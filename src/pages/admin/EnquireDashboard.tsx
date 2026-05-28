import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    createColumnHelper,
  } from "@tanstack/react-table";
  
  import {
    Loader2,
    Mail,
    Trash2,
    Download,
    MoreHorizontal,
  } from "lucide-react";
  
  import * as XLSX from "xlsx";
  import { saveAs } from "file-saver";
  
  import { useNavigate } from "react-router-dom";
  
  import AppSidebar from "../../components/Side-bar";
  
  import {
    getCurrentUser,
    type User,
  } from "../../hooks/context/AdminLogged";
  
  import { supabase } from "../../hooks/supabase/supabaseClient";
  
  type Enquiry = {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    programme: string;
    study_mode: string;
    message: string;
    created_at: string;
  };
  
  const columnHelper = createColumnHelper<Enquiry>();
  
  const EnquireDashboard = () => {
    const navigate = useNavigate();
  
    const [loading, setLoading] = useState(true);
  
    const [fetching, setFetching] = useState(false);
  
    const [user, setUser] = useState<User | null>(null);
  
    const [data, setData] = useState<Enquiry[]>([]);
  
    const [selected, setSelected] = useState<string[]>([]);
  
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
    const [startDate, setStartDate] = useState("");
  
    const [endDate, setEndDate] = useState("");
  
    const [showEmailModal, setShowEmailModal] = useState(false);
  
    const [emailSubject, setEmailSubject] = useState("");
  
    const [emailMessage, setEmailMessage] = useState("");
  
    // AUTH
    useEffect(() => {
      let mounted = true;
  
      const init = async () => {
        try {
          const loggedUser = await getCurrentUser();
  
          if (!loggedUser) {
            navigate("/admin/login", {
              replace: true,
            });
  
            return;
          }
  
          if (mounted) {
            setUser(loggedUser);
          }
        } catch (error) {
          navigate("/admin/login", {
            replace: true,
          });
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };
  
      init();
  
      return () => {
        mounted = false;
      };
    }, [navigate]);
  
    // FETCH
    const fetchEnquiries = async () => {
      if (!startDate || !endDate) {
        alert("Select start and end dates");
  
        return;
      }
  
      setFetching(true);
  
      try {
        const start = `${startDate}T00:00:00`;
  
        const end = `${endDate}T23:59:59`;
  
        const { data, error } = await supabase
            .from("interest_forms")
            .select("*")
            .order("created_at", {
            ascending: false,
        });

        if (error) throw error;
  
        setData(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
  
    // FORMAT DATE
    const formatDate = (date: string) => {
      return new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(date));
    };
  
    // EXPORT
    const exportExcel = () => {
      const exportData = data.map((item) => ({
        Name: item.full_name,
        Email: item.email,
        Phone: item.phone,
        Programme: item.programme,
        "Study Mode": item.study_mode,
        Message: item.message,
        Created: formatDate(item.created_at),
      }));
  
      const worksheet =
        XLSX.utils.json_to_sheet(exportData);
  
      const workbook = XLSX.utils.book_new();
  
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Interest Forms"
      );
  
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
  
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
  
      saveAs(blob, "interest-forms.xlsx");
    };
  
    // DELETE
    const deleteSingle = async (id: string) => {
      const confirmDelete = confirm(
        "Delete enquiry?"
      );
  
      if (!confirmDelete) return;
  
      await supabase
        .from("interest_forms")
        .delete()
        .eq("id", id);
  
      setData((prev) =>
        prev.filter((x) => x.id !== id)
      );
    };
  
    // BULK DELETE
    const deleteSelected = async () => {
      if (!selected.length) return;
  
      const confirmDelete = confirm(
        `Delete ${selected.length} enquiries?`
      );
  
      if (!confirmDelete) return;
  
      await supabase
        .from("interest_forms")
        .delete()
        .in("id", selected);
  
      setData((prev) =>
        prev.filter(
          (x) => !selected.includes(x.id)
        )
      );
  
      setSelected([]);
    };
  
    // SEND EMAIL
    const sendEmails = async () => {
      try {
        const recipients = data
          .filter((x) => selected.includes(x.id))
          .map((x) => x.email);
  
        console.log({
          recipients,
          subject: emailSubject,
          message: emailMessage,
        });
  
        // API CALL
  
        alert("Emails sent");
  
        setShowEmailModal(false);
  
        setEmailSubject("");
  
        setEmailMessage("");
      } catch (error) {
        console.error(error);
      }
    };
  
    // COLUMNS
    const columns = useMemo(
      () => [
        columnHelper.display({
          id: "select",
          header: () => (
            <input
              type="checkbox"
              checked={
                selected.length === data.length &&
                data.length > 0
              }
              onChange={() => {
                if (
                  selected.length === data.length
                ) {
                  setSelected([]);
                } else {
                  setSelected(
                    data.map((x) => x.id)
                  );
                }
              }}
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={selected.includes(
                row.original.id
              )}
              onChange={() => {
                setSelected((prev) =>
                  prev.includes(row.original.id)
                    ? prev.filter(
                        (x) =>
                          x !== row.original.id
                      )
                    : [
                        ...prev,
                        row.original.id,
                      ]
                );
              }}
            />
          ),
        }),
  
        columnHelper.accessor("full_name", {
          header: "Name",
        }),
  
        columnHelper.accessor("email", {
          header: "Email",
        }),
  
        columnHelper.accessor("phone", {
          header: "Cell Number",
        }),
  
        columnHelper.accessor("programme", {
          header: "Programme",
        }),
  
        columnHelper.accessor("study_mode", {
          header: "Study Mode",
        }),
  
        columnHelper.accessor("message", {
          header: "Message",
          cell: ({ getValue }) => (
            <div className="max-w-[240px] truncate">
              {getValue()}
            </div>
          ),
        }),
  
        columnHelper.accessor("created_at", {
          header: "Created",
          cell: ({ getValue }) =>
            formatDate(getValue()),
        }),
  
        columnHelper.display({
          id: "actions",
          header: "",
  
          cell: ({ row }) => (
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown ===
                      row.original.id
                      ? null
                      : row.original.id
                  )
                }
                className="p-1 rounded hover:bg-gray-100"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
  
              {openDropdown ===
                row.original.id && (
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border bg-white shadow-lg">
  
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                    View
                  </button>
  
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                    Edit
                  </button>
  
                  <button
                    onClick={() =>
                      deleteSingle(
                        row.original.id
                      )
                    }
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ),
        }),
      ],
      [data, selected, openDropdown]
    );
  
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel:
        getCoreRowModel(),
    });
  
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
        </div>
      );
    }
  
    if (!user) return null;
  
    return (
      <div className="bg-white min-h-screen flex">
  
        <AppSidebar />
  
        <main className="flex-1 p-5">
  
          {/* HEADER */}
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold">
              Interest Forms Dashboard
            </h1>
  
            <p className="text-sm text-neutral-500">
              Welcome, you have{" "}
              <strong>{data.length}</strong>{" "}
              submissions.
            </p>
          </div>
  
          {/* CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
  
            {/* TOPBAR */}
            <div className="flex flex-wrap gap-3 items-center justify-between p-4 border-b bg-gray-50">
  
              <div className="flex flex-wrap gap-3">
  
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-3 py-2 text-sm"
                />
  
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-3 py-2 text-sm"
                />
  
                <button
                  onClick={fetchEnquiries}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800">
                  {fetching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Fetch Data"
                  )}
                </button>
              </div>
  
              <div className="flex flex-wrap gap-3">
  
                <button
                  onClick={exportExcel}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                  <Download className="w-4 h-4" />
  
                  Export Excel
                </button>
  
                <button
                  disabled={!selected.length}
                  onClick={() =>
                    setShowEmailModal(true)
                  }
                  className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                  <Mail className="w-4 h-4" />
  
                  Resend Emails
                </button>
  
                <button
                  disabled={!selected.length}
                  onClick={deleteSelected}
                  className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                  <Trash2 className="w-4 h-4" />
  
                  Delete
                </button>
              </div>
            </div>
  
            {/* TABLE */}
            <div className="overflow-x-auto">
  
              <table className="w-full text-sm">
  
                <thead className="bg-gray-50 border-b">
  
                  {table
                    .getHeaderGroups()
                    .map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(
                          (header) => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                              {flexRender(
                                header.column
                                  .columnDef
                                  .header,
                                header.getContext()
                              )}
                            </th>
                          )
                        )}
                      </tr>
                    ))}
                </thead>
  
                <tbody>
                  {table
                    .getRowModel()
                    .rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-gray-50"
                      >
                        {row
                          .getVisibleCells()
                          .map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap"
                            >
                              {flexRender(
                                cell.column
                                  .columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
  
            {/* FOOTER */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
  
              <p className="text-sm text-gray-500">
                Showing{" "}
                <strong>{data.length}</strong>{" "}
                submissions
              </p>
            </div>
          </div>
        </main>
  
        {/* EMAIL MODAL */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
  
              <h2 className="text-xl font-semibold mb-5">
                Resend Emails
              </h2>
  
              <div className="space-y-4">
  
                <div>
                  <label className="text-sm font-medium">
                    Subject
                  </label>
  
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) =>
                      setEmailSubject(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
  
                <div>
                  <label className="text-sm font-medium">
                    Message
                  </label>
  
                  <textarea
                    rows={6}
                    value={emailMessage}
                    onChange={(e) =>
                      setEmailMessage(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-lg border px-4 py-2 resize-none"
                  />
                </div>
  
                <div className="flex justify-end gap-3">
  
                  <button
                    onClick={() =>
                      setShowEmailModal(false)
                    }
                    className="border px-4 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
  
                  <button
                    onClick={sendEmails}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Send Emails
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default EnquireDashboard;
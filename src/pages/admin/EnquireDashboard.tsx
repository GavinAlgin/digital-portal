import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { supabase } from "../../hooks/supabase/supabaseClient";
import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";

import AppSidebar from "../../components/Side-bar";
import { createEnquiryColumns } from "./components/types/EnquireColumns";
import { MessageModal } from "./components/MessageModal";
import DataTable from "./components/DataTable";
import type { Enquiry } from "./components/types/Enquire";

const EnquireDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [data, setData] = useState<Enquiry[]>([]);
  const [fetching, setFetching] = useState(false);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [selectedMessage, setSelectedMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewMessage = (message: string) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const columns = createEnquiryColumns(handleViewMessage);

  // =========================
  // FETCH FROM SUPABASE
  // =========================
  const fetchEnquiries = useCallback(async () => {
    setFetching(true);

    try {
      const { data, error } = await supabase
        .from("interest_forms") 
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setData(data || []);
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setFetching(false);
    }
  }, []);

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const loggedUser = await getCurrentUser();

        if (!loggedUser) {
          navigate("/admin/login", { replace: true });
          return;
        }

        if (mounted) setUser(loggedUser);
      } catch (err) {
        console.error(err);
        navigate("/admin/login", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // auto-fetch once user is ready
  useEffect(() => {
    if (user) fetchEnquiries();
  }, [user, fetchEnquiries]);

  // =========================
  // SELECTION LOGIC
  // =========================
  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((x) => x.id));
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />

      <main className="container mx-auto p-4 lg:p-8">

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-xl font-bold">Enquire Dashboard</h1>

          <p className="text-sm text-gray-500">
            Total: <strong>{data.length}</strong>
          </p>
        </div>

        {/* TABLE */}
        <DataTable<Enquiry>
          title="Student Enquiries"
          data={data}
          columns={columns}
          page={1}
          pageSize={10}
          total={data.length}
          loading={fetching}
          emptyText="No enquiries found"

          // 👉 pass selection state to actions
          actions={[
            {
              label: `Copy Email (${selectedRows.length})`,
              onClick: () => {
                const emails = data
                  .filter((x) => selectedRows.includes(x.id))
                  .map((x) => x.email)
                  .join(", ");

                navigator.clipboard.writeText(emails);
              },
            },
          ]}
        />

        {/* MESSAGE MODAL */}
        <MessageModal
          open={modalOpen}
          message={selectedMessage}
          onClose={() => setModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default EnquireDashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import AppSidebar from "../../components/Side-bar";
import { createEnquiryColumns } from "./components/types/EnquireColumns";
import { MessageModal } from "./components/MessageModal";
import DataTable from "./components/DataTable";
import type { Enquiry } from "./components/types/Enquire";

const AdmissionsDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: replace with real API/Supabase fetch
  const [data, setData] = useState<Enquiry[]>([]);

  const handleViewMessage = (message: string) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const columns = createEnquiryColumns(handleViewMessage);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const loggedUser = await getCurrentUser();

        if (!loggedUser) {
          navigate("/admin/login", { replace: true });
          return;
        }

        if (isMounted) {
          setUser(loggedUser);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        navigate("/admin/login", { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />

      <main className="container mx-auto mt-2 p-4 lg:p-8 xl:max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-black">
            Admissions Dashboard
          </h1>

          <p className="text-sm text-neutral-500">
            Total Number of Applications Submissions{" "}
            <strong>{data.length}</strong>.
          </p>
        </div>

        <DataTable<Enquiry>
          title="Student Enquiries"
          data={data}
          columns={columns}
          page={1}
          pageSize={10}
          total={data.length}
          onPageChange={(p) => console.log("page:", p)}
          loading={false}
          emptyText="No enquiries found"
          actions={[
            {
              label: "Copy Email",
              onClick: (row) => {
                if (row.email) {
                  navigator.clipboard.writeText(row.email);
                }
              },
            },
            {
              label: "Delete",
              onClick: (row) => {
                console.log("delete:", row.id);
              },
            },
          ]}
        />

        <MessageModal
          open={modalOpen}
          message={selectedMessage}
          onClose={() => setModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default AdmissionsDashboard;
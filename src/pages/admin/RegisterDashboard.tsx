import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { getCurrentUser, type User } from "../../hooks/context/AdminLogged";
import AppSidebar from "../../components/Side-bar";
import RegisterForm from "../../components/RegisterForm";

const RegisterDashbaord: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    );
  }

  // Redirect fallback
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="container mx-auto mt-2 p-4 lg:p-8 xl:max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-black">
            Student Register Dashboard
          </h1>

          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Total Number of Registered Students <strong>28</strong>.
          </p>
        </div>

        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterDashbaord;
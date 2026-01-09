import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "../supabase/supabaseClient";

/** Allowed roles */
type UserRole = "admin" | "user";

/** Context contract */
interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

/** Context */
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
});

/** Provider */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole | null>(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole === "admin" || storedRole === "user"
      ? storedRole
      : null;
  });

  const isAuthenticated = role !== null;

  const login = (role: UserRole) => {
    setRole(role);
    localStorage.setItem("role", role);
  };

  const logout = async () => {
    setRole(null);
    localStorage.removeItem("role");

    // Ensure Supabase session is cleared
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // 🔐 Single global auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if ((event as string) === 'TOKEN_REFRESH_FAILED') {
        console.warn("Supabase token refresh failed — signing out");
        logout();
      }

      if (event === "SIGNED_OUT") {
        setRole(null);
        localStorage.removeItem("role");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** Hook */
export const useAuth = () => useContext(AuthContext);

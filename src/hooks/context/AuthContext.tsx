import { createContext, useContext, useState, type ReactNode } from "react";

type UserRole = "admin" | "user" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem("role") as UserRole) || null;
  });

  const isAuthenticated = role !== null;

  const login = (role: UserRole) => {
    setRole(role);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

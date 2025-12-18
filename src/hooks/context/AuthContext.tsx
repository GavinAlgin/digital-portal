import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

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

    if (storedRole === "admin" || storedRole === "user") {
      return storedRole;
    }

    return null;
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



// import { createContext, useContext, useState, type ReactNode } from "react";

// type UserRole = "admin" | "user" | null;

// interface AuthContextType {
//   isAuthenticated: boolean;
//   role: UserRole;
//   login: (role: UserRole) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   role: null,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [role, setRole] = useState<UserRole>(() => {
//     return (localStorage.getItem("role") as UserRole) || null;
//   });

//   const isAuthenticated = role !== null;

//   const login = (role: UserRole) => {
//     setRole(role);
//     localStorage.setItem("role", role);
//   };

//   const logout = () => {
//     setRole(null);
//     localStorage.removeItem("role");
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

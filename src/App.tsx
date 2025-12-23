import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/LoginForm";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AuthProvider, useAuth } from "./hooks/context/AuthContext";
import ProtectedRoute from "./hooks/routes/ProtectedRoute";
import UsersDataDashboard from "./pages/admin/UsersDataDashboard";
// import EventDashboard from "./pages/admin/EventDashboard";
import RegistrationForm from "./components/RegisterForm";
import ForgotPassword from "./components/reset-password/ForgotPassword";
import AccommodationForm from "./pages/users/AccommodationForm";
import { SupportForm } from "./pages/SupportForm";
import Profile from "./pages/users/ProfilePage";
import SignupConfirmed from "./pages/ConfirmationPage";

function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Redirect "/" based on login status */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Prevent logged-in users from seeing login page */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          ) : (
            <Login />
          )
        }
      />

      {/** URL */}
      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />
      <Route
        path="/reset-password"
        element={
          <ForgotPassword />
        }
      />
      <Route
        path="/support-form"
        element={
          <SupportForm />
        }
      />
      <Route
        path="/signup-confirmation"
        element={
          <SignupConfirmed />
        }
      />

      {/* Admin Protected Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/admin/tickets"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EventDashboard />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersDataDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/register"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <RegistrationForm />
          </ProtectedRoute>
        }
      />

      {/* User Protected Route */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/accommodation"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <AccommodationForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

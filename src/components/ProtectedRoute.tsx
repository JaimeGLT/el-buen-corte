import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isTokenValid } from "../utlis/auth";

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

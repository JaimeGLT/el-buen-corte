import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isTokenValid } from "../utlis/auth";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

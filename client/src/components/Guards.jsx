import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "./ui";

export default function Protected({ admin, children }) {
  const { user, loading, isAdmin } = useAuth();
  const loc = useLocation();
  if (loading) return <Loading />;
  if (!user)
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && !isAdmin) return <Navigate to="/resources" replace />;
  return children;
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LoadingScreen } from "../components/common/LoadingScreen.jsx";

export const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) {
    const destination =
      user.role === "responder" || user.role === "admin"
        ? "/team/dashboard"
        : "/rescue-portal";
    return <Navigate to={destination} replace />;
  }
  return <Outlet />;
};

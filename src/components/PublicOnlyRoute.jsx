import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function PublicOnlyRoute({ children }) {
  const isLoggedIn = !!getToken();
  const location = useLocation();

  if (isLoggedIn) {
    // Get lastPrivateRoute from localStorage or fallback to /dashboard
    const lastPrivateRoute = localStorage.getItem("lastPrivateRoute") || "/dashboard";

    // If user is already on lastPrivateRoute, just render children to avoid redirect loop
    if (location.pathname === lastPrivateRoute) {
      return children;
    }

    return <Navigate to={lastPrivateRoute} replace />;
  }
  return children;
}

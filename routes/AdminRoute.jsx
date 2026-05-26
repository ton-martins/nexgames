import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../services/authService";

export default function AdminRoute() {
	const location = useLocation();

	if (!isAuthenticated()) {
		return <Navigate to="/auth" replace state={{ from: location }} />;
	}

	if (!isAdmin()) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}

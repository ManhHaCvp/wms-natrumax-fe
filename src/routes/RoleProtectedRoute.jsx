import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/authProvider";
import Layout from "@/components/layout/Layout";

export const RoleProtectedRoute = ({ allowedRoles }) => {
    const { token, roles } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!roles.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/401" />;
    }

    return <Layout><Outlet /></Layout>;
};

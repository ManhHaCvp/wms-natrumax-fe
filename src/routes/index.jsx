import {RouterProvider, createBrowserRouter, Navigate} from "react-router-dom";
import {useAuth} from "../providers/authProvider";
import {ProtectedRoute} from "./ProtectedRoute";
import {RoleProtectedRoute} from "./RoleProtectedRoute";
import Layout from "@/components/layout/Layout.jsx";
import AuthPage from "../pages/auth/AuthPage.jsx";
import Dashboard from "../pages/main/Dashboard.jsx";
import HomePage from "../pages/main/HomePage.jsx";
import {NotFoundPage, InternalServerErrorPage, UnauthorizedPage} from "../pages/error/ErrorPage.jsx";
import ComingSoonPage from "../pages/error/ComingSoonPage.jsx";

const Routes = () => {
    const {token, user} = useAuth();

    const startupRoute = () => {
        if (!token) return <Navigate to="/login" />;
        if (user.roles.includes("ROLE_ADMIN")) return <Navigate to="/admin" />;
        return <Navigate to="/dashboard" />;
    };

    // Public routes wrapped inside Layout
    const routesForPublic = {
        path: "/",
        element: <Layout/>,
        children: [
            {path: "/", element: startupRoute()},
            {path: "/service", element: <div>Service Page</div>},
            {path: "/about-us", element: <div>About Us</div>},
            {path: "/coming-soon", element: <ComingSoonPage/>},
            {path: "*", element: <NotFoundPage/>},
            {path: "/404", element: <NotFoundPage/>},
            {path: "/500", element: <InternalServerErrorPage/>},
        ],
    };

    // Protected routes for authenticated users
    const routesForAuthenticatedOnly = {
        path: "/",
        element: <ProtectedRoute/>,
        children: [
            {path: "/dashboard", element: <Dashboard/>},
            {path: "/home", element: <HomePage/>},
            {path: "/profile", element: <div>User Profile</div>},
            {path: "/401", element: <UnauthorizedPage/>},
        ],
    };

    // Admin-only routes
    const routesForAdminOnly = {
        path: "/admin",
        element: <RoleProtectedRoute allowedRoles={["ROLE_ADMIN"]}/>,
        children: [
            {path: "/admin", element: <div>Admin Dashboard</div>},
            {path: "/admin/users", element: <div>Manage Users</div>},
        ],
    };

    // Routes for non-authenticated users
    const routesForNotAuthenticatedOnly = {
        path: "/",
        element: <AuthPage/>,
        children: [{path: "/login", element: <AuthPage/>}],
    };

    const router = createBrowserRouter([
        routesForPublic,  // Wrap inside an array-friendly structure
        ...(!token ? [routesForNotAuthenticatedOnly] : []),
        routesForAuthenticatedOnly,
        routesForAdminOnly,
    ]);

    return <RouterProvider router={router}/>;
};

export default Routes;

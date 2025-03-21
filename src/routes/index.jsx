import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleProtectedRoute } from "./RoleProtectedRoute";
import Layout from "@/components/layout/Layout.jsx";
import AuthPage from "../pages/auth/AuthPage.jsx";
import Dashboard from "../pages/main/Dashboard.jsx";
import HomePage from "../pages/main/HomePage.jsx";
import ViewUserList from "../pages/admin/ViewUserList";
import ViewUserDetail from "../pages/admin/ViewUserDetail";
import EditUser from "../pages/admin/EditUserProfile";
import ViewProductList from "../pages/admin/ViewProductList";
import ProductDetail from "@/components/product/ProductDetail.jsx";
import UpdateProduct from "@/components/product/UpdateProduct.jsx";
import ViewCategoryList from "../pages/admin/ViewCategoryList";
import CreateCategory from "@/components/category/CreateCategory.jsx";
import UpdateCategory from "@/components/category/UpdateCategory.jsx";
import ViewRoleList from "../pages/admin/ViewRoleList";
import ViewOrderList from "@/pages/admin/ViewOrderList";
import ViewWarehouseList from "@/pages/admin/ViewWarehouseList";
import OrderDetail from "@/components/order/OrderDetail.jsx";
import CreateOrder from "@/components/order/CreateOrder.jsx";
import { NotFoundPage, InternalServerErrorPage, UnauthorizedPage } from "../pages/error/ErrorPage.jsx";
import ComingSoonPage from "../pages/error/ComingSoonPage.jsx";

const Routes = () => {
  const { token, user } = useAuth();

  const startupRoute = () => {
    if (!token) return <Navigate to="/login" />;
    if (user.roles.includes("ROLE_ADMIN")) return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  };

  // Public routes wrapped inside Layout
  const routesForPublic = {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: startupRoute() },
      { path: "/service", element: <div>Service Page</div> },
      { path: "/about-us", element: <div>About Us</div> },
      { path: "/coming-soon", element: <ComingSoonPage /> },
      { path: "*", element: <NotFoundPage /> },
      { path: "/404", element: <NotFoundPage /> },
      { path: "/500", element: <InternalServerErrorPage /> },
      { path: "/dashboard", element: <Dashboard /> },
      // for develop ui
      { path: "/develop-ui/test", element: <div>Develop UI</div> },

      //User
      { path: "/admin/users", element: <ViewUserList /> },
      { path: "/admin/user/:id", element: <ViewUserDetail /> },
      { path: "/admin/user/edit/:id", element: <EditUser /> },

      //Product
      { path: "/admin/products", element: <ViewProductList /> },
      { path: "/admin/products/:id", element: <ProductDetail /> },
      { path: "/admin/products/edit/:id", element: <UpdateProduct /> },

      //Category
      { path: "/admin/category", element: <ViewCategoryList /> },
      { path: "/admin/category/add", element: <CreateCategory /> },
      { path: "/admin/category/edit/:id", element: <UpdateCategory /> },

      //Role
      { path: "/admin/role", element: <ViewRoleList /> },

      //Orders
      { path: "/admin/orders", element: <ViewOrderList /> },
      { path: "/admin/orders/:id", element: <OrderDetail /> },
      { path: "/admin/orders/add", element: <CreateOrder /> },

      //Warehouse
      { path: "/admin/warehouses", element: <ViewWarehouseList /> },
    ],
  };

  // Protected routes for authenticated users
  const routesForAuthenticatedOnly = {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/profile", element: <div>User Profile</div> },
      { path: "/401", element: <UnauthorizedPage /> },
    ],
  };

  // Admin-only routes
  const routesForAdminOnly = {
    path: "/admin",
    element: <RoleProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
    children: [
      { path: "/admin", element: <div>Admin Dashboard</div> },
      { path: "/admin/users", element: <div>Manage Users</div> },
    ],
  };

  // Routes for non-authenticated users
  const routesForNotAuthenticatedOnly = {
    path: "/",
    element: <AuthPage />,
    children: [{ path: "/login", element: <AuthPage /> }],
  };

  const router = createBrowserRouter([
    routesForPublic, // Wrap inside an array-friendly structure
    ...(!token ? [routesForNotAuthenticatedOnly] : []),
    routesForAuthenticatedOnly,
    routesForAdminOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;

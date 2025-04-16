import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleProtectedRoute } from "./RoleProtectedRoute";
import Layout from "@/components/layout/Layout";
import AuthPage from "@/pages/auth/AuthPage";
import Dashboard from "@/pages/main/Dashboard";
import HomePage from "@/pages/main/HomePage";
import ViewUserList from "@/pages/user/ViewUserList";
import ViewUserDetail from "@/pages/user/ViewUserDetail";
import UpdateUser from "@/pages/user/UpdateUser";
import ChangePassword from "@/pages/user/ChangePassword";
import ViewRoleList from "@/pages/role/ViewRoleList";
import ViewProductList from "@/pages/product/ViewProductList";
import ViewProductDetail from "@/pages/product/ViewProductDetail";
import UpdateProduct from "@/pages/product/UpdateProduct";
import ViewCategoryList from "@/pages/category/ViewCategoryList";
import CreateCategory from "@/pages/category/CreateCategory";
import UpdateCategory from "@/pages/category/UpdateCategory";
import ViewOrderList from "@/pages/order/ViewOrderList";
import ViewOrderDetail from "@/pages/order/ViewOrderDetail";
import CreateOrder from "@/pages/order/CreateOrder";
import ViewDiscountList from "@/pages/discount/ViewDiscountList";
import CreateDiscount from "@/pages/discount/CreateDiscount";
import UpdateDiscount from "@/pages/discount/UpdateDiscount";
import ViewWarehouseList from "@/pages/warehouse/ViewWarehouseList";
import { NotFoundPage, InternalServerErrorPage, UnauthorizedPage } from "@/pages/error/ErrorPage";
import ComingSoonPage from "@/pages/error/ComingSoonPage";
import UserProfile from "@/pages/user/UserProfile";

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
      { path: "/dashboard", element: <Dashboard /> },
      { path: "*", element: <NotFoundPage /> },
      { path: "/404", element: <NotFoundPage /> },
      { path: "/500", element: <InternalServerErrorPage /> },
      { path: "/coming-soon", element: <ComingSoonPage /> },
      { path: "/service", element: <div>Service Page</div> },
      { path: "/about-us", element: <div>About Us</div> },

      //User
      { path: "/admin/users", element: <ViewUserList /> },
      { path: "/admin/user/:id", element: <ViewUserDetail /> },
      { path: "/admin/user/update/:id", element: <UpdateUser /> },
      { path: "/admin/user/change-password", element: <ChangePassword /> },
      { path: "/user/:id", element: <UserProfile /> },

      //Role
      { path: "/admin/roles", element: <ViewRoleList /> },

      //Product
      { path: "/admin/products", element: <ViewProductList /> },
      { path: "/admin/product/:id", element: <ViewProductDetail /> },
      { path: "/admin/product/update/:id", element: <UpdateProduct /> },

      //Category
      { path: "/admin/categories", element: <ViewCategoryList /> },
      { path: "/admin/category/create", element: <CreateCategory /> },
      { path: "/admin/category/update/:id", element: <UpdateCategory /> },

      //Orders
      { path: "/admin/orders", element: <ViewOrderList /> },
      { path: "/admin/order/:id", element: <ViewOrderDetail /> },
      { path: "/admin/order/create", element: <CreateOrder /> },

      //Discounts
      { path: "/admin/discounts", element: <ViewDiscountList /> },
      { path: "/admin/discount/create", element: <CreateDiscount /> },
      { path: "/admin/discount/update/:id", element: <UpdateDiscount /> },

       //Rewards
      //  { path: "/admin/rewards", element: <ViewRewardList /> },
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

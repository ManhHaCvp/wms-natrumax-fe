import {RouterProvider, createBrowserRouter, Navigate} from "react-router-dom";
import {useAuth} from "@/providers/authProvider";
import {ProtectedRoute} from "./ProtectedRoute";
import {RoleProtectedRoute} from "./RoleProtectedRoute";
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
import ViewOrderList from "@/pages/order/ViewOrderList";
import ViewOrderDetail from "@/pages/order/ViewOrderDetail";
import CreateOrder from "@/pages/order/CreateOrder";
import ViewDiscountList from "@/pages/discount/ViewDiscountList";
import ViewWarehouseList from "@/pages/warehouse/ViewWarehouseList";
import {NotFoundPage, InternalServerErrorPage, UnauthorizedPage} from "@/pages/error/ErrorPage";
import ComingSoonPage from "@/pages/error/ComingSoonPage";
import UserProfile from "@/pages/user/UserProfile";
import ViewTransactionList from "@/pages/transaction/ViewTransactionList";
import ViewCommissionList from "@/pages/commission/ViewCommissionList.jsx";
import CreateCommissionPolicy from "@/pages/commission/CreateCommissionPolicy.jsx";
import ViewCommissionPolicy from "@/pages/commission/ViewCommissionPolicy.jsx";
import ViewCommissionHistory from "@/pages/commission/ViewCommissionHistory.jsx";
import ViewSaleList from "@/pages/mock-api/ViewSaleList.jsx";
import ViewInventoryOutList from "@/pages/mock-api/ViewInventoryOutList.jsx";
import ViewInventoryInList from "@/pages/mock-api/ViewInventoryInList.jsx";
import ViewPurchaseOrderList from "@/pages/mock-api/ViewPurchaseOrderList.jsx";
import ViewReceiptList from "@/pages/mock-api/ViewReceiptList.jsx";
import ViewRewardList from "@/pages/reward/ViewRewardList.jsx";
import ViewLotteryCodeList from "@/pages/lottery-code/ViewLotteryCodeList.jsx";
import WheelSpin from "@/pages/lottery-code/WheelSpin.jsx";

const Routes = () => {
    const {token, user} = useAuth();

    const startupRoute = () => {
        if (!token) return <Navigate to="/login"/>;
        if (user.roles.includes("ROLE_ADMIN")) return <Navigate to="/admin"/>;
        return <Navigate to="/dashboard"/>;
    };

    // Public routes wrapped inside Layout
    const routesForPublic = {
        path: "/",
        element: <Layout/>,
        children: [
            {path: "/", element: startupRoute()},
            {path: "/dashboard", element: <Dashboard/>},
            {path: "*", element: <NotFoundPage/>},
            {path: "/404", element: <NotFoundPage/>},
            {path: "/500", element: <InternalServerErrorPage/>},
            {path: "/coming-soon", element: <ComingSoonPage/>},
            {path: "/service", element: <div>Service Page</div>},
            {path: "/about-us", element: <div>About Us</div>},

            //Category
            {path: "/admin/categories", element: <ViewCategoryList/>},

            //Discounts
            {path: "/admin/discounts", element: <ViewDiscountList/>},

            //User
            {path: "/admin/users", element: <ViewUserList/>},
            {path: "/admin/user/:id", element: <ViewUserDetail/>},
            {path: "/admin/user/update/:id", element: <UpdateUser/>},
            {path: "/admin/user/change-password", element: <ChangePassword/>},

            //Transaction
            {path: "/admin/transactions", element: <ViewTransactionList/>},

            //Role
            {path: "/admin/roles", element: <ViewRoleList/>},

            //Product
            {path: "/admin/products", element: <ViewProductList/>},
            {path: "/admin/product/:productId", element: <ViewProductDetail/>},
            {path: "/admin/product/update/:id", element: <UpdateProduct/>},

            //Orders
            {path: "/admin/orders", element: <ViewOrderList/>},
            {path: "/admin/order/:id", element: <ViewOrderDetail/>},
            {path: "/admin/order/create", element: <CreateOrder/>},

            //Rewards
            { path: "/admin/rewards", element: <ViewRewardList /> },

            //Lottery Codes
            { path: "/admin/lottery-codes", element: <ViewLotteryCodeList /> },

            //Warehouse
            {path: "/admin/warehouses", element: <ViewWarehouseList/>},

            //Commission
            {path: "/admin/commissions", element: <ViewCommissionList/>},
            {path: "/admin/commissions/create/:referrerId", element: <CreateCommissionPolicy/>},
            {path: "/admin/commissions/policy/:id", element: <ViewCommissionPolicy/>},
            {path: "/admin/commissions/history/:id", element: <ViewCommissionHistory/>},

            //Mock API
            {path: "/admin/misa/sales", element: <ViewSaleList/>},
            {path: "/admin/misa/inventory-outs", element: <ViewInventoryOutList/>},
            {path: "/admin/misa/receipts", element: <ViewReceiptList/>},
            {path: "/admin/misa/inventory-ins", element: <ViewInventoryInList/>},
            {path: "/admin/kiotviet/purchase-orders", element: <ViewPurchaseOrderList/>},
        ],
    };

    // Protected routes for authenticated users
    const routesForAuthenticatedOnly = {
        path: "/",
        element: <ProtectedRoute/>,
        children: [
            {path: "/home", element: <HomePage/>},
            {path: "/profile", element: <UserProfile/>},
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
        routesForPublic, // Wrap inside an array-friendly structure
        ...(!token ? [routesForNotAuthenticatedOnly] : []),
        routesForAuthenticatedOnly,
        routesForAdminOnly,
    ]);

    return <RouterProvider router={router}/>;
};

export default Routes;

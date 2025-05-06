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
            {path: "*", element: <NotFoundPage/>},
            {path: "/404", element: <NotFoundPage/>},
            {path: "/500", element: <InternalServerErrorPage/>},
            {path: "/coming-soon", element: <ComingSoonPage/>},
            {path: "/service", element: <div>Service Page</div>},
            {path: "/about-us", element: <div>About Us</div>},
        ],
    };

    // Protected routes for authenticated users
    const routesForAuthenticated = {
        path: "/",
        element: <ProtectedRoute/>,
        children: [
            {path: "/home", element: <HomePage/>},
            {path: "/401", element: <UnauthorizedPage/>},

            {path: "/dashboard", element: <Dashboard/>},

            {path: "/profile", element: <UserProfile/>},
            {path: "/change-password", element: <ChangePassword/>},

            {path: "/products", element: <ViewProductList/>},
        ],
    };

    // Admin-only routes
    const routesForAdmin = {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["ROLE_ADMIN"]}/>,
        children: [
            //User
            {path: "/user/update/:id", element: <UpdateUser/>},

            //Role
            {path: "/roles", element: <ViewRoleList/>},
        ],
    };

    // Admin, Accountant routes
    const routesForAdminAndAccountant = {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_ACCOUNTANT"]}/>,
        children: [
            //User
            {path: "/users", element: <ViewUserList/>},
            {path: "/user/:id", element: <ViewUserDetail/>},
        ],
    };

    // Accountant routes
    const routesForAccountant = {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["ROLE_ACCOUNTANT"]}/>,
        children: [
            //Product
            {path: "/product/update/:id", element: <UpdateProduct/>},

            //Commission
            {path: "/commissions", element: <ViewCommissionList/>},
            {path: "/commissions/create/:referrerId", element: <CreateCommissionPolicy/>},
        ],
    };

    // Accountant, Distributor routes
    const routesForAccountantAndDistributor = {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"]}/>,
        children: [
            //Category
            {path: "/categories", element: <ViewCategoryList/>},

            //Warehouse
            {path: "/warehouses", element: <ViewWarehouseList/>},

            //Discounts
            {path: "/discounts", element: <ViewDiscountList/>},

            //Transaction
            {path: "/transactions", element: <ViewTransactionList/>},

            //Orders
            {path: "/orders", element: <ViewOrderList/>},

            //Rewards
            {path: "/rewards", element: <ViewRewardList/>},

            //Mock API
            {path: "/misa/sales", element: <ViewSaleList/>},
            {path: "/misa/inventory-outs", element: <ViewInventoryOutList/>},
            {path: "/misa/receipts", element: <ViewReceiptList/>},
            {path: "/misa/inventory-ins", element: <ViewInventoryInList/>},
        ],
    };

    // Not for admin routes
    const routesNotForAdmin = {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER"]}/>,
        children: [
            //Product
            {path: "/products", element: <ViewProductList/>},
            {path: "/product/:productId", element: <ViewProductDetail/>},

            //Orders
            {path: "/order/:id", element: <ViewOrderDetail/>},
            {path: "/order/create", element: <CreateOrder/>},

            //Commission
            {path: "/commissions/policy/:id", element: <ViewCommissionPolicy/>},
            {path: "/commissions/history/:id", element: <ViewCommissionHistory/>},

            //Lottery Codes
            {path: "/lottery-codes", element: <ViewLotteryCodeList/>},

            //Mock API
            {path: "/kiotviet/purchase-orders", element: <ViewPurchaseOrderList/>},
        ]
    };

    // Routes for non-authenticated users
    const routesForNotAuthenticated = {
        path: "/",
        element: <AuthPage/>,
        children: [{path: "/login", element: <AuthPage/>}],
    };

    const router = createBrowserRouter([
        routesForPublic, // Wrap inside an array-friendly structure
        ...(!token ? [routesForNotAuthenticated] : []),
        routesForAuthenticated,
        routesForAdmin,
        routesForAdminAndAccountant,
        routesForAccountant,
        routesForAccountantAndDistributor,
        routesNotForAdmin,
    ]);

    return <RouterProvider router={router}/>;
};

export default Routes;

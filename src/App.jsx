import {createContext, useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from "react-router-dom";
import Header from "./components/layout/Header";
import AuthPage from "./pages/auth/AuthPage.jsx";
import AdminLayout from "./components/admin/Layout";
import Dashboard from "./components/admin/Dashboard";
import NotFoundPage from "./pages/error/NotFoundPage";
import Footer from "./components/layout/Footer";
import ManageUser from "./pages/admin/ManageUser";
import ManageUserDetail from "./pages/admin/ManageUserDetail";
import {Toaster} from "react-hot-toast";
import ProtectedRoute from "@/components/common/ProtectedRoute.jsx";
import Layout from "./components/admin/Layout.jsx";

export const UserContext = createContext({});

const App = () => {
    const location = useLocation();
    const [userAuth, setUserAuth] = useState(null);
    const [isAuthenticated, setAuth] = useState(false);
    const isAdminRoute = location.pathname.includes("/admin");
    const isUserRoute = location.pathname.includes("/user");
    const isLoginPage = location.pathname === "/login";

    useEffect(() => {
        setAuth(!!localStorage.getItem("token"));
    }, []);

    return (
        <>
            <UserContext.Provider value={{ userAuth, setUserAuth }}>
                <Toaster />
                {/* {!isAdminRoute && !isLoginPage && <Header />} */}
                <main>
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                        <Route path="/home" element={<Navigate to="/" />} />
                        <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/admin/dashboard" />} />
                        <Route element={<AdminLayout />}>
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                            <Route path="/admin/user/:id" element={<ManageUserDetail />} />
                            <Route path="/admin/users" element={<ManageUser />} />

                        </Route>

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                {/* {!isAdminRoute && !isUserRoute && !isLoginPage && <Footer />} */}
            </UserContext.Provider>
        </>
    );
}

export default App;

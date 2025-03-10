import { createContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { Toaster } from "./components/ui/sonner";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/main/HomePage";
import Header from "./components/layout/Header";
import LoginPage from "./pages/auth/LoginPage";
import AdminLayout from "./components/admin/Layout";
import Dashboard from "./components/admin/Dashboard";
import NotFoundPage from "./pages/error/NotFoundPage";
import Footer from "./components/layout/Footer";
import ManageUser from "./pages/admin/ManageUser";
import ManageUserDetail from "./pages/admin/ManageUserDetail";
export const UserContext = createContext({});
function App() {
  const location = useLocation();
  const [userAuth, setUserAuth] = useState(null);
  const isAdminRoute = location.pathname.includes("/admin");
  const isUserRoute = location.pathname.includes("/user");
  const isLoginPage = location.pathname === "/login";
  const isAuthenticated = () => {
    return JSON.parse(localStorage.getItem("user"))?.token ? true : false;
  };
  return (
    <>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Toaster />
        {/* {!isAdminRoute && !isLoginPage && <Header />} */}
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/login" element={!isAuthenticated() ? <LoginPage /> : <Navigate to="/admin/dashboard" />} />
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

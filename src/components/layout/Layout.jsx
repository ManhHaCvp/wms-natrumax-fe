import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Navbar from "./NavBar.jsx";
import Footer from "./Footer.jsx";
import { SidebarProvider } from "@/components/ui/sidebar.jsx";

const Layout = () => {
  return (
    <SidebarProvider className="flex h-screen w-screen">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <Navbar/>
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col justify-between h-full">
            <Outlet/>
            <Footer/>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
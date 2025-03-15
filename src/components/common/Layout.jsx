import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Navbar from "./NavBar";

const Layout = () => {
    return (
        <div className="flex h-screen">
            <div className="bg-[#F5F6FA] w-64 border-r border-gray-200">
                <SideBar />
            </div>

            <div className="flex flex-col flex-grow">
                <Navbar />
                <div className="flex-grow p-2 bg-white overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
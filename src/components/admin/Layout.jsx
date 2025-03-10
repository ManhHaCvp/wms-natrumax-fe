import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarAdmin from "./SideBarAdmin";
import Navbar from "./NavBar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="bg-[#F5F6FA] w-64 border-r border-gray-200">
        <SideBarAdmin />
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

export default AdminLayout;

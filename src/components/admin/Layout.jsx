import React, { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import SideBarAdmin from "./SideBarAdmin";
const AdminLayout = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [colors, setColors] = useState([]);
  const [types, setTypes] = useState([]);
  const [tags, setTags] = useState([]);

  //axios get all users and orders

  return (
    <div className="flex ">
      <div className="bg-[#F5F6FA] h-screen border border-gray-150">
      <SideBarAdmin />
      </div>
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

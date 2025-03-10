import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // lưu thông tin đăng nhập vào local storages
  const accessToken = JSON.parse(localStorage.getItem("user"))?.token;
  console.log(accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

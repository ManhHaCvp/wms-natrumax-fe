import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "@/components/admin/ProductTable";

const ManageProduct = () => {
  const [loginTypes, setLoginTypes] = useState([]); // Giả sử bạn có một API để lấy loại đăng nhập nếu cần thiết

  return (
    <div>
      <ProductTable />
    </div>
  );
};

export default ManageProduct;

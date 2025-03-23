import React, { useState, useEffect } from "react";
import ProductList from "@/components/product/ProductList.jsx";

const ViewProductList = () => {
  const [loginTypes, setLoginTypes] = useState([]); // Giả sử bạn có một API để lấy loại đăng nhập nếu cần thiết

  return (
    <div>
      <ProductList />
    </div>
  );
};

export default ViewProductList;

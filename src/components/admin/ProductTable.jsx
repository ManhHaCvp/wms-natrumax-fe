import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductTable = () => {
  const [products, setProducts] = useState([
    { id: 1, code: "#187654", name: "Sữa tươi Vinamilk", price: 25000, stock: 100, status: "Còn hàng" },
    { id: 2, code: "#187654", name: "Sữa chua TH true Milk", price: 15000, stock: 50, status: "Còn hàng" },
    { id: 3, code: "#187654", name: "Sữa đậu nành Fami", price: 12000, stock: 80, status: "Còn hàng" },
    { id: 4, code: "#187654", name: "Sữa hộp Milo", price: 30000, stock: 40, status: "Còn hàng" },
    { id: 5, code: "#187654", name: "Sữa Ensure Gold", price: 50000, stock: 30, status: "Hết hàng" },
    { id: 6, code: "#187654", name: "Sữa Nutifood GrowPLUS+", price: 40000, stock: 60, status: "Còn hàng" },
    { id: 7, code: "#187654", name: "Sữa bột Dielac Alpha", price: 45000, stock: 20, status: "Hết hàng" },
    { id: 8, code: "#187654", name: "Sữa óc chó Hàn Quốc", price: 55000, stock: 25, status: "Còn hàng" },
  ]);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const navigate = useNavigate();

  // Handle Checkbox
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const onDetail = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Danh sách sản phẩm</h1>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedProducts.length === products.length} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => handleCheckboxChange(product.id)} />
                </td>
                <td className="px-6 py-4">{product.code}</td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.price.toLocaleString()} VND</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <Badge className={product.status === "Còn hàng" ? "bg-green-200 text-black" : "bg-red-200 text-black"}>{product.status}</Badge>
                </td>

                {/* 
                Action */}
                <td className="px-6 py-4">
                  <button onClick={() => handleEditProduct(product.id)} className="bg-white hover:bg-gray-50 py-1 px-2 mr-2">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => onDetail(product.id)} className="bg-white hover:bg-gray-50 py-1 px-2">
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;

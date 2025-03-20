import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ViewWarehouseList = () => {
  const [warehouses, setWarehouses] = useState([
    { id: 1, name: "Kho A", location: "Hà Nội", description: "Kho trung tâm Hà Nội" },
    { id: 2, name: "Kho B", location: "Hà Nội", description: "Kho phụ trợ Hà Nội" },
    { id: 3, name: "Kho C", location: "Hải Dương", description: "Kho trung chuyển Hải Dương" },
    { id: 4, name: "Kho D", location: "Hải Dương", description: "Kho chính Hải Dương" },
    { id: 5, name: "Kho E", location: "Hà Nội", description: "Kho dự trữ Hà Nội" },
    { id: 6, name: "Kho F", location: "Hải Dương", description: "Kho tổng hợp Hải Dương" },
    { id: 7, name: "Kho G", location: "Hà Nội", description: "Kho hàng hóa Hà Nội" },
    { id: 8, name: "Kho H", location: "Hải Dương", description: "Kho phân phối Hải Dương" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredWarehouses = warehouses.filter((warehouse) => warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const exportToExcel = () => {
    const data = warehouses.map(({ name, location, description }) => ({
      "Tên nhà kho": name,
      "Tỉnh thành": location,
      "Mô tả": description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Warehouses");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Danh_sach_nha_kho.xlsx");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Danh sách nhà kho</h1>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-400">
            Xuất File
          </button>
          <button onClick={() => navigate("/admin/warehouses/add")} className="px-4 py-2 bg-[#182F73] text-white rounded-lg hover:bg-[#0F1F50]">
            <span className="text-white text-lg">+</span> Thêm mới
          </button>
        </div>
      </div>
      <input type="text" placeholder="Tìm kiếm theo tên nhà kho..." className="w-full p-2 mb-4 border rounded" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên nhà kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỉnh thành</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWarehouses.map((warehouse) => (
              <tr key={warehouse.id}>
                <td className="px-6 py-4">{warehouse.name}</td>
                <td className="px-6 py-4">{warehouse.location}</td>
                <td className="px-6 py-4">{warehouse.description}</td>
                <td className="px-6 py-4">
                  <button onClick={() => navigate(`/admin/warehouses/edit/${warehouse.id}`)} className="bg-white hover:bg-gray-50 py-1 px-2 mr-2">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => navigate(`/admin/warehouses/${warehouse.id}`)} className="bg-white hover:bg-gray-50 py-1 px-2">
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

export default ViewWarehouseList;

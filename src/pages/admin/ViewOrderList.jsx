import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ViewOrderList = () => {
  const [orders, setOrders] = useState([
    { id: 1, orderCode: "#12345", date: "19/03/2025", account: "Chi nhánh 107", status: "Đã thanh toán", total: 20000000 },
    { id: 2, orderCode: "#12346", date: "19/03/2025", account: "Chi nhánh 108", status: "Chưa thanh toán", total: 15000000 },
    { id: 3, orderCode: "#12347", date: "19/03/2025", account: "Chi nhánh 109", status: "Đã thanh toán", total: 18000000 },
    { id: 4, orderCode: "#12348", date: "19/03/2025", account: "Chi nhánh 110", status: "Chưa thanh toán", total: 22000000 },
    { id: 5, orderCode: "#12349", date: "19/03/2025", account: "Chi nhánh 111", status: "Đã thanh toán", total: 25000000 },
    { id: 6, orderCode: "#12350", date: "19/03/2025", account: "Chi nhánh 112", status: "Chưa thanh toán", total: 12000000 },
    { id: 7, orderCode: "#12351", date: "19/03/2025", account: "Chi nhánh 113", status: "Đã thanh toán", total: 30000000 },
    { id: 8, orderCode: "#12352", date: "19/03/2025", account: "Chi nhánh 114", status: "Chưa thanh toán", total: 27000000 },
    { id: 9, orderCode: "#12353", date: "19/03/2025", account: "Chi nhánh 115", status: "Đã thanh toán", total: 19000000 },
    { id: 10, orderCode: "#12354", date: "19/03/2025", account: "Chi nhánh 116", status: "Chưa thanh toán", total: 23000000 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredOrders = orders.filter((order) => order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()));

  const exportToExcel = () => {
    const data = orders.map(({ id, orderCode, date, account, status, total }) => ({
      "Mã đơn hàng": orderCode,
      "Ngày đặt": date,
      "Tài khoản": account,
      "Trạng thái": status,
      "Tổng số tiền": total.toLocaleString() + " VND",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Danh_sach_don_hang.xlsx");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Danh sách đơn hàng</h1>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-400 flex items-center gap-2">
            Xuất File
          </button>
          <button onClick={() => navigate("/admin/order/add")} className="px-4 py-2 bg-[#182F73] text-white rounded-lg hover:bg-[#0F1F50] flex items-center gap-2">
            <span className="text-white text-lg">+</span> Thêm mới
          </button>
        </div>
      </div>
      <input type="text" placeholder="Tìm kiếm theo mã đơn hàng..." className="w-full p-2 mb-4 border rounded" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tài khoản</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng số tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4">{order.orderCode}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">{order.account}</td>
                <td className="px-6 py-4">
                  <Badge className={order.status === "Đã thanh toán" ? "bg-green-200 text-black" : "bg-red-200 text-black"}>{order.status}</Badge>
                </td>
                <td className="px-6 py-4">{order.total.toLocaleString()} VND</td>
                <td className="px-6 py-4">
                  <button onClick={() => navigate(`/admin/orders/edit/${order.id}`)} className="bg-white hover:bg-gray-50 py-1 px-2 mr-2">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => navigate(`/admin/orders/${order.id}`)} className="bg-white hover:bg-gray-50 py-1 px-2">
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

export default ViewOrderList;

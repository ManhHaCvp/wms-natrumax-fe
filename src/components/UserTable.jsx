import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  // Gọi API lấy danh sách user
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/usermanage/listUser")
      .then((response) => {
        const data = response.data.map((user) => ({
          id: user.id,
          name: user.fullName,
          address: user.address || "Chưa cập nhật",
          phone: user.phoneNumber,
          createdAt: user.createDate,
          role: user.role?.name.replace("ROLE_", "") || "User",
          status: user.status == true ? "Hoạt động" : "Bị khóa",
        }));
        setUsers(data);
      })
      .catch((error) => console.error("Lỗi khi tải danh sách người dùng:", error));
  }, []);

  const onDetail = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
        value={searchTerm}
        onChange={handleSearchChange}
        className="px-4 py-2 border rounded-lg w-full sm:w-1/2 lg:w-1/3 mb-4"
      />

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tài khoản</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỉnh thành</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.address}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{user.status}</Badge>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onDetail(user.id)} className="bg-white hover:bg-gray-50 py-1 px-2 mr-2">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => onDetail(user.id)} className="bg-white hover:bg-gray-50 py-1 px-2">
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-4 py-2">Trang {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => (indexOfLastUser < filteredUsers.length ? prev + 1 : prev))}
          disabled={indexOfLastUser >= filteredUsers.length}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default UserTable;

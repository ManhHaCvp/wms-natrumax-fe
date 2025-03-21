import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge.jsx";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "@/services/userService.jsx";

const UserList = () => {
  const sampleUsers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      address: "Hà Nội",
      phone: "0987654321",
      createdAt: "2024-03-10",
      role: "Admin",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Trần Thị B",
      address: "TP. Hồ Chí Minh",
      phone: "0912345678",
      createdAt: "2024-02-15",
      role: "User",
      status: "Bị khóa",
    },
  ];

  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await userService.getUserList(setUsers, sampleUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  const handleEditUser = (userId) => {
    navigate(`/admin/user/edit/${userId}`);
  };

  const onDetail = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm));

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#182F73]">Danh sách người dùng</h1>
      <input type="text" placeholder="Tìm kiếm theo tên" value={searchTerm} onChange={handleSearchChange}
             className="px-4 py-2 border rounded-lg w-full mb-4" />

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              <input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length} />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tài khoản</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỉnh thành</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
          </thead>

          {/* Table Data */}
          <tbody className="bg-white divide-y divide-gray-200">
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4">
                <input type="checkbox" checked={selectedUsers.includes(user.id)}
                       onChange={() => handleCheckboxChange(user.id)} />
              </td>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.phone}</td>
              <td className="px-6 py-4">{user.address}</td>
              <td className="px-6 py-4">
                <Badge variant="outline">{user.status}</Badge>
              </td>

              {/* Action */}
              <td className="px-6 py-4">
                <button onClick={() => handleEditUser(user.id)} className="bg-white hover:bg-gray-50 py-1 px-2 mr-2">
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
    </div>
  );
};

export default UserList;
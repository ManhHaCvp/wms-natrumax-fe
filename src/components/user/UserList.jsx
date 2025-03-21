import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Eye, Pencil, CloudDownload, Plus, Filter } from "lucide-react";
import userService from "@/services/userService.jsx";
import {
  Pagination,
  PaginationContent, PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.jsx";

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

  // Get user list
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
    <div className="bg-[#f8fafc] m-5 p-5 border rounded-2xl">
      <div className="flex justify-between items-center mb-[10px]">
        <h1 className="text-[#182F73] text-3xl font-bold mb-4">Danh sách người dùng</h1>
        <div>
          <Button variant="outline"><CloudDownload/>Xuất file</Button>
          <Button className="bg-[#182F73] ms-[10px]"><Plus/>Thêm mới</Button>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <input type="text" placeholder="Tìm kiếm nhanh..." value={searchTerm} onChange={handleSearchChange}
               className="px-3 border rounded-md w-full" />
        <Button variant="outline" className="ms-[10px]"><Filter/>Bộ lọc</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y table-auto">
          <thead className="">
          <tr>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
              <input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length} />
            </th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tài khoản</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Tỉnh thành</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
          </thead>

          {/* Table Data */}
          <tbody className="divide-y">
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="p-4">
                <input type="checkbox" checked={selectedUsers.includes(user.id)}
                       onChange={() => handleCheckboxChange(user.id)} />
              </td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">{user.address}</td>
              <td className="p-3">
                <Badge variant="outline">{user.status}</Badge>
              </td>

              {/* Action */}
              <td className="p-3">
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
        <Pagination className="mt-[10px]">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default UserList;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageRole = () => {
  const sampleRoles = [
    { id: 1, name: "Admin", description: "Quản trị hệ thống" },
    { id: 2, name: "Distributor", description: "Nhà phân phối" },
    { id: 3, name: "User", description: "Người dùng thông thường" },
  ];

  const [roles, setRoles] = useState(sampleRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const rolesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/role/list")
      .then((response) => {
        const data = response.data.map((role) => ({
          id: role.id,
          name: role.name,
          description: role.description || "Chưa cập nhật",
        }));
        setRoles(data);
      })
      .catch(() => {
        setRoles(sampleRoles);
      });
  }, []);

  const handleEditRole = (roleId) => {
    navigate(`/admin/role/edit/${roleId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (roleId) => {
    setSelectedRoles((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]));
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === roles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles.map((role) => role.id));
    }
  };

  const filteredRoles = roles.filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Danh sách vai trò</h1>
        <button onClick={() => navigate("/admin/role/add")} className="px-4 py-2 bg-[#182F73] text-white rounded-lg hover:bg-[#0F1F50] flex items-center gap-2">
          <span className="text-white text-lg">+</span> Thêm mới
        </button>
      </div>

      <input type="text" placeholder="Tìm kiếm vai trò" value={searchTerm} onChange={handleSearchChange} className="px-4 py-2 border rounded-lg w-full mb-4" />

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedRoles.length === roles.length} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRoles.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedRoles.includes(role.id)} onChange={() => handleCheckboxChange(role.id)} />
                </td>
                <td className="px-6 py-4">{role.name}</td>
                <td className="px-6 py-4">{role.description}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEditRole(role.id)} className="bg-white hover:bg-gray-50 py-1 px-2 mr-2">
                    <Pencil className="h-5 w-5" />
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

export default ManageRole;

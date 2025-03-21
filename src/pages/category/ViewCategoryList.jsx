import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge.jsx";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewCategoryList = () => {
  const sampleCategories = [
    { id: 1, name: "Nhóm hàng A", description: "Mô tả nhóm hàng A" },
    { id: 2, name: "Nhóm hàng B", description: "Mô tả nhóm hàng B" },
    { id: 3, name: "Nhóm hàng C", description: "Mô tả nhóm hàng A" },
    { id: 4, name: "Nhóm hàng D", description: "Mô tả nhóm hàng B" },
    { id: 5, name: "Nhóm hàng E", description: "Mô tả nhóm hàng A" },
    { id: 6, name: "Nhóm hàng F", description: "Mô tả nhóm hàng B" },
  ];

  const [categories, setCategories] = useState(sampleCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categoriesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/category/list")
      .then((response) => {
        const data = response.data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "Chưa cập nhật",
        }));
        setCategories(data);
      })
      .catch(() => {
        setCategories(sampleCategories);
      });
  }, []);

  const handleEditCategory = (categoryId) => {
    navigate(`/admin/category/edit/${categoryId}`);
  };

  //   const handleDetailCategory = (categoryId) => {
  //     navigate(`/admin/category/${categoryId}`);
  //   };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat.id));
    }
  };

  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Danh sách nhóm hàng</h1>

        {/* Add Category */}
        <button onClick={() => navigate("/admin/category/add")} className="px-4 py-2 bg-[#182F73] text-white rounded-lg hover:bg-[#0F1F50] flex items-center gap-2">
          <span className="text-white text-lg">+</span> Thêm mới
        </button>
      </div>
      <input type="text" placeholder="Tìm kiếm theo tên" value={searchTerm} onChange={handleSearchChange} className="px-4 py-2 border rounded-lg w-full mb-4" />

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedCategories.length === categories.length} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhóm hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>

          {/*Table data*/}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCategories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => handleCheckboxChange(cat.id)} />
                </td>
                <td className="px-6 py-4">{cat.name}</td>
                <td className="px-6 py-4">{cat.description}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEditCategory(cat.id)} className="bg-white hover:bg-gray-50 py-1 px-2 mr-2">
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

export default ViewCategoryList;

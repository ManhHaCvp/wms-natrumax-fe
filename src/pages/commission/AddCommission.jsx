import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fetchUsers = async () => {
  return [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Hoàng C" },
  ];
};

const fetchCategories = async () => {
  return [
    { id: 1, categoryName: "Sản phẩm cũ + ngũ cốc 200gr", discount: 0 },
    { id: 2, categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 0 },
    { id: 3, categoryName: "SP Genomil", discount: 0 },
    { id: 4, categoryName: "Bột ăn dặm", discount: 0 },
  ];
};

const AddCommission = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const usersData = await fetchUsers();
      const categoriesData = await fetchCategories();
      setUsers(usersData);
      setCategories(categoriesData);
    };
    loadData();
  }, []);

  const handleDiscountChange = (id, newDiscount) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, discount: newDiscount } : cat)));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Thêm Hoa Hồng</h1>
        <Button className="flex items-center gap-2 bg-[#1A2B68] text-white rounded-lg px-4 py-2">
          <Save size={16} /> Lưu
        </Button>
      </div>

      <Card className="bg-[#F8FAFC] p-6 rounded-lg">
        <CardContent className="space-y-4">
          {/* Người được phân phối */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chi nhánh được phân phối</label>
            <Select onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn người được phân phối" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CategoryCategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0">Danh sách nhóm hàng</label>
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/3 text-left">Tên nhóm hàng</TableHead>
                  <TableHead className="w-1/3 text-center">% Chiết khấu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="h-auto">
                    <TableCell className="p-2">{category.categoryName}</TableCell>
                    <TableCell className="p-2 text-center">
                      <Input type="number" min="0" max="220" value={category.discount} onChange={(e) => handleDiscountChange(category.id, e.target.value)} className="w-20 text-center mx-auto block" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCommission;

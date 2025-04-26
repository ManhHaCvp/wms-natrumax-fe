import React, {useEffect, useState} from "react";
import {Pencil, Save} from "lucide-react";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Link} from "react-router-dom";

const fetchUsers = async () => {
    return [
        {id: 1, name: "Nguyễn Văn A"},
        {id: 2, name: "Trần Thị B"},
        {id: 3, name: "Lê Hoàng C"},
    ];
};

const fetchCategories = async () => {
    return [
        {id: 1, categoryName: "Sản phẩm cũ + ngũ cốc 200gr", discount: 0},
        {id: 2, categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 0},
        {id: 3, categoryName: "SP Genomil", discount: 0},
        {id: 4, categoryName: "Bột ăn dặm", discount: 0},
    ];
};

const CreateCommissionPolicy = () => {
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
        setCategories((prev) => prev.map((cat) => (cat.id === id ? {...cat, discount: newDiscount} : cat)));
    };

    return (
        <div className="p-5 space-y-5">
            <div className="flex justify-between items-center">
                <h1 className="text-[#182F73] text-3xl font-bold">Thêm Hoa Hồng</h1>
                <Button><Save size={16}/> Lưu</Button>
            </div>

            <Card className="p-5">
                <div className="space-y-5">
                    {/* Người được phân phối */}
                    <div className="space-y-3">
                        <label className="block mb-1 font-medium">Chi nhánh được phân phối</label>
                        <Select onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn người được phân phối"/>
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
                    <div className="space-y-3">
                        <label className="block mb-1 font-medium">Danh sách nhóm hàng</label>
                        <div className="rounded border">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên nhóm hàng</TableHead>
                                    <TableHead className="text-center">Phần trăm (%)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.categoryName}</TableCell>
                                        <TableCell>
                                            <Input type="number" min="0" max="220" value={category.discount}
                                                   onChange={(e) => handleDiscountChange(category.id, e.target.value)}
                                                   className="w-20 text-center mx-auto block"/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CreateCommissionPolicy;

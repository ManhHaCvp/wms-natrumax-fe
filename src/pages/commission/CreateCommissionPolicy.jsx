import React, {useEffect, useState} from "react";
import {Pencil, Save} from "lucide-react";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Link, useNavigate, useParams} from "react-router-dom";
import userService from "@/services/userService.jsx";
import categoryService from "@/services/categoryService.jsx";
import commissionService from "@/services/commissionService.jsx";
import toast from "react-hot-toast";
import NumberInput from "@/components/common/NumberInput.jsx";

const CreateCommissionPolicy = () => {
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const {referrerId} = useParams();

    useEffect(() => {
        const loadData = async () => {
            await userService.getReferralListByReferrerId(setUsers).catch((err) =>
                console.error("Failed to fetch user list:", err)
            );
            await categoryService.getAll(setCategories).catch((err) =>
                console.error("Failed to fetch category list:", err)
            )
        };
        loadData();
    }, []);

    const handlePercentageChange = (id, newPercentage) => {
        setCategories((prev) => prev.map((cat) => (cat.categoryId === id ? {...cat, percentage: newPercentage} : cat)));
    };

    const navigate = useNavigate();

    const handleSave = async () => {
        if (!selectedUser) {
            toast.error("Vui lòng chọn người được giới thiệu.");
            return;
        }

        const policies = categories.map((category) => ({
            categoryId: category.categoryId,
            percentage: Number(category.percentage) || 0,
        }));

        const payload = {
            referralId: selectedUser,   // Người được phân phối
            referrerId: Number(referrerId),  // Người giới thiệu (từ URL param)
            policies,
        };

        try {
            await commissionService.createPolicy(payload);
            navigate(`/admin/commissions/policy/${Number(referrerId)}`);
        } catch (error) {
            console.error("Error when creating policy:", error);
        }
    };

    return (
        <div className="p-5 space-y-5">
            <div className="flex justify-between items-center">
                <h1 className="text-[#182F73] text-3xl font-bold">Thêm chính sách hoa hồng</h1>
                <Button asChild><span onClick={handleSave}><Save size={16}/> Lưu</span></Button>
            </div>

            <Card className="p-5">
                <div className="space-y-5">
                    {/* Người được phân phối */}
                    <div className="space-y-3">
                        <label className="block mb-1 font-medium">Người được giới thiệu</label>
                        <Select onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn người được giới thiệu"/>
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.accountName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* CategoryCategory */}
                    <div className="space-y-3">
                        <label className="block font-medium">Danh sách nhóm hàng</label>
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
                                    <TableRow key={category.categoryId}>
                                        <TableCell>{category.categoryName}</TableCell>
                                        <TableCell>
                                            <NumberInput
                                                value={category.percentage || 0}
                                                min={0}
                                                max={15}
                                                onChange={(newValue) => handlePercentageChange(category.categoryId, newValue)}
                                            />
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

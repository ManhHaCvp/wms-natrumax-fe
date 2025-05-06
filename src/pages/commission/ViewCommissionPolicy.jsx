import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Plus, Pencil, Save, FileClock} from "lucide-react";
import {Link, useParams} from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetHeader,
    SheetTitle,
    SheetDescription, SheetFooter
} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import commissionService from "@/services/commissionService.jsx";
import toast from "react-hot-toast";
import NumberInput from "@/components/common/NumberInput.jsx";
import {checkUserRole} from "@/utils/checkUserRole.jsx";

const ViewCommissionPolicy = () => {
    const {id} = useParams();

    const [policies, setPolicies] = useState({
        referrer: {
            userId: 0,
            accountName: "",
            role: "",
            province: "",
        },
        commissions: [
            {
                commissionId: 0,
                referral: {
                    userId: 0,
                    accountName: "",
                    role: "",
                    province: "",
                },
                commissionPolicies: [
                    {
                        commissionPolicyId: 0,
                        categoryName: "",
                        percentage: 0,
                    },
                ],
            }
        ],
    });

    useEffect(() => {
        const fetchCommissionPolicyData = async () => {
            try {
                await commissionService.getPolicyByReferrerId(id, setPolicies);
            } catch (error) {
                console.error("Failed to fetch commission data:", error);
            }
        };

        fetchCommissionPolicyData().catch(console.error);
    }, []);

    const handleSaveChanges = async (commissionIndex) => {
        const selectedCommission = policies.commissions[commissionIndex];

        // Validate trước khi gửi
        if (!selectedCommission || !selectedCommission.commissionPolicies || selectedCommission.commissionPolicies.length === 0) {
            toast.error("Không có chính sách hoa hồng nào để cập nhật.");
            return;
        }

        const validPolicies = selectedCommission.commissionPolicies
            .filter((policy) =>
                policy.commissionPolicyId &&
                !isNaN(policy.percentage) &&
                policy.percentage !== null &&
                policy.percentage !== undefined
            )
            .map((policy) => ({
                commissionPolicyId: policy.commissionPolicyId,
                percentage: policy.percentage,
            }));

        if (validPolicies.length === 0) {
            toast.error("Dữ liệu cập nhật không hợp lệ.");
            return;
        }

        const payload = {
            commissionDetails: validPolicies,
        };

        try {
            await commissionService.updatePolicy(selectedCommission.referral.userId, payload);
        } catch (error) {
            console.error("Failed to update commission policy:", error);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <div className="p-5 space-y-5">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-[#182F73] text-3xl font-bold">Chính sách hoa hồng</h1>
                    <h2 className="text-lg font-semibold">
                        {policies.referrer.accountName} ({policies.referrer.province})
                    </h2>
                </div>
                <div className="space-x-3">
                    {checkUserRole("ROLE_ACCOUNTANT") ? (
                        <Button variant="default" asChild>
                            <Link to={`/commissions/create/${id}`}>
                                <Plus/>
                                Thêm mới
                            </Link>
                        </Button>
                    ) : null}
                    <Button variant="default" asChild>
                        <Link to={`/commissions/history/${id}`}>
                            <FileClock/>
                            Lịch sử
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {policies.commissions.map((commission, index) => (
                    <Card key={index} className="p-5 space-y-5">
                        <div className="flex justify-between items-center">
                        <span
                            className="block font-medium">{commission.referral.accountName} - {commission.referral.province}</span>
                            {checkUserRole("ROLE_ACCOUNTANT") ? (
                                <Sheet>
                                    <SheetTrigger>
                                        <Button variant="outline">
                                            <Pencil/> Sửa
                                        </Button>
                                    </SheetTrigger>

                                    <SheetContent className="space-y-5">
                                        <SheetHeader>
                                            <SheetTitle>Chỉnh sửa</SheetTitle>
                                            <SheetDescription>{commission.referral.accountName}</SheetDescription>
                                        </SheetHeader>
                                        <div className="space-y-3">
                                            {commission.commissionPolicies.map((policy, policyIndex) => (
                                                <div key={policyIndex} className="flex justify-between items-center">
                                                    <Label className="w-2/3">{policy.categoryName}</Label>

                                                    <div className="w-1/3">
                                                        <NumberInput
                                                            value={policy.percentage}
                                                            min={0}
                                                            max={15}
                                                            onChange={(newValue) => {
                                                                setPolicies(prevPolicies => {
                                                                    const updatedCommissions = [...prevPolicies.commissions];
                                                                    updatedCommissions[index] = {
                                                                        ...updatedCommissions[index],
                                                                        commissionPolicies: updatedCommissions[index].commissionPolicies.map((p, idx) => {
                                                                            if (idx === policyIndex) {
                                                                                return {...p, percentage: newValue};
                                                                            }
                                                                            return p;
                                                                        })
                                                                    };
                                                                    return {
                                                                        ...prevPolicies,
                                                                        commissions: updatedCommissions
                                                                    };
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <SheetFooter>
                                            <SheetClose>
                                                <Button type="button" onClick={() => handleSaveChanges(index)}>
                                                    <Save/> Save changes
                                                </Button>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Button type="button" variant="outline">
                                                    Đóng
                                                </Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            ) : null}
                        </div>

                        <div className="rounded border">
                            <Table className="w-full text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-2/3">Tên nhóm hàng</TableHead>
                                        <TableHead className="w-1/3 text-center">Phần trăm</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commission.commissionPolicies.map((policy, policyIndex) => (
                                        <TableRow key={policyIndex}>
                                            <TableCell>{policy.categoryName}</TableCell>
                                            <TableCell className="text-center">{policy.percentage}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ViewCommissionPolicy;

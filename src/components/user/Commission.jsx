import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent} from "@/components/ui/card";
import commissionService from "@/services/commissionService.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";
import {Pencil, Plus, Save} from "lucide-react";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import toast from "react-hot-toast";

const Commission = ({userId}) => {
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

    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!userId || hasFetched.current) return; // Don't fetch if no userId

        const fetchCommissionPolicyData = async () => {
            setLoading(true);
            try {
                await commissionService.getPolicyByReferrerId(userId, setPolicies);
            } catch (error) {
                console.error("Failed to fetch commission data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommissionPolicyData().catch(console.error);
        hasFetched.current = true;
    }, [userId]);

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <h1 className="text-[#182F73] text-3xl font-bold">Chính sách hoa hồng</h1>
                <Button variant="default" asChild>
                    <Link to={`/admin/commissions/create/${userId}`}>
                        <Plus /> Thêm mới
                    </Link>
                </Button>
            </div>

            {/* Loading skeleton */}
            {loading || policies.referrer.userId === 0 ? (
                <div className="grid grid-cols-3 gap-5">
                    {[1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-40 w-full rounded-md" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-5">
                    {policies.commissions.map((commission, index) => (
                        <Card key={index} className="p-5 space-y-5">
                            <span className="block font-medium">
                                {commission.referral.accountName} - {commission.referral.province}
                            </span>

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
            )}
        </div>
    );
}

export default Commission;
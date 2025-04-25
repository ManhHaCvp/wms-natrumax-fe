import React, {useEffect, useState} from "react";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {createColumnHelper} from "@tanstack/react-table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import DataTable from "@/components/common/DataTable";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const columnHelper = createColumnHelper();

// Data from the API response
const commissionData = {
    referrer: {
        userId: 6,
        accountName: "Chi nhánh 259",
        role: "ROLE_BRANCH_OWNER",
        province: "Hà Nội",
    },
    commissions: [
        {
            commissionId: 1,
            referral: {
                userId: 5,
                accountName: "Chi nhánh 107",
                role: "ROLE_BRANCH_OWNER",
                province: "Hải Dương",
            },
            commissionHistory: {
                commissionHistoryId: 1,
                month: 4,
                year: 2025,
                totalAmount: 2644489.9999999995,
                details: [
                    {
                        commissionHistoryDetailId: 1,
                        categoryName: "Sản phẩm cũ + ngũ cốc 200gr",
                        percentage: 10.0,
                        amount: 0.0
                    },
                    {
                        commissionHistoryDetailId: 2,
                        categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr",
                        percentage: 20.0,
                        amount: 9312999.999999998
                    },
                    {
                        commissionHistoryDetailId: 3,
                        categoryName: "SP Genumil",
                        percentage: 30.0,
                        amount: 2606299.9999999995
                    },
                ],
            },
        },
        {
            commissionId: 2,
            referral: {
                userId: 5,
                accountName: "Chi nhánh 107",
                role: "ROLE_BRANCH_OWNER",
                province: "Hải Dương",
            },
            commissionHistory: {
                commissionHistoryId: 2,
                month: 5,
                year: 2025,
                totalAmount: 2644489.9999999995,
                details: [
                    {
                        commissionHistoryDetailId: 1,
                        categoryName: "Sản phẩm cũ + ngũ cốc 200gr",
                        percentage: 10.0,
                        amount: 0.0
                    },
                    {
                        commissionHistoryDetailId: 2,
                        categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr",
                        percentage: 20.0,
                        amount: 9312999.999999998
                    },
                    {
                        commissionHistoryDetailId: 3,
                        categoryName: "SP Genumil",
                        percentage: 30.0,
                        amount: 2606299.9999999995
                    },
                ],
            },
        },
    ],
};

const columns = [
    columnHelper.accessor("year", {
        header: ({column}) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                 className="flex items-center cursor-pointer">
                Năm <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("month", {
        header: ({column}) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                 className="flex items-center cursor-pointer">
                Tháng <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("totalCommission", {
        header: "Tổng hoa hồng",
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("status", {
        header: "Trạng thái",
        cell: (info) => <span
            className={`px-2 py-1 rounded-md text-white ${info.getValue() === "Đã thanh toán" ? "bg-green-500" : "bg-red-500"}`}>{info.getValue()}</span>,
    }),
];

const CommissionManager = () => {
    const [commissionHistory, setCommissionHistory] = useState([]);

    useEffect(() => {
        const commissionHistoryData = commissionData.commissions.map((commission) => ({
            month: commission.commissionHistory.month,
            year: commission.commissionHistory.year,
            totalCommission: commission.commissionHistory.totalAmount.toLocaleString(),
            status: commission.commissionHistory.totalAmount > 0 ? "Đã thanh toán" : "Chưa thanh toán", // Example status based on totalAmount
        }));
        setCommissionHistory(commissionHistoryData);
    }, []);

    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedCommission, setSelectedCommission] = useState(null);

    const handleFilter = (e) => {
        e.preventDefault();
        const result = commissionData.commissions.find((item) => item.commissionHistory.month === +selectedMonth && item.commissionHistory.year === +selectedYear);
        setSelectedCommission(result);
    };

    return (
        <div className="p-5 space-y-5">
            <h1 className="text-[#182F73] text-3xl font-bold">Lịch sử hoa hồng</h1>

            <Tabs defaultValue="table" className="w-full">
                <TabsList className="">
                    <TabsTrigger value="table">Lịch sử giao dịch</TabsTrigger>
                    <TabsTrigger value="filter">Chi tiết giao dịch</TabsTrigger>
                </TabsList>

                <TabsContent value="table">
                    <DataTable className="m-0" title="Bảng hoa hồng" columns={columns} data={commissionHistory}/>
                </TabsContent>

                <TabsContent value="filter" className="space-y-5">
                    <form className="flex gap-4 items-end" onSubmit={handleFilter}>
                        <div>
                            <label className="block text-sm font-medium">Tháng</label>
                            <input type="number" min="1" max="12" value={selectedMonth}
                                   onChange={(e) => setSelectedMonth(e.target.value)}
                                   className="border rounded px-2 py-1 w-24" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Năm</label>
                            <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                                   className="border rounded px-2 py-1 w-32" required/>
                        </div>
                        <Button type="submit"> Lọc</Button>
                    </form>

                    {selectedCommission && (
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-[#182F73]">
                                        Chi tiết hoa hồng - {selectedMonth}/{selectedYear}
                                    </h3>
                                    <p className="text-md font-medium">
                                        Trạng thái: <span
                                        className={selectedCommission.status === "Đã thanh toán" ? "text-green-500" : "text-red-500"}>{selectedCommission.status}</span>
                                    </p>
                                </div>
                                {/* Total Commission */}
                                <div className="flex justify-between items-center space-x-5">
                                    <div className="text-xl font-bold text-[#182F73]">
                                        Tổng thanh
                                        toán: {commissionData.commissions.reduce((acc, curr) => acc + curr.commissionHistory.totalAmount, 0).toLocaleString("vi-VN")} VND
                                    </div>
                                    <Button type="submit"> Thanh toán</Button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {commissionData.commissions.map((commission, index) => {
                                    const {referral, commissionHistory} = commission;
                                    const totalAmount = commissionHistory.totalAmount;

                                    return (
                                        <Card key={index}>
                                            <CardContent className="p-5 space-y-5">
                                                <h2 className="text-lg font-bold text-gray-800">{referral.accountName}</h2>
                                                <div className="border rounded">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-1/3">Tên nhóm hàng</TableHead>
                                                            <TableHead className="text-center">Phần trăm</TableHead>
                                                            <TableHead className="text-right">Hoa hồng</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {commissionHistory.details.map((detail) => (
                                                            <TableRow key={detail.commissionHistoryDetailId}>
                                                                <TableCell>{detail.categoryName}</TableCell>
                                                                <TableCell
                                                                    className="text-center">{detail.percentage}%</TableCell>
                                                                <TableCell
                                                                    className="text-right">{detail.amount.toLocaleString("vi-VN")} VND</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow className="font-semibold border-t">
                                                            <TableCell>Tổng</TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell
                                                                className="text-right text-primary">{totalAmount.toLocaleString("vi-VN")} VND</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CommissionManager;

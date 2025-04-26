import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {createColumnHelper} from "@tanstack/react-table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import DataTable from "@/components/common/DataTable";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import commissionService from "@/services/commissionService.jsx";
import commissionHistoryService from "@/services/commissionHistoryService.jsx";
import {formatCurrency} from "@/utils/formatCurrency.jsx";
import toast from "react-hot-toast";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {DialogHeader} from "@/components/ui/dialog.jsx";
import userService from "@/services/userService.jsx";

const columnHelper = createColumnHelper();

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
    columnHelper.accessor("totalAmount", {
        header: "Tổng hoa hồng",
        cell: (info) => <div>{formatCurrency(info.getValue())}</div>,
    }),
    columnHelper.accessor("status", {
        header: "Trạng thái",
        cell: (info) => (
            <span
                className={`px-2 py-1 rounded-md text-white ${info.getValue() === "Đã thanh toán" ? "bg-green-500" : "bg-red-500"}`}>
        {info.getValue()}
      </span>
        ),
    }),
];

const ViewCommissionHistory = () => {
    const {id} = useParams();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCommissionHistory, setSelectedCommissionHistory] = useState({});

    const handleFilter = async (e) => {
        e.preventDefault();
        try {
            await commissionHistoryService.getByReferrerIdAndTime(id, selectedMonth, selectedYear, setSelectedCommissionHistory);
        } catch (error) {
            console.error("Failed to fetch commission data:", error);
        }
    };

    const totalPayment = selectedCommissionHistory?.commissions?.reduce(
        (sum, commission) => sum + (commission.commissionHistory?.totalAmount || 0),
        0
    ) || 0;

    const [qrUrl, setQrUrl] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [user, setUser] = useState({});

    const handleSendClick = async () => {
        try {
            const data = await userService.getById(selectedCommissionHistory?.referrer?.userId, setUser);
            setUser(data);

            const accountNameEncoded = encodeURIComponent(user.bank.accountName);
            const info = encodeURIComponent(`${user.bank.accountNo} gui tien`);
            const qrLink = `https://img.vietqr.io/image/${user.bank.bankCode}-${user.bank.accountNo}-compact2.jpg?amount=${totalPayment}&addInfo=${info}&accountName=${accountNameEncoded}`;

            setQrUrl(qrLink);
            setDialogOpen(true);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    return (
        <div className="p-5 space-y-5">
            <h1 className="text-[#182F73] text-3xl font-bold">Lịch sử hoa hồng</h1>
            <h2>{selectedCommissionHistory?.referrer?.accountName}</h2>

            <form className="flex space-x-3 items-end" onSubmit={handleFilter}>
                <div>
                    <label className="block text-sm font-medium">Tháng</label>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-24"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Năm</label>
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-32"
                        required
                    />
                </div>
                <Button type="submit">Lọc</Button>
            </form>

            {selectedCommissionHistory?.commissions?.length > 0 && (
                <div className="space-y-3">
                    {/* Header: Tổng thanh toán + trạng thái */}
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-[#182F73]">
                                Chi tiết hoa hồng - {selectedMonth}/{selectedYear}
                            </h3>
                            <p className="text-md font-medium">
                                Trạng thái: <span className="text-green-500">Đã thanh toán</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-5">
                            <div className="text-xl font-bold text-[#182F73]">
                                Tổng thanh toán: {formatCurrency(totalPayment)}
                            </div>
                            <Button asChild><span onClick={handleSendClick}>Thanh toán</span></Button>
                        </div>
                    </div>

                    {/* Danh sách các commission */}
                    <div className="space-y-5">
                        {selectedCommissionHistory.commissions.map((commission) => {
                            const {referral, commissionHistory} = commission;
                            const totalAmount = commissionHistory.totalAmount || 0;

                            return (
                                <Card key={commission.commissionId}>
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
                                                                className="text-right">{formatCurrency(detail.amount)} VND</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow className="font-semibold border-t">
                                                        <TableCell>Tổng</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell className="text-right text-primary">
                                                            {formatCurrency(totalAmount)} VND
                                                        </TableCell>
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quét mã QR để thanh toán</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center mb-4">
                        {qrUrl && <img src={qrUrl} alt="QR Code" className="max-w-full max-h-[400px]"/>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ViewCommissionHistory;
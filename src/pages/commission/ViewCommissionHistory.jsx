import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {Link, useParams} from "react-router-dom";
import {Pencil, View} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import commissionHistoryService from "@/services/commissionHistoryService.jsx";
import {formatCurrency} from "@/utils/formatCurrency.jsx";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {DialogHeader} from "@/components/ui/dialog.jsx";
import userService from "@/services/userService.jsx";
import walletService from "@/services/walletService";
import transactionService from "@/services/transactionService";
import UploadProofDialog from "@/components/user/UploadProofDialog";
import {Badge} from "@/components/ui/badge.jsx";
import NumberInput from "@/components/common/NumberInput.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";

const ViewCommissionHistory = () => {
    const {id} = useParams();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCommissionHistory, setSelectedCommissionHistory] = useState({});

    const [qrUrl, setQrUrl] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [user, setUser] = useState({});

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            await commissionHistoryService.getByReferrerIdAndTime(id, selectedMonth, selectedYear, setSelectedCommissionHistory);
        } catch (error) {
            console.error("Failed to fetch commission data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchData();
    };

    const totalPayment = selectedCommissionHistory?.commissions?.reduce((sum, commission) => sum + (commission.commissionHistory?.totalAmount || 0), 0) || 0;

    const handleSendClick = async () => {
        try {
            const data = await userService.getById(selectedCommissionHistory?.referrer?.userId);
            setUser(data);

            const qrLink = `https://img.vietqr.io/image/${user.bank.bankCode}-${user.bank.accountNo}-compact2.jpg?amount=${totalPayment}&addInfo=Thanh toán hoa hồng tháng ${selectedMonth} năm ${selectedYear}&accountName=${user.bank.accountName}`;
            setQrUrl(qrLink);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setDialogOpen(true);
        }
    };

    const handleCreateTransaction = async () => {
        try {
            if (!selectedCommissionHistory?.referrer?.userId) {
                toast.error("Không có thông tin người giới thiệu.");
                return;
            }

            const {data} = await walletService.getWalletByUserId(selectedCommissionHistory.referrer.userId);

            const payload = {
                totalAmount: totalPayment,
                walletId: data.walletId,
                discountId: null,
                transactionType: "COMMISSION",
            };

            const transaction = await transactionService.create(payload);

            if (!selectedCommissionHistory?.commissions?.length) {
                toast.error("Không có lịch sử hoa hồng.");
                return;
            }

            await commissionHistoryService.updateTransaction(id, selectedMonth, selectedYear, transaction.data.transactionsId);
            toast.success("Tạo giao dịch thành công!");
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi tạo giao dịch");
            console.error("Lỗi khi tạo giao dịch:", error);
        } finally {
            setDialogOpen(false);
            if (id) {
                fetchData();
            }
        }
    };

    const handleUploadTransferImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            await transactionService.uploadTransferImage(selectedCommissionHistory?.transactions?.transactionsId, formData); // await fetchData();
            toast.success("Tải ảnh lên thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Upload thất bại.");
        } finally {
            setUploadDialogOpen(false);
            if (id) {
                fetchData();
            }
        }
    };

    return (
        <div className="p-5 space-y-5">
            <div className="flex justify-between items-center">
                <h1 className="text-[#182F73] text-3xl font-bold">Lịch sử hoa hồng</h1>
                <h2 className="text-[#182F73] text-2xl font-bold">{selectedCommissionHistory?.referrer?.accountName}</h2>
            </div>

            <form className="flex space-x-3 items-center" onSubmit={handleFilter}>
                    <label className="text-xl font-semibold">Tháng</label>
                    <NumberInput
                        value={selectedMonth}
                        min={1}
                        max={12}
                        onChange={(newValue) => setSelectedMonth(newValue)}
                    />
                    <label className="text-xl font-semibold">Năm</label>
                    <NumberInput
                        value={selectedYear}
                        min={1900}  // Tùy bạn, ví dụ 1900 - 2100
                        max={2100}
                        onChange={(newValue) => setSelectedYear(newValue)}
                    />

                <Button>Lọc</Button>
            </form>
            {loading ? (
                <div className="space-y-5">

                    {/* Skeleton Header Info */}
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-80"/>
                            <Skeleton className="h-5 w-40"/>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-8 w-40"/>
                            <Skeleton className="h-8 w-32"/>
                            <Skeleton className="h-8 w-32"/>
                        </div>
                    </div>

                    {/* Skeleton for List of Commissions */}
                    <div className="space-y-5">
                        {[1, 2, 3].map((item) => (
                            <Card key={item}>
                                <CardContent className="p-5 space-y-5">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-6 w-40"/>
                                        <Skeleton className="h-8 w-24"/>
                                    </div>

                                    <div className="border rounded p-5 space-y-3">
                                        {[1, 2, 3].map((row) => (
                                            <div key={row} className="flex justify-between">
                                                <Skeleton className="h-4 w-1/4"/>
                                                <Skeleton className="h-4 w-1/6"/>
                                                <Skeleton className="h-4 w-1/6"/>
                                                <Skeleton className="h-4 w-1/6"/>
                                            </div>
                                        ))}
                                        {/* Total row */}
                                        <div className="flex justify-end pt-3">
                                            <Skeleton className="h-4 w-24"/>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {selectedCommissionHistory?.commissions?.length > 0 && (
                        <div className="space-y-3">
                            {/* Header: Tổng thanh toán + trạng thái */}
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <h3 className="text-[#182F73] text-xl font-bold">
                                        Chi tiết hoa hồng - {selectedMonth}/{selectedYear}
                                    </h3>
                                    <p className="text-md font-medium space-x-2">
                                        <span>Trạng thái:</span>
                                        {selectedCommissionHistory?.transactions?.status === "SUCCESS" ? (
                                            <Badge variant="default">
                                                {selectedCommissionHistory?.transactions?.status}
                                            </Badge>
                                        ) : (
                                            <Badge variant="tertiary">
                                                PENDING
                                            </Badge>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="text-xl font-bold text-[#182F73]">
                                        Tổng thanh toán: {formatCurrency(totalPayment)}
                                    </div>
                                    {!selectedCommissionHistory?.transactions ? (
                                        <Button asChild>
                                            <span onClick={handleSendClick}>Thanh toán</span>
                                        </Button>) : null
                                    }
                                    {selectedCommissionHistory?.transactions?.status === "PENDING" ? (
                                        <Button
                                            onClick={() => {
                                                setUploadDialogOpen(true);
                                            }}
                                        >
                                            Thêm ảnh chuyển khoản
                                        </Button>) : null
                                    }
                                    {selectedCommissionHistory?.transactions?.transferImage ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline"><View/></Button>
                                            </DialogTrigger>
                                            <DialogContent className="">
                                                <img
                                                    src={selectedCommissionHistory?.transactions?.transferImage}
                                                    alt="Proof"
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    ) : null}
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
                                                <div className="flex justify-between items-center">
                                                    <CardTitle
                                                        className="text-xl font-bold text-[#182F73]">{referral.accountName}</CardTitle>
                                                    <Button variant="outline" asChild>
                                                        <Link
                                                            to={`/admin/commissions/policy/${selectedCommissionHistory?.referrer?.userId}`}><Pencil/>Sửa</Link>
                                                    </Button>
                                                </div>
                                                <div className="border rounded">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-1/3">Tên nhóm hàng</TableHead>
                                                                <TableHead className="text-center">Phần trăm</TableHead>
                                                                <TableHead className="text-right">Doanh số</TableHead>
                                                                <TableHead className="text-right">Hoa hồng</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {commissionHistory.details.map((detail) => (
                                                                <TableRow key={detail.commissionHistoryDetailId}>
                                                                    <TableCell>{detail.categoryName}</TableCell>
                                                                    <TableCell
                                                                        className="text-center">{detail.percentage}%</TableCell>
                                                                    <TableCell className="text-right">
                                                                        {formatCurrency(detail.amount)}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        {formatCurrency(detail.amount * detail.percentage / 100)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                            <TableRow className="font-semibold border-t">
                                                                <TableCell>Tổng</TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell
                                                                    className="text-right text-primary">{formatCurrency(totalAmount)}</TableCell>
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
                </>
            )}
            <UploadProofDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}
                               onUpload={handleUploadTransferImage}/>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quét mã QR để thanh toán</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center mb-4">{qrUrl &&
                        <img src={qrUrl} alt="QR Code" className="max-w-full max-h-[400px]"/>}</div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreateTransaction}>Tạo giao dịch</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ViewCommissionHistory;

import React, {useEffect, useState} from "react";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {Button} from "@/components/ui/button.jsx";
import {createColumnHelper} from "@tanstack/react-table";
import axios from "axios";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import ImagePreviewModal from "@/components/common/ImagePreviewModal.jsx";
import UploadProofDialog from "@/components/user/UploadProofDialog.jsx";
import transactionService from "@/services/transactionService.jsx";
import toast from "react-hot-toast";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import {formatCurrency} from "@/utils/formatCurrency.jsx";
import formatDate from "@/utils/formatDate.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";

const columnHelper = createColumnHelper();

const columns = (
    setPreviewUrl,
    handleChangeTransactionStatus,
    setSelectedTransactionId,
    setUploadDialogOpen,
    handleSendClick,
    setImageDialogOpen // <--- fixed: must pass this in!
) => [
    columnHelper.accessor("transactionsId", {
        name: "Mã giao dịch",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center cursor-pointer"
            >
                Mã giao dịch
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("paymentDate", {
        name: "Ngày tạo",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center cursor-pointer"
            >
                Ngày tạo
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{formatDate.formatJsonToDateTime(info.getValue())}</div>,
    }),
    columnHelper.accessor("totalAmount", {
        name: "Số tiền",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center cursor-pointer"
            >
                Số tiền
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => {
            const amount = parseFloat(info.getValue());
            return <div>{formatCurrency(amount)}</div>;
        },
    }),
    columnHelper.accessor("discount.discountPercent", {
        name: "Chiết khấu",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center cursor-pointer"
            >
                Chiết khấu (%)
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue() ?? 0}%</div>,
    }),
    columnHelper.accessor("status", {
        name: "Trạng thái",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center cursor-pointer"
            >
                Trạng thái
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => {
            const status = info.getValue();
            const variant = {
                PENDING: "tertiary",
                SUCCESS: "outline",
                CONFIRMED: "default",
                CANCELED: "destructive",
                REFUNDED: "default",
            }[status] || "secondary";
            return <Badge variant={variant}>{status}</Badge>;
        },
    }),
    columnHelper.display({
        id: "actions",
        header: "Hành động",
        enableHiding: false,
        cell: (info) => {
            const row = info.row.original;
            console.log(row);
            const amount = row.totalAmount;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {row.status === "SUCCESS" && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => handleChangeTransactionStatus(row.transactionsId, "CONFIRMED")}>
                                    Xác nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleChangeTransactionStatus(row.transactionsId, "CANCELED")}>
                                    Hủy
                                </DropdownMenuItem>
                            </>
                        )}
                        {row.status === "CANCELED" && (
                            <>
                                <DropdownMenuItem onClick={() => {
                                    setSelectedTransactionId(row.transactionsId);
                                    setUploadDialogOpen(true);
                                }}>
                                    Thêm ảnh
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendClick(amount, row.bank)}>
                                    Mã QR
                                </DropdownMenuItem>
                            </>
                        )}
                        <>
                            {row.transferImage && (
                                <DropdownMenuItem onClick={() => {
                                    setPreviewUrl(row.transferImage);
                                    setImageDialogOpen(true);
                                }}>
                                    Bill chuyển khoản
                                </DropdownMenuItem>
                            )}
                            {row.refundImage && (
                                <DropdownMenuItem onClick={() => {
                                    setPreviewUrl(row.refundImage);
                                    setImageDialogOpen(true);
                                }}>
                                    Bill hoàn tiền
                                </DropdownMenuItem>
                            )}
                        </>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];

const statusOptions = ["PENDING", "SUCCESS", "CONFIRMED", "CANCELED", "REFUNDED"];

const ViewTransactionList = () => {
    const [data, setData] = useState([]);
    const [statusFilter, setStatusFilter] = useState("SUCCESS");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [qrUrl, setQrUrl] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchTransactions = async (status) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/transactions/status/${status}`);
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy giao dịch:", error);
        }
    };

    const handleChangeTransactionStatus = async (transactionId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8080/api/v1/transactions/${transactionId}/change-status`,
                {},
                {params: {status: newStatus}}
            );
            fetchTransactions(statusFilter);
        } catch (error) {
            console.error("Đổi trạng thái thất bại:", error);
        }
    };

    const handleUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            await transactionService.uploadRefundImage(selectedTransactionId, formData);
            await fetchTransactions("CANCELED");
            toast.success("Tải ảnh lên thành công!");
            setUploadDialogOpen(false);
            setSelectedTransactionId(null);
        } catch (err) {
            console.error(err);
            toast.error("Upload thất bại.");
        }
    };

    const handleSendClick = async (amount, bank) => {
        try {
            console.log(bank)
            const numberAmount = parseInt(String(amount).replace(/\D/g, ""), 10);
            const encodedName = encodeURIComponent(bank.accountName);
            const url = `https://img.vietqr.io/image/${bank.bankCode}-${bank.accountNo}-compact2.jpg?amount=${numberAmount}&addInfo=Hoàn tiền giao dịch&accountName=${encodedName}`;
            setQrUrl(url);
            setDialogOpen(true);
        } catch (error) {
            toast.error("Không thể tạo mã QR");
            console.error("QR Error:", error);
        }
    };

    useEffect(() => {
        fetchTransactions(statusFilter);
    }, [statusFilter]);

    return (
        <div className="space-y-4">
            <DataTable
                title="Danh sách giao dịch"
                columns={columns(
                    setPreviewUrl,
                    handleChangeTransactionStatus,
                    setSelectedTransactionId,
                    setUploadDialogOpen,
                    handleSendClick,
                    setImageDialogOpen // <--- added
                )}
                data={data}
                addButton={
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Trạng thái:</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Chọn trạng thái"/>
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                }
            />

            <UploadProofDialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
                onUpload={handleUpload}
            />

            <ImagePreviewModal
                open={imageDialogOpen}
                onOpenChange={setImageDialogOpen}
                imageUrl={previewUrl}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mã QR thanh toán</DialogTitle>
                    </DialogHeader>
                    {qrUrl && <img src={qrUrl} alt="QR Payment" className="w-full h-auto"/>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ViewTransactionList;
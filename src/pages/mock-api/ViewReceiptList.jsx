import React, {useEffect, useState} from "react";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {createColumnHelper} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import mockApiService from "@/services/mockApiService.jsx";
import formatDate from "@/utils/formatDate.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";

const columnHelper = createColumnHelper();

const ViewReceiptList = () => {
    const [data, setData] = useState([]);
    const [clientSecret, setClientSecret] = useState("secretNppHD");

    useEffect(() => {
        const fetchData = async () => {
            await mockApiService.getReceipts(clientSecret, setData);
        };
        fetchData();
    }, [clientSecret]);

    const columns = () => [
        columnHelper.accessor("Voucher_no", {
            name: "Số chứng từ",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Số chứng từ
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => <div>{info.getValue()}</div>,
        }),
        columnHelper.accessor("Voucher_date", {
            name: "Ngày chứng từ",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Ngày chứng từ
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => formatDate.formatJsonToDateTime(info.getValue()),
        }),
        columnHelper.accessor("Posted_date", {
            name: "Ngày hạch toán",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Ngày hạch toán
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => formatDate.formatJsonToDateTime(info.getValue()),
        }),
        columnHelper.accessor("Cash_deposit", {
            name: "Tiền nộp",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Tiền nộp
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => <div>{Number(info.getValue()).toLocaleString("vi-VN")} đ</div>,
        }),
        columnHelper.accessor("Reason", {
            name: "Lý do",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Lý do
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => info.getValue(),
        }),
        columnHelper.display({
            id: "actions",
            header: "Thao tác",
            enableHiding: false,
            cell: ({row}) => {
                const data = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
                            >
                                Sao chép
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild>
                                <Dialog>
                                    <DialogTrigger asChild>
                    <span
                        className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      Xem chi tiết
                    </span>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Chi tiết phiếu thu</DialogTitle>
                                        </DialogHeader>
                                        <div
                                            className="bg-gray-100 p-6 rounded-lg shadow-md space-y-6 text-sm overflow-x-auto">
                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Thông tin phiếu thu</h2>
                                                <div className="space-y-1">
                                                    <p><span
                                                        className="font-semibold">Số chứng từ:</span> {data.Voucher_no || "N/A"}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngày chứng từ:</span> {formatDate.formatJsonToDateTime(data.Voucher_date)}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngày hạch toán:</span> {formatDate.formatJsonToDateTime(data.Posted_date)}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Số tiền:</span> {Number(data.Cash_deposit || data.amount || 0).toLocaleString("vi-VN")} đ
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Lý do thanh toán:</span> {data.Reason || "Không có"}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Mục chi:</span> {data.Item_name || "Không có"}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngân hàng:</span> {data.Bank || "Không có"}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Khách hàng ID:</span> {data.Customer || "Không có"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ];

    return (
        <DataTable
            title="Danh sách phiếu thu"
            columns={columns()}
            data={data}
            addButton={
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="client-secret">Client Secret</Label>
                    <Input
                        type="password"
                        id="client-secret"
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                    />
                </div>
            }
        />
    );
};

export default ViewReceiptList;
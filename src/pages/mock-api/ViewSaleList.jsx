import React, {useEffect, useState} from "react";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {createColumnHelper} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import mockApiService from "@/services/mockApiService.jsx";
import formatDate from "@/utils/formatDate.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogTrigger
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

const ViewSaleList = () => {
    const [data, setData] = useState([]);
    const [clientSecret, setClientSecret] = useState("secretNppHD");

    useEffect(() => {
        const fetchData = async () => {
            await mockApiService.getSales(setData);
        };
        fetchData();
    }, []);

    // --- handle create inventory out ---
    const handleCreateInventoryOut = async (voucherNo) => {
        try {
            await mockApiService.createInventoryOutBySale(voucherNo, clientSecret);
        } catch (error) {
            console.error("Failed to create inventory out:", error);
        }
    };

    const columns = () => [
        columnHelper.accessor("Voucher_no", {
            name: "Số chứng từ",
            header: ({column}) => (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Số chứng từ
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => <div>{info.getValue()}</div>,
        }),
        columnHelper.accessor("Voucher_date", {
            name: "Ngày chứng từ",
            header: ({column}) => (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Ngày chứng từ
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => formatDate.formatJsonToDateTimeMinus7Hour(info.getValue()),
        }),
        columnHelper.accessor("Posted_date", {
            name: "Ngày hạch toán",
            header: ({column}) => (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Ngày hạch toán
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => formatDate.formatJsonToDateTimeMinus7Hour(info.getValue()),
        }),
        columnHelper.accessor("Customer", {
            name: "Khách hàng",
            header: ({column}) => (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Khách hàng
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("warehouse_id", {
            name: "Kho hàng",
            header: ({column}) => (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Kho hàng
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
                                            <DialogTitle>Phiếu bán hàng</DialogTitle>
                                        </DialogHeader>
                                        <div
                                            className="bg-gray-100 p-6 rounded-lg shadow-md space-y-6 text-sm overflow-x-auto">
                                            {/* Thông tin */}
                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Thông tin hóa đơn</h2>
                                                <div className="space-y-1">
                                                    <p><span
                                                        className="font-semibold">Số hóa đơn:</span> {data.Voucher_no}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngày hóa đơn:</span> {new Date(data.Voucher_date).toLocaleString("vi-VN")}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngày hạch toán:</span> {new Date(data.Posted_date).toLocaleString("vi-VN")}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Khách hàng ID:</span> {data.Customer}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Kho ID:</span> {data.warehouse_id}</p>
                                                    <p><span
                                                        className="font-semibold">Trạng thái:</span> {data.status ? "Đã duyệt" : "Chưa duyệt"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Danh sách sản phẩm */}
                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Danh sách sản phẩm</h2>
                                                <div className="border rounded bg-white">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-[50px]">STT</TableHead>
                                                                <TableHead>Mã sản phẩm</TableHead>
                                                                <TableHead>Ngày tạo</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {data.sale_items.map((item, index) => (
                                                                <TableRow key={item._id}>
                                                                    <TableCell
                                                                        className="font-medium">{index + 1}</TableCell>
                                                                    <TableCell>{item.Good}</TableCell>
                                                                    <TableCell>{formatDate.formatJsonToDateTime(item.createdAt)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleCreateInventoryOut(data.Voucher_no)}
                            >
                                Tạo phiếu xuất kho
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ];

    return (
        <DataTable
            title="Danh sách phiếu bán hàng"
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

const ViewSaleDetailInline = ({voucherNo}) => {
    const [saleDetail, setSaleDetail] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            await mockApiService.getSaleByVoucherNo(voucherNo, setSaleDetail);
        };
        fetchDetail();
    }, [voucherNo]);

    if (!saleDetail) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Số chứng từ</label>
                <div className="border p-2 rounded-md">{saleDetail.Voucher_no}</div>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Ngày chứng từ</label>
                <div
                    className="border p-2 rounded-md">{formatDate.formatJsonToDateTimeMinus7Hour(saleDetail.Voucher_date)}</div>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Ngày hạch toán</label>
                <div
                    className="border p-2 rounded-md">{formatDate.formatJsonToDateTimeMinus7Hour(saleDetail.Posted_date)}</div>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Khách hàng</label>
                <div className="border p-2 rounded-md">{saleDetail.Customer}</div>
            </div>
        </div>
    );
};

export default ViewSaleList;
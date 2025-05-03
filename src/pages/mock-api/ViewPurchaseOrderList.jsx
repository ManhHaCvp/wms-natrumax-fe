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
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";

const columnHelper = createColumnHelper();

const ViewPurchaseOrderList = () => {
    const [data, setData] = useState([]);
    const [retailerId, setRetailerId] = useState("500370926");

    useEffect(() => {
        const fetchData = async () => {
            const response = await mockApiService.getPurchaseOrders(retailerId, setData);
        };
        fetchData();
    }, []);

    const columns = () => [
        columnHelper.accessor("code", {
            name: "Mã phiếu",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Mã phiếu
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => <div>{info.getValue()}</div>,
        }),
        columnHelper.accessor("branchName", {
            name: "Chi nhánh",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Chi nhánh
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("purchaseDate", {
            name: "Ngày nhập",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Ngày nhập
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => formatDate.formatJsonToDateTimeMinus7Hour(info.getValue()),
        }),
        columnHelper.accessor("total", {
            name: "Tổng tiền",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Tổng tiền
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => <div>{Number(info.getValue()).toLocaleString("vi-VN")} đ</div>,
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
                                            <DialogTitle>Chi tiết phiếu nhập hàng</DialogTitle>
                                        </DialogHeader>
                                        <div
                                            className="bg-gray-100 p-6 rounded-lg shadow-md space-y-6 text-sm overflow-x-auto">
                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Thông tin chung</h2>
                                                <div className="space-y-1">
                                                    <p><span className="font-semibold">Mã phiếu:</span> {data.code}</p>
                                                    <p><span
                                                        className="font-semibold">Chi nhánh:</span> {data.branchName}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngày nhập:</span> {formatDate.formatJsonToDateTime(data.purchaseDate)}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Tổng tiền:</span> {Number(data.total).toLocaleString("vi-VN")} đ
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Tỷ lệ chiết khấu:</span> {data.discountRatio}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Danh sách sản phẩm</h2>
                                                <Table>
                                                    <TableCaption>Danh sách sản phẩm trong phiếu nhập
                                                        hàng.</TableCaption>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Mã sản phẩm</TableHead>
                                                            <TableHead>Tên sản phẩm</TableHead>
                                                            <TableHead>Số lượng</TableHead>
                                                            <TableHead>Đơn giá</TableHead>
                                                            <TableHead>Chiết khấu</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {data.purchaseOrderDetails.map((item) => (
                                                            <TableRow key={item._id}>
                                                                <TableCell>{item.productCode}</TableCell>
                                                                <TableCell>{item.productName}</TableCell>
                                                                <TableCell>{item.quantity}</TableCell>
                                                                <TableCell>{Number(item.price).toLocaleString("vi-VN")} đ</TableCell>
                                                                <TableCell>{item.discount}%</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
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
            title="Danh sách phiếu nhập hàng"
            columns={columns()}
            data={data}
            addButton={
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="retailer-id">Retailer Id</Label>
                    <Input
                        type="password"
                        id="retailer-id"
                        value={retailerId}
                        onChange={(e) => setRetailerId(e.target.value)}
                    />
                </div>
            }
        />
    );
};

export default ViewPurchaseOrderList;
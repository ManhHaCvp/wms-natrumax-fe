import React, {useEffect, useState} from "react";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {createColumnHelper} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
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
    DialogTrigger
} from "@/components/ui/dialog.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";

const columnHelper = createColumnHelper();

const ViewInventoryOutList = () => {
    const [data, setData] = useState([]);
    const [clientSecret, setClientSecret] = useState("secretNppHD");
    const [saleId, setSaleId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            await mockApiService.getInventoryOutsBySaleId(clientSecret, saleId, setData);
        };
        fetchData();
    }, [clientSecret, saleId]);

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
        columnHelper.accessor("sale_id", {
            name: "Phiếu bán hàng",
            header: ({column}) => (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center"
                >
                    Phiếu bán hàng
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
            cell: (info) => formatDate.formatJsonToDateTime(info.getValue()),
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
            cell: (info) => formatDate.formatJsonToDateTime(info.getValue()),
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
                                            <DialogTitle>Phiếu xuất kho</DialogTitle>
                                        </DialogHeader>
                                        <div
                                            className="bg-gray-100 p-6 rounded-lg shadow-md space-y-6 text-sm overflow-x-auto">
                                            {/* Thông tin khách hàng */}
                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Thông tin khách hàng</h2>
                                                <div className="space-y-1">
                                                    <p><span
                                                        className="font-semibold">Tên khách:</span> {data.Customer_id.Customer_name}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Số điện thoại:</span> {data.Customer_id.Phone_number}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Địa chỉ:</span> {data.Customer_id.Address}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Mã khách hàng:</span> {data.Customer_id.Customer_id}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Mã kho:</span> {data.Customer_id.warehouse_id}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Thông tin phiếu xuất */}
                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Thông tin phiếu xuất</h2>
                                                <div className="space-y-1">
                                                    <p><span
                                                        className="font-semibold">Số phiếu:</span> {data.Voucher_no}</p>
                                                    <p><span
                                                        className="font-semibold">Mã kho:</span> {data.warehouse_id}</p>
                                                    <p><span
                                                        className="font-semibold">Mã đơn hàng:</span> {data.sale_id || "Không có"}
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
                                                                <TableHead className="w-[100px]">Mã sản phẩm</TableHead>
                                                                <TableHead>Trạng thái</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {data.items.map((item) => (
                                                                <TableRow key={item._id}>
                                                                    <TableCell
                                                                        className="font-medium">{item.Good_id}</TableCell>
                                                                    <TableCell>{item.Status || "Chưa xử lý"}</TableCell>
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ];

    return (
        <DataTable
            title="Danh sách phiếu xuất kho"
            columns={columns()}
            data={data}
            addButton={
                <div className="flex items-center gap-3">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="sale-id">Sale Id</Label>
                        <Input
                            type="text"
                            id="sale-id"
                            value={saleId}
                            onChange={(e) => setSaleId(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="client-secret">Client Secret</Label>
                        <Input
                            type="password"
                            id="client-secret"
                            value={clientSecret}
                            onChange={(e) => setClientSecret(e.target.value)}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default ViewInventoryOutList;
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

const ViewInventoryInList = () => {
    const [data, setData] = useState([]);
    const [clientSecret, setClientSecret] = useState("secretNppHD");

    useEffect(() => {
        const fetchData = async () => {
            const response = await mockApiService.getInventoryIns(clientSecret, setData);
        };
        fetchData();
    }, []);

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
            cell: (info) => formatDate.formatJsonToDateTimeMinus7Hour(info.getValue()),
        }),
        columnHelper.accessor("Posted_date", {
            name: "Ngày hạch toán",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Ngày hạch toán
                    <ArrowUpDown size={16} className="ml-2"/>
                </div>
            ),
            cell: (info) => formatDate.formatJsonToDateTimeMinus7Hour(info.getValue()),
        }),
        columnHelper.accessor("warehouse_id", {
            name: "Kho nhập",
            header: ({column}) => (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                    Kho nhập
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
                                            <DialogTitle>Chi tiết phiếu nhập kho</DialogTitle>
                                        </DialogHeader>
                                        <div
                                            className="bg-gray-100 p-6 rounded-lg shadow-md space-y-6 text-sm overflow-x-auto">
                                            <div>
                                                <h2 className="font-bold text-lg mb-2">Thông tin phiếu nhập kho</h2>
                                                <div className="space-y-1">
                                                    <p><span
                                                        className="font-semibold">Số chứng từ:</span> {data.Voucher_no}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngày chứng từ:</span> {formatDate.formatJsonToDateTime(data.Voucher_date)}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Ngày hạch toán:</span> {formatDate.formatJsonToDateTime(data.Posted_date)}
                                                    </p>
                                                    <p><span
                                                        className="font-semibold">Kho nhập:</span> {data.warehouse_id}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Nếu sau này items có dữ liệu */}
                                            {data.items?.length > 0 && (
                                                <div>
                                                    <h2 className="font-bold text-lg mb-2">Danh sách sản phẩm</h2>
                                                    <Table>
                                                        <TableCaption>Danh sách sản phẩm nhập kho.</TableCaption>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Mã sản phẩm</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {data.items.map((item) => (
                                                                <TableRow key={item._id}>
                                                                    <TableCell>{item.Good_id}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            )}
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
            title="Danh sách phiếu nhập kho"
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

export default ViewInventoryInList;
import React, {useEffect, useState, useMemo} from "react";
import {Link} from "react-router-dom";
import {createColumnHelper} from "@tanstack/react-table";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import orderService from "@/services/orderService.jsx";
import formatDate from "@/utils/formatDate.jsx";

const columnHelper = createColumnHelper();

const useOrderColumns = () => useMemo(() => [
    columnHelper.display({
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("orderId", {
        name: "Mã đơn hàng",
        header: sortableHeader("Mã đơn hàng"),
        cell: (info) => <div>DH{info.getValue()}</div>,
    }),
    columnHelper.accessor("orderDate", {
        name: "Ngày đặt",
        header: sortableHeader("Ngày đặt"),
        cell: (info) => <div>{formatDate.formatJsonToDateTime(info.getValue())}</div>,
    }),
    columnHelper.accessor("accountName", {
        name: "Tài khoản",
        header: sortableHeader("Tài khoản"),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("totalAmount", {
        name: "Tổng số tiền",
        header: sortableHeader("Tổng số tiền"),
        cell: (info) => {
            const amount = parseFloat(info.getValue());
            return <div className="font-medium">{amount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND"
            })}</div>;
        },
    }),
    columnHelper.accessor("status", {
        name: "Trạng thái",
        header: "Trạng thái",
        cell: (info) => {
            const status = info.getValue();
            const badgeMap = {
                PENDING: {label: "Đang chờ xác nhận", variant: "secondary"},
                CONFIRMED: {label: "Đã xác nhận", variant: "default"},
                PACKED: {label: "Đã đóng gói", variant: "default"},
                SHIPPED: {label: "Đang được giao", variant: "outline"},
                DELIVERED: {label: "Đã được giao", variant: "success"},
                CANCELED: {label: "Đã hủy", variant: "destructive"},
                RETURNED: {label: "Hoàn trả", variant: "destructive"},
                FAILED: {label: "Thất bại", variant: "destructive"},
            };
            const {label, variant} = badgeMap[status] || {label: status, variant: "default"};
            return <Badge variant={variant}>{label}</Badge>;
        },
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
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}>
                            Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link to={`/admin/order/${data.orderId}`}>Xem</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={`/admin/order/update/${data.orderId}`}>Sửa</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
], []);

const sortableHeader = (label) => ({column}) => (
    <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         className="flex items-center cursor-pointer">
        {label} <ArrowUpDown size={16} className="ml-2"/>
    </div>
);

const ViewOrderList = () => {
    const [data, setData] = useState([]);
    const columns = useOrderColumns();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await orderService.getAll(setData);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <DataTable
            title="Danh sách đơn hàng"
            columns={columns}
            data={data}
        />
    );
};

export default ViewOrderList;
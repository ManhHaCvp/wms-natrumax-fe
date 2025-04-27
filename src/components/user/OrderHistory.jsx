import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Button } from "@/components/ui/button.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import orderService from "@/services/orderService.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import HomePage from "@/pages/main/HomePage.jsx";
import formatDate from "@/utils/formatDate";

const columnHelper = createColumnHelper();
 
const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
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
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Mã đơn hàng
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>DH{info.getValue()}</div>,
  }),
  columnHelper.accessor("orderDate", {
    name: "Ngày đặt",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Ngày đặt
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>  {formatDate.formatJsonToDateTime(info.getValue())}</div>,
  }),
  columnHelper.accessor("accountName", {
    name: "Tài khoản",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tài khoản
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("totalAmount", {
    name: "Tổng số tiền",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tổng số tiền
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => {
      const amount = parseFloat(info.getValue());
      const formatted = new Intl.NumberFormat("vn-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  }),
  columnHelper.accessor("status", {
    name: "Trạng thái",
    header: "Trạng thái",
    cell: (info) => {
      const status = info.getValue();
      switch (status) {
        case "PENDING":
          return <Badge variant="secondary">Đang chờ xác nhận</Badge>;
        case "CONFIRMED":
          return <Badge variant="default">Đã xác nhận</Badge>;
        case "PACKED":
          return <Badge variant="default">Đã đóng gói</Badge>;
        case "SHIPPED":
          return <Badge variant="outline">Đang được giao</Badge>;
        case "DELIVERED":
          return <Badge variant="success">Đã được giao</Badge>;
        case "CANCELED":
          return <Badge variant="destructive">Đã hủy</Badge>;
        case "RETURNED":
          return <Badge variant="destructive">Hoàn trả</Badge>;
        case "FAILED":
          return <Badge variant="destructive">Thất bại</Badge>;
        default:
          return <Badge>{status}</Badge>;
      }
    },
  }),
  
  
  columnHelper.display({
    id: "actions",
    header: "Thao tác",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
            >
              Sao chép
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
];

const OrderHistory = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
   
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await orderService.getOrderListById(user.id,setData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  return (
    <DataTable
      title="Danh sách đơn hàng"
      columns={columns}
      data={data}
      addLink="/admin/order/create"
      className="m-0"
    />
  );
}

export default OrderHistory;
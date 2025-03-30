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
import { Badge } from "@/components/ui/badge.jsx";
import discountService from "@/services/discountService.jsx";

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
  columnHelper.accessor("description", {
    name: "Mô tả",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Mô tả
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("minimumAmount", {
    name: "Số tiền tối thiểu",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Số tiền tối thiểu
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
  columnHelper.accessor("discount", {
    name: "Mức giảm giá",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Mức giảm giá
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("activeDate", {
    name: "Ngày bắt đầu",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Ngày bắt đầu
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("expiryDate", {
    name: "Ngày kết thúc",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Ngày kết thúc
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("status", {
    name: "Trạng thái",
    header: "Trạng thái",
    cell: (info) =>  (
      info.getValue() === "-1" ? (
        <Badge variant="tertiary">Chưa bắt đầu</Badge>
      ) : info.getValue() === "0" ? (
        <Badge>Đang có hiệu lực</Badge>
      ) : (
        <Badge variant="destructive">Đã hết hạn</Badge>
      )
    ),
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
            {/*<DropdownMenuItem asChild>*/}
            {/*  <Link to={`/admin/discount/${data.id}`}>Xem</Link>*/}
            {/*</DropdownMenuItem>*/}
            <DropdownMenuItem asChild>
              <Link to={`/admin/discount/update/${data.id}`}>Sửa</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewDiscountList = () => {
  const [data, setData] = useState([
    { id: 1, minimumAmount: "1500000", discount: "10%", description: "Giảm giá cho khách hàng VIP", activeDate: "01/03/2025", expiryDate: "31/03/2025", status: "-1" },
    { id: 2, minimumAmount: "500000", discount: "5%", description: "Ưu đãi tháng 3", activeDate: "10/03/2025", expiryDate: "20/03/2025", status: "0" },
    { id: 3, minimumAmount: "2000000", discount: "15%", description: "Giảm giá sinh nhật", activeDate: "05/03/2025", expiryDate: "10/03/2025", status: "1" },
    { id: 4, minimumAmount: "3000000", discount: "20%", description: "Flash Sale", activeDate: "15/03/2025", expiryDate: "16/03/2025", status: "1" },
    { id: 5, minimumAmount: "750000", discount: "8%", description: "Khuyến mãi ngày lễ", activeDate: "20/03/2025", expiryDate: "25/03/2025", status: "1" },
    { id: 6, minimumAmount: "1200000", discount: "12%", description: "Giảm giá khách hàng thân thiết", activeDate: "01/04/2025", expiryDate: "10/04/2025", status: "1" },
    { id: 7, minimumAmount: "950000", discount: "6%", description: "Ưu đãi cho đơn hàng đầu tiên", activeDate: "05/04/2025", expiryDate: "15/04/2025", status: "0" },
    { id: 8, minimumAmount: "2500000", discount: "18%", description: "Đại hội giảm giá", activeDate: "10/04/2025", expiryDate: "20/04/2025", status: "0" },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await discountService.getAll(setData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  return (
    <DataTable
      title="Danh sách giảm giá"
      columns={columns}
      data={data}
      addLink="/admin/discount/create"
    />
  );
}

export default ViewDiscountList;
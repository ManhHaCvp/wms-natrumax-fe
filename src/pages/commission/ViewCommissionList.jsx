import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Button } from "@/components/ui/button.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import commissionService from "@/services/commissionService.jsx";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("accountName", {
    name: "Tên tài khoản",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Tên tài khoản
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("phoneNumber", {
    name: "Số điện thoại",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Số điện thoại
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("address", {
    name: "Tỉnh thành",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Tỉnh thành
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("province", {
    name: "Khu vực",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Khu vực
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.display({
    id: "actions",
    header: "Thao tác",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/admin/commissions/policy/${user.id}`}>Chính sách hoa hồng</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/admin/commissions/history/${user.id}`}>Lịch sử giao dịch</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewCommissionList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        await commissionService.getAllReferrer(setData);
      } catch (error) {
        console.error("Failed to fetch commission data:", error);
      }
    };

    fetchCommissionData().catch(console.error);
  }, []);

  return <DataTable title="Danh sách hoa hồng" columns={columns} data={data} />;
};

export default ViewCommissionList;

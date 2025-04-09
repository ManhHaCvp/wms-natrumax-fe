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
import roleService from "@/services/roleService.jsx";
import DataTable from "@/components/common/DataTable.jsx";

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
  columnHelper.accessor("roleName", {
    name: "Tên vai trò",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tên vai trò
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
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
            {/*<DropdownMenuSeparator />*/}
            {/*<DropdownMenuItem asChild>*/}
            {/*  <Link to={`/admin/role/${data.id}`}>Xem</Link>*/}
            {/*</DropdownMenuItem>*/}
            {/*<DropdownMenuItem asChild>*/}
            {/*  <Link to={`/admin/role/update/${data.id}`}>Sửa</Link>*/}
            {/*</DropdownMenuItem>*/}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewRoleList = () => {
  const [data, setData] = useState([
    { roleId: 1, roleName: "Admin", description: "Quản trị hệ thống" },
    { roleId: 2, roleName: "Accountant", description: "Kế toán" },
    { roleId: 3, roleName: "Distributor", description: "Nhà phân phối" },
    { roleId: 4, roleName: "Branch Owner", description: "Chủ chi nhánh" },
    { roleId: 5, roleName: "Customer", description: "Khách mua hàng" },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await roleService.getAll(setData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  return (
    <DataTable
      title="Danh sách vai trò"
      columns={columns}
      data={data}
      addLink="/admin/role/create"
    />
  );
}

export default ViewRoleList;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import categoryService from "@/services/categoryService.jsx";

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
  columnHelper.accessor("name", {
    name: "Tên nhóm hàng",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tên nhóm hàng
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
            <DropdownMenuSeparator />
            {/*<DropdownMenuItem asChild>*/}
            {/*  <Link to={`/admin/category/${data.id}`}>Xem</Link>*/}
            {/*</DropdownMenuItem>*/}
            <DropdownMenuItem asChild>
              <Link to={`/admin/category/update/${data.id}`}>Sửa</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewCategoryList = () => {
  const [data, setData] = useState([
    { id: 1, name: "Nhóm hàng A", description: "Mô tả nhóm hàng A" },
    { id: 2, name: "Nhóm hàng B", description: "Mô tả nhóm hàng B" },
    { id: 3, name: "Nhóm hàng C", description: "Mô tả nhóm hàng A" },
    { id: 4, name: "Nhóm hàng D", description: "Mô tả nhóm hàng B" },
    { id: 5, name: "Nhóm hàng E", description: "Mô tả nhóm hàng A" },
    { id: 6, name: "Nhóm hàng F", description: "Mô tả nhóm hàng B" },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await categoryService.getAll(setData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  return (
    <DataTable
      title="Danh sách nhóm hàng"
      columns={columns}
      data={data}
      addLink="/admin/category/create"
    />
  );
}

export default ViewCategoryList;
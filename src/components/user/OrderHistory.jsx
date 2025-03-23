import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import userService from "@/services/userService.jsx";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("name", {
    name: "Tên",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tên
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("phoneNumber", {
    name: "Số điện thoại",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Số điện thoại
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("amount", {
    name: "Số tiền",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Số tiền
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
    cell: (info) => (
      info.getValue() ? (
        <Badge>Hoạt động</Badge>
      ) : (
        <Badge variant="destructive">Bị khóa</Badge>
      )
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Thao tác",
    enableHiding: false,
    cell: ({ row }) => {
      const paymentHistory = row.original;
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
              onClick={() => navigator.clipboard.writeText(JSON.stringify(paymentHistory))}
            >
              Sao chép
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/admin/payment-history/${paymentHistory.id}`}>Xem</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admin/payment-history/update/${paymentHistory.id}`}>Sửa</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

export default function ViewUserList() {
  const [data, setData] = useState([
    { id: 1, name: "Nguyen Van A", phoneNumber: "0123456789", status: "Đã thanh toán", amount: "500000", color: "green", },
    { id: 2, name: "Nguyen Van B", phoneNumber: "0123456789", status: "Chờ xác nhận", amount: "100000", color: "orange", },
    { id: 3, name: "Nguyen Van C", phoneNumber: "0123456789", status: "Đã hủy", amount: "200000", color: "red" },
    { id: 4, name: "Nguyen Van D", phoneNumber: "0123456789", status: "Đã hủy", amount: "750000", color: "red" },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //await orderService.getOrderListByUserId(user.id, setData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="m-5">
      <div className="flex items-center pb-3">
        <Input
          placeholder="Tìm kiếm nhanh..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            table.setGlobalFilter(e.target.value);
          }}
          className="w-full me-3"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Cột <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.name}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-3">
        <div className="flex-1 text-sm text-muted-foreground"> Đã chọn&nbsp;
          {table.getFilteredSelectedRowModel().rows.length} trên{" "}
          {table.getFilteredRowModel().rows.length} hàng.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
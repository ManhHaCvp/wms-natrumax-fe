import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import transactionService from "@/services/transactionService";
import UploadProofDialog from "./UploadProofDialog";
import toast from "react-hot-toast";
import ImagePreviewModal from "../common/ImagePreviewModal";

const columnHelper = createColumnHelper();

export default function ListTransactionByWalletId({ walletId,reloadTrigger }) {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fetchData = useCallback(async () => {
    try {
      const response = await transactionService.getByWalletId(walletId);
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi fetch danh sách giao dịch:", error);
    }
  }, [walletId,reloadTrigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    columnHelper.accessor("transactionsId", {
      header: "Mã GD",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("paymentDate", {
      header: "Ngày thanh toán",
      cell: (info) => (
        <div>{new Date(info.getValue()).toLocaleString("vi-VN")}</div>
      ),
    }),
    columnHelper.accessor("totalAmount", {
      header: ({ column }) => (
        <div
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex items-center cursor-pointer"
        >
          Số tiền
          <ArrowUpDown size={16} className="ml-2" />
        </div>
      ),
      cell: (info) => {
        const amount = parseFloat(info.getValue());
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount);
      },
    }),
    columnHelper.accessor("status", {
      header: "Trạng thái",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge variant={status === "PENDING" ? "secondary" : "outline"}>
            {status}
          </Badge>
        );
      },
    }),
    // columnHelper.accessor("transaction_type", {
    //   header: "Loại giao dịch",
    //   cell: (info) => <div>{info.getValue()}</div>,
    // }),
    columnHelper.accessor("discount.discountPercent", {
      header: "Chiết khấu (%)",
      cell: (info) => <div>{info.getValue() ?? 0}%</div>,
    }),
    columnHelper.accessor("transferImage", {
      header: "Ảnh minh chứng",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <img
            src={url}
            alt="Proof"
            className="w-16 h-16 object-cover rounded border"
            onClick={() => setPreviewUrl(url)}

          />
        ) : (
          <span className="text-sm text-muted-foreground">Chưa có</span>
        );
      },
    }),
    columnHelper.accessor("refundImage", {
      header: "Ảnh hoàn tiền",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <img
            src={url}
            alt="Proof"
            className="w-16 h-16 object-cover rounded border"
            onClick={() => setPreviewUrl(url)}

          />
        ) : (
          <span className="text-sm text-muted-foreground">Không có</span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTransactionId(transaction.transactionsId);
                  setUploadDialogOpen(true);
                }}
              >
                Thêm ảnh
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Xem chi tiết")}>
                Xem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await transactionService.uploadTransferImage(
        selectedTransactionId,
        formData
      );
      await fetchData();
      toast.success("Tải ảnh lên thành công!");
      setUploadDialogOpen(false);
      setSelectedTransactionId(null);
    } catch (err) {
      console.error(err);
      alert("Upload thất bại.");
    }
  };

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
            <Button variant="outline">
              Cột <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.columnDef.header}
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end pt-3 space-x-2">
        <div className="text-sm text-muted-foreground">
          Đã chọn {table.getFilteredSelectedRowModel().rows.length} trên{" "}
          {table.getFilteredRowModel().rows.length} hàng.
        </div>
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

      <UploadProofDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
      />
      <ImagePreviewModal
        open={!!previewUrl}
        imageUrl={previewUrl}
        onOpenChange={() => setPreviewUrl(null)}
      />
    </div>
  );
}

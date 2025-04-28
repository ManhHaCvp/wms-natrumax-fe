import React, { useState } from "react";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DataTable from "@/components/common/DataTable";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columnHelper = createColumnHelper();

const ViewLotteryCodeList = () => {
  const [data, setData] = useState([
    { id: 1, code: "LT12345", product: "Sữa tươi A", price: 50000, address: "Hà Nội", buyDate: "2025-04-10" },
    { id: 2, code: "LT67890", product: "Sữa chua B", price: 30000, address: "Hồ Chí Minh", buyDate: "2025-04-12" },
    { id: 3, code: "LT11223", product: "Bánh sữa C", price: 45000, address: "Đà Nẵng", buyDate: "2025-04-15" },
  ]);

  const [openSheet, setOpenSheet] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentData, setCurrentData] = useState({
    id: null,
    code: "",
    product: "",
    price: "",
    address: "",
    buyDate: "",
  });

  const handleAdd = () => {
    setMode("create");
    setCurrentData({
      id: null,
      code: "",
      product: "",
      price: "",
      address: "",
      buyDate: "",
    });
    setOpenSheet(true);
  };

  const handleEdit = (item) => {
    setMode("edit");
    setCurrentData(item);
    setOpenSheet(true);
  };

  const handleSave = () => {
    if (mode === "create") {
      const newItem = { ...currentData, id: Date.now() };
      setData((prev) => [...prev, newItem]);
    } else if (mode === "edit") {
      setData((prev) => prev.map((item) => (item.id === currentData.id ? currentData : item)));
    }
    setOpenSheet(false);
  };

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
    columnHelper.accessor("code", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
          Mã trúng thưởng
          <ArrowUpDown size={16} className="ml-2" />
        </div>
      ),
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("product", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
          Sản phẩm
          <ArrowUpDown size={16} className="ml-2" />
        </div>
      ),
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("price", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
          Giá
          <ArrowUpDown size={16} className="ml-2" />
        </div>
      ),
      cell: (info) => <div>{info.getValue()} đ</div>,
    }),
    columnHelper.accessor("address", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
          Địa chỉ
          <ArrowUpDown size={16} className="ml-2" />
        </div>
      ),
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("buyDate", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
          Ngày mua
          <ArrowUpDown size={16} className="ml-2" />
        </div>
      ),
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(item)}>Sửa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
    }),
  ];

  return (
    <>
      <DataTable title="Danh sách mã trúng thưởng" columns={columns} data={data} addLink={() => handleAdd()} />
      {/* <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" /> Thêm mới
        </Button>
      </div> */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{mode === "create" ? "Thêm mã trúng thưởng" : "Sửa mã trúng thưởng"}</SheetTitle>
            <SheetDescription>Vui lòng nhập đầy đủ thông tin bên dưới.</SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Mã trúng thưởng</Label>
              <Input value={currentData.code} onChange={(e) => setCurrentData({ ...currentData, code: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Sản phẩm</Label>
              <Input value={currentData.product} onChange={(e) => setCurrentData({ ...currentData, product: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Giá</Label>
              <Input type="number" value={currentData.price} onChange={(e) => setCurrentData({ ...currentData, price: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input value={currentData.address} onChange={(e) => setCurrentData({ ...currentData, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ngày mua</Label>
              <Input type="date" value={currentData.buyDate} onChange={(e) => setCurrentData({ ...currentData, buyDate: e.target.value })} />
            </div>
          </div>

          <SheetFooter className="mt-4">
            <Button onClick={handleSave}>{mode === "create" ? "Thêm mới" : "Lưu thay đổi"}</Button>
            <SheetClose asChild>
              <Button variant="outline">Hủy</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ViewLotteryCodeList;

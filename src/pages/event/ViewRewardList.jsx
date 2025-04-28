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

const ViewRewardList = () => {
  const [data, setData] = useState([
    { id: 1, name: "Quà Tặng A", image: "https://bighousevietnam.com/wp-content/uploads/2020/01/boc-tham-trung-thuong.jpg", description: "Mô tả quà tặng A", createdDate: "2025-04-10" },
    { id: 2, name: "Quà Tặng B", image: "https://bighousevietnam.com/wp-content/uploads/2020/01/boc-tham-trung-thuong.jpg", description: "Mô tả quà tặng B", createdDate: "2025-04-12" },
    { id: 3, name: "Quà Tặng C", image: "https://bighousevietnam.com/wp-content/uploads/2020/01/boc-tham-trung-thuong.jpg", description: "Mô tả quà tặng C", createdDate: "2025-04-15" },
  ]);

  const [openSheet, setOpenSheet] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentData, setCurrentData] = useState({
    id: null,
    name: "",
    image: "",
    description: "",
    createdDate: "",
  });

  const handleAdd = () => {
    setMode("create");
    setCurrentData({
      id: null,
      name: "",
      image: "",
      description: "",
      createdDate: "",
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
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
          Tên
          <ArrowUpDown size={16} className="ml-2" />
        </div>
      ),
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("image", {
      header: "Chi tiết ",
      cell: (info) => <img src={info.getValue()} alt="reward image" className="w-16 h-16 object-cover" />,
    }),
    columnHelper.accessor("description", {
      header: "Mô tả",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("createdDate", {
      header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
          Ngày tạo
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
      <DataTable title="Danh sách phần thưởng" columns={columns} data={data} addLink={() => handleAdd()} />
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{mode === "create" ? "Thêm phần thưởng" : "Sửa phần thưởng"}</SheetTitle>
            <SheetDescription>Vui lòng nhập đầy đủ thông tin bên dưới.</SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tên phần thưởng</Label>
              <Input value={currentData.name} onChange={(e) => setCurrentData({ ...currentData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Chi tiết </Label>
              <Input value={currentData.image} onChange={(e) => setCurrentData({ ...currentData, image: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Input value={currentData.description} onChange={(e) => setCurrentData({ ...currentData, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Ngày tạo</Label>
              <Input type="date" value={currentData.createdDate} onChange={(e) => setCurrentData({ ...currentData, createdDate: e.target.value })} />
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

export default ViewRewardList;

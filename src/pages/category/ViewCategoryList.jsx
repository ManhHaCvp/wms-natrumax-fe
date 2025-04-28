import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper();

const columns = (setData) => [
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
  columnHelper.accessor("categoryName", {
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
            <DropdownMenuSeparator/>
            {/* Nút "Xem chi tiết" */}
            <DropdownMenuItem asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <span
                    className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Xem</span>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Nhóm hàng</SheetTitle>
                    <SheetDescription>Thông tin chi tiết nhóm hàng.</SheetDescription>
                  </SheetHeader>
                  <ViewDetailRoleInline categoryId={data.categoryId} />
                  {/* <EditCategoryInline categoryId={data.categoryId} /> */}

                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            {/* Nút "Sửa" */}
            <DropdownMenuItem asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <span className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Sửa</span>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sửa nhóm hàng</SheetTitle>
                    <SheetDescription>Chỉnh sửa thông tin nhóm hàng.</SheetDescription>
                  </SheetHeader>
                  <EditCategoryInline categoryId={data.categoryId} setData={setData} />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link to={`/admin/category/update/${data.categoryId}`}>Sửa</Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewCategoryList = () => {
  const [openCreateSheet, setOpenCreateSheet] = useState(false);

  const [data, setData] = useState([]);

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
      columns={columns(setData)}
      data={data}
      // addLink="/admin/category/create"
      addButton={
        <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
          <SheetTrigger asChild>
            <Button className="ms-3"><Plus /> Thêm mới</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Thêm nhóm hàng</SheetTitle>
              <SheetDescription>Nhập thông tin nhóm hàng mới</SheetDescription>
            </SheetHeader>
            <CreateCategoryInline setData={setData} onClose={() => setOpenCreateSheet(false)} />
          </SheetContent>
        </Sheet>}
    />
  );
};
const ViewDetailRoleInline = ({ categoryId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [category, setCategory] = useState(null); // Lưu dữ liệu chi tiết

  useEffect(() => {
    const fetchCategory = async () => {
      console.log(categoryId);
      await categoryService.getById(categoryId, (data) => {
        setCategory(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          name: data.name || data.categoryName || "",
          description: data.description || "",
        });
      });
    };

    fetchCategory();
  }, [categoryId, reset]);

  return (
    <form className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên nhóm hàng</label>
        <Input {...register("name")} disabled />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} disabled />
      </div>
    </form>
  );
};
const EditCategoryInline = ({ categoryId, setData }) => {
  const { register, handleSubmit, reset } = useForm();
  const [category, setCategory] = useState(null); // Lưu dữ liệu chi tiết

  useEffect(() => {
    const fetchCategory = async () => {
      await categoryService.getById(categoryId, (data) => {
        setCategory(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          name: data.name || data.categoryName || "",
          description: data.description || "",
        });
      });
    };

    fetchCategory();
  }, [categoryId, reset]);
  const onSubmit = async (formData) => {
    try {
      await categoryService.update(categoryId, {
        name: formData.name,
        description: formData.description,
      });
      // toast.success("Cập nhật thành công!");
      // window.location.reload();
      const data = await categoryService.getAll(setData);

    } catch (error) {
      console.error("Lỗi cập nhật vai trò:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên nhóm hàng</label>
        <Input {...register("name")} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} />
      </div>
      <Button type="submit">Lưu thay đổi</Button>
    </form>
  );
};
const CreateCategoryInline = ({ setData, onClose }) => {
  // console.log(roleId);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onSubmit = async (formData) => {
    if (!formData.name?.trim()) {
      toast.error("Tên nhóm hàng là bắt buộc");
      return;
    }
    try {
      await categoryService.create({
        name: formData.name,
        description: formData.description,
      });
      // toast.success("Tạo vai trò thành công!");
      const data = await categoryService.getAll(setData);
      onClose?.(); // Gọi hàm đóng Sheet
      reset();
    } catch (error) {
      console.error("Lỗi cập nhật vai trò:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên vai trò</label>
        <Input {...register("name")} placeholder="Nhập tên vai trò" />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} placeholder="Nhập mô tả vai trò" />
      </div>
      <Button type="submit">Tạo mới</Button>
    </form>
  );
};

export default ViewCategoryList;
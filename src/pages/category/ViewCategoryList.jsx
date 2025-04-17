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

const columns = (setData) =>[
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
      console.log(data);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
            >
              Sao chép
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            {/*<DropdownMenuItem asChild>*/}
            {/*  <Link to={`/admin/category/${data.id}`}>Xem</Link>*/}
            {/*</DropdownMenuItem>*/}
            {/* Nút "Xem chi tiết" */}
            <DropdownMenuItem asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="w-full pl-2 text-sm text-left">Xem chi tiết</button>
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
                              <button className="w-full pl-2 text-sm text-left">Sửa</button>
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
  const [data, setData] = useState([
    // { categoryId: 1, categoryName: "Nhóm hàng A", description: "Mô tả nhóm hàng A" },
    // { categoryId: 2, categoryName: "Nhóm hàng B", description: "Mô tả nhóm hàng B" },
    // { categoryId: 3, categoryName: "Nhóm hàng C", description: "Mô tả nhóm hàng A" },
    // { categoryId: 4, categoryName: "Nhóm hàng D", description: "Mô tả nhóm hàng B" },
    // { categoryId: 5, categoryName: "Nhóm hàng E", description: "Mô tả nhóm hàng A" },
    // { categoryId: 6, categoryName: "Nhóm hàng F", description: "Mô tả nhóm hàng B" },
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
      columns={columns(setData)}
      data={data}
      // addLink="/admin/category/create"
      addButton={
        <Sheet>
          <SheetTrigger asChild>
          <Button className="ms-3"><Plus /> Thêm mới</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Thêm nhóm hàng</SheetTitle>
              <SheetDescription>Nhập thông tin nhóm hàng mới</SheetDescription>
            </SheetHeader>
            <CreateCategoryInline setData = {setData} />
          </SheetContent>
        </Sheet>}
    />
  );
}
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
        description: formData.description,      });
      // toast.success("Cập nhật thành công!");
      // window.location.reload();
      const data= await categoryService.getAll(setData);

    } catch (error) {
      console.error("Lỗi cập nhật vai trò:", error);
    }
  };

  return (
    <form  onSubmit={handleSubmit(onSubmit)}  className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên nhóm hàng</label>
        <Input {...register("name")}  />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")}  />
      </div>
      <Button type="submit">Lưu thay đổi</Button>
    </form>
  );
};
const CreateCategoryInline = ({setData,onClose }) => {
  // console.log(roleId);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onSubmit = async (formData) => {
    try {
      await categoryService.create({
        name: formData.name,
        description: formData.description,
      });
      // toast.success("Tạo vai trò thành công!");
      const data= await categoryService.getAll(setData);

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
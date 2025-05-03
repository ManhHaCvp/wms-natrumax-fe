import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Button } from "@/components/ui/button.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import roleService from "@/services/roleService.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper();

const columns = (setData)=> [
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
  columnHelper.accessor("roleName", {
    name: "Tên vai trò",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Tên vai trò
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("description", {
    name: "Mô tả",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
            >
              Sao chép
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Nút "Xem chi tiết" */}
            <DropdownMenuItem asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <span className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Xem</span>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Vai trò</SheetTitle>
                    <SheetDescription>Thông tin chi tiết vai trò.</SheetDescription>
                  </SheetHeader>
                  <ViewDetailRoleInline roleId={data.roleId} />
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
                    <SheetTitle>Sửa vai trò</SheetTitle>
                    <SheetDescription>Chỉnh sửa thông tin vai trò.</SheetDescription>
                  </SheetHeader>
                  <EditRoleInline roleId={data.roleId}  setData={setData} />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>

            {/* Nút "Xóa" (nếu cần) */}
            {/* 
  <DropdownMenuItem asChild>
    <Link to={`/admin/role/delete/${data.id}`} className="w-full pl-2 text-sm">
      Xóa
    </Link>
  </DropdownMenuItem> 
  */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewRoleList = () => {
  const [data, setData] = useState([
    // { roleId: 1, roleName: "Admin", description: "Quản trị hệ thống" },
    // { roleId: 2, roleName: "Accountant", description: "Kế toán" },
    // { roleId: 3, roleName: "Distributor", description: "Nhà phân phối" },
    // { roleId: 4, roleName: "Branch Owner", description: "Chủ chi nhánh" },
    // { roleId: 5, roleName: "Customer", description: "Khách mua hàng" },
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
      columns={columns(setData)}
      data={data}
      // addLink="/admin/role/create"
      // addButton={
      //   <Sheet>
      //     <SheetTrigger asChild>
      //       <Button>+ Thêm vai trò</Button>
      //     </SheetTrigger>
      //     <SheetContent>
      //       <SheetHeader>
      //         <SheetTitle>Thêm vai trò</SheetTitle>
      //         <SheetDescription>Nhập thông tin vai trò mới</SheetDescription>
      //       </SheetHeader>
      //       <CreateRoleInline />
      //     </SheetContent>
      //   </Sheet>}
    />
  );
};

export default ViewRoleList;
const EditRoleInline = ({ roleId, setData }) => {
  const { register, handleSubmit, reset } = useForm();
  const [role, setRole] = useState(null); // Lưu dữ liệu chi tiết

  useEffect(() => {
    const fetchRole = async () => {
      await roleService.getById(roleId, (data) => {
        setRole(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          name: data.name || data.roleName || "",
          description: data.description || "",
        });
      });
    };

    fetchRole();
  }, [roleId, reset]);

  const onSubmit = async (formData) => {
    try {
      await roleService.update(roleId, {
        description: formData.description,
      });
      toast.success("Cập nhật thành công!");
      const data= await roleService.getAll(setData);

      // window.location.reload();
    } catch (error) {
      console.error("Lỗi cập nhật vai trò:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên vai trò</label>
        <Input {...register("name")} disabled />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} placeholder="Nhập mô tả vai trò" />
      </div>
      <Button type="submit">Lưu thay đổi</Button>
    </form>
  );
};

const ViewDetailRoleInline = ({ roleId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [role, setRole] = useState(null); // Lưu dữ liệu chi tiết

  useEffect(() => {
    const fetchRole = async () => {
      await roleService.getById(roleId, (data) => {
        setRole(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          name: data.name || data.roleName || "",
          description: data.description || "",
        });
      });
    };

    fetchRole();
  }, [roleId, reset]);

  return (
    <form className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên vai trò</label>
        <Input {...register("name")} disabled />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} disabled />
      </div>
    </form>
  );
};

const CreateRoleInline = () => {
  // console.log(roleId);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onSubmit = async (formData) => {
    try {
      await roleService.create({
        roleName: formData.name,
        description: formData.description,
      });
      toast.success("Tạo vai trò thành công!");
      window.location.reload();
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

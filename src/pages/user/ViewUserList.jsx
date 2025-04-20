import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import userService from "@/services/userService.jsx";
import TableComponent from "@/components/common/DataTable.jsx";
import warehouseService from "@/services/warehouseService";
import roleService from "@/services/roleService";

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
  columnHelper.accessor("accountName", {
    name: "Tên tài khoản",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tên tài khoản
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
  columnHelper.accessor("address", {
    name: "Tỉnh thành",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tỉnh thành
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("role", {
    name: "Vai trò",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Vai trò
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(JSON.stringify(user))}
            >
              Sao chép
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/admin/user/${user.id}`}>Xem</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admin/user/update/${user.id}`}>Sửa</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewUserList = () => {
  const [data, setData] = useState([
    // {
    //   id: 1,
    //   accountName: "admin",
    //   phoneNumber: "0812497838",
    //   address: "Admin Street, City",
    //   status: true,
    //   role: "ROLE_ADMIN",
    // },
    // {
    //   id: 2,
    //   accountName: "accountant",
    //   phoneNumber: "0812497838",
    //   address: "User Street, City",
    //   status: true,
    //   role: "ROLE_ACCOUNTANT",
    // },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await userService.getAll(setData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  return (
    <TableComponent
      title="Danh sách người dùng"
      columns={columns}
      data={data}
      // addLink="/admin/user/create"
      addButton={
          <Sheet>
            <SheetTrigger asChild>
              <Button>+ Thêm mới</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Thêm vai trò</SheetTitle>
                <SheetDescription>Nhập thông tin vai trò mới</SheetDescription>
              </SheetHeader>
              <CreateUserInline />
            </SheetContent>
          </Sheet>}
    />
  );
}
const CreateUserInline = () => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      misaCode: "",
      warehouseId: "",
      roleId: "",
    },
  });

  const [roles, setRoles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data1 = await roleService.getAll(setRoles);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data2 = await warehouseService.getAll(setWarehouses);
        console.log(data2);

      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);



  const onSubmit = async (formData) => {
    try {
      await userService.create({
        misaCode: formData.misaCode,
        warehouseId: Number(formData.warehouseId),
        roleId: Number(formData.roleId),
      });
      toast.success("Tạo người dùng thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi tạo người dùng:", error);
      toast.error("Lỗi khi tạo người dùng!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Mã MISA</label>
        <Input {...register("misaCode")} placeholder="Nhập mã MISA" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Vai trò</label>
        <select {...register("roleId")} className="w-full p-2 border rounded">
  <option value="">-- Chọn vai trò --</option>
  {roles.map((role) => (
    <option key={role.roleId} value={String(role.roleId)}>
      {role.roleName}
    </option>
  ))}
</select>

      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Kho</label>
        <select {...register("warehouseId")} className="w-full p-2 border rounded">
  <option value="">-- Chọn kho --</option>
  {warehouses.map((wh) => (
    <option key={wh.warehouseId} value={String(wh.warehouseId)}>
      {wh.warehouseName}
    </option>
  ))}
</select>
      </div>

      <Button type="submit">Tạo mới</Button>
    </form>
  );
};
export default ViewUserList;
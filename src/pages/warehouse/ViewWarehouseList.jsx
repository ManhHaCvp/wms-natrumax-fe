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
import warehouseService from "@/services/warehouseService.jsx";
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
  columnHelper.accessor("warehouseName", {
    name: "Tên kho",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tên kho
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("province", {
    name: "Tỉnh",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Tỉnh
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()?.name}</div>,
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
            {/* Nút "Xem chi tiết" */}
            <DropdownMenuItem asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <span className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Xem</span>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Kho</SheetTitle>
                    <SheetDescription>Thông tin chi tiết kho.</SheetDescription>
                  </SheetHeader>
                  <ViewDetailWarehouseInline warehouseId={data.warehouseId} />
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
                    <SheetTitle>Sửa kho</SheetTitle>
                    <SheetDescription>Chỉnh sửa thông tin kho.</SheetDescription>
                  </SheetHeader>
                  <EditWarehouseInline warehouseId={data.warehouseId} setData={setData} />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewWarehouseList = () => {
  const [data, setData] = useState([
    // { id: 1, name: "Kho A", province: "Hà Nội", description: "Kho trung tâm Hà Nội" },
    // { id: 2, name: "Kho B", province: "Hà Nội", description: "Kho phụ trợ Hà Nội" },
    // { id: 3, name: "Kho C", province: "Hải Dương", description: "Kho trung chuyển Hải Dương" },
    // { id: 4, name: "Kho D", province: "Hải Dương", description: "Kho chính Hải Dương" },
    // { id: 5, name: "Kho E", province: "Hà Nội", description: "Kho dự trữ Hà Nội" },
    // { id: 6, name: "Kho F", province: "Hải Dương", description: "Kho tổng hợp Hải Dương" },
    // { id: 7, name: "Kho G", province: "Hà Nội", description: "Kho hàng hóa Hà Nội" },
    // { id: 8, name: "Kho H", province: "Hải Dương", description: "Kho phân phối Hải Dương" }
  ]);
  const [openCreateSheet, setOpenCreateSheet] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await warehouseService.getAll(setData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  return (
    <DataTable
      title="Danh sách kho"
      columns={columns(setData)}
      data={data}
      addButton={
        <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
          <SheetTrigger asChild>
            <Button className="ms-3"><Plus /> Thêm mới</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Thêm kho</SheetTitle>
              <SheetDescription>Nhập thông tin kho mới</SheetDescription>
            </SheetHeader>
            <CreateWarehouseInline setData={setData} onClose={() => setOpenCreateSheet(false)} />
          </SheetContent>
        </Sheet>}
    />
  );
};
const ViewDetailWarehouseInline = ({ warehouseId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [warehouse, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết

  useEffect(() => {
    const fetchRole = async () => {
      await warehouseService.getById(warehouseId, (data) => {
        setWarehouse(data);
        console.log(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          name: data.name || data.warehouseName || "",
          description: data.description || "",
          province: data.province.name || "",
          accessCode: data.accessCode,
        });
      });
    };

    fetchRole();
  }, [warehouseId, reset]);

  return (
    <form className="mt-6 space-y-4">
      <div>

        <div>
          <p className="text-muted-foreground">Tên kho</p>
          <p>{warehouse?.warehouseName || "Không có dữ liệu"}</p>
        </div>
      </div>
      <div>
        <p className="text-muted-foreground">Tỉnh</p>
        <p>{warehouse?.province.name || "Không có dữ liệu"}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Mô tả</p>
        <p>{warehouse?.description || "Không có dữ liệu"}</p>
      </div>
    </form>
  );
};
const EditWarehouseInline = ({ warehouseId, setData }) => {
  const { register, handleSubmit, reset } = useForm();
  const [warehouse, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết
  const [provinces, setProvinces] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  useEffect(() => {
    const fetchData = async () => {
      // Lấy danh sách tỉnh
      //  const fetchedProvinces = await warehouseService.getAllProvinces();
      //  setProvinces(fetchedProvinces);
      //  console.log("Fetched provinces:", fetchedProvinces);

      await warehouseService.getById(warehouseId, (data) => {
        setWarehouse(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          name: data.name || data.warehouseName || "",
          description: data.description || "",
          province: data.province?.provinceId || "", // Sử dụng provinceId để gán vào select
          // accessCode: data.accessCode
        });
      });

    };

    fetchData();
  }, [warehouseId, reset]);

  const onSubmit = async (formData) => {
    try {
      if (!formData.name?.trim()) {
        toast.error("Tên kho là bắt buộc");
        return;
      }
      await warehouseService.update(warehouseId, {
        name: formData.name,
        description: formData.description,
        provinceId: formData.province,
        userId: user.id,
        // accessCode: formData.accessCode
      });
      toast.success("Cập nhật thành công!");
      const data = await warehouseService.getAll(setData);

      //     item.id === warehouseId
      //       ? {
      //           ...item,
      //           name: formData.name,
      //           description: formData.description,
      //           province: provinces.find(p => p.provinceId === formData.province),
      //           accessCode: formData.accessCode
      //         }
      //       : item
      //   )
      // );
      // window.location.reload();
    } catch (error) {
      console.error("Lỗi cập nhật kho:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên kho</label>
        <Input {...register("name")} />
      </div>
      {/* <div>
        <label className="block mb-1 text-sm font-medium">Access Code</label>
        <Input {...register("accessCode")}  />
      </div> */}
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} />
      </div>
      <div>

      </div>
      <Button type="submit">Lưu thay đổi</Button>
    </form>
  );
};
const CreateWarehouseInline = ({ setData, onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const [warehouse, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết
  const [provinces, setProvinces] = useState([]);
  const [openCreateSheet, setOpenCreateSheet] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Lấy danh sách tỉnh
      const fetchedProvinces = await warehouseService.getAllProvinces();
      setProvinces(fetchedProvinces);
      console.log("Fetched provinces:", fetchedProvinces);
    };

    fetchData();
  }, []);

  const onSubmit = async (formData) => {
    if (!formData.name?.trim()) {
      toast.error("Tên kho là bắt buộc");
      return;
    }
    if (!formData.province?.trim()) {
      toast.error("Tên tỉnh là bắt buộc");
      return;
    }
    try {
      await warehouseService.create({
        name: formData.name,
        description: formData.description,
        provinceId: formData.province,
        accessCode: formData.accessCode,
      });
      toast.success("Thêm mới thành công!");
      const data = await warehouseService.getAll(setData);
      onClose?.(); // Gọi hàm đóng Sheet
      reset();
      // window.location.reload();
    } catch (error) {
      console.error("Lỗi thêm mới  kho:", error);
      // toast.error("Thêm mới thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên kho</label>
        <Input {...register("name")} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Access code</label>
        <Input {...register("accessCode")} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Tỉnh</label>
        <select
          {...register("province")}
          className="w-full border rounded p-2"
          defaultValue=""
        >
          <option value="" disabled>Chọn tỉnh</option>
          {provinces.map((province) => (
            <option key={province.provinceId} value={province.provinceId}>
              {province.provinceName}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit">Thêm kho</Button>
    </form>
  );
};
export default ViewWarehouseList;
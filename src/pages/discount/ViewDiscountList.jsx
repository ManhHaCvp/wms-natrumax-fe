import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Button } from "@/components/ui/button.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import discountService from "@/services/discountService.jsx";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import DisableDialog from "@/components/common/DisableDialog.jsx";
const columnHelper = createColumnHelper();

const columns = (setData) => [
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
  columnHelper.accessor("minimumAmount", {
    name: "Số tiền tối thiểu",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Số tiền tối thiểu
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
  columnHelper.accessor("discountPercent", {
    name: "Mức giảm giá",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Mức giảm giá
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("activeDate", {
    name: "Ngày bắt đầu",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Ngày bắt đầu
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("expiryDate", {
    name: "Ngày kết thúc",
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
        Ngày kết thúc
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("status", {
    name: "Trạng thái",
    header: ({ column }) => (
        <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
          Trạng thái
          <ArrowUpDown size={16} className="ml-2" />
        </div>
    ),
    cell: (info) => {
      const value = info.getValue();
      if (value === "-1") return <Badge variant="tertiary">Chưa bắt đầu</Badge>;
      if (value === "1") return <Badge>Đang có hiệu lực</Badge>;
      if (value === "0") return <Badge variant="destructive">Đã hết hạn</Badge>;
      return <Badge variant="outline">Không xác định</Badge>;
    },
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
                    <SheetTitle> Giảm giá</SheetTitle>
                    <SheetDescription>Thông tin chi tiết giảm giá.</SheetDescription>
                  </SheetHeader>
                  <ViewDetailDiscountInline discountId={data.discountId} />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
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
                  <EditDiscountInline discountId={data.discountId} setData={setData} />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <span className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                 onClick={async () => {
                  try {
                    await discountService.updateStatus(data.discountId);
                    toast.success("Đã cập nhật trạng thái thành công");
                    await discountService.getAll(setData)
                  } catch (error) {
                    toast.error("Cập nhật trạng thái thất bại");
                    console.error(error);
                  }
                }}
              >Đổi trạng thái</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ViewDiscountList = () => {
  const [data, setData] = useState([
    // { discountId: 1, minimumAmount: "1500000", discountPercent: "10%", description: "Giảm giá cho khách hàng VIP", activeDate: "01/03/2025", expiryDate: "31/03/2025", status: "-1" },
    // { discountId: 2, minimumAmount: "500000", discountPercent: "5%", description: "Ưu đãi tháng 3", activeDate: "10/03/2025", expiryDate: "20/03/2025", status: "0" },
    // { discountId: 3, minimumAmount: "2000000", discountPercent: "15%", description: "Giảm giá sinh nhật", activeDate: "05/03/2025", expiryDate: "10/03/2025", status: "1" },
    // { discountId: 4, minimumAmount: "3000000", discountPercent: "20%", description: "Flash Sale", activeDate: "15/03/2025", expiryDate: "16/03/2025", status: "1" },
    // { discountId: 5, minimumAmount: "750000", discountPercent: "8%", description: "Khuyến mãi ngày lễ", activeDate: "20/03/2025", expiryDate: "25/03/2025", status: "1" },
    // { discountId: 6, minimumAmount: "1200000", discountPercent: "12%", description: "Giảm giá khách hàng thân thiết", activeDate: "01/04/2025", expiryDate: "10/04/2025", status: "1" },
    // { discountId: 7, minimumAmount: "950000", discountPercent: "6%", description: "Ưu đãi cho đơn hàng đầu tiên", activeDate: "05/04/2025", expiryDate: "15/04/2025", status: "0" },
    // { discountId: 8, minimumAmount: "2500000", discountPercent: "18%", description: "Đại hội giảm giá", activeDate: "10/04/2025", expiryDate: "20/04/2025", status: "0" },
  ]);
  const [openCreateSheet, setOpenCreateSheet] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await discountService.getAll(setData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers().catch(console.error); // Handles the promise properly
  }, []);

  return (
    <DataTable
      title="Danh sách giảm giá"
      columns={columns(setData)}
      data={data}
      addButton={
        <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
          <SheetTrigger asChild>
            <Button className="ms-3">
              <Plus /> Thêm mới
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Thêm khuyến mãi</SheetTitle>
              <SheetDescription>Nhập thông tin khuyến mãi mới</SheetDescription>
            </SheetHeader>
            <CreateDiscountInline setData={setData} onClose={() => setOpenCreateSheet(false)} />
          </SheetContent>
        </Sheet>
      }
      // addLink="/admin/discount/create"
    />
  );
};
const ViewDetailDiscountInline = ({ discountId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [discount, setDiscount] = useState(null); // Lưu dữ liệu chi tiết

  useEffect(() => {
    const fetchDiscount = async () => {
      await discountService.getById(discountId, (data) => {
        setDiscount(data);
        console.log(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          description: data.description || "",
          discountPercent: data.discountPercent || 0,
          minimumAmount: data.minimumAmount || 0,
          activeDate: convertToDateInputFormat(data.activeDate),
          expiryDate: convertToDateInputFormat(data.expiryDate),
          status: data.status === "1" ? "Đang hoạt động" : "Ngưng hoạt động",
        });
      });
    };

    fetchDiscount();
  }, [discountId, reset]);

  return (
    <form className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} disabled />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Phần trăm giảm (%)</label>
        <Input type="number" {...register("discountPercent")} disabled />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Số tiền tối thiểu (VND)</label>
        <Input type="number" {...register("minimumAmount")} disabled />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
        <Input type="date" {...register("activeDate")} disabled />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
        <Input type="date" {...register("expiryDate")} disabled />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Trạng thái</label>
        <Input {...register("status")} disabled />
      </div>
      <DisableDialog item="sự kiện giảm giá"/>
    </form>
  );
};
const EditDiscountInline = ({ discountId, setData }) => {
  const { register, handleSubmit, reset } = useForm();
  const [discount, setDiscount] = useState(null); // Lưu dữ liệu chi tiết

  useEffect(() => {
    const fetchDiscount = async () => {
      await discountService.getById(discountId, (data) => {
        setDiscount(data);
        console.log(data);
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        reset({
          description: data.description || "",
          discountPercent: data.discountPercent || 0,
          minimumAmount: data.minimumAmount || 0,
          activeDate: convertToDateInputFormat(data.activeDate),
          expiryDate: convertToDateInputFormat(data.expiryDate),
          status: data.status === "1" ? "Đang hoạt động" : "Ngưng hoạt động",
        });
      });
    };

    fetchDiscount();
  }, [discountId, reset]);
  const onSubmit = async (formData) => {
    try {
      const formatToDateTime = (dateStr) => {
        // Nếu cần giờ mặc định khác, thay đổi phần T10:00:00 tại đây
        return `${dateStr}T10:00:00`;
      };
      await discountService.update(discountId, {
        description: formData.description,
        discountPercent: Number(formData.discountPercent),
        minimumAmount: Number(formData.minimumAmount),
        activeDate: formatToDateTime(formData.activeDate),
        expiryDate: formatToDateTime(formData.expiryDate),
      });
      toast.success("Cập nhật thành công!");
      const data = await discountService.getAll(setData);
    } catch (error) {
      console.error("Lỗi cập nhật vai trò:", error);
      toast.error("Cập nhật thất bại!");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Phần trăm giảm (%)</label>
        <Input type="number" {...register("discountPercent")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Số tiền tối thiểu (VND)</label>
        <Input type="number" {...register("minimumAmount")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
        <Input type="date" {...register("activeDate")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
        <Input type="date" {...register("expiryDate")} />
      </div>

      <Button type="submit">Lưu thay đổi</Button>
    </form>
  );
};

const CreateDiscountInline = ({ setData, onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const [openCreateSheet, setOpenCreateSheet] = useState(false);

  const onSubmit = async (formData) => {
    try {
      const formatToDateTime = (dateStr) => {
        return `${dateStr}T10:00:00`; // Hoặc T00:00:00 nếu không cần giờ cụ thể
      };
      if (!formData.discountPercent?.trim()) {
        toast.error("Phần trăm giảm là bắt buộc");
        return;
      }
      if (formData.discountPercent?.trim()>100) {
        toast.error("Phần trăm giảm phải nhỏ hơn 100%");
        return;
      }
      if (!formData.minimumAmount?.trim()) {
        toast.error("Số tiền tối thiểu là bắt buộc");
        return;
      }
      if (!formData.activeDate?.trim()) {
        toast.error("Ngày bắt đầu là bắt buộc");
        return;
      }
      if (!formData.expiryDate?.trim()) {
        toast.error("Ngày kết thúc là bắt buộc");
        return;
      }
      const activeDate = new Date(formData.activeDate);
      const expiryDate = new Date(formData.expiryDate);

      if (activeDate >= expiryDate) {
        toast.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
        return;
      }
      const payload = {
        description: formData.description,
        discountPercent: Number(formData.discountPercent),
        minimumAmount: Number(formData.minimumAmount),
        activeDate: formatToDateTime(formData.activeDate),
        expiryDate: formatToDateTime(formData.expiryDate),
      };

      await discountService.create(payload);
      toast.success("Tạo mới thành công!");
      const data = await discountService.getAll(setData);
      onClose?.(); // Gọi hàm đóng Sheet
      reset();
    } catch (error) {
      console.error("Lỗi tạo mới giảm giá:", error);
      // toast.error("Tạo mới thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Mô tả</label>
        <Input {...register("description")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Phần trăm giảm (%)</label>
        <Input type="number" {...register("discountPercent")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Số tiền tối thiểu (VND)</label>
        <Input type="number" {...register("minimumAmount")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
        <Input type="date" {...register("activeDate")} />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
        <Input type="date" {...register("expiryDate")} />
      </div>

      {/* <div>
        <label className="block mb-1 text-sm font-medium">Trạng thái</label>
        <select {...register("status")} className="w-full border rounded p-2">
          <option value="Đang hoạt động">Đang hoạt động</option>
          <option value="Ngưng hoạt động">Ngưng hoạt động</option>
        </select>
      </div> */}

      <Button type="submit">Tạo mới</Button>
    </form>
  );
};
const convertToDateInputFormat = (dateStr) => {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

export default ViewDiscountList;

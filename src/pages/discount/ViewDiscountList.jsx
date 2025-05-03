import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ArrowUpDown, MoreHorizontal, Plus} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Button} from "@/components/ui/button.jsx";
import {createColumnHelper} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import discountService from "@/services/discountService.jsx";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import toast from "react-hot-toast";
import {CreateDiscount, UpdateDiscount, ViewDiscountDetail} from "@/pages/discount/DiscountSheet.jsx";
import {formatCurrency} from "@/utils/formatCurrency.jsx";

const columnHelper = createColumnHelper();

const statusBadge = (value) => {
    switch (value) {
        case "-1":
            return <Badge variant="tertiary">Chưa bắt đầu</Badge>;
        case "1":
            return <Badge>Đang có hiệu lực</Badge>;
        case "0":
            return <Badge variant="destructive">Đã hết hạn</Badge>;
        default:
            return <Badge variant="outline">Không xác định</Badge>;
    }
};

const handleChangeStatus = async (id, setData) => {
    try {
        await discountService.updateStatus(id);
        toast.success("Đã cập nhật trạng thái thành công");
        await discountService.getAll(setData)
    } catch (error) {
        toast.error("Cập nhật trạng thái thất bại");
        console.error(error);
    }
}

const columns = (setData) => [
    columnHelper.display({
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    }),
    columnHelper.accessor("description", {
        name: "Mô tả",
        header: sortableHeader("Mô tả"),
        cell: (info) => <div>{info.getValue()}</div>
    }),
    columnHelper.accessor("minimumAmount", {
        name: "Số tiền tối thiểu",
        header: sortableHeader("Số tiền tối thiểu"),
        cell: (info) => <div className="font-medium">{formatCurrency(info.getValue())}</div>
    }),
    columnHelper.accessor("discountPercent", {
        name: "Mức giảm giá",
        header: sortableHeader("Mức giảm giá"),
        cell: (info) => <div>{info.getValue()}%</div>
    }),
    columnHelper.accessor("activeDate", {
        name: "Ngày bắt đầu",
        header: sortableHeader("Ngày bắt đầu"),
        cell: (info) => <div>{info.getValue()}</div>
    }),
    columnHelper.accessor("expiryDate", {
        name: "Ngày kết thúc",
        header: sortableHeader("Ngày kết thúc"),
        cell: (info) => <div>{info.getValue()}</div>
    }),
    columnHelper.accessor("status", {
        name: "Trạng thái",
        header: sortableHeader("Trạng thái"),
        cell: (info) => statusBadge(info.getValue())
    }),
    columnHelper.display({
        id: "actions",
        header: "Thao tác",
        enableHiding: false,
        cell: ({row}) => renderActions(row.original, setData)
    })
];

const sortableHeader = (label) => ({column}) => (
    <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         className="flex items-center cursor-pointer">
        {label} <ArrowUpDown size={16} className="ml-2"/>
    </div>
);

const renderActions = (data, setData) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal/>
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
                            className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            Xem
                        </span>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle> Giảm giá</SheetTitle>
                            <SheetDescription>Thông tin chi tiết giảm giá.</SheetDescription>
                        </SheetHeader>
                        <ViewDiscountDetail discountId={data.discountId}/>
                    </SheetContent>
                </Sheet>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Sheet>
                    <SheetTrigger asChild>
                        <span
                            className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            Sửa
                        </span>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Sửa kho</SheetTitle>
                            <SheetDescription>Chỉnh sửa thông tin kho.</SheetDescription>
                        </SheetHeader>
                        <UpdateDiscount discountId={data.discountId} setData={setData}/>
                    </SheetContent>
                </Sheet>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <span
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleChangeStatus(data.discountId, setData)}
              >Đổi trạng thái</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const ViewDiscountList = () => {
    const [data, setData] = useState([]);
    const [openCreateSheet, setOpenCreateSheet] = useState(false);

    useEffect(() => {
        discountService.getAll(setData).catch(console.error);
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
                            <Plus/> Thêm mới
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Thêm khuyến mãi</SheetTitle>
                            <SheetDescription>Nhập thông tin khuyến mãi mới</SheetDescription>
                        </SheetHeader>
                        <CreateDiscount setData={setData} onClose={() => setOpenCreateSheet(false)}/>
                    </SheetContent>
                </Sheet>
            }
        />
    );
};

export default ViewDiscountList;
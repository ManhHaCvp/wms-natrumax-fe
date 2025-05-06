import React, { useEffect, useState } from "react";
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
import rewardService from "@/services/rewardService.jsx";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge.jsx";
import { CreateReward, UpdateReward, ViewRewardDetail } from "@/pages/reward/RewardSheet.jsx";

const columnHelper = createColumnHelper();

const sortableHeader = (label) => ({ column }) => (
    <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         className="flex items-center cursor-pointer">
        {label} <ArrowUpDown size={16} className="ml-2" />
    </div>
);

const renderActions = (data, refreshData) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}>
                Sao chép
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Sheet>
                    <SheetTrigger asChild>
                        <span className="relative flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">Xem</span>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Phần thưởng</SheetTitle>
                            <SheetDescription>Thông tin chi tiết phần thưởng.</SheetDescription>
                        </SheetHeader>
                        <ViewRewardDetail rewardId={data.rewardId} />
                    </SheetContent>
                </Sheet>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Sheet>
                    <SheetTrigger asChild>
                        <span className="relative flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">Sửa</span>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Sửa phần thưởng</SheetTitle>
                            <SheetDescription>Chỉnh sửa thông tin phần thưởng.</SheetDescription>
                        </SheetHeader>
                        <UpdateReward rewardId={data.rewardId} onSuccess={refreshData} />
                    </SheetContent>
                </Sheet>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const columns = (refreshData) => [
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
    columnHelper.accessor("name", {
        name: "Tên phần thưởng",
        header: sortableHeader("Tên phần thưởng"),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("description", {
        name: "Mô tả",
        header: sortableHeader("Mô tả"),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("status", {
        name: "Trạng thái",
        header: "Trạng thái",
        cell: (info) => (
            info.getValue() ? (
                <Badge className="w-[5.1rem]">Hoạt động</Badge>
            ) : (
                <Badge variant="destructive">Bị khóa</Badge>
            )
        ),
    }),
    columnHelper.display({
        id: "actions",
        header: "Thao tác",
        enableHiding: false,
        cell: ({ row }) => renderActions(row.original, refreshData)
    }),
];

const ViewRewardList = () => {
    const [openCreateSheet, setOpenCreateSheet] = useState(false);
    const [data, setData] = useState([]);

    const refreshData = async () => {
        try {
            const rewards = await rewardService.getAll();
            setData(rewards);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <DataTable
            title="Danh sách phần thưởng"
            columns={columns(refreshData)}
            data={data}
            addButton={
                <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
                    <SheetTrigger asChild>
                        <Button className="ms-3"><Plus /> Thêm mới</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Thêm phần thưởng</SheetTitle>
                            <SheetDescription>Nhập thông tin phần thưởng mới</SheetDescription>
                        </SheetHeader>
                        <CreateReward onSuccess={() => {
                            refreshData();
                            setOpenCreateSheet(false);
                        }} />
                    </SheetContent>
                </Sheet>
            }
        />
    );
};

export default ViewRewardList;
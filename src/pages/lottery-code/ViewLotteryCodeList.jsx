import React, {useEffect, useState} from "react";
import {Plus, MoreHorizontal, ArrowUpDown, FerrisWheel} from "lucide-react";
import {createColumnHelper} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Button} from "@/components/ui/button.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ViewLotteryCodeDetail, CreateLotteryCode, UpdateLotteryCode} from "@/pages/lottery-code/LotteryCodeSheet.jsx";
import lotteryCodeService from "@/services/lotteryCodeService.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import WheelSpin from "@/pages/lottery-code/WheelSpin.jsx";
import {checkUserRole} from "@/utils/checkUserRole.jsx";

const columnHelper = createColumnHelper();

const sortableHeader = (label) => ({column}) => (
    <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         className="flex items-center cursor-pointer">
        {label} <ArrowUpDown size={16} className="ml-2"/>
    </div>
);

const renderActions = (data, refreshData) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}>
                Sao chép
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem asChild>
                <Sheet>
                    <SheetTrigger asChild>
                        <span
                            className="relative flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">Xem</span>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Mã quay thưởng</SheetTitle>
                            <SheetDescription>Chi tiết mã quay thưởng</SheetDescription>
                        </SheetHeader>
                        <ViewLotteryCodeDetail lotteryCodeId={data.lotteryCodeId}/>
                    </SheetContent>
                </Sheet>
            </DropdownMenuItem>
            {checkUserRole("ROLE_ACCOUNTANT") ? (
                <DropdownMenuItem asChild>
                    <Sheet>
                        <SheetTrigger asChild>
                        <span
                            className="relative flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">Sửa</span>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Sửa mã</SheetTitle>
                                <SheetDescription>Chỉnh sửa mã quay thưởng.</SheetDescription>
                            </SheetHeader>
                            <UpdateLotteryCode lotteryCodeId={data.lotteryCodeId} onSuccess={refreshData}/>
                        </SheetContent>
                    </Sheet>
                </DropdownMenuItem>
            ) : null}
        </DropdownMenuContent>
    </DropdownMenu>
);

const columns = (refreshData) => [
    columnHelper.display({
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
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
        enableHiding: false,
    }),
    columnHelper.accessor("code", {
        name: "Mã quay thưởng",
        header: sortableHeader("Mã quay thưởng"),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("user.accountName", {
        name: "Khách hàng",
        header: sortableHeader("Khách hàng"),
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
        cell: ({row}) => renderActions(row.original, refreshData),
    }),
];

const ViewLotteryCodeList = () => {
    const [data, setData] = useState([]);
    const [openCreateSheet, setOpenCreateSheet] = useState(false);

    const refreshData = async () => {
        try {
            const res = await lotteryCodeService.getAll();
            setData(res);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <DataTable
            title="Danh sách mã quay thưởng"
            columns={columns(refreshData)}
            data={data}
            addButton={
                <div className="space-x-3">
                    {checkUserRole("ROLE_ACCOUNTANT") ? (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button><Plus/> Thêm mới</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Thêm mã quay thưởng</SheetTitle>
                                    <SheetDescription>Nhập thông tin mã mới</SheetDescription>
                                </SheetHeader>
                                <CreateLotteryCode onSuccess={() => {
                                    refreshData();
                                    setOpenCreateSheet(false);
                                }}/>
                            </SheetContent>
                        </Sheet>
                    ) : null}
                    {checkUserRole("ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR") ? (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button><FerrisWheel/> Quay thưởng</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Spin the Wheel</SheetTitle>
                                </SheetHeader>
                                <WheelSpin/>
                            </SheetContent>
                        </Sheet>
                    ) : null}
                </div>
            }
        />
    )
        ;
};

export default ViewLotteryCodeList;
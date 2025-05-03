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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import warehouseService from "@/services/warehouseService.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ViewWarehouseDetail, CreateWarehouse, UpdateWarehouse} from "@/pages/warehouse/WarehouseSheet.jsx"

const columnHelper = createColumnHelper();

const columns = (setData) => [
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
    columnHelper.accessor("warehouseName", {
        name: "Tên kho",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Tên kho
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("province", {
        name: "Tỉnh",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Tỉnh
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()?.name}</div>,
    }),
    columnHelper.accessor("description", {
        name: "Mô tả",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Mô tả
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.display({
        id: "actions",
        header: "Thao tác",
        enableHiding: false,
        cell: ({row}) => {
            const data = row.original;
            return (
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
                                        className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Xem</span>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Kho</SheetTitle>
                                        <SheetDescription>Thông tin chi tiết kho.</SheetDescription>
                                    </SheetHeader>
                                    <ViewWarehouseDetail warehouseId={data.warehouseId}/>
                                </SheetContent>
                            </Sheet>
                        </DropdownMenuItem>
                        {/* Nút "Sửa" */}
                        <DropdownMenuItem asChild>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <span
                                        className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">Sửa</span>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Sửa kho</SheetTitle>
                                        <SheetDescription>Chỉnh sửa thông tin kho.</SheetDescription>
                                    </SheetHeader>
                                    <UpdateWarehouse warehouseId={data.warehouseId} setData={setData}/>
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
    const [data, setData] = useState([]);
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
                        <Button className="ms-3"><Plus/> Thêm mới</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Thêm kho</SheetTitle>
                            <SheetDescription>Nhập thông tin kho mới</SheetDescription>
                        </SheetHeader>
                        <CreateWarehouse setData={setData} onClose={() => setOpenCreateSheet(false)}/>
                    </SheetContent>
                </Sheet>}
        />
    );
};

export default ViewWarehouseList;
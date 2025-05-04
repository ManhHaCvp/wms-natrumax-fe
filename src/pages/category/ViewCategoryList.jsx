import React, {useEffect, useState} from "react";
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
import categoryService from "@/services/categoryService.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {ViewCategoryDetail, CreateCategory, UpdateCategory} from "@/pages/category/CategorySheet.jsx";

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
    columnHelper.accessor("categoryName", {
        name: "Tên nhóm hàng",
        header: sortableHeader("Tên nhóm hàng"),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("description", {
        name: "Mô tả",
        header: sortableHeader("Mô tả"),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.display({
        id: "actions",
        header: "Thao tác",
        enableHiding: false,
        cell: ({row}) => renderActions(row.original, setData)
    }),
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
            {/* Nút "Xem" */}
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
                        <ViewCategoryDetail categoryId={data.categoryId}/>
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
                            <SheetTitle>Sửa nhóm hàng</SheetTitle>
                            <SheetDescription>Chỉnh sửa thông tin nhóm hàng.</SheetDescription>
                        </SheetHeader>
                        <UpdateCategory categoryId={data.categoryId} setData={setData}/>
                    </SheetContent>
                </Sheet>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const ViewCategoryList = () => {
    const [openCreateSheet, setOpenCreateSheet] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const categories = await categoryService.getAll(setData);
                setData(categories)
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
            addButton={
                <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
                    <SheetTrigger asChild>
                        <Button className="ms-3"><Plus/> Thêm mới</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Thêm nhóm hàng</SheetTitle>
                            <SheetDescription>Nhập thông tin nhóm hàng mới</SheetDescription>
                        </SheetHeader>
                        <CreateCategory setData={setData} onClose={() => setOpenCreateSheet(false)}/>
                    </SheetContent>
                </Sheet>
            }
        />
    );
};

export default ViewCategoryList;
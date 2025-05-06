import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ArrowUpDown, MoreHorizontal, Plus} from "lucide-react";
import {createColumnHelper} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import DataTable from "@/components/common/DataTable.jsx";
import userService from "@/services/userService.jsx";
import CreateNewUser from "@/components/user/CreateNewUser.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import toast from "react-hot-toast";
import userApi from "@/api/userApi.jsx";

const columnHelper = createColumnHelper();

const columns = [
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
    columnHelper.accessor("accountName", {
        name: "Tên tài khoản",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Tên tài khoản
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("phoneNumber", {
        name: "Số điện thoại",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Số điện thoại
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("address", {
        name: "Tỉnh thành",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Tỉnh thành
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("role", {
        name: "Vai trò",
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Vai trò
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
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
        cell: ({row}) => {
            const user = row.original;
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
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(user))}
                        >
                            Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
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

const rolesOptions = ["ROLE_ADMIN", "ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER", "ROLE_CUSTOMER"];

const ViewUserList = () => {
    const [rolesFilter, setRolesFilter] = useState("ROLE_BRANCH_OWNER");
    const [userList, setUserList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userService.getByRole(rolesFilter);
                setUserList(response);
                console.log(response)
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }

        fetchUsers();
    }, [rolesFilter]);

    return (
        <DataTable
            title="Danh sách người dùng"
            columns={columns}
            data={userList}
            addButton={
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Trạng thái:</span>
                        <Select value={rolesFilter} onValueChange={setRolesFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Chọn trạng thái"/>
                            </SelectTrigger>
                            <SelectContent>
                                {rolesOptions.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus/> Thêm mới
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Thêm người dùng</SheetTitle>
                                <SheetDescription>Nhập thông tin người dùng mới</SheetDescription>
                            </SheetHeader>
                            <CreateNewUser setUserList={setUserList} setIsOpen={setIsOpen}/>
                        </SheetContent>
                    </Sheet>
                </div>
            }
        />
    );
};

export default ViewUserList;
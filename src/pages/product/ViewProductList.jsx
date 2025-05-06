import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {ArrowUpDown, ChevronDown, MoreHorizontal, CloudDownload, Plus, ShoppingCart, Warehouse} from "lucide-react";
import {Input} from "@/components/ui/input.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Card} from "@/components/ui/card.jsx";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import productService from "@/services/productService.jsx";
import toast from "react-hot-toast";
import warehouseService from "@/services/warehouseService.jsx";
import {formatCurrency} from "@/utils/formatCurrency.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import userService from "@/services/userService";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import CreateProduct from "@/pages/product/CreateProduct.jsx";
import {checkUserRole} from "@/utils/checkUserRole.jsx";
import LoadingOverlay from "@/components/common/LoadingOverlay.jsx";

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.display({
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => <Checkbox checked={row.getIsSelected()}
                                   onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row"/>,
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("barcode", {
        name: "Mã vạch",
        header: ({column}) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                Mã vạch
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("name", {
        name: "Tên hàng",
        header: ({column}) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                Tên hàng
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("price", {
        name: "Giá bán",
        header: ({column}) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                Giá bán
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div className="font-medium">{formatCurrency(info.getValue())}</div>,
    }),
    columnHelper.accessor("quantity", {
        name: "Số lượng",
        header: ({column}) => (
            <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
                Số lượng
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("status", {
        name: "Trạng thái",
        header: "Trạng thái",
        cell: (info) => (info.getValue() ? <Badge>Hoạt động</Badge> : <Badge variant="destructive">Bị khóa</Badge>),
    }),
    columnHelper.display({
        id: "actions",
        header: "Thao tác",
        enableHiding: false,
        cell: ({row}) => {
            const product = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(product))}>Sao
                            chép</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link to={`/product/${product.productId}`}>Xem</Link>
                        </DropdownMenuItem>
                        {checkUserRole("ROLE_ACCOUNTANT") ? (
                            <DropdownMenuItem asChild>
                                <Link to={`/product/update/${product.productId}`}>Sửa</Link>
                            </DropdownMenuItem>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];

const ViewProductList = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isAccountant = user?.roles?.includes("ROLE_ACCOUNTANT");

    const [warehouses, setWarehouses] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [openCreateSheet, setOpenCreateSheet] = useState(false);

    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
    const [warehouse, setWarehouse] = useState({
        warehouseId: "",
        warehouseName: "",
        province: "",
        description: "",
    });
    const [data, setData] = useState([
        {
            productId: 1,
            barcode: "#187654",
            name: "Sữa tươi Vinamilk",
            price: 25000,
            quantity: 100,
            quantityToGetPromotion: 0,
            status: "Còn hàng",
        },
    ]);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCreateOrder = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedProducts = selectedRows.map((row) => row.original);
        if (selectedProducts.length > 0) {
            navigate("/order/create", {state: {selectedProducts}});
        } else {
            toast.error("Người dùng chưa chọn sản phẩm.")
        }
    };

    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            if (isAdmin || isAccountant) {
                const result = await warehouseService.getAll(setWarehouse);
                setWarehouses(result);
                if (!selectedWarehouseId && result.length > 0) {
                    setSelectedWarehouseId(result[0].warehouseId); // Chỉ set khi chưa có
                }
            } else {
                const result = await userService.getById(user.id);
                setUserDetail(result);

                const memberWarehouse = result.userWarehouses.find((uw) => uw.roleInWarehouse === "Member");
                const warehouseId = memberWarehouse?.warehouse?.warehouseId;
                setWarehouse(memberWarehouse?.warehouse);
                setSelectedWarehouseId(warehouseId); // Thêm dòng này để đồng bộ
            }
        } catch (error) {
            console.log("Lỗi khi tải dữ liệu kho", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWarehouses();
        }
    }, [user]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            if (selectedWarehouseId) {
                const products = await productService.getByWarehouseId(selectedWarehouseId);
                setData(products);
            }
        } catch (error) {
            toast.error("Lỗi khi tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedWarehouseId) {
            fetchProducts();
        }
    }, [selectedWarehouseId]);

    const handleFetchQuantity = async () => {
        setLoading(true);
        try {
            await productService.fetchQuantity(warehouse.warehouseId ? warehouse.warehouseId : selectedWarehouseId);
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            await fetchWarehouses();
            setLoading(false);
        }
    }

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <>
            {loading && <LoadingOverlay/>}
            <Card className="space-y-3 m-5 p-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-[#182F73] text-3xl font-bold">Danh sách hàng hóa</h1>
                        {checkUserRole("ROLE_ADMIN", "ROLE_ACCOUNTANT") ? (
                            <Select value={selectedWarehouseId}
                                    onValueChange={(value) => setSelectedWarehouseId(value)}>
                                <SelectTrigger className="w-[240px] flex items-center gap-2">
                                    <Warehouse className="h-4 w-4 text-muted-foreground"/>
                                    <SelectValue placeholder="Chọn kho"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((w) => (
                                        <SelectItem key={w.warehouseId} value={w.warehouseId}>
                                            {w.warehouseName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Button variant="outline">
                                <Warehouse className="mr-2 h-4 w-4"/>
                                {warehouse.warehouseName}
                            </Button>
                        )}
                    </div>
                    <div className="space-x-3">
                        {checkUserRole("ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR") ? (
                            <Button variant="outline" onClick={handleFetchQuantity}>
                                <CloudDownload/>
                                Đồng bộ
                            </Button>
                        ) : null}
                        {checkUserRole("ROLE_ACCOUNTANT") ? (
                            <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
                                <SheetTrigger asChild>
                                    <Button className="ms-3"><Plus/> Thêm mới</Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Thêm nhóm hàng</SheetTitle>
                                        <SheetDescription>Nhập thông tin nhóm hàng mới</SheetDescription>
                                    </SheetHeader>
                                    <CreateProduct onSuccess={() => {
                                        fetchProducts();
                                        setOpenCreateSheet(false);
                                    }}/>
                                </SheetContent>
                            </Sheet>
                        ) : null}
                        {checkUserRole("ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER") ? (
                            <Button variant="default" onClick={handleCreateOrder}>
                                <ShoppingCart/> Tạo đơn hàng
                            </Button>
                        ) : null}
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Input
                        placeholder="Tìm kiếm nhanh..."
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                            table.setGlobalFilter(e.target.value);
                        }}
                        className="w-full"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Cột <ChevronDown/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem key={column.id} className="capitalize"
                                                              checked={column.getIsVisible()}
                                                              onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                        {column.columnDef.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {" "}
                        Đã chọn&nbsp;
                        {table.getFilteredSelectedRowModel().rows.length} trên {table.getFilteredRowModel().rows.length} hàng.
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}>
                            Trước
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}>
                            Sau
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default ViewProductList;

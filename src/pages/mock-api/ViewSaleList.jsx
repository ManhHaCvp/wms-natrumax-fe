import React, {useEffect, useState} from "react";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
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
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import mockApiService from "@/services/mockApiService.jsx";
import formatDate from "@/utils/formatDate.jsx"; // Use service, no more direct axios!

const columnHelper = createColumnHelper();

// --- handle create inventory out ---
const handleCreateInventoryOut = async (voucherNo) => {
    try {
        const clientSecret = "secretNppHD"; // Replace with real client secret
        await mockApiService.createInventoryOutBySale(voucherNo, clientSecret);
    } catch (error) {
        console.error("Failed to create inventory out:", error);
    }
};

const columns = () => [
    columnHelper.accessor("Voucher_no", {
        header: ({column}) => (
            <div
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center"
            >
                Số chứng từ
                <ArrowUpDown size={16} className="ml-2"/>
            </div>
        ),
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("Voucher_date", {
        header: "Ngày chứng từ",
        cell: (info) => formatDate.formatJsonToDateTimeMinus7Hour(info.getValue()),
    }),
    columnHelper.accessor("Posted_date", {
        header: "Ngày hạch toán",
        cell: (info) => formatDate.formatJsonToDateTimeMinus7Hour(info.getValue()),
    }),
    columnHelper.accessor("Customer", {
        header: "Khách hàng",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("warehouse_id", {
        header: "Kho hàng",
        cell: (info) => info.getValue(),
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
                        <DropdownMenuItem asChild>
                            <Sheet>
                                <SheetTrigger asChild>
                  <span
                      className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    Xem chi tiết
                  </span>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Chi tiết phiếu bán hàng</SheetTitle>
                                        <SheetDescription>Thông tin đơn bán hàng</SheetDescription>
                                    </SheetHeader>
                                    <ViewSaleDetailInline voucherNo={data.Voucher_no}/>
                                </SheetContent>
                            </Sheet>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleCreateInventoryOut(data.Voucher_no)}
                        >
                            Tạo phiếu xuất kho
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];

const ViewSaleList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await mockApiService.getSales(setData);
        };
        fetchData();
    }, []);

    return (
        <DataTable
            title="Danh sách phiếu bán hàng"
            columns={columns()}
            data={data}
        />
    );
};

const ViewSaleDetailInline = ({voucherNo}) => {
    const [saleDetail, setSaleDetail] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            await mockApiService.getSaleByVoucherNo(voucherNo, setSaleDetail);
        };
        fetchDetail();
    }, [voucherNo]);

    if (!saleDetail) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Số chứng từ</label>
                <div className="border p-2 rounded-md">{saleDetail.Voucher_no}</div>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Ngày chứng từ</label>
                <div className="border p-2 rounded-md">{formatDate.formatJsonToDateTimeMinus7Hour(saleDetail.Voucher_date)}</div>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Ngày hạch toán</label>
                <div className="border p-2 rounded-md">{formatDate.formatJsonToDateTimeMinus7Hour(saleDetail.Posted_date)}</div>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Khách hàng</label>
                <div className="border p-2 rounded-md">{saleDetail.Customer}</div>
            </div>
        </div>
    );
};

export default ViewSaleList;
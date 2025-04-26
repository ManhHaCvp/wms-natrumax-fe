import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columnHelper = createColumnHelper();

const ViewSaleList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState("");
  const [formData, setFormData] = useState({
    customerId: "",
    postedDate: "",
    voucherDate: "",
    inventoryItems: [{ code: "", quantity: "", status: "Xuất đủ" }],
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  const fetchSales = async () => {
    try {
      const currentItem = (page - 1) * pageSize;
      const response = await fetch(`https://mock-api-bice.vercel.app/misa-sales?currentItem=${currentItem}&pageSize=${pageSize}`);
      const result = await response.json();
      setData(result.data);
      setTotalItems(result.total);
      setPageSize(result.pageSize);
    } catch (error) {
      console.error("Lỗi khi load danh sách sale:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page]);

  const columns = () => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    columnHelper.accessor("sale_items", {
      header: "Sale Items",
      cell: (info) => <div>{info.getValue().join(", ")}</div>,
    }),
    columnHelper.accessor("Voucher_no", {
      header: "Voucher_no",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => <div>{new Date(info.getValue()).toLocaleString()}</div>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCurrentSaleId(data._id);
                  setOpenDialog(true);
                }}
              >
                Tạo phiếu xuất kho
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const handleCreateInventoryOut = async () => {
    const body = {
        Customer_id: formData.customerId,
        Posted_date: new Date().toISOString(),
        Voucher_date: new Date().toISOString(),
        sale_id: currentSaleId,
        inventory_out_items: formData.inventoryItems
          .filter(item => item.code && item.quantity)
          .map(item => ({
            Code: item.code,
            Quantity: item.quantity,
            Status: item.status,
          })),
      };
    try {
      const response = await fetch("https://mock-api-bice.vercel.app/misa-inventory-outs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "clientSecret": "secretNppHD", // 👉 Thêm clientSecret vào header
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        alert("Tạo phiếu thành công!");
        setOpenDialog(false);
        setFormData({
          customerId: "",
          postedDate: "",
          voucherDate: "",
          inventoryItems: [{ code: "", quantity: "", status: "Xuất đủ" }],
        });
      } else {
        alert("Tạo phiếu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi tạo phiếu:", error);
      alert("Có lỗi xảy ra.");
    }
  };
  

  return (
    <div className="space-y-4">
      <DataTable title="Danh sách Sale" columns={columns()} data={data} />

      <div className="flex justify-center items-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo phiếu xuất kho</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Customer ID</Label>
              <Input
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                placeholder=""
              />
            </div>

            {formData.inventoryItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Mã Code"
                  value={item.code}
                  onChange={(e) => {
                    const newItems = [...formData.inventoryItems];
                    newItems[index].code = e.target.value;
                    setFormData({ ...formData, inventoryItems: newItems });
                  }}
                />
                <Input
                  placeholder="Số lượng"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...formData.inventoryItems];
                    newItems[index].quantity = e.target.value;
                    setFormData({ ...formData, inventoryItems: newItems });
                  }}
                />
                <Input
                  placeholder="Trạng thái"
                  value={item.status}
                  onChange={(e) => {
                    const newItems = [...formData.inventoryItems];
                    newItems[index].status = e.target.value;
                    setFormData({ ...formData, inventoryItems: newItems });
                  }}
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() =>
                setFormData({
                  ...formData,
                  inventoryItems: [...formData.inventoryItems, { code: "", quantity: "", status: "Xuất đủ" }],
                })
              }
            >
              + Thêm sản phẩm
            </Button>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleCreateInventoryOut}>
              Tạo phiếu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewSaleList;

import React, { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import TableComponent from "@/components/common/DataTable.jsx";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const columnHelper = createColumnHelper();

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString("vi-VN");
};

const columns = [
  columnHelper.accessor("transactionsId", {
    header: "Mã giao dịch",
    cell: (info) => <div>#{info.getValue()}</div>,
  }),
  columnHelper.accessor("paymentDate", {
    header: "Ngày thanh toán",
    cell: (info) => <div>{formatDate(info.getValue())}</div>,
  }),
  columnHelper.accessor("totalAmount", {
    header: "Số tiền",
    cell: (info) => <div>{formatCurrency(info.getValue())}</div>,
  }),
  columnHelper.accessor("transaction_type", {
    header: "Loại giao dịch",
    cell: (info) => (
      <Badge variant="outline">
        {info.getValue() === "DEPOSIT" ? "Nạp tiền" : info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("discount", {
    header: "Khuyến mãi",
    cell: (info) => {
      const discount = info.getValue();
      if (!discount) return <span>-</span>;
      return (
        <div>
          <div>{discount.discountPercent}%</div>
        </div>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Trạng thái",
    cell: (info) => (
      info.getValue() === "SUCCESS" ? (
        <Badge variant="success">Thành công</Badge>
      ) : (
        <Badge variant="destructive">{info.getValue()}</Badge>
      )
    ),
  }),
];

const statusOptions = ["PENDING", "SUCCESS", "CONFIRMED", "CANCELED", "REFUNDED"];

const CheckBill = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("SUCCESS");

  const fetchTransactions = async (status) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/transactions/status/${status}`);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách giao dịch - {statusFilter}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Lọc theo trạng thái:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <TableComponent
        title=""
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default CheckBill;

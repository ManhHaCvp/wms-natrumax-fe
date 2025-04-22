import React, { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import TableComponent from "@/components/common/DataTable.jsx";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";
import UploadProofDialog from "@/components/user/UploadProofDialog";
import transactionService from "@/services/transactionService";

// Khởi tạo column helper cho react-table
const columnHelper = createColumnHelper();

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

// Hàm định dạng ngày tháng
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString("vi-VN");
};

// Cột cho bảng
const columns = (setPreviewUrl, handleChangeTransactionStatus,setSelectedTransactionId,setUploadDialogOpen) => [
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
  columnHelper.accessor("discount", {
    header: "Khuyến mãi",
    cell: (info) => {
      const discount = info.getValue();
      if (!discount) return <span>Không có</span>;
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
  columnHelper.accessor("transferImage", {
    header: "Ảnh minh chứng",
    cell: (info) => {
      const url = info.getValue();
      return url ? (
        <img
          src={url}
          alt="Proof"
          className="w-16 h-16 object-cover rounded border"
          onClick={() => setPreviewUrl(url)}
        />
      ) : (
        <span className="text-sm text-muted-foreground">Chưa có</span>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Hành động",
    cell: (info) => {
      const row = info.row.original;
      if (row.status === "SUCCESS") {
        return (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleChangeTransactionStatus(row.transactionsId, "CONFIRMED")}
            >
              Xác nhận
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleChangeTransactionStatus(row.transactionsId, "CANCELED")}
            >
              Huỷ
            </Button>
          </div>
        );
      }
      else if (row.status === "CANCELED") {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTransactionId(row.transactionsId);
                setUploadDialogOpen(true);
              }}
            >
              Thêm ảnh
            </Button>
            
          </div>
        );
      }
      return <span className="text-sm text-muted-foreground">---</span>;
    },
  }),
];

// Các trạng thái để lọc giao dịch
const statusOptions = ["PENDING", "SUCCESS", "CONFIRMED", "CANCELED", "REFUNDED"];

const CheckBill = () => {
  const [data, setData] = useState([]); // Dữ liệu giao dịch
  const [statusFilter, setStatusFilter] = useState("SUCCESS"); // Trạng thái lọc
  const [previewUrl, setPreviewUrl] = useState(null); // URL ảnh minh chứng
  const [selectedFile, setSelectedFile] = useState(null); // File ảnh đã chọn cho "CANCELED" status
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await transactionService.uploadRefundImage(
        selectedTransactionId,
        formData
      );
      await fetchData();
      toast.success("Tải ảnh lên thành công!");
      setUploadDialogOpen(false);
      setSelectedTransactionId(null);
    } catch (err) {
      console.error(err);
      alert("Upload thất bại.");
    }
  };
  // Hàm lấy dữ liệu giao dịch
  const fetchTransactions = async (status) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/transactions/status/${status}`);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  // Hàm thay đổi trạng thái giao dịch
  const handleChangeTransactionStatus = async (transactionId, newStatus) => {
    try {
      // Cập nhật trạng thái giao dịch
      await axios.put(
        `http://localhost:8080/api/v1/transactions/${transactionId}/change-status`,
        {},
        {
          params: {
            status: newStatus,
          },
        }
      );

      // Reload lại danh sách giao dịch sau khi thay đổi trạng thái
      fetchTransactions(statusFilter);
    } catch (error) {
      console.error("Đổi trạng thái giao dịch thất bại:", error);
    }
  };

  // Fetch dữ liệu khi trạng thái lọc thay đổi
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
        columns={columns(setPreviewUrl, handleChangeTransactionStatus,setSelectedTransactionId,setUploadDialogOpen)} // Truyền hàm vào cột
        data={data}
      />
      <UploadProofDialog
              open={uploadDialogOpen}
              onOpenChange={setUploadDialogOpen}
              onUpload={handleUpload}
            />
      <ImagePreviewModal
        open={!!previewUrl}
        imageUrl={previewUrl}
        onOpenChange={() => setPreviewUrl(null)}
      />
    </div>
  );
};

export default CheckBill;

import React, { useEffect, useState } from "react";
import { ArrowUpDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { createColumnHelper } from "@tanstack/react-table";
import TableComponent from "@/components/common/DataTable.jsx";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import ImagePreviewModal from "@/components/common/ImagePreviewModal.jsx";
import UploadProofDialog from "@/components/user/UploadProofDialog.jsx";
import transactionService from "@/services/transactionService.jsx";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { formatCurrency } from "@/utils/formatCurrency.jsx";
import formatDate from "@/utils/formatDate.jsx";

// Khởi tạo column helper
const columnHelper = createColumnHelper();

// Tạo column cho bảng
const columns = (data) => [
  columnHelper.accessor("transactionsId", {
    header: "Mã giao dịch",
    cell: (info) => <div>#{info.getValue()}</div>,
  }),
  columnHelper.accessor("paymentDate", {
    header: "Ngày thanh toán",
    cell: (info) => <div>{formatDate.formatJsonToDate(info.getValue())}</div>,
  }),
  columnHelper.accessor("totalAmount", {
    header: "Số tiền",
    cell: (info) => <div>{formatCurrency(info.getValue())}</div>,
  }),
  columnHelper.accessor("discount", {
    header: "Khuyến mãi",
    cell: (info) => {
      const discount = info.getValue();
      return discount ? <div>{discount.discountPercent}%</div> : <span>Không có</span>;
    },
  }),
  columnHelper.accessor("status", {
    header: "Trạng thái",
    cell: (info) =>
      info.getValue() === "SUCCESS" ? (
        <Badge variant="success">Thành công</Badge>
      ) : (
        <Badge variant="destructive">{info.getValue()}</Badge>
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
          className="w-16 h-16 object-cover rounded border cursor-pointer"
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
      const amount = row.totalAmount;
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
      } else if (row.status === "CANCELED") {
        return (
          <div className="flex gap-2 items-center">
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
            <Eye
              className="w-5 h-5 cursor-pointer text-blue-500 hover:opacity-75"
              onClick={() => handleSendClick(amount,row.bank)}
              title="Hiển thị mã QR"
            />
          </div>
        );
      }
      return <span className="text-sm text-muted-foreground">---</span>;
    },
  }),
];

// Các trạng thái có thể lọc
const statusOptions = ["PENDING", "SUCCESS", "CONFIRMED", "CANCELED", "REFUNDED"];

const ViewTransactionList = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("SUCCESS");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTransactions = async (status) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/transactions/status/${status}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy giao dịch:", error);
    }
  };

  const handleChangeTransactionStatus = async (transactionId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/transactions/${transactionId}/change-status`,
        {},
        { params: { status: newStatus } }
      );
      fetchTransactions(statusFilter);
    } catch (error) {
      console.error("Đổi trạng thái thất bại:", error);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await transactionService.uploadRefundImage(selectedTransactionId, formData);
      await fetchTransactions("CANCELED");
      toast.success("Tải ảnh lên thành công!");
      setUploadDialogOpen(false);
      setSelectedTransactionId(null);
    } catch (err) {
      console.error(err);
      alert("Upload thất bại.");
    }
  };

  const getBankCode = (bankName) => {
    const bankCodeMap = {
      "Ngân hàng Quân Đội Việt Nam": "mbbank",
      "Ngân hàng TMCP Ngoại thương Việt Nam": "vcb",
      "Ngân hàng TMCP Công Thương Việt Nam": "vietinbank",
      "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam": "bidv",
      "Ngân hàng TMCP Á Châu": "acb",
      "Ngân hàng TMCP Kỹ thương Việt Nam": "techcombank",
      "Ngân hàng TMCP Việt Nam Thịnh Vượng": "vpbank",
      "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam": "agribank",
      "Ngân hàng TMCP Tiên Phong": "tpbank",
      "Ngân hàng TMCP Hàng Hải Việt Nam": "msb",
      // Thêm các ngân hàng khác nếu cần...
    };
  
    return bankCodeMap[bankName] || "mbbank"; // fallback mặc định nếu không tìm thấy
  };
  const handleSendClick = async (amount,bank) => {
  
    try {
      const numberAmount = parseInt(String(amount).replace(/\D/g, ""), 10);
      const bankCode = getBankCode(bank.bankName);
      const accountNumber = bank.accountNo;
      const encodedInfo = encodeURIComponent("Hoàn tiền giao dịch");
      const encodedName = encodeURIComponent("");
      console.log(encodedName);
      const url = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${numberAmount}&addInfo=${encodedInfo}&accountName=${encodedName}`;
  
      setQrUrl(url);
      setDialogOpen(true);
    } catch (error) {
      toast.error("Không thể tạo mã QR");
      console.error("QR Error:", error);
    }
  };
  

  useEffect(() => {
    fetchTransactions(statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between m-5">
        <h2 className="text-xl font-semibold"></h2>
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
        title= "Danh sách giao dịch"
        columns={columns(
          setPreviewUrl,
          handleChangeTransactionStatus,
          setSelectedTransactionId,
          setUploadDialogOpen,
          handleSendClick
        )}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mã QR thanh toán</DialogTitle>
          </DialogHeader>
          {qrUrl && <img src={qrUrl} alt="QR Payment" className="w-full h-auto" />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewTransactionList;

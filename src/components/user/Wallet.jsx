import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import userService from "@/services/userService";
import transactionService from "@/services/transactionService";
import discountService from "@/services/discountService";
import ListTransactionByWalletId from "./ListTransactionByWalletId";

const Wallet = ({userId}) => {
  const [amount, setAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [wallet, setWallet] = useState(null);
  const [discount, setDiscount] = useState(null);

  // const [user] = useState(() => {
  //   const storedUser = localStorage.getItem("user");
  //   return storedUser ? JSON.parse(storedUser) : null;
  // });
  console.log(userId);
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const data = await userService.getWalletByUserId(userId);
        setWallet(data.data);
        console.log("Ví nạp được:", data);
      } catch (error) {
        console.error("Lỗi khi lấy ví:", error);
        toast.error("Không thể tải ví.");
      }
    };

    fetchWalletData();
  }, [userId]);

  useEffect(() => {
    const fetchDiscount = async () => {
      const cleanAmount = parseInt(amount.replace(/\D/g, ""), 10);

      if (!cleanAmount || cleanAmount < 200000) {
        setDiscount(null);
        return;
      }

      try {
        const res = await discountService.getByTotalAmount({ totalAmount: cleanAmount },setDiscount);
        // setDiscount(res);
        console.log("Discount nhận được:", res);
      } catch (error) {
        console.error("Lỗi khi lấy giảm giá:", error);
        setDiscount(null);
      }
    };

    fetchDiscount();
  }, [amount]);

  const handleSendClick = () => {
    const numberAmount = parseInt(amount.replace(/\D/g, ""), 10);

    // if (!wallet?.walletId) {
    //   toast.error("Ví chưa được tải, vui lòng thử lại sau.");
    //   return;
    // }

    if (isNaN(numberAmount) || numberAmount < 200000) {
      toast.error("Vui lòng nhập số tiền hợp lệ (tối thiểu 200.000đ)");
      return;
    }

    const encodedInfo = encodeURIComponent("dong qop quy vac xin");
    const encodedName = encodeURIComponent("Quy Vac Xin Covid");
    const url = `https://img.vietqr.io/image/mbbank-25250520039999-compact2.jpg?amount=${numberAmount}&addInfo=${encodedInfo}&accountName=${encodedName}`;

    setQrUrl(url);
    setDialogOpen(true);
  };

  const handleCreateTransaction = async () => {
    const numberAmount = parseInt(amount.replace(/\D/g, ""), 10);

    // if (!wallet?.walletId) {
    //   toast.error("Không thể tạo giao dịch vì ví chưa được tải.");
    //   return;
    // }

    if (!numberAmount || numberAmount < 200000) {
      toast.error("Số tiền không hợp lệ.");
      return;
    }

    const payload = {
      totalAmount: numberAmount ,
      walletId: wallet.walletId,
      discountId: discount?.discountId || null,
    };

    console.log("Payload gửi đi:", payload);

    try {
      await transactionService.create(payload);
      toast.success("Tạo giao dịch thành công!");
      setDialogOpen(false);
      setAmount("");
    } catch (error) {
      console.error("Lỗi khi tạo giao dịch:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo giao dịch");
    }
  };

  return (
    <div className="m-5">
      <p className="text-base font-semibold mb-5">
        <span className="text-muted-foreground me-7">Số dư hiện tại</span>
        <span>{wallet?.balance?.toLocaleString("vi-VN")}đ</span>
      </p>

      <div className="flex justify-between items-center mb-5">
        <p className="text-muted-foreground text-base font-semibold w-20 me-3">Số tiền</p>
        <Input
          placeholder="Tối thiểu 200.000đ"
          className="w-full me-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button variant="outline" onClick={handleSendClick} disabled={!wallet}>
          <Plus className="mr-1" />
          Gửi
        </Button>
      </div>
      {wallet?.walletId && <ListTransactionByWalletId walletId={wallet.walletId} />}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quét mã QR để thanh toán</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center mb-4">
            {qrUrl && <img src={qrUrl} alt="QR Code" className="max-w-full max-h-[400px]" />}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateTransaction}>Tạo giao dịch</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;

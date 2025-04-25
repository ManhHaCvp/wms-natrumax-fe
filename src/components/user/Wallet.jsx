import React, {useEffect, useState} from "react";
import {Plus, Info, Save} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import walletService from "@/services/walletService";
import transactionService from "@/services/transactionService";
import discountService from "@/services/discountService";
import TransactionList from "./TransactionList.jsx";
import {formatCurrency} from "@/utils/formatCurrency.jsx";
import {
    Sheet,
    SheetClose, SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.jsx";
import {Label} from "@/components/ui/label.jsx";
import {getBankId} from "@/utils/getBankId.jsx";

const Wallet = ({userId, bank}) => {
    const [amount, setAmount] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [qrUrl, setQrUrl] = useState("");
    const [wallet, setWallet] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const data = await walletService.getWalletByUserId(userId);
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
                setChecked(false);
                return;
            }

            try {
                const res = await discountService.getByTotalAmount({totalAmount: cleanAmount}, setDiscount);
                setChecked(true);
                console.log("Discount nhận được:", res);
            } catch (error) {
                console.error("Lỗi khi lấy giảm giá:", error);
                setDiscount(null);
            }
        };

        fetchDiscount();
    }, [amount]);

    const fetchBankInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/warehouses/owner-by-member/${userId}`);
            if (!response.ok) throw new Error("Không thể lấy thông tin tài khoản ngân hàng");

            const data = await response.json();
            return data.bank;
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin tài khoản ngân hàng");
            console.error(error);
            return null;
        }
    };

    const handleSendClick = async () => {
        const numberAmount = parseInt(amount.replace(/\D/g, ""), 10);

        if (isNaN(numberAmount) || numberAmount < 200000) {
            toast.error("Vui lòng nhập số tiền hợp lệ (tối thiểu 200.000đ)");
            return;
        }

        const bank = await fetchBankInfo();
        if (!bank) return;

        const bankCode = bank.bankCode; // ánh xạ tên sang mã
        const accountNo = bank.accountNo;
        const accountName = encodeURIComponent(bank.accountName);
        const encodedInfo = encodeURIComponent( accountNo + " gui tien");

        const url = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.jpg?amount=${numberAmount}&addInfo=${encodedInfo}&accountName=${accountName}`;

        setQrUrl(url);
        setDialogOpen(true);
    };

    const handleCreateTransaction = async () => {
        const numberAmount = parseInt(amount.replace(/\D/g, ""), 10);

        if (!numberAmount || numberAmount < 200000) {
            toast.error("Số tiền không hợp lệ.");
            return;
        }
        const bonusAmount = discount ? Math.round(numberAmount * (discount.discountPercent / 100)) : 0;
        const totalAmountWithDiscount = numberAmount + bonusAmount;

        const payload = {
            totalAmount: totalAmountWithDiscount,
            walletId: wallet.walletId,
            discountId: discount?.discountId || null,
        };

        console.log("Payload gửi đi:", payload);

        try {
            await transactionService.create(payload);
            toast.success("Tạo giao dịch thành công!");
            setDialogOpen(false);
            setAmount("");
            setReloadTrigger(prev => prev + 1); // 🔄 Fetch lại danh sách giao dịch
        } catch (error) {
            console.error("Lỗi khi tạo giao dịch:", error);
            toast.error(error.message || "Có lỗi xảy ra khi tạo giao dịch");
        }
    };

    return (
        <div className="m-5 space-y-5">
            <div className="flex justify-between items-center">
                <p className="text-base font-semibold space-x-7">
                    <span className="text-muted-foreground">Số dư hiện tại</span>
                    <span>{formatCurrency(wallet?.balance)}</span>
                </p>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button><Info/>Ngân hàng</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Thông tin ngân hàng</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="bankName" className="text-right">
                                    Tên ngân hàng
                                </Label>
                                <Input id="bankName" value={bank?.bankName} className="col-span-3"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="bankName" className="text-right">
                                    Tên tài khoản
                                </Label>
                                <Input id="bankName" value={bank?.accountName} className="col-span-3"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="accountNo" className="text-right">
                                    Số tài khoản
                                </Label>
                                <Input id="accountNo" value={bank?.accountNo} className="col-span-3"/>
                            </div>

                            <img alt="QR Code"
                                 src={`https://img.vietqr.io/image/${bank?.bankCode}-${bank?.accountNo}-compact2.jpg?&accountName=${bank?.accountName}`}/>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit"><Save/>Lưu</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-muted-foreground text-base font-semibold w-20 me-3">Số tiền</p>
                <Input
                    placeholder="Tối thiểu 200.000đ"
                    className="w-full me-3"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <Button variant="outline" onClick={handleSendClick} disabled={!wallet}>
                    <Plus className="mr-1"/>
                    Gửi
                </Button>
            </div>
            {(() => {
                const cleanAmount = parseInt(amount.replace(/\D/g, ""), 10);

                if (!cleanAmount || cleanAmount < 200000) return null;

                // if (discount) {
                //   return (
                //     <div className="text-green-600 font-medium">
                //       ✅ Bạn được khuyến mãi thêm {discount.discountPercent}%
                //     </div>
                //   );
                // }

                // if (checked) {
                //   return (
                //     <div className="text-red-600 font-medium">
                //       ❌ Bạn không có khuyến mãi nào phù hợp
                //     </div>
                //   );
                // }

                return null;
            })()}

            {discount && (
                <div className="text-green-600 font-medium">
                    ✅ Bạn được khuyến mãi thêm {discount.discountPercent}%
                </div>
            )}

            {wallet?.walletId && (
                <TransactionList
                    walletId={wallet.walletId}
                    reloadTrigger={reloadTrigger} // 🔁 truyền để refetch khi trigger thay đổi
                />
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quét mã QR để thanh toán</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center mb-4">
                        {qrUrl && <img src={qrUrl} alt="QR Code" className="max-w-full max-h-[400px]"/>}
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

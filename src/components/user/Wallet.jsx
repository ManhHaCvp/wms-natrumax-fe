import React, { useEffect, useState } from "react";
import { Plus, Info, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/utils/formatCurrency.jsx";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.jsx";
import { Label } from "@/components/ui/label.jsx";

const Wallet = ({ userId, bank }) => {
    const [amountInput, setAmountInput] = useState("");
    const [wallet, setWallet] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [qrUrl, setQrUrl] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [checkedDiscount, setCheckedDiscount] = useState(false);

    const [bankInfo, setBankInfo] = useState({
        bankName: bank?.bankName || "",
        accountName: bank?.accountName || "",
        accountNo: bank?.accountNo || "",
        bankCode: bank?.bankCode || "",
    });

    const numberAmount = parseInt(amountInput.replace(/\D/g, ""), 10) || 0;

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const { data } = await walletService.getWalletByUserId(userId);
                setWallet(data);
            } catch (error) {
                toast.error("Không thể tải ví.");
                console.error("Lỗi khi lấy ví:", error);
            }
        };

        fetchWallet();
    }, [userId]);

    useEffect(() => {
        const fetchDiscount = async () => {
            if (numberAmount < 200000) {
                setDiscount(null);
                setCheckedDiscount(false);
                return;
            }

            try {
                const res = await discountService.getByTotalAmount({ totalAmount: numberAmount });
                setDiscount(res);
                setCheckedDiscount(true);
            } catch (error) {
                setDiscount(null);
                setCheckedDiscount(true);
                console.error("Lỗi khi lấy giảm giá:", error);
            }
        };

        fetchDiscount();
    }, [amountInput]);

    const fetchBankFromAPI = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/warehouses/owner-by-member/${userId}`);
            if (!res.ok) throw new Error("Không thể lấy thông tin ngân hàng");
            const data = await res.json();
            return data.bank;
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin ngân hàng");
            return null;
        }
    };

    const handleAmountChange = (e) => setAmountInput(e.target.value);

    const handleBankInputChange = (e) => {
        const { id, value } = e.target;
        setBankInfo((prev) => ({ ...prev, [id]: value }));
    };

    const handleSaveBankInfo = () => {
        toast.success("Đã lưu thông tin ngân hàng!");
        console.log("Thông tin ngân hàng đã cập nhật:", bankInfo);
    };

    const handleSendClick = async () => {
        if (numberAmount < 200000) {
            toast.error("Vui lòng nhập số tiền hợp lệ (tối thiểu 200.000đ)");
            return;
        }

        const latestBank = await fetchBankFromAPI();
        if (!latestBank) return;

        const accountNameEncoded = encodeURIComponent(latestBank.accountName);
        const info = encodeURIComponent(`${latestBank.accountNo} gui tien`);

        const qrLink = `https://img.vietqr.io/image/${latestBank.bankCode}-${latestBank.accountNo}-compact2.jpg?amount=${numberAmount}&addInfo=${info}&accountName=${accountNameEncoded}`;
        setQrUrl(qrLink);
        setDialogOpen(true);
    };

    const handleCreateTransaction = async () => {
        if (numberAmount < 200000) {
            toast.error("Số tiền không hợp lệ.");
            return;
        }

        const bonus = discount ? Math.round(numberAmount * (discount.discountPercent / 100)) : 0;

        const payload = {
            totalAmount: numberAmount + bonus,
            walletId: wallet.walletId,
            discountId: discount?.discountId || null,
            transactionType: "DEPOSIT"
        };

        try {
            await transactionService.create(payload);
            toast.success("Tạo giao dịch thành công!");
            setDialogOpen(false);
            setAmountInput("");
            setReloadTrigger((prev) => prev + 1);
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi tạo giao dịch");
            console.error("Lỗi khi tạo giao dịch:", error);
        }
    };

    const BankInput = ({ label, id, value }) => (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={id} className="text-right">{label}</Label>
            <Input id={id} value={value} onChange={handleBankInputChange} className="col-span-3" />
        </div>
    );

    return (
        <div className="m-5 space-y-5">
            <div className="flex justify-between items-center">
                <p className="text-base font-semibold space-x-7">
                    <span className="text-muted-foreground">Số dư hiện tại</span>
                    <span>{formatCurrency(wallet?.balance)}</span>
                </p>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button><Info />Ngân hàng</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Thông tin ngân hàng</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <BankInput label="Tên ngân hàng" id="bankName" value={bankInfo.bankName} />
                            <BankInput label="Tên tài khoản" id="accountName" value={bankInfo.accountName} />
                            <BankInput label="Số tài khoản" id="accountNo" value={bankInfo.accountNo} />
                            <BankInput label="Mã ngân hàng" id="bankCode" value={bankInfo.bankCode} />
                            <img
                                alt="QR Code"
                                src={`https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNo}-compact2.jpg?&accountName=${encodeURIComponent(bankInfo.accountName)}`}
                            />
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button onClick={handleSaveBankInfo}><Save />Lưu</Button>
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
                    value={amountInput}
                    onChange={handleAmountChange}
                />
                <Button variant="outline" onClick={handleSendClick} disabled={!wallet}>
                    <Plus className="mr-1" />Gửi
                </Button>
            </div>

            {discount && (
                <div className="text-green-600 font-medium">
                    ✅ Bạn được khuyến mãi thêm {discount.discountPercent}%
                </div>
            )}

            {wallet?.walletId && (
                <TransactionList
                    walletId={wallet.walletId}
                    reloadTrigger={reloadTrigger}
                />
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quét mã QR để thanh toán</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center mb-4">
                        {qrUrl && <img src={qrUrl} alt="QR Code" className="max-w-full max-h-[400px]" />}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleCreateTransaction}>Tạo giao dịch</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Wallet;
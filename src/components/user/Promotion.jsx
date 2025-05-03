import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Gift, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

const Promotion = ({ promotion }) => {
    const [payload, setPayload] = useState({
        quantityToGetPromotion: promotion.quantityToGetPromotion,
        bonusQuantity: promotion.bonusQuantity,
        sameProduct: promotion.sameProduct,
    });

    const handleChange = (field, value) => {
        setPayload((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        console.log("Payload gửi API:", payload);
        // TODO: Gọi API tại đây nếu cần
    };

    return (
        <div className="flex justify-between items-center m-5">
            <div className="text-base font-semibold space-y-3">
                {[
                    { label: "Số lượng cần", value: payload.quantityToGetPromotion },
                    { label: "Số lượng thêm", value: payload.bonusQuantity },
                    { label: "Tính chất", value: payload.sameProduct ? "Cùng loại" : "Khác loại" }
                ].map((item, index) => (
                    <div key={index} className="flex items-center">
                        <p className="w-32 text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                    </div>
                ))}
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">Chỉnh sửa</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Chỉnh sửa chương trình khuyến mãi</SheetTitle>
                        <SheetDescription>
                            Sửa đổi thông tin và nhấn lưu để cập nhật.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 gap-4">
                            <Label htmlFor="quantity" className="text-right">
                                Số lượng cần
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={payload.quantityToGetPromotion}
                                onChange={(e) => handleChange('quantityToGetPromotion', Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bonus" className="text-right">
                                Số lượng thêm
                            </Label>
                            <Input
                                id="bonus"
                                type="number"
                                value={payload.bonusQuantity}
                                onChange={(e) => handleChange('bonusQuantity', Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sameProduct" className="text-right">
                                Tính chất
                            </Label>
                            <select
                                id="sameProduct"
                                value={payload.sameProduct ? "true" : "false"}
                                onChange={(e) => handleChange('sameProduct', e.target.value === "true")}
                                className="col-span-3 border rounded px-2 py-1"
                            >
                                <option value="true">Cùng loại</option>
                                <option value="false">Khác loại</option>
                            </select>
                        </div>
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="button" onClick={handleSave}>
                                Lưu thay đổi
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Promotion;
import React from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Copy, Gift, ShoppingCart} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";

const Promotion = ({promotion}) => {
    return (
        <div>
            <div className="text-base font-semibold m-5 space-y-3">
                <div className="flex items-center">
                    <p className="w-32 text-muted-foreground">Số lượng cần</p>
                    <p className="font-medium">{promotion.quantityToGetPromotion}</p>
                </div>
                <div className="flex items-center">
                    <p className="w-32 text-muted-foreground">Số lượng thêm</p>
                    <p className="font-medium">{promotion.bonusQuantity}</p>
                </div>
                <div className="flex items-center">
                    <p className="w-32 text-muted-foreground">Tính chất</p>
                    <p className="font-medium">{promotion.sameProduct ? "Cùng loại" : "Khác loại"}</p>
                </div>
            </div>
        </div>
    );
};

export default Promotion;
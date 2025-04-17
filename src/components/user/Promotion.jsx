// const Promotion = ({ promotion }) => {
//   console.log(promotion);
//   return (
//     <div className="m-5">
//       <div>
//         <div>
//           <p className="text-muted-foreground">Số lượng để được khuyến mãi</p>
//           <p>{promotion?.quantityToGetPromotion || "Không có dữ liệu"}</p>
//         </div>
//       </div>
//       <div>
//         <p className="text-muted-foreground">Khuyến mãi</p>
//         <p>{promotion?.bonusQuantity || "Không có dữ liệu"}</p>
//       </div>
      
//     </div>
//   )
// }

// export default Promotion;
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, ShoppingCart } from "lucide-react";

const PromotionScreen = () => {
  const purchasedProducts = [
    {
      productName: "Sữa Natrumax Gold 900g",
      quantity: 6,
      promotion: "Mua 5 tặng 1",
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold text-[#182F73] mb-6">Khuyến mãi theo sản phẩm</h1>

      {purchasedProducts.map((item, index) => (
        <Card key={index} className="mb-4 border rounded-xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-5 space-y-2">

            <div className="text-sm text-gray-700">
              <span className="font-medium">Số lượng đã mua:</span> {item.quantity}
            </div>

            <div className="text-sm text-gray-700 flex items-center gap-2">
              <Gift size={16} className="text-pink-600" />
              <span className="font-medium">Khuyến mãi:</span> {item.promotion}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PromotionScreen;
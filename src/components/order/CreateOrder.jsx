import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Check } from "lucide-react";

const CreateOrder = () => {
  const [order, setOrder] = useState({
    items: [
      { id: 1, code: "112", name: "Tên hàng hóa", price: 800000, quantity: 20 },
      { id: 2, code: "113", name: "Tên hàng hóa", price: 800000, quantity: 20 },
      { id: 3, code: "114", name: "Tên hàng hóa", price: 800000, quantity: 20 },
    ],
    totalPrice: 200000000,
    discount: 200000,
    subtotal: 199800000,
    status: "Đã thanh toán",
    customer: {
      name: "Chi nhánh 107",
      phone: "0123456789",
      address: "Hải Dương",
      saleOrderCode: "BH001",
      warehouseCode: "XH001",
    },
  });

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item));
      return { ...prevOrder, items: updatedItems };
    });
  };

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#182F73]">Tạo đơn hàng</h1>
        <Button variant="outline" onClick={() => console.log("Đặt hàng", order)} className="bg-[#182F73] hover:bg-gray-50 py-1 px-2 mr-2 flex text-white items-center">
          <Check className="h-5 w-5 mt-1" /> Đặt hàng
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* Thông tin đơn hàng */}
          <Card className="bg-[#f8fafc] rounded-lg shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-0">Hàng đặt</h2>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center px-4 py-3 bg-[#f8fafc]">
                    <span className="text-gray-800">{item.code}</span>
                    <span className="text-gray-800">{item.name}</span>
                    <span className="text-gray-800">{item.price.toLocaleString()} VND</span>
                    <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))} className="w-16 p-1 border rounded text-center" min="1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Thanh toán */}
          <Card className="bg-[#f8fafc]">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">Thanh toán</h2>
              <div className="flex justify-between text-gray-700 mb-1 font-semibold">
                <span>Tổng tiền hàng</span>
                <span>{order.totalPrice.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between text-red-500 mb-3 font-semibold">
                <span>Giảm giá</span>
                <span>-{order.discount.toLocaleString()} VND</span>
              </div>
              <div className="border-t border-gray-200"></div>
              <div className="flex justify-between font-bold mt-2">
                <span>Tổng thanh toán</span>
                <span>{order.subtotal.toLocaleString()} VND</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Người đặt hàng */}
        <div>
          <Card className="bg-[#f8fafc] rounded-lg shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2">Người đặt</h2>
              <div className="text-gray-700 flex flex-col space-y-2">
                <div className="flex flex-col">
                  <span className="font-semibold">Tên:</span>
                  <span>{order.customer.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Số điện thoại:</span>
                  <span>{order.customer.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Địa chỉ:</span>
                  <span>{order.customer.address}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Mã phiếu bán hàng:</span>
                  <span>{order.customer.saleOrderCode}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Mã phiếu xuất kho:</span>
                  <span>{order.customer.warehouseCode}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;

import React from "react";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";

const ViewOrderDetail = () => {
  const order = {
    items: [
      { id: 1, code: "112", name: "Tên hàng hóa", price: 800000, quantity: 20 },
      { id: 2, code: "113", name: "Tên hàng hóa", price: 800000, quantity: 20 },
      { id: 3, code: "114", name: "Tên hàng hóa", price: 800000, quantity: 20 },
    ],
    totalPrice: 200000000,
    discount: 200000,
    subtotal: 199800000,
    status: "Đã thanh toán",
    activities: [{ title: "Đã giao" }, { title: "Đang giao" }, { title: "Đã xác nhận" }],
    customer: {
      name: "Chi nhánh 107",
      phone: "0123456789",
      address: "Hải Dương",
      saleOrderCode: "BH001",
      warehouseCode: "XH001",
    },
  };

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#182F73]">Thông tin đơn hàng</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/orders/edit/${order.id}`)} className="bg-[#182F73] hover:bg-gray-50 py-1 px-2 mr-2 flex text-white items-center">
            <Pencil className="h-5 w-5 mt-1" /> Sửa
          </Button>
          {/* <Button variant="destructive">Cập nhật trạng thái</Button> */}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* Thong tin don hang */}
          <Card className="bg-[#f8fafc] rounded-lg shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-0">Hàng đặt</h2>
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-center px-4 py-3 bg-[#f8fafc]">
                    <span className="text-gray-800">{item.code}</span>
                    <span className="text-gray-800">{item.name}</span>
                    <span className="text-gray-800">{item.price.toLocaleString()} VND</span>
                    <span className="text-gray-800">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Thanh toan */}
          <Card className="bg-[#f8fafc]">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                Thanh toán <Badge className="bg-green-500 text-white">{order.status}</Badge>
              </h2>
              <div className="flex justify-between text-gray-700 mb-1 font-semibold">
                <span>Tổng tiền hàng</span>
                <span>{order.totalPrice.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between text-red-500 mb-3 font-semibold">
                <span>Giảm giá</span>
                <span>-{order.discount.toLocaleString()} VND</span>
              </div>
              <div className="border-t border-gray-200"></div>
              <div className="flex justify-between font-bold mt-2 font-bold">
                <span>Tổng thanh toán</span>
                <span>{order.subtotal.toLocaleString()} VND</span>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card className="bg-[#f8fafc]">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                Hoạt động <Badge className="bg-green-500 text-white">Đã hoàn thành</Badge>
              </h2>
              <ul className="list-none">
                {order.activities.map((activity, index) => (
                  <li key={index} className="flex items-center gap-2 py-1">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    {/* <span className="text-gray-700">{activity.time}</span> */}
                    <span className="text-gray-500">{activity.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Nguoi dat hang */}
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

export default ViewOrderDetail;

import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import QuantityInput from "@/components/common/QuantityInput.jsx";

const CreateOrder = () => {
  const [order, setOrder] = useState({
    id: 1,
    items: [
      { id: 1, code: "112", name: "Tên hàng hóa", price: 800000, quantity: 20 },
      { id: 2, code: "113", name: "Tên hàng hóa", price: 800000, quantity: 20 },
      { id: 3, code: "114", name: "Tên hàng hóa", price: 800000, quantity: 20 },
    ],
    discount: 0.2,
    paymentStatus: "Đã thanh toán",
    orderStatus: "Đã giao",
    activities: [
      { id: 1, title: "Đã giao", dateTime: "02:00 PM 20/2/2025" },
      { id: 2, title: "Đang giao", dateTime: "02:00 PM 20/2/2025" },
      { id: 3, title: "Đã xác nhận", dateTime: "02:00 PM 20/2/2025" },
    ],
    customer: {
      name: "Chi nhánh 107",
      phone: "0123456789",
      address: "Hải Dương",
      saleOrderCode: "BH001",
      warehouseCode: "XH001",
    },
  });

  const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = totalPrice * order.discount;

  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Tạo đơn hàng</h1>
          <Button asChild><Link to={`/admin/order/update/${order.id}`}><Check/>Đặt hàng</Link></Button>
      </div>
      <div className="flex space-x-5">
        <div className="w-full flex flex-col space-y-5">
          {/* Thong tin don hang */}
          <Card>
            <CardHeader>
              <CardTitle>Hàng đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Mã hàng</TableHead>
                      <TableHead>Tên hàng</TableHead>
                      <TableHead>Giá tiền</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead className="text-right">Tổng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price.toLocaleString()} VND</TableCell>
                        <TableCell>
                          <QuantityInput
                            item={{ ...item, max: 20 }}
                            onChange={(id, newQuantity) => {
                              setOrder((prev) => ({
                                ...prev,
                                items: prev.items.map((i) =>
                                  i.id === id ? { ...i, quantity: newQuantity } : i,
                                ),
                              }));
                            }}
                          />
                        </TableCell>
                        <TableCell
                          className="text-right">{(item.price * item.quantity).toLocaleString()} VND</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>Tổng số tiền</TableCell>
                      <TableCell className="text-right">{totalPrice.toLocaleString()} VND</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Thanh toan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="me-3">Thanh toán</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead colSpan={2}>Mã hàng</TableHead>
                      <TableCell className="text-right">{totalPrice.toLocaleString()} VND</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={2}>Giảm giá</TableHead>
                      <TableCell
                        className="text-right text-destructive">-{discountAmount.toLocaleString()} VND</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>Tổng số tiền</TableCell>
                      <TableCell className="text-right">{(totalPrice - discountAmount).toLocaleString()} VND</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nguoi dat hang */}
        <Card className="w-2/6 h-fit">
          <CardHeader>
            <CardTitle>Hàng đặt</CardTitle>
          </CardHeader>
          <CardContent className="font-semibold space-y-5">
            <div>
              <p className="text-muted-foreground">Tên</p>{order.customer.name}
            </div>
            <div>
              <p className="text-muted-foreground">Liên lạc</p>{order.customer.phone}
            </div>
            <div>
              <p className="text-muted-foreground">Địa chỉ</p>{order.customer.address}
            </div>
            <div>
              <p className="text-muted-foreground">Phiếu bán hàng</p>{order.customer.saleOrderCode}
            </div>
            <div>
              <p className="text-muted-foreground">Phiếu xuất kho</p>{order.customer.warehouseCode}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link, useLocation } from "react-router-dom";
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
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const detail = user?.detail ? JSON.parse(user.detail) : null;

  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];

  const [order, setOrder] = useState({
    userId: 1,
    createOrderDetailRequests: [],
    createOrderInvoiceRequests: {
      discountId: 0,
      totalAmount: 0,
      paymentMethod: "Chuyển khoản", // hoặc "Tiền mặt", tuỳ vào bạn
      status: "PENDING",
      createDate: new Date().toISOString(),
    },
  });

  const [discount, setDiscount] = useState({
    discountId: 1,
    minimumAmount: "1500000",
    discountPercent: 10,
    description: "Giảm giá cho khách hàng VIP",
    activeDate: "01/03/2025",
    expiryDate: "31/03/2025",
  });

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const detailRequests = selectedProducts.map((item) => ({
        quantity: 1,
        price: item.price,
        productId: item.productId,
        bonus: false,
        maxQuantity: item.stock,
        name: item.name,
      }));

      setOrder(prev => ({
        ...prev,
        createOrderDetailRequests: detailRequests,
      }));
    }
  }, [selectedProducts]);

  useEffect(() => {
    const total = order.createOrderDetailRequests.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    setOrder(prev => ({
      ...prev,
      createOrderInvoiceRequests: {
        ...prev.createOrderInvoiceRequests,
        totalAmount: total,
      },
    }));
  }, [order.createOrderDetailRequests]);

  const totalPrice = order.createOrderInvoiceRequests.totalAmount;
  const discountAmount = totalPrice * (1 - discount.discountPercent/100);

  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Tạo đơn hàng</h1>
        <Button asChild><Link to={`/admin/order/update/${order.id}`}><Check />Đặt hàng</Link></Button>
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
                    {order.createOrderDetailRequests.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.productId}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price.toLocaleString()} VND</TableCell>
                        <TableCell>
                          <QuantityInput
                            item={{ ...item, max: item.maxQuantity }}
                            onChange={(id, newQuantity) => {
                              setOrder((prev) => ({
                                ...prev,
                                createOrderDetailRequests: prev.createOrderDetailRequests.map((i) =>
                                  i.productId === id ? { ...i, quantity: newQuantity } : i,
                                ),
                              }));
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.price * item.quantity).toLocaleString()} VND
                        </TableCell>
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
              <p className="text-muted-foreground">Tên</p>{detail.accountName}
            </div>
            <div>
              <p className="text-muted-foreground">Liên lạc</p>{detail.phoneNumber}
            </div>
            <div>
              <p className="text-muted-foreground">Địa chỉ</p>{detail.address}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
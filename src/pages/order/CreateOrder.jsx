import React, { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link, useLocation } from "react-router-dom";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import QuantityInput from "@/components/common/QuantityInput.jsx";
import discountService from "@/services/discountService";
import orderService from "@/services/orderService";
import toast from "react-hot-toast";

const CreateOrder = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const detail = user?.detail ? JSON.parse(user.detail) : null;

  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];
  console.log(location.state);
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

  const [discount, setDiscount] = useState(null);

  const totalPrice = order.createOrderInvoiceRequests.totalAmount;

  // Tính discountAmount khi discount hoặc totalPrice thay đổi
  const discountAmount = useMemo(() => {
    if (!discount?.discountPercent || totalPrice <= 0) return 0;
    return totalPrice * (discount.discountPercent / 100);
  }, [discount, totalPrice]);

  // Thêm vào đầu component:
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        if (totalPrice > 0) {
          await discountService.getByTotalAmount({ totalAmount: totalPrice }, setDiscount);
          console.log(discount);
        } else {
          setDiscount(null);
        }
      } catch (error) {
        console.error("Failed to fetch discount:", error);
        setDiscount(null); // reset discount nếu lỗi
      }
    };

    fetchDiscount(); // chỉ gọi khi totalPrice thay đổi
  }, [totalPrice]);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const detailRequests = selectedProducts.map((item) => ({
        id: item.productId,
        quantity: 1,
        price: item.price,
        barcode: item.barcode,
        bonus: false,
        maxQuantity: item.quantity,
        name: item.name,
      }));

      setOrder((prev) => ({
        ...prev,
        createOrderDetailRequests: detailRequests,
      }));
    }
  }, [selectedProducts]);

  useEffect(() => {
    const total = order.createOrderDetailRequests.reduce((sum, item) => sum + item.price * item.quantity, 0);

    setOrder((prev) => ({
      ...prev,
      createOrderInvoiceRequests: {
        ...prev.createOrderInvoiceRequests,
        totalAmount: total,
      },
    }));
  }, [order.createOrderDetailRequests]);

  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Tạo đơn hàng</h1>
        {/* <Button asChild>
          <Link to={`/admin/order/update/${order.id}`}>
            <Check />
            Đặt hàng  
          </Link>
        </Button> */}
        <Button
  onClick={async () => {
    try {
      const payload = {
        userId: user.id,
        createOrderInvoiceRequests: {
          discountId: discount?.id || 0,
          totalAmount: order.createOrderInvoiceRequests.totalAmount,
          paymentMethod: "BANK_TRANSFER", // hoặc "CASH"
        },
        createOrderDetailRequests: order.createOrderDetailRequests.map((item) => ({
          quantity: item.quantity,
          isBonus: item.bonus,
          price: item.price,
          productId: item.id,
        })),
      };

      const response = await orderService.create(payload);
      console.log("Order created:", response);

      // Chuyển trang hoặc hiển thị thành công tuỳ bạn
      toast.success("Đơn hàng đã được tạo thành công!");
    } catch (error) {
      // console.error("Error creating order:", error);
      toast.error("Tạo đơn hàng thất bại.");
    }
  }}
>
  <Check className="mr-2" />
  Đặt hàng
</Button>

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
                      <TableRow key={item.id}>
                        <TableCell>{item.barcode}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price.toLocaleString()} VND</TableCell>
                        <TableCell>
                          <QuantityInput
                            item={{ ...item, max: item.maxQuantity }}
                            onChange={(id, newQuantity) => {
                              setOrder((prev) => ({
                                ...prev,
                                createOrderDetailRequests: prev.createOrderDetailRequests.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)),
                              }));
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">{(item.price * item.quantity).toLocaleString()} VND</TableCell>
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
                      <TableHead colSpan={2}>Giảm giá: {discount?.description} ({discount?.discountPercent}%) </TableHead>
                      <TableCell className="text-right text-destructive">-{discountAmount.toLocaleString()} VND</TableCell>
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
            <CardTitle>Thông tin người đặt</CardTitle>
          </CardHeader>
          <CardContent className="font-semibold space-y-5">
            <div>
              <p className="text-muted-foreground">Tên: </p>
              {user.accountName}
            </div>
            <div>
              <p className="text-muted-foreground">Số liên lạc: </p>
              {user.phoneNumber}
            </div>
            <div>
              <p className="text-muted-foreground">Địa chỉ: </p>
              {user.address}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;

import React, { useEffect, useState } from "react";
import { Accessibility, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import axios from "axios";
import formatDate from "@/utils/formatDate";
import UploadProofDialog from "@/components/user/UploadProofDialog";
import transactionService from "@/services/transactionService";
import orderService from "@/services/orderService";
import toast from "react-hot-toast";

const ViewOrderDetail = () => {
  const { id } = useParams(); // assuming you pass orderId via route param
  const [order, setOrder] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/orders/${id}`);
        const data = res.data;
        console.log(data);
        // Parse JSON detail field safely
        let detailParsed = {};
        try {
          detailParsed = JSON.parse(data.user.detail);
        } catch (e) {
          console.error("Error parsing user.detail", e);
        }

        setOrder({
          id: data.orderId,
          items: data.orderDetails, // update this when you have order item API
          discount: data?.invoices?.discount?.discountPercent ?? 0, // or data.discount if available
          paymentStatus: "Đã thanh toán", // convert from data.status if needed
          orderStatus: data.status,
          activities: [], // populate if available
          customer: {
            name: data.user.accountName,
            phone: data.user.phoneNumber,
            address: data.user.address,
            saleOrderCode: data.saleCode,
            warehouseCode: detailParsed.client_id || "N/A",
          },
          orderModifyHistories: data.orderModifyHistories,
          urlTranferImage: data.invoices.transferImage,
          urlRefundImage: data.invoices.refundImage,

        });
      } catch (err) {
        console.error("Error fetching order", err);
      }
    };

    fetchOrder();
  }, [id]);
  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await orderService.uploadTranferImage(
        selectedTransactionId,
        formData
      );
      // await fetchData();
      toast.success("Tải ảnh lên thành công!");
      setUploadDialogOpen(false);
      setSelectedTransactionId(null);
    } catch (err) {
      console.error(err);
      alert("Upload thất bại.");
    }
  };
  if (!order) return <p className="m-5">Đang tải đơn hàng...</p>;
  const nextStatusMap = {
    PENDING: "Đã xác nhận",
    CONFIRMED: "Đã đóng gói",
    PACKED: "Đang được giao",
    SHIPPED: "Đã được giao",
    DELIVERED: "Đã nhận",
  };
  const statusViMap = {
    PENDING: "Đang chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PACKED: "Đã đóng gói",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };
  const currentStatus = order.orderStatus;
  const nextStatus = nextStatusMap[currentStatus];
  console.log(nextStatus);
  const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // const discountPercent = order?.invoices?.discount?.discountPercent ?? 0;
  const discountAmount = totalPrice * (order.discount / 100);
  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Thông tin đơn hàng</h1>
        <div className="space-x-3">
          {nextStatus && (
            <Button
              variant="default"
              onClick={async () => {
                try {
                  await axios.put(`http://localhost:8080/api/v1/orders/update-status/${order.id}`);
                  window.location.reload();
                } catch (err) {
                  console.error("Lỗi khi cập nhật trạng thái:", err);
                }
              }}
            >
              <Accessibility className="mr-2 h-4 w-4" />
              {nextStatus}
            </Button>
          )}
          <Button asChild>
            <Link to={`/admin/order/update/${order.id}`}>
              <Pencil />
              Sửa
            </Link>
          </Button>
        </div>
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
                      <TableRow key={item.product.productId}>
                        <TableCell>{item.product.barcode}</TableCell>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.price.toLocaleString()} VND</TableCell>
                        <TableCell>{item.quantity}</TableCell>
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
                <Badge>{order.paymentStatus}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead colSpan={2}>Tổng số tiền</TableHead>
                      <TableCell className="text-right">{totalPrice.toLocaleString()} VND</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={2}>Giảm giá</TableHead>
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

          {/* Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="me-3">Hoạt động</span>
                <Badge>{statusViMap[order.orderStatus]}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line */}
                <Separator orientation="vertical" className="absolute left-[5px] w-0.5 rounded" />

                <ul className="space-y-5">
                  {order.orderModifyHistories.map((orderModifyHistory, index) => (
                    <li key={index} className="relative flex items-start">
                      {/* Circle indicator */}
                      <div className="absolute top-2 w-3 h-3 bg-[#182f73] rounded-full border-2 border-white"></div>

                      {/* Activity content */}
                      <div className="ml-7">
                        <h3 className="font-semibold">{orderModifyHistory.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate.formatJsonToDateTime(orderModifyHistory.createDate)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
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
              <p className="text-muted-foreground">Tên</p>
              {order.customer.name}
            </div>
            <div>
              <p className="text-muted-foreground">Liên lạc</p>
              {order.customer.phone}
            </div>
            <div>
              <p className="text-muted-foreground">Địa chỉ</p>
              {order.customer.address}
            </div>
            <div>
              <p className="text-muted-foreground">Phiếu bán hàng</p>
              {order.customer.saleOrderCode}
            </div>
            <div>
              <p className="text-muted-foreground">Phiếu xuất kho</p>
              {order.customer.warehouseCode}
            </div>
            <Button
              onClick={() => {
                setSelectedTransactionId(order.id);
                setUploadDialogOpen(true);
              }}
            >
              Thêm ảnh chuyển khoản
            </Button>
            {order.urlTranferImage ? (
          <img
            src={order.urlRefundImage}
            alt="Proof"
            className="w-16 h-16 object-cover rounded border"
            // onClick={() => setPreviewUrl(url)}

          />
        ) : (
          <span className="text-sm text-muted-foreground">Chưa có</span>
        )}

<Button
              onClick={() => {
                setSelectedTransactionId(order.id);
                setUploadDialogOpen(true);
              }}
            >
              Thêm ảnh hoàn tiền
            </Button>
            {order.urlTranferImage ? (
          <img
            src={order.urlTranferImage}
            alt="Proof"
            className="w-16 h-16 object-cover rounded border"
            // onClick={() => setPreviewUrl(url)}

          />
        ) : (
          <span className="text-sm text-muted-foreground">Chưa có</span>
        )}
          </CardContent>
        </Card>
      </div>
       <UploadProofDialog
              open={uploadDialogOpen}
              onOpenChange={setUploadDialogOpen}
              onUpload={handleUpload}
            />
    </div>
  );
};

export default ViewOrderDetail;

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const paymentHistoryData = [
  { id: 1, name: "Nguyen Van A", phone: "0123456789", status: "Đã thanh toán", amount: "500,000 VND", color: "green" },
  { id: 2, name: "Nguyen Van B", phone: "0123456789", status: "Chờ xác nhận", amount: "1,000,000 VND", color: "orange" },
  { id: 3, name: "Nguyen Van C", phone: "0123456789", status: "Đã hủy", amount: "200,000 VND", color: "red" },
  { id: 4, name: "Nguyen Van D", phone: "0123456789", status: "Đã hủy", amount: "750,000 VND", color: "red" },
];

export default function PaymentHistory() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Số điện thoại</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Số tiền</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentHistoryData.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.name}</TableCell>
            <TableCell>{payment.phone}</TableCell>
            <TableCell>
              <Badge style={{ backgroundColor: payment.color }}>{payment.status}</Badge>
            </TableCell>
            <TableCell>{payment.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const userDiscountData = [
  { id: 1, paidAmount: "1,500,000 VND", discount: "10%", description: "Giảm giá cho khách hàng VIP", startDate: "01/03/2025", endDate: "31/03/2025" },
  { id: 2, paidAmount: "500,000 VND", discount: "5%", description: "Ưu đãi tháng 3", startDate: "10/03/2025", endDate: "20/03/2025" },
  { id: 3, paidAmount: "2,000,000 VND", discount: "15%", description: "Giảm giá sinh nhật", startDate: "05/03/2025", endDate: "10/03/2025" },
  { id: 4, paidAmount: "3,000,000 VND", discount: "20%", description: "Flash Sale", startDate: "15/03/2025", endDate: "16/03/2025" },
  { id: 5, paidAmount: "750,000 VND", discount: "8%", description: "Khuyến mãi ngày lễ", startDate: "20/03/2025", endDate: "25/03/2025" },
  { id: 6, paidAmount: "1,200,000 VND", discount: "12%", description: "Giảm giá khách hàng thân thiết", startDate: "01/04/2025", endDate: "10/04/2025" },
  { id: 7, paidAmount: "950,000 VND", discount: "6%", description: "Ưu đãi cho đơn hàng đầu tiên", startDate: "05/04/2025", endDate: "15/04/2025" },
  { id: 8, paidAmount: "2,500,000 VND", discount: "18%", description: "Đại hội giảm giá", startDate: "10/04/2025", endDate: "20/04/2025" },
];

export default function UserDiscount() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Đã thanh toán</TableHead>
          <TableHead>Mức giảm giá (%)</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Ngày hiệu lực</TableHead>
          <TableHead>Ngày hết hạn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userDiscountData.map((discount) => (
          <TableRow key={discount.id}>
            <TableCell>{discount.paidAmount}</TableCell>
            <TableCell>{discount.discount}</TableCell>
            <TableCell>{discount.description}</TableCell>
            <TableCell>{discount.startDate}</TableCell>
            <TableCell>{discount.endDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

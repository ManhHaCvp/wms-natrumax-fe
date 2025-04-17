import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CommissionDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const [detailData] = useState([
    {
      customerName: "Nguyen Van A",
      products: [
        { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5, quantitySold: 50, totalRevenue: 5000000 },
        { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3, quantitySold: 30, totalRevenue: 3000000 },
        { name: "SP Genomil", discount: 2, quantitySold: 20, totalRevenue: 2000000 },
        { name: "Bột ăn dặm", discount: 2, quantitySold: 40, totalRevenue: 4000000 },
      ],
    },
    {
      customerName: "Nguyen Van A",
      products: [
        { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5, quantitySold: 50, totalRevenue: 5000000 },
        { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3, quantitySold: 30, totalRevenue: 3000000 },
        { name: "SP Genomil", discount: 2, quantitySold: 20, totalRevenue: 2000000 },
        { name: "Bột ăn dặm", discount: 2, quantitySold: 40, totalRevenue: 4000000 },
      ],
    },
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4 text-[#182F73]">Chi tiết hoa hồng</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">
          Trạng thái: <span className={status === "Đã thanh toán" ? "text-green-500" : "text-red-500"}>{status}</span>
        </p>
        {status === "Chưa thanh toán" && (
          <div className="flex justify-end">
            <Button className="bg-[#182F73] text-white px-6 py-2 rounded-md ">Thanh toán</Button>
          </div>
        )}
      </div>

      {/* Hiển thị danh sách khách hàng */}
      {detailData.map((detail, index) => {
        const totalQuantitySold = detail.products.reduce((sum, product) => sum + product.quantitySold, 0);
        const totalRevenue = detail.products.reduce((sum, product) => sum + product.totalRevenue, 0);
        const totalCommission = detail.products.reduce((sum, product) => sum + product.totalRevenue * (product.discount / 100), 0);

        return (
          <Card key={index} className="mb-2 p-2 shadow-md rounded-lg">
            <CardContent className="p-2 flex justify-between items-center">
              <div>
                <Button variant="ghost" className="text-sm font-semibold text-gray-700">
                  {detail.customerName}
                </Button>
              </div>
            </CardContent>

            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/6">Tên hàng</TableHead>
                  <TableHead className="w-1/6 text-center">Số lượng đã bán</TableHead>
                  <TableHead className="w-1/6 text-center">Tổng doanh số</TableHead>
                  <TableHead className="w-1/6 text-center">% CK</TableHead>
                  <TableHead className="w-1/6 text-center">Tiền hoa hồng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.products.map((product, idx) => (
                  <TableRow key={idx} className="h-6">
                    <TableCell className="py-1">{product.name}</TableCell>
                    <TableCell className="text-center py-1">{product.quantitySold}</TableCell>
                    <TableCell className="text-center py-1">{product.totalRevenue.toLocaleString()} VND</TableCell>
                    <TableCell className="text-center py-1">{product.discount}%</TableCell>
                    <TableCell className="text-center py-1">{(product.totalRevenue * (product.discount / 100)).toLocaleString()} VND</TableCell>
                  </TableRow>
                ))}

                <TableRow className="font-bold bg-gray-100">
                  <TableCell className="py-2 text-left">Tổng cộng</TableCell>
                  <TableCell className="text-center">{totalQuantitySold}</TableCell>
                  <TableCell className="text-center">{totalRevenue.toLocaleString()} VND</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">{totalCommission.toLocaleString()} VND</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        );
      })}
    </div>
  );
};

export default CommissionDetail;

// const [detailData] = useState([
//   {
//     customerName: "Nguyen Van A",
//     products: [
//       { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5, quantitySold: 50, totalRevenue: 5000000 },
//       { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3, quantitySold: 30, totalRevenue: 3000000 },
//       { name: "SP Genomil", discount: 2, quantitySold: 20, totalRevenue: 2000000 },
//       { name: "Bột ăn dặm", discount: 2, quantitySold: 40, totalRevenue: 4000000 },
//     ],
//   },
//   {
//     customerName: "Nguyen Van A",
//     products: [
//       { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5, quantitySold: 50, totalRevenue: 5000000 },
//       { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3, quantitySold: 30, totalRevenue: 3000000 },
//       { name: "SP Genomil", discount: 2, quantitySold: 20, totalRevenue: 2000000 },
//       { name: "Bột ăn dặm", discount: 2, quantitySold: 40, totalRevenue: 4000000 },
//     ],
//   },
// ]);

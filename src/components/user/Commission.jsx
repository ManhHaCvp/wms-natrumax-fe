import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const Commission = () => {
  const [policyData] = useState([
    {
      customerName: "Nguyen Van A",
      products: [
        { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5 },
        { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3 },
        { name: "SP Genomil", discount: 2 },
        { name: "Bột ăn dặm", discount: 2 },
      ],
    },
    {
      customerName: "Tran Thi B",
      products: [
        { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5 },
        { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3 },
        { name: "SP Genomil", discount: 2 },
        { name: "Bột ăn dặm", discount: 2 },
      ],
    },
    {
      customerName: "Le Van C",
      products: [
        { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5 },
        { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3 },
        { name: "SP Genomil", discount: 2 },
        { name: "Bột ăn dặm", discount: 3 },
      ],
    },
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      <h1 className="text-xl font-bold text-[#182F73] mb-4 ml-2">Chính sách hoa hồng</h1>

      {policyData.map((policy, customerIndex) => (
        <Card key={customerIndex} className="mb-2 p-2 shadow-md rounded-lg">
          <CardContent className="p-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">{policy.customerName}</span>
            </div>

            <Table className="w-full text-sm mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/3">Tên hàng</TableHead>
                  <TableHead className="w-1/3 text-center">% CK</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policy.products.map((product, productIndex) => (
                  <TableRow key={productIndex} className="h-6">
                    <TableCell className="py-1">{product.name}</TableCell>
                    <TableCell className="text-center py-1">{product.discount}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Commission;

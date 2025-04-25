// import React, { useState } from "react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Plus, Edit, Pencil } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

// const CommissionPolicy = () => {
//   const [policyData, setPolicyData] = useState([
//     {
//       customerName: "Nguyen Van A",
//       products: [
//         { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5 },
//         { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3 },
//         { name: "SP Genomil", discount: 2 },
//         { name: "Bột ăn dặm", discount: 2 },
//       ],
//     },
//     {
//       customerName: "Tran Thi B",
//       products: [
//         { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5 },
//         { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3 },
//         { name: "SP Genomil", discount: 2 },
//         { name: "Bột ăn dặm", discount: 2 },
//       ],
//     },
//     {
//       customerName: "Le Van C",
//       products: [
//         { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5 },
//         { name: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", discount: 3 },
//         { name: "SP Genomil", discount: 2 },
//         { name: "Bột ăn dặm", discount: 3 },
//       ],
//     },
//   ]);

//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   return (
//     <div className="w-full max-w-6xl mx-auto mt-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-[#182F73]">Chính sách hoa hồng</h1>
//         <Link to="/admin/commissions/create">
//           <Button variant="default" className="ms-3">
//             <Plus />
//             Thêm mới
//           </Button>
//         </Link>
//       </div>

//       <h2 className="text-lg font-semibold text-[#182F73] mb-2">Nhà phân phối: </h2>

//       {policyData.map((policy, customerIndex) => (
//         <Card key={customerIndex} className="mb-2 p-2 shadow-md rounded-lg">
//           <CardContent className="p-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-semibold text-gray-700">{policy.customerName}</span>
//               <Sheet>
//                 <SheetTrigger>
//                   <Button variant="ghost" className="text-xs mr-40">
//                     <Pencil /> Sửa
//                   </Button>
//                 </SheetTrigger>

//                 <SheetContent side="right">
//                   <div className="p-4">
//                     <h2 className="text-lg font-semibold">Chỉnh sửa hoa hồng - {policy.customerName}</h2>
//                     <form>
//                       {policy.products.map((product, productIndex) => (
//                         <div key={productIndex} className="flex justify-between my-2">
//                           <label className="w-2/3">{product.name}</label>
//                           <input
//                             type="number"
//                             value={product.discount}
//                             onChange={(e) => {
//                               const newProducts = [...policy.products];
//                               newProducts[productIndex].discount = parseInt(e.target.value);
//                               const newPolicyData = [...policyData];
//                               newPolicyData[customerIndex].products = newProducts;
//                               setPolicyData(newPolicyData);
//                             }}
//                             className="w-1/3 p-2 border rounded"
//                           />
//                         </div>
//                       ))}
//                     </form>
//                     <div className="mt-4 flex justify-end">
//                       <SheetClose asChild>
//                         <Button variant="outline">Đóng</Button>
//                       </SheetClose>
//                       <Button className="ml-2">Lưu thay đổi</Button>
//                     </div>
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>

//             <Table className="w-full text-sm mt-4">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-2/3">Tên hàng</TableHead>
//                   <TableHead className="w-1/3 text-center">% CK</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {policy.products.map((product, productIndex) => (
//                   <TableRow key={productIndex} className="h-6">
//                     <TableCell className="py-1">{product.name}</TableCell>
//                     <TableCell className="text-center py-1">{product.discount}%</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default CommissionPolicy;

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const CommissionPolicy = () => {
  const [distributorData, setDistributorData] = useState({
    referrer: {
      userId: 6,
      accountName: "Chi nhánh 259",
      role: "ROLE_BRANCH_OWNER",
      province: "Hà Nội",
    },
    commissions: [
      {
        commissionId: 1,
        referral: {
          userId: 5,
          accountName: "Chi nhánh 107",
          role: "ROLE_BRANCH_OWNER",
          province: "Hải Dương",
        },
        commissionPolicies: [
          {
            commissionPolicyId: 1,
            categoryName: "Sản phẩm cũ + ngũ cốc 200gr",
            percentage: 10.0,
          },
          {
            commissionPolicyId: 2,
            categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr",
            percentage: 20.0,
          },
          {
            commissionPolicyId: 3,
            categoryName: "SP Genumil",
            percentage: 30.0,
          },
        ],
      },
      {
        commissionId: 2,
        referral: {
          userId: 5,
          accountName: "Chi nhánh 107",
          role: "ROLE_BRANCH_OWNER",
          province: "Hải Dương",
        },
        commissionPolicies: [
          {
            commissionPolicyId: 1,
            categoryName: "Sản phẩm cũ + ngũ cốc 200gr",
            percentage: 10.0,
          },
          {
            commissionPolicyId: 2,
            categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr",
            percentage: 20.0,
          },
          {
            commissionPolicyId: 3,
            categoryName: "SP Genumil",
            percentage: 30.0,
          },
        ],
      },
      {
        commissionId: 2,
        referral: {
          userId: 5,
          accountName: "Chi nhánh 107",
          role: "ROLE_BRANCH_OWNER",
          province: "Hải Dương",
        },
        commissionPolicies: [
          {
            commissionPolicyId: 1,
            categoryName: "Sản phẩm cũ + ngũ cốc 200gr",
            percentage: 10.0,
          },
          {
            commissionPolicyId: 2,
            categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr",
            percentage: 20.0,
          },
          {
            commissionPolicyId: 3,
            categoryName: "SP Genumil",
            percentage: 30.0,
          },
        ],
      },
    ],
  });

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Chính sách hoa hồng</h1>
        <Link to="/admin/commissions/create">
          <Button variant="default" className="ms-3">
            <Plus />
            Thêm mới
          </Button>
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-[#182F73] mb-4">
        Nhà phân phối: {distributorData.referrer.accountName} ({distributorData.referrer.province})
      </h2>

      {distributorData.commissions.map((commission, index) => (
        <Card key={index} className="mb-4 p-2 shadow-md rounded-lg">
          <CardContent className="p-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">
                {commission.referral.accountName} - {commission.referral.province}
              </span>
              <Sheet>
                <SheetTrigger>
                  <Button variant="ghost" className="text-xs mr-40">
                    <Pencil /> Sửa
                  </Button>
                </SheetTrigger>

                <SheetContent side="right">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">Chỉnh sửa hoa hồng - {commission.referral.accountName}</h2>
                    <form>
                      {commission.commissionPolicies.map((policy, policyIndex) => (
                        <div key={policyIndex} className="flex justify-between my-2">
                          <label className="w-2/3">{policy.categoryName}</label>
                          <input
                            type="number"
                            value={policy.percentage}
                            onChange={(e) => {
                              const newData = { ...distributorData };
                              newData.commissions[index].commissionPolicies[policyIndex].percentage = parseFloat(e.target.value);
                              setDistributorData(newData);
                            }}
                            className="w-1/3 p-2 border rounded"
                          />
                        </div>
                      ))}
                    </form>
                    <div className="mt-4 flex justify-end">
                      <SheetClose asChild>
                        <Button variant="outline">Đóng</Button>
                      </SheetClose>
                      <Button className="ml-2">Lưu thay đổi</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Table className="w-full text-sm mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/3">Tên hàng</TableHead>
                  <TableHead className="w-1/3 text-center">% CK</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commission.commissionPolicies.map((policy, policyIndex) => (
                  <TableRow key={policyIndex} className="h-6">
                    <TableCell className="py-1">{policy.categoryName}</TableCell>
                    <TableCell className="text-center py-1">{policy.percentage}%</TableCell>
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

export default CommissionPolicy;

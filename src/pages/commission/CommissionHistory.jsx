// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowUpDown, MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button.jsx";
// import { createColumnHelper } from "@tanstack/react-table";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
// import TableComponent from "@/components/common/DataTable.jsx";

// const columnHelper = createColumnHelper();

// // Tach thang va nam
// const extractMonthYear = (dateString) => {
//   const date = new Date(dateString);
//   return {
//     month: date.getMonth() + 1,
//     year: date.getFullYear(),
//   };
// };

// const columns = [
//   columnHelper.accessor("year", {
//     header: ({ column }) => (
//       <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
//         Năm
//         <ArrowUpDown size={16} className="ml-2" />
//       </div>
//     ),
//     cell: (info) => <div>{info.getValue()}</div>,
//   }),
//   columnHelper.accessor("month", {
//     header: ({ column }) => (
//       <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
//         Tháng
//         <ArrowUpDown size={16} className="ml-2" />
//       </div>
//     ),
//     cell: (info) => <div>{info.getValue()}</div>,
//   }),
//   columnHelper.accessor("totalCommission", {
//     header: ({ column }) => (
//       <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">
//         Tổng hoa hồng
//         <ArrowUpDown size={16} className="ml-2" />
//       </div>
//     ),
//     cell: (info) => <div>{info.getValue()}</div>,
//   }),
//   columnHelper.accessor("status", {
//     header: "Trạng thái",
//     cell: (info) => <span className={`px-2 py-1 rounded-md text-white ${info.getValue() === "Đã thanh toán" ? "bg-green-500" : "bg-red-500"}`}>{info.getValue()}</span>,
//   }),
//   columnHelper.display({
//     id: "actions",
//     header: "Thao tác",
//     cell: ({ row }) => {
//       const historyItem = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem asChild>
//               <Link to={`/admin/commissions/history/detail/${historyItem.id}?status=${historyItem.status}`}>Chi tiết hoa hồng</Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   }),
// ];

// const CommissionHistory = () => {
//   const [historyData, setHistoryData] = useState([
//     { id: 1, time: "2025-01-01", totalCommission: "1,500,000 VND", status: "Đã thanh toán" },
//     { id: 2, time: "2025-02-05", totalCommission: "2,000,000 VND", status: "Chưa thanh toán" },
//     { id: 3, time: "2025-03-10", totalCommission: "3,200,000 VND", status: "Đã thanh toán" },
//     { id: 4, time: "2025-04-15", totalCommission: "1,750,000 VND", status: "Chưa thanh toán" },
//     { id: 5, time: "2025-05-20", totalCommission: "2,500,000 VND", status: "Đã thanh toán" },
//     { id: 6, time: "2025-06-25", totalCommission: "900,000 VND", status: "Chưa thanh toán" },
//     { id: 7, time: "2025-07-28", totalCommission: "4,000,000 VND", status: "Đã thanh toán" },
//     { id: 8, time: "2025-08-01", totalCommission: "2,800,000 VND", status: "Chưa thanh toán" },
//     { id: 9, time: "2025-09-05", totalCommission: "1,200,000 VND", status: "Đã thanh toán" },
//     { id: 10, time: "2025-10-10", totalCommission: "3,500,000 VND", status: "Chưa thanh toán" },
//   ]);

//   // Chuyển đổi dữ liệu để thêm cột tháng & năm
//   const formattedData = historyData.map((item) => {
//     const { month, year } = extractMonthYear(item.time);
//     return { ...item, month, year };
//   });

//   useEffect(() => {
//     const fetchCommissionHistory = async () => {
//       try {
//         // API call để lấy dữ liệu lịch sử hoa hồng (nếu cần)
//       } catch (error) {
//         console.error("Failed to fetch commission history:", error);
//       }
//     };

//     fetchCommissionHistory();
//   }, []);

//   return <TableComponent title="Lịch sử hoa hồng" columns={columns} data={formattedData} />;
// };

// export default CommissionHistory;

import React, { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import TableComponent from "@/components/common/DataTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const columnHelper = createColumnHelper();

const extractMonthYear = (dateString) => {
  const date = new Date(dateString);
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

const columns = [
  columnHelper.accessor("year", {
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
        Năm
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("month", {
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
        Tháng
        <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("totalCommission", {
    header: "Tổng hoa hồng",
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("status", {
    header: "Trạng thái",
    cell: (info) => <span className={`px-2 py-1 rounded-md text-white ${info.getValue() === "Đã thanh toán" ? "bg-green-500" : "bg-red-500"}`}>{info.getValue()}</span>,
  }),
];

const CommissionManager = () => {
  const [historyData] = useState([
    { id: 1, time: "2025-01-01", totalCommission: "1,500,000 VND", status: "Đã thanh toán" },
    { id: 2, time: "2025-02-05", totalCommission: "2,000,000 VND", status: "Chưa thanh toán" },
    { id: 3, time: "2025-03-10", totalCommission: "3,200,000 VND", status: "Đã thanh toán" },
    { id: 4, time: "2025-04-15", totalCommission: "1,750,000 VND", status: "Chưa thanh toán" },
    { id: 5, time: "2025-05-20", totalCommission: "2,500,000 VND", status: "Đã thanh toán" },
  ]);

  const formattedData = historyData.map((item) => {
    const { month, year } = extractMonthYear(item.time);
    return { ...item, month, year };
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCommission, setSelectedCommission] = useState(null);

  const handleFilter = (e) => {
    e.preventDefault();
    const result = formattedData.find((item) => item.month === +selectedMonth && item.year === +selectedYear);
    setSelectedCommission(result);
  };

  const [detailData] = useState([
    {
      customerName: "Nguyễn Thị B",
      products: [
        { name: "Sữa công thức A+ 900gr", discount: 4, quantitySold: 40, totalRevenue: 6400000 },
        { name: "Ngũ cốc dinh dưỡng vị sô cô la 400gr", discount: 3, quantitySold: 25, totalRevenue: 2500000 },
        { name: "Vitamin tổng hợp trẻ em", discount: 5, quantitySold: 15, totalRevenue: 1800000 },
      ],
    },
    {
      customerName: "Phạm Văn C",
      products: [
        { name: "Sữa chua uống probi", discount: 2, quantitySold: 100, totalRevenue: 3000000 },
        { name: "Sữa bột cho mẹ bầu", discount: 3, quantitySold: 60, totalRevenue: 7200000 },
        { name: "Bột ăn dặm lúa mạch", discount: 2, quantitySold: 45, totalRevenue: 4050000 },
      ],
    },
    {
      customerName: "Lê Thị D",
      products: [
        { name: "Sản phẩm cũ + ngũ cốc 200gr", discount: 5, quantitySold: 80, totalRevenue: 8000000 },
        { name: "Sữa hạt óc chó 180ml", discount: 3, quantitySold: 120, totalRevenue: 9600000 },
        { name: "SP Genomil Gold", discount: 4, quantitySold: 35, totalRevenue: 4550000 },
      ],
    },
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 space-y-8">
      <h2 className="text-2xl font-bold text-[#182F73]">Lịch sử hoa hồng</h2>

      {/* Form lọc */}
      <form className="flex gap-4 items-end ml-5" onSubmit={handleFilter}>
        <div>
          <label className="block text-sm font-medium">Tháng</label>
          <input type="number" min="1" max="12" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border rounded px-2 py-1 w-24" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Năm</label>
          <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border rounded px-2 py-1 w-32" required />
        </div>
        <Button type="submit" className="bg-[#182F73] text-white">
          Lọc
        </Button>
      </form>

      <TableComponent title="Bảng hoa hồng" columns={columns} data={formattedData} />

      {/* Chi tiết hoa hồng */}
      {selectedCommission && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-[#182F73] mb-4">
            Chi tiết hoa hồng - {selectedMonth}/{selectedYear}
          </h3>
          <p className="text-md font-medium mb-2">
            Trạng thái: <span className={selectedCommission.status === "Đã thanh toán" ? "text-green-500" : "text-red-500"}>{selectedCommission.status}</span>
          </p>

          {detailData.map((detail, index) => {
            const totalQuantitySold = detail.products.reduce((sum, p) => sum + p.quantitySold, 0);
            const totalRevenue = detail.products.reduce((sum, p) => sum + p.totalRevenue, 0);
            const totalCommission = detail.products.reduce((sum, p) => sum + p.totalRevenue * (p.discount / 100), 0);

            return (
              <Card key={index} className="mb-4">
                <CardContent className="p-4">
                  <h4 className="text-md font-bold mb-2">{detail.customerName}</h4>
                  <Table className="text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên hàng</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-center">Doanh số</TableHead>
                        <TableHead className="text-center">% CK</TableHead>
                        <TableHead className="text-center">Hoa hồng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.products.map((product, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="text-center">{product.quantitySold}</TableCell>
                          <TableCell className="text-center">{product.totalRevenue.toLocaleString()} VND</TableCell>
                          <TableCell className="text-center">{product.discount}%</TableCell>
                          <TableCell className="text-center">{(product.totalRevenue * (product.discount / 100)).toLocaleString()} VND</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-gray-100">
                        <TableCell>Tổng cộng</TableCell>
                        <TableCell className="text-center">{totalQuantitySold}</TableCell>
                        <TableCell className="text-center">{totalRevenue.toLocaleString()} VND</TableCell>
                        <TableCell className="text-center">-</TableCell>
                        <TableCell className="text-center">{totalCommission.toLocaleString()} VND</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommissionManager;

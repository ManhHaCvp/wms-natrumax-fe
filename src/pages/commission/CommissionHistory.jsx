import React, { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TableComponent from "@/components/common/DataTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const columnHelper = createColumnHelper();

// Data from the API response
const commissionData = {
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
      commissionHistory: {
        commissionHistoryId: 1,
        month: 4,
        year: 2025,
        totalAmount: 2644489.9999999995,
        details: [
          { commissionHistoryDetailId: 1, categoryName: "Sản phẩm cũ + ngũ cốc 200gr", percentage: 10.0, amount: 0.0 },
          { commissionHistoryDetailId: 2, categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", percentage: 20.0, amount: 9312999.999999998 },
          { commissionHistoryDetailId: 3, categoryName: "SP Genumil", percentage: 30.0, amount: 2606299.9999999995 },
        ],
      },
    },
    {
      commissionId: 2,
      referral: {
        userId: 5,
        accountName: "Chi nhánh 107",
        role: "ROLE_BRANCH_OWNER",
        province: "Hải Dương",
      },
      commissionHistory: {
        commissionHistoryId: 2,
        month: 5,
        year: 2025,
        totalAmount: 2644489.9999999995,
        details: [
          { commissionHistoryDetailId: 1, categoryName: "Sản phẩm cũ + ngũ cốc 200gr", percentage: 10.0, amount: 0.0 },
          { commissionHistoryDetailId: 2, categoryName: "Sản phẩm nhóm B, sữa hạt, ngũ cốc 800gr", percentage: 20.0, amount: 9312999.999999998 },
          { commissionHistoryDetailId: 3, categoryName: "SP Genumil", percentage: 30.0, amount: 2606299.9999999995 },
        ],
      },
    },
  ],
};

const columns = [
  columnHelper.accessor("year", {
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
        Năm <ArrowUpDown size={16} className="ml-2" />
      </div>
    ),
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("month", {
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center cursor-pointer">
        Tháng <ArrowUpDown size={16} className="ml-2" />
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
  const [commissionHistory, setCommissionHistory] = useState([]);

  useEffect(() => {
    const commissionHistoryData = commissionData.commissions.map((commission) => ({
      month: commission.commissionHistory.month,
      year: commission.commissionHistory.year,
      totalCommission: commission.commissionHistory.totalAmount.toLocaleString(),
      status: commission.commissionHistory.totalAmount > 0 ? "Đã thanh toán" : "Chưa thanh toán", // Example status based on totalAmount
    }));
    setCommissionHistory(commissionHistoryData);
  }, []);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCommission, setSelectedCommission] = useState(null);

  const handleFilter = (e) => {
    e.preventDefault();
    const result = commissionData.commissions.find((item) => item.commissionHistory.month === +selectedMonth && item.commissionHistory.year === +selectedYear);
    setSelectedCommission(result);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-[#182F73] mb-4">Lịch sử hoa hồng</h2>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Lịch sử giao dịch</TabsTrigger>
          <TabsTrigger value="filter">Chi tiết giao dịch</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <TableComponent title="Bảng hoa hồng" columns={columns} data={commissionHistory} />
        </TabsContent>

        <TabsContent value="filter">
          <form className="flex gap-4 items-end ml-5 mb-6" onSubmit={handleFilter}>
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

          {selectedCommission && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-[#182F73] mb-4">
                Chi tiết hoa hồng - {selectedMonth}/{selectedYear}
              </h3>
              <p className="text-md font-medium mb-2">
                Trạng thái: <span className={selectedCommission.status === "Đã thanh toán" ? "text-green-500" : "text-red-500"}>{selectedCommission.status}</span>
              </p>

              {/* {selectedCommission.commissionHistory.details.map((detail, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="p-4">
                    <h4 className="text-md font-bold mb-2">{detail.categoryName}</h4>
                    <p className="text-sm">Phần trăm: {detail.percentage}%</p>
                    <p className="text-sm">Hoa hồng: {detail.amount.toLocaleString()} VND</p>
                  </CardContent>
                </Card>
              ))} */}
              <div className="space-y-6">
                {commissionData.commissions.map((commission, index) => {
                  const { referral, commissionHistory } = commission;
                  const totalAmount = commissionHistory.totalAmount;

                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">{referral.accountName}</h2>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-1/3">Tên hàng</TableHead>
                              <TableHead className="text-center">Phần trăm</TableHead>
                              <TableHead className="text-right">Hoa hồng</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {commissionHistory.details.map((detail) => (
                              <TableRow key={detail.commissionHistoryDetailId}>
                                <TableCell>{detail.categoryName}</TableCell>
                                <TableCell className="text-center">{detail.percentage}%</TableCell>
                                <TableCell className="text-right">{detail.amount.toLocaleString("vi-VN")} VND</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="font-semibold border-t">
                              <TableCell className="bg-muted">Tổng</TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right text-primary">{totalAmount.toLocaleString("vi-VN")} VND</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {/* Total Commission */}
              <div className="mt-8 text-right pr-6 mb-5">
                <div className="text-xl font-bold text-[#182F73]">
                  Tổng thanh toán: {commissionData.commissions.reduce((acc, curr) => acc + curr.commissionHistory.totalAmount, 0).toLocaleString("vi-VN")} VND
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionManager;

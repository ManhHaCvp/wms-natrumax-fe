import React, { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, Users, Receipt, Calendar as CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { parseISO, getMonth, getYear, format } from "date-fns";
import { Button } from "@/components/ui/button.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import TopProductsSold from "../../components/product/TopProductsSold.jsx";
import ChatInterface from "./ChatInterface.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Clipboard, Repeat, Paperclip, Package, Badge } from "lucide-react";
import DataTable from "@/components/common/DataTable.jsx";
import ViewOrderList from "../order/ViewOrderList.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompareSalesDetail from "./CompareSalesDetail.jsx";

// Date Picker Component
const DatePickerDemo = ({ date, setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={`w-[280px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM yyyy") : <span>Pick a Month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [depotProductsData, setDepotProductsData] = useState([]);
  const [date, setDate] = useState(null); // State for selected date
  const [maxY, setMaxY] = useState(50);
  const [stepSize, setStepSize] = useState(2);

  const recentOrders = [
    { id: 1, orderDate: "19/03/2025", accountName: "Chi nhánh 107", totalAmount: 20000000, status: "Đã thanh toán" },
    { id: 2, orderDate: "19/03/2025", accountName: "Chi nhánh 108", totalAmount: 15000000, status: "Chưa thanh toán" },
    { id: 3, orderDate: "19/03/2025", accountName: "Chi nhánh 109", totalAmount: 18000000, status: "Đã thanh toán" },
    { id: 4, orderDate: "19/03/2025", accountName: "Chi nhánh 110", totalAmount: 22000000, status: "Chưa thanh toán" },
    { id: 5, orderDate: "19/03/2025", accountName: "Chi nhánh 111", totalAmount: 25000000, status: "Đã thanh toán" },
    { id: 6, orderDate: "19/03/2025", accountName: "Chi nhánh 112", totalAmount: 12000000, status: "Chưa thanh toán" },
    { id: 7, orderDate: "19/03/2025", accountName: "Chi nhánh 113", totalAmount: 30000000, status: "Đã thanh toán" },
    { id: 8, orderDate: "19/03/2025", accountName: "Chi nhánh 114", totalAmount: 27000000, status: "Chưa thanh toán" },
    { id: 9, orderDate: "19/03/2025", accountName: "Chi nhánh 115", totalAmount: 19000000, status: "Đã thanh toán" },
    { id: 10, orderDate: "19/03/2025", accountName: "Chi nhánh 116", totalAmount: 23000000, status: "Chưa thanh toán" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/order/all-orders");
        setOrdersData(response.data);
      } catch (error) {
        console.error("Error fetching orders data", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/user/all");
        setUsersData(response.data);
      } catch (error) {
        console.error("Error fetching users data", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/product/get-all-product");
        setProductsData(response.data.products); // Assuming the response structure
      } catch (error) {
        console.error("Error fetching products data", error);
      }
    };

    const fetchDepotProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/depotProduct/get-all-product");
        setDepotProductsData(response.data.productDepots);
      } catch (error) {
        console.error("Error fetching depot products data", error);
      }
    };

    fetchOrders();
    fetchUsers();
    fetchProducts();
    fetchDepotProducts();
  }, []);

  const filterDataByMonth = (data) => {
    if (!date) return data;
    return data.filter((item) => {
      const itemDate = parseISO(item.createdAt);
      return getMonth(itemDate) === getMonth(date) && getYear(itemDate) === getYear(date);
    });
  };

  //Add Datatable
  const recentOrderColumns = [
    {
      header: "Order ID",
      accessorKey: "_id",
      cell: (info) => info.getValue(),
    },
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (info) => info.getValue(),
    },
    {
      header: "Total Price",
      accessorKey: "totalPrice",
      cell: (info) => {
        const value = info.getValue();
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
      },
    },
    {
      header: "Status",
      accessorKey: "orderStatus",
      cell: (info) => <Badge variant={info.getValue() === "completed" ? "success" : "secondary"}>{info.getValue()}</Badge>,
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleString("vi-VN");
      },
    },
  ];

  const filteredOrders = filterDataByMonth(ordersData);
  const filteredDepotProducts = filterDataByMonth(depotProductsData);

  const countRoles = (users) => {
    const counts = { admin: 0, seller: 0, user: 0 };
    users.forEach((user) => {
      if (counts[user.role] !== undefined) {
        counts[user.role]++;
      }
    });
    return counts;
  };

  const roleCounts = countRoles(usersData);
  const roleData = {
    labels: ["Admin", "Seller", "User"],
    datasets: [
      {
        data: [roleCounts.admin, roleCounts.seller, roleCounts.user],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
        hoverOffset: 4,
      },
    ],
  };

  const countOrdersPerMonth = (orders) => {
    const counts = Array(12).fill(0);
    orders.forEach((order) => {
      const month = parseISO(order.createdAt).getMonth();
      counts[month]++;
    });
    return counts;
  };

  const ordersPerMonth = countOrdersPerMonth(filteredOrders);
  const ordersDataChart = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Orders Completed",
        data: ordersPerMonth,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: "blue",
          font: {
            size: 13,
          },
        },
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: maxY,
        ticks: {
          stepSize: stepSize,
        },
      },
    },
  };

  const totalRevenue = filteredOrders.filter((order) => order.orderStatus === "completed").reduce((acc, order) => acc + order.totalPrice, 0);
  const totalImportPrice = filteredDepotProducts.reduce((acc, product) => acc + product.importTotal, 0);

  const profitLoss = totalRevenue - totalImportPrice;
  const profitLossStyle = profitLoss >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold";

  const ordersCount = filteredOrders.length;
  const activeSessions = usersData.length;
  const totalSessions = productsData.length;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="p-4">
      <div className="mb-2 mt-2 p-6 w-full">
        <ChatInterface />
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow border-spacing-6">
          <h2 className="text-lg font-semibold mb-6">KPI Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-2 divide-gray-400 border border-gray-150 rounded-lg">
            {/* Total Marketing Spend */}
            <Card className="border-none shadow-none rounded-none pt-12">
              <CardContent className="flex items-start gap-4 p-0 px-4 min-h-[120px]">
                <div className="bg-pink-100 rounded-full p-3">
                  <DollarSign className="text-pink-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                  <p className="text-2xl font-bold">$192,817</p>
                  <p className="text-green-600 text-sm mt-1">+5.3% vs last month</p>
                </div>
              </CardContent>
            </Card>

            {/* ROI */}
            <Card className="border-none shadow-none rounded-none pt-12">
              <CardContent className="flex items-start gap-4 p-0 px-4 min-h-[120px]">
                <div className="bg-blue-100 rounded-full p-3">
                  <Clipboard className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng số đơn hàng</p>
                  <p className="text-2xl font-bold">270%</p>
                  <p className="text-green-600 text-sm mt-1">+8.1% vs last month</p>
                </div>
              </CardContent>
            </Card>

            {/* Conversion rates */}
            <Card className="border-none shadow-none rounded-none pt-12">
              <CardContent className="flex items-start gap-4 p-0 px-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Repeat className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chi nhánh đặt hàng</p>
                  <p className="text-2xl font-bold">4.5%</p>
                  <p className="text-green-600 text-sm mt-1">+0.9% vs last month</p>
                </div>
              </CardContent>
            </Card>

            {/* Total leads */}
            <Card className="border-none shadow-none rounded-none pt-12">
              <CardContent className="flex items-start gap-4 p-0 px-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <Package className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng số sản phẩm</p>
                  <p className="text-2xl font-bold">1,289</p>
                  <p className="text-green-600 text-sm mt-1">+16.2% vs last month</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">Top 5 Sản Phẩm Nhập Nhiều Nhất</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="px-4 py-2 text-left">Tên</th>
                  <th className="px-4 py-2 text-right">Số lượng</th>
                  <th className="px-4 py-2 text-right">Giá trị</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {[
                  { color: "bg-orange-400", name: "SBPS Special 180 ml/48H", quantity: 200, value: "12.000.000" },
                  { color: "bg-blue-400", name: "SBPS Fatter 180ml", quantity: 200, value: "12.000.000" },
                  { color: "bg-cyan-400", name: "Cốc chia vạch Natrumax", quantity: 200, value: "12.000.000" },
                  { color: "bg-gray-400", name: "Natrumax Fatter 110 ML", quantity: 200, value: "12.000.000" },
                  { color: "bg-rose-400", name: "Sữa hạt Natrumax", quantity: 200, value: "12.000.000" },
                ].map((item, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="flex items-center gap-2 px-4 py-3">
                      <span className={`w-3 h-3 rounded-sm ${item.color}`}></span>
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-right">{item.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">Top 5 Khách Hàng Đặt Nhiều Nhất</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="px-4 py-2 text-left">Tên khách hàng</th>
                  <th className="px-4 py-2 text-right">Số đơn hàng</th>
                  <th className="px-4 py-2 text-right">Tổng giá trị</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {[
                  { name: "Nguyễn Văn A", orders: 25, total: "125.000.000" },
                  { name: "Trần Thị B", orders: 22, total: "98.450.000" },
                  { name: "Lê Văn C", orders: 20, total: "87.300.000" },
                  { name: "Phạm Thị D", orders: 18, total: "75.500.000" },
                  { name: "Đỗ Văn E", orders: 17, total: "69.200.000" },
                ].map((customer, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="px-4 py-3">{customer.name}</td>
                    <td className="px-4 py-3 text-right">{customer.orders}</td>
                    <td className="px-4 py-3 text-right">{customer.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="mb-2 mt-2 p-6 w-full">
        <CompareSalesDetail />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-4 col-span-2">
          <h2 className="text-xl font-bold mb-4">Orders Over Time</h2>
          <Line data={ordersDataChart} options={options} />
          <div className="mt-4">
            <label className="mr-2">Max Y:</label>
            <input type="number" value={maxY} onChange={(e) => setMaxY(Number(e.target.value))} className="border rounded p-1" />
            <label className="ml-4 mr-2">Step Size:</label>
            <input type="number" value={stepSize} onChange={(e) => setStepSize(Number(e.target.value))} className="border rounded p-1" />
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 col-span-1">
          <h2 className="text-xl font-bold mb-4">User Roles Distribution</h2>
          <Pie data={roleData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

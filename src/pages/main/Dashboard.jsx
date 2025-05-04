import React, { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, Clipboard, Repeat, Package } from "lucide-react";
import { format, parseISO, getMonth, getYear } from "date-fns";
import { Button } from "@/components/ui/button.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ChatInterface from "./ChatInterface.jsx";
import CompareSalesDetail from "./CompareSalesDetail.jsx";

const DatePickerDemo = ({ date, setDate }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" className={`w-[280px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}>
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM yyyy") : <span>Pick a Month</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
    </Popover>
);

const Dashboard = () => {
    const [ordersData, setOrdersData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [depotProductsData, setDepotProductsData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [date, setDate] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [orders, users, products, depotProducts, topCust, topProd] = await Promise.all([
                    axios.get("/api/order/all-orders"),
                    axios.get("/api/user/all"),
                    axios.get("/api/product/get-all-product"),
                    axios.get("/api/depotProduct/get-all-product"),
                    axios.get("/api/customer/top"), // replace with real endpoint
                    axios.get("/api/product/top-imported"), // replace with real endpoint
                ]);
                setOrdersData(Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.orders || []);
                setUsersData(users.data);
                setProductsData(products.data.products);
                setDepotProductsData(depotProducts.data.productDepots);
                setTopCustomers(topCust.data);
                setTopProducts(topProd.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchAllData();
    }, []);

    const filterByMonth = (data) => {
        if (!Array.isArray(data)) return [];
        if (!date) return data;

        return data.filter(d => {
            const dt = parseISO(d.createdAt);
            return getMonth(dt) === getMonth(date) && getYear(dt) === getYear(date);
        });
    };

    const filteredOrders = filterByMonth(ordersData);
    const filteredDepots = filterByMonth(depotProductsData);
    const totalRevenue = filteredOrders.filter(o => o.orderStatus === "completed").reduce((a, b) => a + b.totalPrice, 0);
    const totalImport = filteredDepots.reduce((a, b) => a + b.importTotal, 0);
    const profitLoss = totalRevenue - totalImport;

    return (
        <div className="m-5 space-y-5">
            <ChatInterface />
            <Card className="rounded-lg p-5 space-y-10">
                <h2 className="text-lg font-semibold mb-3">KPI Summary</h2>
                <div className="flex justify-around items-center pb-5">
                    {[
                        { className: "bg-pink-100", icon: <DollarSign className="text-pink-600" size={20} />, label: "Tổng doanh thu", value: totalRevenue },
                        { className: "bg-blue-100", icon: <Clipboard className="text-blue-600" size={20} />, label: "Số đơn hàng", value: filteredOrders.length },
                        { className: "bg-green-100", icon: <Repeat className="text-green-600" size={20} />, label: "Chi nhánh đặt hàng", value: new Set(filteredOrders.map(o => o.customerName)).size },
                        { className: "bg-purple-100", icon: <Package className="text-purple-600" size={20} />, label: "Tổng sản phẩm", value: productsData.length },
                    ].map((item, i) => (
                        <Card key={i} className="border-none shadow-none rounded-none">
                            <CardContent className="flex items-start gap-4 p-0 px-4">
                                <div className={`${item.className} rounded-full p-3`}>{item.icon}</div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Top Sản Phẩm Nhập</CardTitle></CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow><TableHead>Tên</TableHead><TableHead className="text-right">Số lượng</TableHead><TableHead className="text-right">Giá trị</TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {topProducts.map((p, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell className="text-right">{p.quantity.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{p.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-lg">Top Khách Hàng</CardTitle></CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow><TableHead>Tên KH</TableHead><TableHead className="text-right">Đơn hàng</TableHead><TableHead className="text-right">Tổng</TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {topCustomers.map((c, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell className="text-right">{c.orders}</TableCell>
                                        <TableCell className="text-right">{c.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <CompareSalesDetail />
        </div>
    );
};

export default Dashboard;
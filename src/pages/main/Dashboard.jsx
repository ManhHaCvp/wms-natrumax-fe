import React, {useState, useEffect} from "react";
import axios from "axios";
import {DollarSign, Clipboard, Repeat, Package} from "lucide-react";
import {format, parseISO, getMonth, getYear} from "date-fns";
import {Button} from "@/components/ui/button.jsx";
import {Calendar} from "@/components/ui/calendar.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import ChatInterface from "./ChatInterface.jsx";
import CompareSalesDetail from "./CompareSalesDetail.jsx";
import orderService from "@/services/orderService.jsx";
import userService from "@/services/userService.jsx";
import productService from "@/services/productService.jsx";
import reportService from "@/services/reportService.jsx";
import toast from "react-hot-toast";
import {formatCurrency} from "@/utils/formatCurrency.jsx";

const Dashboard = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [userDetail, setUserDetail] = useState(null);
    const [warehouse, setWarehouse] = useState(null);

    const fetchWarehouses = async () => {
        if (!user?.id) return;
        try {
            const result = await userService.getById(user.id);
            setUserDetail(result);

            const memberWarehouse = result.userWarehouses.find((uw) => uw.roleInWarehouse === "Member");
            setWarehouse(memberWarehouse?.warehouse);
        } catch (error) {
            toast.error("Failed to fetch warehouses");
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const [ordersData, setOrdersData] = useState([]);
    const [membersData, setMembersData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [topProductsData, setTopProductsData] = useState([]);
    const [topCustomersData, setTopCustomersData] = useState([]);
    const [date, setDate] = useState(new Date());

    const fetchAllData = async () => {
        try {
            const [orders, members, products, topProducts, topCustomers] = await Promise.all([
                orderService.getByUserId(userDetail.id),
                userService.getMembersByWarehouseId(warehouse.warehouseId),
                productService.getByWarehouseId(warehouse.warehouseId),
                reportService.getTopImported(),
                reportService.getTopUserOrder(),
            ]);

            setOrdersData(Array.isArray(orders) ? orders : []);
            setMembersData(Array.isArray(members) ? members : []);
            setProductsData(Array.isArray(products) ? products : []);
            setTopProductsData(Array.isArray(topProducts) ? topProducts : []);
            setTopCustomersData(Array.isArray(topCustomers) ? topCustomers : []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        if (userDetail?.id && warehouse?.warehouseId) {
            fetchAllData();
        }
    }, [userDetail, warehouse]);

    const filterByMonth = (data) => {
        if (!Array.isArray(data)) return [];

        const now = date || new Date(); // nếu chưa chọn tháng, dùng tháng hiện tại

        return data.filter(d => {
            if (!d?.orderDate) return false;
            try {
                const dt = parseISO(d.orderDate);
                return getMonth(dt) === getMonth(now) && getYear(dt) === getYear(now);
            } catch (e) {
                console.warn("Invalid date:", d.orderDate);
                return false;
            }
        });
    };

    const filteredOrders = filterByMonth(ordersData);
    const totalRevenue = filteredOrders.filter(o => o.status === "DELIVERED").reduce((a, b) => a + (b.totalAmount || 0), 0);

    return (
        <div className="m-5 space-y-5">
            {userDetail?.id && warehouse?.warehouseId && (
                <ChatInterface userId={userDetail.id} warehouseId={warehouse.warehouseId}/>
            )}
            <Card className="rounded-lg p-5 space-y-10">
                <h2 className="text-lg font-semibold mb-3">KPI Summary</h2>
                <div className="flex justify-around items-center pb-5">
                    {[
                        {
                            className: "bg-pink-100",
                            icon: <DollarSign className="text-pink-600" size={20}/>,
                            label: "Tổng giá trị đơn hàng",
                            value: totalRevenue
                        },
                        {
                            className: "bg-blue-100",
                            icon: <Clipboard className="text-blue-600" size={20}/>,
                            label: "Số đơn hàng",
                            value: filteredOrders?.length || 0
                        },
                        {
                            className: "bg-green-100",
                            icon: <Repeat className="text-green-600" size={20}/>,
                            label: "Số lượng thành viên kho",
                            value: membersData.length || 0
                        },
                        {
                            className: "bg-purple-100",
                            icon: <Package className="text-purple-600" size={20}/>,
                            label: "Tổng sản phẩm",
                            value: productsData?.length || 0
                        },
                    ].map((item, i) => (
                        <Card key={i} className="border-none shadow-none rounded-none">
                            <CardContent className="flex items-start gap-4 p-0 px-4">
                                <div className={`${item.className} rounded-full p-3`}>{item.icon}</div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="text-2xl font-bold">{(item.value ?? 0).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Top 5 Sản Phẩm Nhập</CardTitle></CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên</TableHead>
                                    <TableHead className="text-right">Số lượng</TableHead>
                                    <TableHead className="text-right">Giá trị</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(topProductsData || []).map((p, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{p.productName}</TableCell>
                                        <TableCell
                                            className="text-right">{p.totalQuantity || 0}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(p.price || 0)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-lg">Top 5 Khách Hàng</CardTitle></CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên KH</TableHead>
                                    <TableHead className="text-right">Đơn hàng</TableHead>
                                    <TableHead className="text-right">Tổng</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(topCustomersData || []).map((c, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{c.accountName}</TableCell>
                                        <TableCell
                                            className="text-right">{c.orderCount || 0}</TableCell>
                                        <TableCell
                                            className="text-right">{formatCurrency(c.totalValue || 0)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/*<CompareSalesDetail/>*/}
        </div>
    );
};

export default Dashboard;
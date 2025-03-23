import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Ban, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentHistory from "@/components/user/OrderHistory";
import Wallet from "@/components/user/Wallet";
import Commission from "@/components/user/Commission";
import Promotion from "@/components/user/Promotion";
import ApiConnection from "@/components/user/ApiConnection";
import userService from "@/services/userService";

export default function ViewUserDetail() {
  const [user, setUser] = useState({
    id: 1,
    accountName: "admin",
    phoneNumber: "0812497838",
    email: "admin@example.com",
    address: "Admin Street, City",
    province: "Hai Duong",
    status: true,
    role: "ROLE_ADMIN",
    retailer: "haiyenhd",
    clientId: "ba477a2c4a9f-4be8-9996-f7cdf2b46119",
    clientSecret: "7FFDE6E9FD05CAEB74660BC170B2C6C9F0808119"
  });

  const { id } = useParams("id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await userService.getUserById(id, setUser);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUserData().catch(console.error);
  }, []);

  const navigate = useNavigate();

  const handleNavigate = (url) => {
    navigate(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col m-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[#182F73] text-3xl font-bold">Danh sách người dùng</h1>
        <div>
          <Button variant="destructive"><Ban />Vô hiệu hóa</Button>
        </div>
      </div>
      <div className="flex">
        <Card className="bg-[#f8fafc] w-2/6 h-fit p-5">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-semibold">{user.accountName}</div>
              <CardDescription>{user.role}</CardDescription>
            </div>
            <Button variant="outline"><Link to={`/admin/user/update/${user.id}`}><Pencil /></Link></Button>
          </div>
          <div className="space-y-2 pt-7">
            <p className="font-semibold pb-3">
              <span className="text-muted-foreground">Số điện thoại</span><br/>{user.phoneNumber}
            </p>
            <p className="font-semibold pb-3">
              <span className="text-muted-foreground">Email</span><br/>{user.email}
            </p>
            <p className="font-semibold pb-3">
              <span className="text-muted-foreground">Địa chỉ</span><br/>{user.address}
            </p>
            <div className="flex justify-between items-center">
              <p className="font-semibold pb-3">
                <span className="text-muted-foreground">Mật khẩu</span><br/>*******
              </p>
              <Link to="/admin/user/change-password" className="text-[#182F73] hover:text-[#12245C]">Thay đổi</Link>
            </div>
            <div className="font-semibold">
              <p className="text-muted-foreground">Trạng thái</p>
              <Badge className="bg-green-600 rounded">Hoạt động</Badge>
            </div>
          </div>
        </Card>
        <Tabs defaultValue="order-history" className="w-full ms-5">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="order-history">Lịch sử đặt hàng</TabsTrigger>
            <TabsTrigger value="wallet">Ví</TabsTrigger>
            <TabsTrigger value="commission">Hoa hồng</TabsTrigger>
            <TabsTrigger value="promotion">Khuyến mại</TabsTrigger>
            <TabsTrigger value="api-connection">Kết nối API</TabsTrigger>
          </TabsList>
          <TabsContent value="order-history">
            <Card className="bg-[#f8fafc]">
              <PaymentHistory />
            </Card>
          </TabsContent>
          <TabsContent value="wallet">
            <Card className="bg-[#f8fafc]">
              <Wallet />
            </Card>
          </TabsContent>
          <TabsContent value="commission">
            <Card className="bg-[#f8fafc]">
              <Commission />
            </Card>
          </TabsContent>
          <TabsContent value="promotion">
            <Card className="bg-[#f8fafc]">
              <Promotion />
            </Card>
          </TabsContent>
          <TabsContent value="api-connection">
            <Card className="bg-[#f8fafc]">
              <ApiConnection retailer={user.retailer} clientId={user.clientId} clientSecret={user.clientSecret} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

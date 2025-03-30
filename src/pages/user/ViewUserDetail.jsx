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

const ViewUserDetail = () => {
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
        await userService.getById(id, setUser);
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
        <h1 className="text-[#182F73] text-3xl font-bold">Thông tin người dùng</h1>
        <div>
          <Button asChild><Link to={`/admin/user/update/${user.id}`}><Pencil />Sửa</Link></Button>
          <Button variant="destructive" className="ms-3"><Ban />Vô hiệu hóa</Button>
        </div>
      </div>
      <div className="flex">
        <Card className="w-2/6 h-fit p-5">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-semibold">{user.accountName}</div>
              <CardDescription>{user.role}</CardDescription>
            </div>
            <Button variant="outline" asChild><Link to={`/admin/user/update/${user.id}`}><Pencil /></Link></Button>
          </div>
          <div className="font-semibold grid grid-cols-1 gap-5 mt-7">
            <div>
              <p className="text-muted-foreground">Số điện thoại</p>{user.phoneNumber}
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>{user.email}
            </div>
            <div>
              <p className="text-muted-foreground">Địa chỉ</p>{user.address}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground">Mật khẩu</p>*******
              </div>
              <Link to="/admin/user/change-password" className="text-[#182F73] hover:text-[#12245C]">Thay đổi</Link>
            </div>
            <div>
              <p className="text-muted-foreground">Trạng thái</p>
              {user.status ? (
                <Badge>Hoạt động</Badge>
              ) : (
                <Badge variant="destructive">Bị khóa</Badge>
              )}
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
            <Card>
              <PaymentHistory />
            </Card>
          </TabsContent>
          <TabsContent value="wallet">
            <Card>
              <Wallet />
            </Card>
          </TabsContent>
          <TabsContent value="commission">
            <Card>
              <Commission />
            </Card>
          </TabsContent>
          <TabsContent value="promotion">
            <Card>
              <Promotion />
            </Card>
          </TabsContent>
          <TabsContent value="api-connection">
            <Card>
              <ApiConnection retailer={user.retailer} clientId={user.clientId} clientSecret={user.clientSecret} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewUserDetail;
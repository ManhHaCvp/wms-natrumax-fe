import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/common/InputField.jsx";
import userService from "@/services/userService.jsx";

const UpdateUser = () => {
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

  return (
    <div className="flex flex-col m-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[#182F73] text-3xl font-bold">Sửa thông tin người dùng</h1>
        <div>
          <Button variant="default" content=""><Check />Lưu</Button>
          <Button variant="destructive" className="ms-3"><Ban />Vô hiệu hóa</Button>
        </div>
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <InputField label="Tên tài khoản" value={user.accountName} onChange={(e) => setUser({ ...user, accountName: e.target.value })} />
          <InputField label="Role" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} />
          <InputField label="Số điện thoại" value={user.phoneNumber} onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} />
          <InputField label="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <InputField label="Địa chỉ" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} />
          <InputField label="Tỉnh" value={user.province} onChange={(e) => setUser({ ...user, province: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kết nối API</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <InputField label="Retailer" value={user.retailer} onChange={(e) => setUser({ ...user, retailer: e.target.value })} />
          <InputField label="Client ID" value={user.clientId} onChange={(e) => setUser({ ...user, clientId: e.target.value })} />
          <InputField label="Client Secret" value={user.clientSecret} onChange={(e) => setUser({ ...user, clientSecret: e.target.value })} className="col-span-2" />
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateUser;
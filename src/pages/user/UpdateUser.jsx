import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/common/InputField.jsx";
import userService from "@/services/userService.jsx";
import provinceService from "@/services/provinceService";

const UpdateUser = () => {
  const [user, setUser] = useState({
    // id: 1,
    // accountName: "admin",
    // phoneNumber: "0812497838",
    // email: "admin@example.com",
    // address: "Admin Street, City",
    // province: "Hai Duong",
    // status: true,
    // role: "ROLE_ADMIN",
    // retailer: "haiyenhd",
    // clientId: "ba477a2c4a9f-4be8-9996-f7cdf2b46119",
    // clientSecret: "7FFDE6E9FD05CAEB74660BC170B2C6C9F0808119"
  });
  const { id } = useParams("id");
  const [provinces, setProvinces] = useState([]);
  const [apiConnection,setApiConnection] = useState({});
  const [data,setData] = useState({});


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userService.getById(id, setUser);
        console.log(data);
        setData(data);
        setApiConnection(JSON.parse(data.detail));
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData().catch(console.error);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      // Lấy danh sách tỉnh từ API
      const fetchedProvinces = await provinceService.getAll();
      setProvinces(fetchedProvinces);
    };

    fetchData();
  }, []);

  // Hàm gọi API update khi nhấn nút Lưu
  const handleSave = async () => {
    try {
      const payload = {
        userId: user.id,
        accountName: user.accountName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        retailer: apiConnection.retailer,
        clientId: apiConnection.client_id,
        clientSecret: apiConnection.client_secret,
        provinceId: user.province?.provinceId,
        roleId: user.role.id
      };
      // console.log(user.province);
      // Cập nhật thông tin người dùng với tỉnh thành đã chọn
      await userService.update(payload);
      // alert("Cập nhật thành công!");
      // Hoặc bạn có thể chuyển hướng hoặc hiển thị toast thành công
    } catch (error) {
      console.error("Cập nhật thất bại", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  // Hàm xử lý khi người dùng thay đổi tỉnh thành
  const handleProvinceChange = (e) => {
    const selectedProvince = provinces.find(
      (p) => String(p.provinceId) === e.target.value
    );
    console.log(selectedProvince);
    setUser({ ...user, province: selectedProvince });
  };
  

  return (
    <div className="flex flex-col m-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[#182F73] text-3xl font-bold">Sửa thông tin người dùng</h1>
        <div>
          <Button variant="default" onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" /> Lưu
          </Button>
          <Button variant="destructive" className="ms-3">
            <Ban className="mr-2 h-4 w-4" /> Vô hiệu hóa
          </Button>
        </div>
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        {/* <span>{user.wallet.wallet}</span> */}
        <CardContent className="grid grid-cols-2 gap-3">
          <InputField
            label="Tên tài khoản"
            value={user.accountName}
            onChange={(e) => setUser({ ...user, accountName: e.target.value })}
          />
          <InputField
            label="Role"
            value={user.role?.name || ""}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          />
          <InputField
            label="Số điện thoại"
            value={user.phoneNumber}
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          />
          <InputField
            label="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <InputField
            label="Địa chỉ"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
          />
          {/* Thay thế InputField cho tỉnh thành bằng thẻ select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tỉnh thành</label>
            <select
              value={user.province?.provinceId}
              onChange={handleProvinceChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>Chọn tỉnh</option>
              {provinces.map((province) => (
                <option key={province.provinceId} value={province.provinceId}>
                  {province.provinceName}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kết nối API</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <InputField
            label="Retailer"
            value={apiConnection.retailer}
            onChange={(e) => setApiConnection({ ...apiConnection, retailer: e.target.value })}
          />
          <InputField
            label="Client ID"
            value={apiConnection.client_id}
            onChange={(e) => setApiConnection({ ...apiConnection, client_id: e.target.value })}
          />
          <InputField
            label="Client Secret"
            value={apiConnection.client_secret}
            onChange={(e) => setApiConnection({ ...apiConnection, client_secret: e.target.value })}
            className="col-span-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateUser;

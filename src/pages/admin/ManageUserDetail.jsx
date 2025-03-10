import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PaymentHistory from "@/components/admin/PaymentHistory";

export default function ManageUserDetail() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token;

        if (!token) {
          console.error("Không tìm thấy token, vui lòng đăng nhập lại!");
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setUser(response.data); // Lưu toàn bộ dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      }
    };

    fetchUserData();
  }, [id]);

  if (!user) return <p>Đang tải dữ liệu...</p>; // Xử lý khi chưa có dữ liệu

  return (
    <form className="flex">
      {/* Thông tin cơ bản */}
      <Card className="w-4/12 h-full m-4 bg-[#F5F6FA]">
        <CardHeader className="text-xl font-bold text-center">{user.fullName || "Chưa có tên"}</CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-700 mb-3">
              📞 <strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}
            </p>
            <p className="text-gray-700 mb-3">
              🏠 <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}
            </p>
            <div>
              <strong>Trạng thái: </strong>
              <Badge variant="outline bg-green">{user.status ? "Hoạt động" : "Bị khóa"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab chi tiết */}
      <Card className="w-8/12 m-4">
        <Tabs defaultValue="history-payment" className="w-[800px]">
          <TabsList className="border-b">
            <TabsTrigger value="history-payment">Lịch sử thanh toán</TabsTrigger>
            <TabsTrigger value="wallet">Ví</TabsTrigger>
            <TabsTrigger value="commission">Hoa hồng</TabsTrigger>
            <TabsTrigger value="api">Kết nối API</TabsTrigger>
          </TabsList>

          <TabsContent value="history-payment">
            <PaymentHistory />
          </TabsContent>
          <TabsContent value="wallet">Ví</TabsContent>
          <TabsContent value="commission">Hoa hồng</TabsContent>
          <TabsContent value="api">
            <div className="p-4 bg-gray-100 rounded-lg max-w-lg mt-1">
              <div className="mb-1 flex justify-start">
                <p className="text-gray-500 w-24">Retailer</p>
                <p className="font-mono text-gray-800 ml-4">{user.retailer || "Chưa cập nhật"}</p>
              </div>

              <div className="mb-1 flex justify-start">
                <p className="text-gray-500 w-24">Client ID</p>
                <p className="font-mono text-gray-800 break-all ml-4">{user.clientId || "Chưa có"}</p>
              </div>

              <div className="mb-1 flex justify-start">
                <p className="text-gray-500 w-24">Client Secret</p>
                <p className="font-mono text-gray-800 break-all ml-4">{user.clientSecret || "Chưa có"}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  );
}

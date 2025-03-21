import { useState, useEffect } from "react";
import axios from "axios";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PaymentHistory from "@/components/user/PaymentHistory.jsx";
import DiscountList from "@/components/discount/DiscountList.jsx";
import userService from "@/services/userService.jsx";
export default function ViewUserDetail() {
  const [user, setUser] = useState({
    name: "",
    role: "",
    phoneNumber: "",
    email: "",
    address: "",
    status: "",
  });
  const navigate = useNavigate();
  const goBack = () => {
    navigate(`/admin/users`);
  };
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <form className="flex">
      <Card className="w-4/12 h-fit m-4 bg-[#F5F6FA]">
        <CardHeader className="text-xl font-bold text-center">{user.name}</CardHeader>
        <CardContent>
          <div className="space-y-2 ">
            <p className="text-gray-700 mb-3">
              📞 <strong>Số điện thoại:</strong> {user.phoneNumber}
            </p>
            <p className="text-gray-700 mb-3">
              🏠 <strong>Địa chỉ:</strong> {user.address}
            </p>
            <div>
              <strong>Trạng thái: </strong>
              <Badge variant="outline">{user.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-8/12 m-4">
        <Tabs defaultValue="history-payment" className="w-[800px]">
          <TabsList className="border-b">
            <TabsTrigger
              value="history-payment"
              className="relative data-[state=active]:after:absolute data-[state=active]:after:content-[''] data-[state=active]:after:w-full data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-500 data-[state=active]:after:bottom-0"
            >
              Lịch sử thanh toán
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="relative data-[state=active]:after:absolute data-[state=active]:after:content-[''] data-[state=active]:after:w-full data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-500 data-[state=active]:after:bottom-0"
            >
              Ví
            </TabsTrigger>
            <TabsTrigger
              value="commission"
              className="relative data-[state=active]:after:absolute data-[state=active]:after:content-[''] data-[state=active]:after:w-full data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-500 data-[state=active]:after:bottom-0"
            >
              Hoa hồng
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="relative data-[state=active]:after:absolute data-[state=active]:after:content-[''] data-[state=active]:after:w-full data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-5500 data-[state=active]:after:bottom-0"
            >
              Kết nối API
            </TabsTrigger>
            <TabsTrigger
              value="discount"
              className="relative data-[state=active]:after:absolute data-[state=active]:after:content-[''] data-[state=active]:after:w-full data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-5500 data-[state=active]:after:bottom-0"
            >
              Chính sách giảm giá
            </TabsTrigger>
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
                <p className="font-mono text-gray-800 ml-4">haiyenhd</p>
              </div>

              <div className="mb-1 flex justify-start">
                <p className="text-gray-500 w-24">Client ID</p>
                <p className="font-mono text-gray-800 break-all ml-4">7FFDE6E9FD05CAEB74660BC170B26C69F0808119</p>
              </div>

              <div className="mb-1 flex justify-start">
                <p className="text-gray-500 w-24">Client Secret</p>
                <p className="font-mono text-gray-800 break-all ml-4">7FFDE6E9FD05CAEB74660BC170B26C69F0808119</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="discount">
            <DiscountList />
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  );
}

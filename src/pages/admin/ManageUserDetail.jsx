import { useState, useEffect } from "react";
import axios from "axios";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function ManageUserDetail() {
  const [user, setUser] = useState({
    name: "",
    role: "",
    refreshToken: "",
    email: "",
    shippingAddress: [],
  });
  const navigate = useNavigate();
  const goBack = () => {
    navigate(`/admin/users`);
  };
  const { id } = useParams("id");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/user/detail/${id}`);
        const data = response.data;
        setUser({
          name: data.name,
          role: data.role.name,
          refreshToken: data.refreshToken == null ? "X" : data.refreshToken,
          email: data.email,
          shippingAddress: data.shippingAddress,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
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
      <Card className="w-4/12 h-full m-4 bg-[#F5F6FA]">
        <CardHeader>
          <CardTitle className="flex">
            <button type="button" onClick={goBack} className="ml-auto text-sm font-semibold leading-6 text-gray-400 bg-white hover:bg-gray-50 py-1 px-2 border border-gray-200 rounded-full shadow">
              <Pencil className="w-5 h-5" />
            </button>
          </CardTitle>

          <CardTitle className="text-center">Tên tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-gray-600">Số điện thoại</p>
          <input className="font-semibold" value={"12346"} />
        </CardContent>

        <CardContent>
          <p className="font-semibold text-gray-600">Địa chỉ</p>
          <input className="font-semibold" value={"Hải Dương"} />
        </CardContent>
        <CardContent>
          <p className="font-semibold text-gray-600">Trạng thái</p>
          <div className="px-2 py-1 padd bg-red-500 text-white  inline-block rounded text-sm">
            <p>Hoạt động</p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-8/12 m-4">
        <Tabs defaultValue="account" className="w-[400px]">
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
              className="relative data-[state=active]:after:absolute data-[state=active]:after:content-[''] data-[state=active]:after:w-full data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-500 data-[state=active]:after:bottom-0"
            >
              Kết nối API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history-payment">Lịch sử thanh toán</TabsContent>
          <TabsContent value="wallet">Ví</TabsContent>
          <TabsContent value="commission">Hoa hồng</TabsContent>
          <TabsContent value="api">
            <div className="p-4 bg-gray-100 rounded-lg max-w-md">
              <div className="mb-2 grid grid-cols-2 gap-4">
                <p className="text-gray-500">Retailer</p>
                <p className="font-mono text-gray-800 text-left">haiyenhd</p>
              </div>

              <div className="mb-2 grid grid-cols-2 gap-4">
                <p className="text-gray-500 whitespace-nowrap">Client ID</p>
                <p className="font-mono text-gray-800 text-left">7FFDE6E9FD05CAEB74660BC170B26C69F0808119</p>
              </div>

              <div className="mb-2 grid grid-cols-2 gap-4">
                <p className="text-gray-500 whitespace-nowrap">Client Secret</p>
                <p className="font-mono text-gray-800 text-left">7FFDE6E9FD05CAEB74660BC170B26C69F0808119</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  );
}

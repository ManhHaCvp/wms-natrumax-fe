import { Pencil, Ban } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";

const handleEditProduct = (productId) => {
  navigate(`/admin/products/edit/${productId}`);
};

export default function ViewProductDetail() {
  return (
    <div className="p-8">
      {/* Form Action */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#182F73]">Thông tin hàng hóa</h1>
        <div className="flex gap-4">
          <Button onClick={handleEditProduct} className="flex items-center gap-2 bg-[#1A2B68] text-white rounded-lg">
            <Pencil size={16} />
            Sửa
          </Button>
          <Button className="flex items-center gap-2 bg-red-600 text-white rounded-lg">
            <Ban size={16} />
            Vô hiệu hóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1 flex flex-col items-center justify-center p-6">
          <div className="w-68 h-68 bg-gray-200 rounded-md">
            <img src="https://natrumax.com/wp-content/uploads/2021/11/SPECAL.jpg" alt="Tên hàng hóa" className="w-full h-full object-cover rounded-md" />
          </div>
          <p className="mt-4 text-lg font-semibold">Tên hàng hóa</p>
        </Card>

        {/* Form product Information */}
        <Card className="col-span-2 p-6">
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Mã hàng</p>
              <p className="font-medium">8938540687462</p>
            </div>
            <div>
              <p className="text-gray-500">Mã MISA</p>
              <p className="font-medium">NA.01</p>
            </div>
            <div>
              <p className="text-gray-500">Nhóm hàng</p>
              <p className="font-medium">SP Genumil</p>
            </div>
            <div>
              <p className="text-gray-500">Đơn vị</p>
              <p className="font-medium">Hộp</p>
            </div>
            <div>
              <p className="text-gray-500">Giá gốc</p>
              <p className="font-medium">800,000 VNĐ</p>
            </div>
            <div>
              <p className="text-gray-500">Giá chiết khấu (40%)</p>
              <p className="font-medium">400,000 VNĐ</p>
            </div>
            <div>
              <p className="text-gray-500">Số lượng</p>
              <p className="font-medium">20</p>
            </div>
            <div>
              <p className="text-gray-500">Khuyến mãi</p>
              <p className="font-medium">Mua 6 tặng 1</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Mô tả</p>
              <p className="font-medium">Mô tả...</p>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <p className="text-gray-500">Trạng thái:</p>
              <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">Hoạt động</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-10 text-xs text-gray-500 text-center">Copyright © 2025 Natraumax All rights reserved. | Điều khoản dịch vụ | Chính sách bảo mật</footer>
    </div>
  );
}

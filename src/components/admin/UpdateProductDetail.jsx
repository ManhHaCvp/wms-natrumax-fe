import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Ban, Upload, Save } from "lucide-react";
import { useState } from "react";

export default function UpdateProductDetail() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        {/* Form Action */}
        <h1 className="text-2xl font-bold text-[#182F73]">Sửa thông tin hàng hóa</h1>
        <div className="flex gap-4">
          <Button className="flex items-center gap-2 bg-[#1A2B68] text-white rounded-lg">
            <Save size={16} /> Lưu
          </Button>
          <Button className="flex items-center gap-2 bg-red-600 text-white rounded-lg">
            <Ban size={16} /> Vô hiệu hóa
          </Button>
        </div>
      </div>

      {/* File reader Imange */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1 flex flex-col items-center justify-center p-6">
          <div className="w-80 h-80 bg-gray-200 rounded-md mb-4">{selectedImage && <img src={selectedImage} alt="Product" className="w-full h-full object-cover rounded-md" />}</div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="upload-image" />
          <label htmlFor="upload-image" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
            <Upload size={16} /> Tải ảnh lên
          </label>
        </Card>

        {/* Form Informaion */}
        <Card className="col-span-2 p-6">
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Tên hàng hóa</p>
              <Input defaultValue="Tên hàng hóa" />
            </div>
            <div>
              <p className="text-gray-500">Mã hàng</p>
              <Input defaultValue="8938540687462" disabled />
            </div>
            <div>
              <p className="text-gray-500">Mã MISA</p>
              <Input defaultValue="NA.01" />
            </div>
            <div>
              <p className="text-gray-500">Chiết khấu</p>
              <Input defaultValue="40%" />
            </div>
            <div>
              <p className="text-gray-500">Khuyến mãi (Số lượng mua để nhận khuyến mãi)</p>
              <Input defaultValue="6" />
            </div>
            <div>
              <p className="text-gray-500">Nhóm hàng</p>
              <Input defaultValue="SP Genumil" />
            </div>
            <div>
              <p className="text-gray-500">Đơn vị</p>
              <Input defaultValue="Hộp" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

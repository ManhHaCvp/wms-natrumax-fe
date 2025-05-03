import React, { useEffect, useState } from "react";
import { Ban, Upload, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import InputField from "@/components/common/InputField.jsx";
import productService from "@/services/ProductService.jsx";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams();

  const [data, setData] = useState({
    id: 1,
    image: "https://natrumax.com/wp-content/uploads/2020/03/curcumin.jpg",
    barcode: "8938540687295",
    misaCode: "NA.8",
    name: "Natrumax Curcumin 800gr",
    category: "Sản phẩm cũ + ngũ cốc 200gr",
    unit: "Hộp",
    basePrice: 850000,
    discount: 40,
    stock: 100,
    quantityToGetPromotion: 0,
    description: "Natrumax Curcumin 800gr",
    status: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await productService.getById(id, setData);
      } catch (error) {
        toast.error("Failed to fetch category:", error);
      }
    };

    fetchUserData().catch(console.error);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Thông tin hàng hóa</h1>
        <div>
          <Button><Check />Lưu</Button>
          <Button variant="destructive" className="ms-3"><Ban />Vô hiệu hóa</Button>
        </div>
      </div>

      <div className="flex space-x-5">
        <Card className="flex flex-col items-center justify-center w-fit h-fit p-5">
          <div className="bg-sidebar-border w-80 h-80 rounded mb-3">
            {data.image &&
              <img src={data.image} alt="Data" className="w-full h-full object-cover rounded-md" />
            }
          </div>
          <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="upload-image" />
          <Button asChild>
            <label htmlFor="upload-image">
              <Upload /> Tải ảnh lên
            </label>
          </Button>
        </Card>

        {/* Form data Information */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <InputField label="Tên hàng hóa" className="col-span-2" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            <InputField label="Mã hàng" value={data.barcode} onChange={(e) => setData({ ...data, barcode: e.target.value })} />
            <InputField label="Mã MISA" value={data.misaCode} onChange={(e) => setData({ ...data, misaCode: e.target.value })} />
            <InputField label="Nhóm hàng" value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} />
            <InputField label="Đơn vị" value={data.unit} onChange={(e) => setData({ ...data, unit: e.target.value })} />
            <InputField label="Giá gốc" value={data.basePrice} onChange={(e) => setData({ ...data, basePrice: e.target.value })} />
            <InputField label="Chiết khấu" value={data.discount} onChange={(e) => setData({ ...data, discount: e.target.value })} />
            <InputField label="Số lượng" value={data.stock} onChange={(e) => setData({ ...data, stock: e.target.value })} />
            <InputField label="Khuyến mại (Số lượng mua để nhận khuyến mại)" value={data.quantityToGetPromotion} onChange={(e) => setData({ ...data, quantityToGetPromotion: e.target.value })} />
            <InputField label="Mô tả" className="col-span-2" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProduct;
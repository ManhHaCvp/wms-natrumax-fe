import React, { useState } from "react";
import { Ban, Upload, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import InputField from "@/components/common/InputField.jsx";

const UpdateProduct = () => {
  const [product, setProduct] = useState({
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result });
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
            {product.image &&
              <img src={product.image} alt="Product" className="w-full h-full object-cover rounded-md" />
            }
          </div>
          <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="upload-image" />
          <Button asChild>
            <label htmlFor="upload-image">
              <Upload /> Tải ảnh lên
            </label>
          </Button>
        </Card>

        {/* Form product Information */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <InputField label="Tên hàng hóa" className="col-span-2" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            <InputField label="Mã hàng" value={product.barcode} onChange={(e) => setProduct({ ...product, barcode: e.target.value })} />
            <InputField label="Mã MISA" value={product.misaCode} onChange={(e) => setProduct({ ...product, misaCode: e.target.value })} />
            <InputField label="Nhóm hàng" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
            <InputField label="Đơn vị" value={product.unit} onChange={(e) => setProduct({ ...product, unit: e.target.value })} />
            <InputField label="Giá gốc" value={product.basePrice} onChange={(e) => setProduct({ ...product, basePrice: e.target.value })} />
            <InputField label="Chiết khấu" value={product.discount} onChange={(e) => setProduct({ ...product, discount: e.target.value })} />
            <InputField label="Số lượng" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
            <InputField label="Khuyến mại (Số lượng mua để nhận khuyến mại)" value={product.quantityToGetPromotion} onChange={(e) => setProduct({ ...product, quantityToGetPromotion: e.target.value })} />
            <InputField label="Mô tả" className="col-span-2" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProduct;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Ban } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";

const ViewProductDetail = () => {
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

  const navigate = useNavigate();

  const handleEditProduct = (productId) => {
    navigate(`/admin/product/update/${productId}`);
  };

  return (
    <div className="space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Sửa thông tin hàng hóa</h1>
        <div>
          <Button asChild><Link to={`/admin/product/update/1`}><Pencil />Sửa</Link></Button>
          <Button variant="destructive" className="ms-3"><Ban />Vô hiệu hóa</Button>
        </div>
      </div>

      <div className="flex space-x-5">
        <Card className="flex flex-col items-center justify-center w-fit h-fit p-5">
          <p className="text-2xl font-semibold text-center">{product.name}</p>
          <div className="bg-gray-200 rounded w-80 h-80 mt-3">
            <img src={product.image} alt={product.name}
                 className="w-full h-full object-cover rounded-md" />
          </div>
        </Card>

        {/* Form product Information */}
        <Card className="w-full h-fit p-5">
          <div className="font-semibold grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground">Mã hàng</p>{product.barcode}
            </div>
            <div>
              <p className="text-muted-foreground">Mã MISA</p>{product.misaCode}
            </div>
            <div>
              <p className="text-muted-foreground">Nhóm hàng</p>{product.category}
            </div>
            <div>
              <p className="text-muted-foreground">Đơn vị</p>{product.unit}
            </div>
            <div>
              <p className="text-muted-foreground">Giá gốc</p>{product.basePrice} VNĐ
            </div>
            <div>
              <p className="text-muted-foreground">Giá chiết khấu
                (40%)</p>{product.basePrice * (1 - product.discount / 100)} VNĐ
            </div>
            <div>
              <p className="text-muted-foreground">Số lượng</p>{product.stock}
            </div>
            <div>
              <p className="text-muted-foreground">Khuyến mãi</p>
              {product.quantityToGetPromotion === 0 ? (
                `Không có`
                ) : (
                `Mua ${product.quantityToGetPromotion} tặng 1`
                )
              }
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Mô tả</p>{product.description}
            </div>
            <div>
              <p className="text-muted-foreground">Trạng thái</p>
              {product.status ? (
                <Badge>Hoạt động</Badge>
              ) : (
                <Badge variant="destructive">Bị khóa</Badge>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewProductDetail;
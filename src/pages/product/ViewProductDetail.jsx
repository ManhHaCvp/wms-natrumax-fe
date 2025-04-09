import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Ban } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import toast from "react-hot-toast";
import productService from "@/services/productService.jsx";
import { formatCurrency } from "@/utils/formatCurrency.jsx";

const ViewProductDetail = () => {
  const { id } = useParams();

  const [data, setData] = useState({
    productId: 1,
    barcode: "8938540687295",
    misaCode: "NA.8",
    name: "Natrumax Curcumin 800gr",
    image: "https://natrumax.com/wp-content/uploads/2020/03/curcumin.jpg",
    category: "Sản phẩm cũ + ngũ cốc 200gr",
    basePrice: 850000,
    discount: 40,
    quantity: 20,
    unit: "Hộp",
    quantityToGetPromotion: 0,
    description: "Natrumax Curcumin 800gr",
    status: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await productService.getByProductIdAndWarehouseId(id, 1, setData);
      } catch (error) {
        toast.error("Failed to fetch category:", error);
      }
    };

    fetchUserData().catch(console.error);
  }, []);

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
          <p className="text-2xl font-semibold text-center">{data.name}</p>
          <div className="bg-gray-200 rounded w-80 h-80 mt-3">
            <img src={data.image} alt={data.name}
                 className="w-full h-full object-cover rounded-md" />
          </div>
        </Card>

        {/* Form product Information */}
        <Card className="w-full h-fit p-5">
          <div className="font-semibold grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground">Mã hàng</p>{data.barcode}
            </div>
            <div>
              <p className="text-muted-foreground">Mã MISA</p>{data.misaCode}
            </div>
            <div>
              <p className="text-muted-foreground">Nhóm hàng</p>{data.category}
            </div>
            <div>
              <p className="text-muted-foreground">Đơn vị</p>{data.unit}
            </div>
            <div>
              <p className="text-muted-foreground">Giá gốc</p>{formatCurrency(data.basePrice)}
            </div>
            <div>
              <p className="text-muted-foreground">Giá chiết khấu
                ({data.discount}%)</p>{formatCurrency(data.basePrice * (1 - data.discount / 100))}
            </div>
            <div>
              <p className="text-muted-foreground">Số lượng</p>{data.quantity}
            </div>
            <div>
              <p className="text-muted-foreground">Khuyến mãi</p>
              {data.quantityToGetPromotion === 0 ? (
                `Không có`
                ) : (
                `Mua ${data.quantityToGetPromotion} tặng 1`
                )
              }
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Mô tả</p>{data.description}
            </div>
            <div>
              <p className="text-muted-foreground">Trạng thái</p>
              {data.status ? (
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
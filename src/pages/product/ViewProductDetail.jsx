import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Ban } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import toast from "react-hot-toast";
import productService from "@/services/productService.jsx";
import { formatCurrency } from "@/utils/formatCurrency.jsx";
import mockApiService from "@/services/mockApiService.jsx";

const ViewProductDetail = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const detail = user?.detail ? JSON.parse(user.detail) : null;

  const { productId } = useParams();
  const { warehouse, getWarehouse } = useParams();

  const [data, setData] = useState({
    productId: 1,
    barcode: "",
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

  const [kiotVietQuantity, setKiotVietQuantity] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await productService.getByWarehouseIdAndProductId(2, productId); // Không setData ngay
        setData(result); // Set sau
        await mockApiService.getProductDetail("500370926", result.barcode, setKiotVietQuantity); // Dùng result.barcode ngay lập tức
      } catch (error) {
        toast.error("Failed to fetch product");
        console.error(error); // nên thêm log lỗi chi tiết
      }
    };

    fetchUserData();
  }, [productId]); // nhớ thêm productId vào dependency nếu productId thay đổi

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
              <p className="text-muted-foreground">Tồn kho của bạn</p>{kiotVietQuantity}
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
            <div>
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
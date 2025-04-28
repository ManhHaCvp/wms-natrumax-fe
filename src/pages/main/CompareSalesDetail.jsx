import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockProducts = [
  {
    id: "1",
    name: "Sữa bột Natrumax Gold",
    image: "https://natrumax.com/wp-content/uploads/2020/03/curcumin.jpg",
    price: 350000,
    sales: 120,
    stock: 50,
    category: "Sữa dinh dưỡng",
  },
  {
    id: "2",
    name: "Sữa bột Natrumax Grow Plus",
    image: "https://natrumax.com/wp-content/uploads/2020/03/curcumin.jpg",
    price: 400000,
    sales: 90,
    stock: 30,
    category: "Sữa phát triển chiều cao",
  },
  {
    id: "3",
    name: "Sữa bột Natrumax Grow Plus",
    image: "https://natrumax.com/wp-content/uploads/2020/03/curcumin.jpg",
    price: 400000,
    sales: 90,
    stock: 30,
    category: "Sữa phát triển chiều cao",
  },
];

export default function CompareProductTable() {
  const [productA, setProductA] = useState(mockProducts[0]);
  const [productB, setProductB] = useState(mockProducts[1]);

  const productKeys = [
    { label: "Ảnh sản phẩm", key: "image" },
    { label: "Tên sản phẩm", key: "name" },
    { label: "Giá", key: "price" },
    { label: "Tồn kho", key: "stock" },
    { label: "Đã bán", key: "sold" },
    { label: "Tổng doanh số", key: "totalSales" },
    { label: "Nhóm hàng", key: "category" },
  ];

  const renderValue = (product, key) => {
    if (key === "image") {
      return <img src={product.image} alt={product.name} className="mx-auto h-20" />;
    } else if (key === "price") {
      return `${product.price.toLocaleString()} đ`;
    } else if (key === "sold") {
      return product.sales - product.stock;
    } else if (key === "totalSales") {
      return `${(product.sales * product.price).toLocaleString()} đ`;
    } else {
      return product[key];
    }
  };

  return (
    <Card className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-800">So sánh sản phẩm</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Chọn sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="mb-2 font-semibold text-gray-700">Chọn sản phẩm A</p>
            <Select
              onValueChange={(id) => {
                const found = mockProducts.find((p) => p.id === id);
                if (found) setProductA(found);
              }}
              defaultValue={productA.id}
            >
              <SelectTrigger className="bg-white border border-gray-300 rounded-md p-2">
                <SelectValue placeholder="Chọn sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-2 font-semibold text-gray-700">Chọn sản phẩm B</p>
            <Select
              onValueChange={(id) => {
                const found = mockProducts.find((p) => p.id === id);
                if (found) setProductB(found);
              }}
              defaultValue={productB.id}
            >
              <SelectTrigger className="bg-white border border-gray-300 rounded-md p-2">
                <SelectValue placeholder="Chọn sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b text-left">Thông tin</th>
                <th className="py-2 px-4 border-b text-center">{productA.name}</th>
                <th className="py-2 px-4 border-b text-center">{productB.name}</th>
              </tr>
            </thead>
            <tbody>
              {productKeys.map(({ label, key }) => (
                <tr key={key}>
                  <td className="py-2 px-4 border-b font-medium text-gray-700">{label}</td>
                  <td className="py-2 px-4 border-b text-center">{renderValue(productA, key)}</td>
                  <td className="py-2 px-4 border-b text-center">{renderValue(productB, key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

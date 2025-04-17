// import warehouseService from "@/services/warehouseService";
// import { useEffect, useState } from "react";

// const Warehouse = ({ warehouse }) => {
//   const warehouseId = warehouse.warehouse_id;
//   const [warehouse1, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết
//   useEffect(() => {
//     const fetchRole = async () => {
//       await warehouseService.getById(warehouseId, (data) => {
//         setWarehouse(data);
//         console.log(data)
//         // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
//         // reset({
//         //   name: data.name || data.warehouseName || "",
//         //   description: data.description || "",
//         //   province: data.province.name || "",
//         //   accessCode: data.accessCode
//         // });
//       });
//     };

//     fetchRole();
//   }, [warehouseId]);
//   return (
//     <div className="m-5">
//       <div>
//         <div>
//           <p className="text-muted-foreground">Tên kho</p>
//           <p>{warehouse1?.warehouseName || "Không có dữ liệu"}</p>
//         </div>
//       </div>
//       <div>
//         <p className="text-muted-foreground">Tỉnh</p>
//         <p>{warehouse1?.province.name || "Không có dữ liệu"}</p>
//       </div>
//       <div>
//         <p className="text-muted-foreground">Mô tả</p>
//         <p>{warehouse1?.description || "Không có dữ liệu"}</p>
//       </div>
//     </div>
//   )
// }

// export default Warehouse;

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Warehouse = () => {
  const linkedWarehouse = {
    name: "Kho tổng",
    location: "Hải Dương",
    description: "Kho đối tác dùng để lưu trữ hàng hóa khu vực miền Bắc .",
  };

  const ownedWarehouse = {
    name: "Kho Cầu Giấy",
    location: "Hà Nội",
    description: "Kho chính của công ty, quản lý trực tiếp bởi nhân viên nội bộ.",
  };

  const renderWarehouseCard = (warehouse) => (
    <Card className="mb-6 shadow-md rounded-lg">
      <CardContent className="p-4 space-y-2">
        <div>
          <span className="font-semibold">Tên kho: </span>
          {warehouse.name}
        </div>
        <div>
          <span className="font-semibold">Tỉnh thành: </span>
          {warehouse.location}
        </div>
        <div>
          <span className="font-semibold">Mô tả: </span>
          {warehouse.description}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-[#182F73] mb-6">Chi tiết kho</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Kho liên kết</h2>
        {renderWarehouseCard(linkedWarehouse)}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Kho sở hữu</h2>
        {renderWarehouseCard(ownedWarehouse)}
      </div>
    </div>
  );
};

export default Warehouse;
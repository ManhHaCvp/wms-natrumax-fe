import warehouseService from "@/services/warehouseService";
import { useEffect, useState } from "react";

const Warehouse = ({ warehouse }) => {
  const warehouseId = warehouse.warehouse_id;
  const [warehouse1, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết
  useEffect(() => {
    const fetchRole = async () => {
      await warehouseService.getById(warehouseId, (data) => {
        setWarehouse(data);
        console.log(data)
        // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
        // reset({
        //   name: data.name || data.warehouseName || "",
        //   description: data.description || "",
        //   province: data.province.name || "",
        //   accessCode: data.accessCode
        // });
      });
    };

    fetchRole();
  }, [warehouseId]);
  return (
    <div className="m-5">
      <div>
        <div>
          <p className="text-muted-foreground">Tên kho</p>
          <p>{warehouse1?.warehouseName || "Không có dữ liệu"}</p>
        </div>
      </div>
      <div>
        <p className="text-muted-foreground">Tỉnh</p>
        <p>{warehouse1?.province.name || "Không có dữ liệu"}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Mô tả</p>
        <p>{warehouse1?.description || "Không có dữ liệu"}</p>
      </div>
    </div>
  )
}

export default Warehouse;
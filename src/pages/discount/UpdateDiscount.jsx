import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button.jsx";
import { Ban, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import InputField from "@/components/common/InputField.jsx";
import discountService from "@/services/discountService.jsx";

const UpdateDiscount = () => {
  const { id } = useParams();

  const [data, setData] = useState({
    discountId: id,
    minimumAmount: "",
    discountPercent: "",
    description: "",
    activeDate: "",
    expiryDate: "",
    status: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await discountService.getById(id, setData);
      } catch (error) {
        toast.error("Failed to fetch discount:", error);
      }
    };

    fetchUserData().catch(console.error);
  }, []);

  const handleSaveChange = async (e) => {
    e.preventDefault();
    try {
      await discountService.update(data);
    } catch (error) {
      toast.error("Failed to update discount:", error);
    }
  }

  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Sửa thông tin </h1>
        <div>
          <Button variant="default" asChild><div onClick={handleSaveChange}><Check />Lưu</div></Button>
          <Button variant="destructive" className="ms-3"><Ban />Vô hiệu hóa</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <InputField className="col-span-2" label="Mô tả" value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })} />
          <InputField label="Số tiền tối thiểu" value={data.minimumAmount}
                      onChange={(e) => setData({ ...data, minimumAmount: e.target.value })} />
          <InputField label="Mức giảm giá" value={data.discountPercent}
                      onChange={(e) => setData({ ...data, discountPercent: e.target.value })} />
          <InputField label="Ngày bắt đầu" value={data.activeDate}
                      onChange={(e) => setData({ ...data, activeDate: e.target.value })} />
          <InputField label="Ngày kết thúc" value={data.expiryDate}
                      onChange={(e) => setData({ ...data, expiryDate: e.target.value })} />
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateDiscount;
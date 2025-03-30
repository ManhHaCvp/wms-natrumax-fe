import { useEffect, useState } from "react";
import discountService from "@/services/discountService.jsx";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button.jsx";
import { Ban, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import InputField from "@/components/common/InputField.jsx";

const CreateDiscount = () => {
  const [data, setData] = useState({
    id: "",
    minimumAmount: "",
    discount: "",
    description: "",
    activeDate: "",
    expiryDate: "",
    status: "",
  });

  const handleSaveChange = async (e) => {
    e.preventDefault();
    try {
      await discountService.create(data);
    } catch (error) {
      toast.error("Failed to create discount:", error);
    }
  }

  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Thêm giảm giá</h1>
        <div>
          <Button variant="default" asChild><div onClick={handleSaveChange}><Check />Lưu</div></Button>
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
          <InputField label="Mức giảm giá" value={data.discount}
                      onChange={(e) => setData({ ...data, discount: e.target.value })} />
          <InputField label="Ngày bắt đầu" value={data.activeDate}
                      onChange={(e) => setData({ ...data, activeDate: e.target.value })} />
          <InputField label="Ngày kết thúc" value={data.expiryDate}
                      onChange={(e) => setData({ ...data, expiryDate: e.target.value })} />
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateDiscount;
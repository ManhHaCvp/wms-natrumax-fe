import toast from "react-hot-toast";
import { Ban, Check } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { useState } from "react";
import categoryService from "@/services/categoryService.jsx";
import InputField from "@/components/common/InputField.jsx";

const CreateCategory = () => {
  const [data, setData] = useState({
    categoryName: "",
    description: "",
  });

  const handleSaveChange = async (e) => {
    e.preventDefault();
    try {
      await categoryService.create(data);
    } catch (error) {
      toast.error("Failed to create category:", error);
    }
  }

  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Thêm nhóm hàng</h1>
        <div>
          <Button variant="default" asChild><div onClick={handleSaveChange}><Check />Lưu</div></Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3">
          <InputField label="Tên nhóm hàng" value={data.categoryName}
                      onChange={(e) => setData({ ...data, categoryName: e.target.value })} />
          <InputField label="Mô tả" value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCategory;

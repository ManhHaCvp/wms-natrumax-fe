import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, Ban } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import categoryService from "@/services/categoryService.jsx";
import InputField from "@/components/common/InputField.jsx";

const UpdateCategory = () => {
  const { id } = useParams();

  const [data, setData] = useState({
    categoryId: id,
    categoryName: "",
    description: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await categoryService.getById(id, setData);
      } catch (error) {
        toast.error("Failed to fetch category:", error);
      }
    };

    fetchUserData().catch(console.error);
  }, []);

  const handleSaveChange = async (e) => {
    e.preventDefault();
    try {
      await categoryService.update(data);
    } catch (error) {
      toast.error("Failed to update category:", error);
    }
  }

  return (
    <div className="flex flex-col space-y-5 m-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#182F73] text-3xl font-bold">Sửa thông tin nhóm hàng</h1>
        <div>
          <Button variant="default" asChild><div onClick={handleSaveChange}><Check />Lưu</div></Button>
          <Button variant="destructive" className="ms-3"><Ban />Vô hiệu hóa</Button>
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

export default UpdateCategory;

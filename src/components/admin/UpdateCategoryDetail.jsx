import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";

const UpdateCategoryDetail = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#182F73]">Sửa thông tin nhóm hàng</h1>
        <div className="flex gap-4">
          <Button className="flex items-center gap-2 bg-[#1A2B68] text-white rounded-lg px-4 py-2">
            <Save size={16} /> Lưu
          </Button>
        </div>
      </div>

      <Card className="bg-[#F8FAFC] p-6 rounded-lg">
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhóm hàng</label>
            <Input defaultValue="Tên nhóm hàng" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <Input defaultValue="Mô tả" className="w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateCategoryDetail;

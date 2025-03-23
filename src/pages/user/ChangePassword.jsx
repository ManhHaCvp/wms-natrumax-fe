import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import InputField from "@/components/common/InputField.jsx";

const ChangePassword = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="flex flex-col m-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[#182F73] text-3xl font-bold">Thay đổi mật khẩu</h1>
        <Button variant="default" content=""><Check />Lưu</Button>
      </div>

      <Card>
        <CardHeader>
          <p className="text-foreground text-lg font-semibold">Nhập mật khẩu có tối thiểu 8 ký tự bao gồm số, chữ hoa,
            chữ thường.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3">
          <InputField label="Mật khẩu hiện tại" placeholder="Mật khẩu hiện tại" value={data.oldPassword}
                      onChange={(e) => setData({ ...data, oldPassword: e.target.value })} />
          <InputField label="Mật khẩu mới" placeholder="Mật khẩu mới" value={data.newPassword}
                      onChange={(e) => setData({ ...data, newPassword: e.target.value })} />
          <InputField label="Xác nhận mật khẩu mới" placeholder="Xác nhận mật khẩu mới" value={data.confirmPassword}
                      onChange={(e) => setData({ ...data, confirmPassword: e.target.value })} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
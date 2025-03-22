import { Input } from "@/components/ui/input.jsx";
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

const Wallet = () => {
  return (
    <div className="m-5">
      <p className="text-base font-semibold mb-5">
        <span className="text-muted-foreground me-7">Số dư hiện tại</span>
        <span>1,500,000,000đ</span>
      </p>
      <div className="flex justify-between items-center mb-5">
        <p className="text-muted-foreground text-base font-semibold w-20 me-3">Số tiền</p>
        <Input placeholder="Tối thiểu 200.000đ" className="w-full me-3" />
        <Button variant="outline"><Plus/>Gửi</Button>
      </div>
    </div>
  );
};

export default Wallet;
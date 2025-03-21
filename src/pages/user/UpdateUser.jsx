import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UpdateUser() {
    return (
        <div className="w-[85vw] m-5 p-5 bg-gray-100 rounded-lg">
            <h1 className="text-2xl font-bold mb-6 ml-4 text-[#182F73]">Sửa thông tin người dùng</h1>

            <Card className="mb-6 bg-gray-50 m-4">
                <CardContent className="grid grid-cols-2 gap-6 p-6">
                    <InputField label="Tên tài khoản" placeholder="Tên tài khoản" />
                    <InputField label="Role" value="Admin" disabled />
                    <InputField label="Số điện thoại" placeholder="0123456789" />
                    <InputField label="Email" placeholder="example@gmail.com" />
                    <InputField label="Địa chỉ" placeholder="Địa chỉ..." className="col-span-2" />
                    <InputField label="Thành phố/Huyện" placeholder="Tp. Hải Dương" />
                    <InputField label="Tỉnh" placeholder="Hải Dương" />
                </CardContent>
            </Card>

            <Card className="mb-6 bg-gray-50 m-4">
                <CardContent className="grid grid-cols-2 gap-6 p-6">
                    <InputField label="Retailer" placeholder="haiyenhd" />
                    <InputField label="Client ID" placeholder="ba477a2c..." />
                    <InputField label="Client Secret" placeholder="7FFDE6E9..." className="col-span-2" />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button variant="outline" className="text-red-600 border-red-600">
                    Vô hiệu hóa
                </Button>
                <Button>Lưu</Button>
            </div>
        </div>
    );
}

function InputField({ label, placeholder, value, disabled, className }) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <Input placeholder={placeholder} value={value} disabled={disabled} className="w-full" />
        </div>
    );
}
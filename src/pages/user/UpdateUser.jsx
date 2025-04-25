import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/common/InputField.jsx";
import userService from "@/services/userService.jsx";
import provinceService from "@/services/provinceService";
import { checkUserRoleByUser } from "@/utils/checkUserRole.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import toast from "react-hot-toast";
import ChangeStatusButton from "@/components/common/ChangeStatusButton.jsx";

const UpdateUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [apiConnection, setApiConnection] = useState({});
    const { control, setValue } = useForm();

    const fetchUserData = async () => {
        try {
            const data = await userService.getById(id, setUser);
            setUser(data);
            setApiConnection(JSON.parse(data.detail));
            setValue("provinceId", data.province?.provinceId?.toString());
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchUserData().catch(console.error);
    }, [id, setValue]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedProvinces = await provinceService.getAll();
            setProvinces(fetchedProvinces);
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const payload = {
                userId: user.id,
                accountName: user.accountName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                retailer: apiConnection.retailer,
                clientId: apiConnection.client_id,
                clientSecret: apiConnection.client_secret,
                provinceId: user.province?.provinceId,
                roleId: user.role?.id,
            };
            await userService.update(payload);
            toast.success("Cập nhật thành công!");
        } catch (error) {
            console.error("Failed to update user", error);
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    const handleProvinceChange = (provinceId) => {
        const selectedProvince = provinces.find((p) => String(p.provinceId) === provinceId);
        setUser((prev) => ({
            ...prev,
            province: selectedProvince,
        }));
        setValue("provinceId", provinceId);
    };

    const handleChangeStatus = async () => {
        try {
            await userService.changeStatus(user.id);
            toast.success("Cập nhật thành công!");
            fetchUserData();
        } catch (error) {
            console.error("Failed to update user", error);
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex flex-col m-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-[#182F73] text-3xl font-bold">Sửa thông tin người dùng</h1>
                <div>
                    <Button variant="default" onClick={handleSave}>
                        <Save/> Lưu
                    </Button>
                    <ChangeStatusButton user={user} handleChangeStatus={handleChangeStatus} />
                </div>
            </div>

            <Card className="mb-5">
                <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                    <InputField
                        label="Tên tài khoản"
                        value={user.accountName}
                        onChange={(e) => setUser({ ...user, accountName: e.target.value })}
                    />
                    <InputField
                        label="Vai trò"
                        value={user.role?.name || ""}
                        disabled
                    />
                    <InputField
                        label="Số điện thoại"
                        value={user.phoneNumber}
                        onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                    />
                    <InputField
                        label="Email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <InputField
                        label="Địa chỉ"
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                    />
                    <div>
                        <label className="block mb-1 text-sm font-medium">Tỉnh thành</label>
                        <Controller
                            control={control}
                            name="provinceId"
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        handleProvinceChange(val);
                                    }}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn tỉnh" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem key={province.provinceId} value={String(province.provinceId)}>
                                                {province.provinceName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {checkUserRoleByUser(user, "ROLE_BRANCH_OWNER") && (
                <Card>
                    <CardHeader>
                        <CardTitle>Kết nối API</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <InputField
                            label="Retailer"
                            value={apiConnection.retailer}
                            onChange={(e) => setApiConnection({ ...apiConnection, retailer: e.target.value })}
                        />
                        <InputField
                            label="Client ID"
                            value={apiConnection.client_id}
                            onChange={(e) => setApiConnection({ ...apiConnection, client_id: e.target.value })}
                        />
                        <InputField
                            label="Client Secret"
                            value={apiConnection.client_secret}
                            onChange={(e) => setApiConnection({ ...apiConnection, client_secret: e.target.value })}
                            className="col-span-2"
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UpdateUser;
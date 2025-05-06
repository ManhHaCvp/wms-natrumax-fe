import {Controller, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import roleService from "@/services/roleService.jsx";
import warehouseService from "@/services/warehouseService.jsx";
import userService from "@/services/userService.jsx";
import toast from "react-hot-toast";
import {Input} from "@/components/ui/input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Plus} from "lucide-react";
import LoadingOverlay from "@/components/common/LoadingOverlay.jsx";

const CreateNewUser = ({onSuccess}) => {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: {errors},
        reset,
    } = useForm({
        defaultValues: {
            misaCode: "",
            warehouseId: "",
            roleId: "",
        },
    });

    const [roleOptions, setRoleOptions] = useState([]);
    const [warehouseOptions, setWarehouseOptions] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([
                    roleService.getAll(setRoleOptions),
                    warehouseService.getAll(setWarehouseOptions),
                ]);
            } catch (error) {
                console.error("Failed to fetch dropdown data:", error);
            }
        };

        loadInitialData();
    }, []);

    const [loading, setLoading] = useState(false);

    const onSubmit = async (newUserData) => {
        setLoading(true);
        try {
            await userService.create({
                misaCode: newUserData.misaCode,
                warehouseId: Number(newUserData.warehouseId),
                roleId: Number(newUserData.roleId),
            });
            toast.success("Tạo người dùng thành công!");
            reset();
            onSuccess?.();
        } catch (error) {
            toast.error("Tạo người dùng không thành công!");

            if (error.response?.data) {
                const messages = error.response.data;
                for (const field in messages) {
                    setError(field, {type: "server", message: messages[field]});
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LoadingOverlay/>}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Mã MISA</label>
                    <Input {...register("misaCode")} placeholder="Nhập mã MISA"/>
                    {errors.misaCode && <p className="text-sm text-red-500">{errors.misaCode.message}</p>}
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Vai trò</label>
                    <Controller
                        control={control}
                        name="roleId"
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn vai trò"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.slice(2).map((role) => (
                                        <SelectItem
                                            key={role.roleId}
                                            value={String(role.roleId)}
                                        >
                                            {role.roleName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.roleId && <p className="text-sm text-red-500">{errors.roleId.message}</p>}
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Kho</label>
                    <Controller
                        control={control}
                        name="warehouseId"
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouseOptions.map((wh) => (
                                        <SelectItem
                                            key={wh.warehouseId}
                                            value={String(wh.warehouseId)}
                                        >
                                            {wh.warehouseName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.warehouseId && <p className="text-sm text-red-500">{errors.warehouseId.message}</p>}
                </div>

                <Button type="submit">
                    <Plus/> Thêm mới
                </Button>
            </form>
        </>
    );
};

export default CreateNewUser;
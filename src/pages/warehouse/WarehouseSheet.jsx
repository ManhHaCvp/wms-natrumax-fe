import {Controller, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import warehouseService from "@/services/warehouseService.jsx";
import toast from "react-hot-toast";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import provinceService from "@/services/provinceService.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import userService from "@/services/userService.jsx";

export const ViewWarehouseDetail = ({warehouseId}) => {
    const {register, handleSubmit, reset} = useForm();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [warehouseData] = await Promise.all([
                    warehouseService.getById(warehouseId),
                ]);

                reset({
                    name: warehouseData.name || warehouseData.warehouseName || "",
                    accessCode: warehouseData.accessCode,
                    ownerId: warehouseData.ownerId ? String(warehouseData.ownerId) : "",
                    province: warehouseData.province?.name,
                    description: warehouseData.description || "",
                });
            } catch (error) {
                console.error("Lỗi khi load dữ liệu kho:", error);
                toast.error("Không thể tải dữ liệu kho.");
            }
        };

        fetchAll();
    }, [warehouseId, reset]);

    return (
        <form className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên kho</label>
                <Input {...register("name")} disabled/>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Access code</label>
                <Input {...register("accessCode")} disabled/>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Tỉnh</label>
                <Input {...register("province")} disabled/>
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} disabled/>
            </div>
        </form>
    );
};

export const CreateWarehouse = ({setData, onClose}) => {
    const {register, handleSubmit, control, reset} = useForm({
        defaultValues: {
            name: "",
            accessCode: "",
            provinceId: "",
            description: "",
        },
    });
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Lấy danh sách tỉnh
            const fetchedProvinces = await provinceService.getAll();
            setProvinces(fetchedProvinces);
            console.log("Fetched provinces:", fetchedProvinces);
        };

        fetchData();
    }, []);

    const onSubmit = async (formData) => {
        if (!formData.name?.trim()) {
            toast.error("Tên kho là bắt buộc");
            return;
        }
        try {
            await warehouseService.create({
                name: formData.name,
                accessCode: formData.accessCode,
                provinceId: Number(formData.provinceId),
                description: formData.description,
            });
            toast.success("Thêm mới thành công!");
            await warehouseService.getAll(setData);
            onClose?.();
            reset();
        } catch (error) {
            console.error("Lỗi thêm mới  kho:", error);
            toast.error("Thêm mới thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên kho</label>
                <Input {...register("name")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Access code</label>
                <Input {...register("accessCode")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Tỉnh</label>
                <Controller
                    name="provinceId"
                    control={control}
                    render={({field}) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tỉnh"/>
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
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} />
            </div>
            <Button type="submit">Thêm kho</Button>
        </form>
    );
};

export const UpdateWarehouse = ({ warehouseId, setData }) => {
    const { register, handleSubmit, control, reset } = useForm();
    const [provinces, setProvinces] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [warehouseData, provinceList] = await Promise.all([
                    warehouseService.getById(warehouseId),
                    provinceService.getAll(),
                ]);

                setProvinces(provinceList);

                let defaultOwnerId = warehouseData.ownerId
                    ? String(warehouseData.ownerId)
                    : "";

                if (warehouseData?.warehouseId) {
                    const membersList = await userService.getMembersByWarehouseId(
                        warehouseData.warehouseId
                    );
                    setMembers(membersList);

                    // Auto select the first member if ownerId is empty
                    if (!defaultOwnerId && membersList.length > 0) {
                        defaultOwnerId = String(membersList[0].userId);
                    }
                }

                reset({
                    name: warehouseData.name || warehouseData.warehouseName || "",
                    accessCode: warehouseData.accessCode,
                    ownerId: defaultOwnerId,
                    provinceId: warehouseData.province?.provinceId
                        ? String(warehouseData.province.provinceId)
                        : "",
                    description: warehouseData.description || "",
                });
            } catch (error) {
                console.error("Lỗi khi load dữ liệu kho:", error);
                toast.error("Không thể tải dữ liệu kho.");
            }
        };

        fetchAll();
    }, [warehouseId, reset]);

    const onSubmit = async (formData) => {
        try {
            if (!formData.name?.trim()) {
                toast.error("Tên kho là bắt buộc");
                return;
            }

            await warehouseService.update(warehouseId, {
                name: formData.name,
                accessCode: formData.accessCode,
                ownerId: Number(formData.ownerId),
                provinceId: Number(formData.provinceId),
                description: formData.description,
            });

            toast.success("Cập nhật thành công!");
            await warehouseService.getAll(setData);
        } catch (error) {
            console.error("Lỗi cập nhật kho:", error);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên kho</label>
                <Input {...register("name")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Access code</label>
                <Input {...register("accessCode")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Chủ kho</label>
                <Controller
                    name="ownerId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn chủ kho" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((member) => (
                                    <SelectItem
                                        key={member.userId}
                                        value={String(member.userId)}
                                    >
                                        {member.accountName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Tỉnh</label>
                <Controller
                    name="provinceId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tỉnh" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map((province) => (
                                    <SelectItem
                                        key={province.provinceId}
                                        value={String(province.provinceId)}
                                    >
                                        {province.provinceName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} />
            </div>
            <Button type="submit">Cập nhật kho</Button>
        </form>
    );
};
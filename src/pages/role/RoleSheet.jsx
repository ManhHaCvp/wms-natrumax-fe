import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import roleService from "@/services/roleService.jsx";
import toast from "react-hot-toast";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";

export const UpdateRole = ({ roleId, setData }) => {
    const { register, handleSubmit, reset } = useForm();
    const [role, setRole] = useState(null); // Lưu dữ liệu chi tiết

    useEffect(() => {
        const fetchRole = async () => {
            await roleService.getById(roleId, (data) => {
                setRole(data);
                // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
                reset({
                    name: data.name || data.roleName || "",
                    description: data.description || "",
                });
            });
        };

        fetchRole();
    }, [roleId, reset]);

    const onSubmit = async (formData) => {
        try {
            await roleService.update(roleId, {
                description: formData.description,
            });
            toast.success("Cập nhật thành công!");
            const data= await roleService.getAll(setData);

            // window.location.reload();
        } catch (error) {
            console.error("Lỗi cập nhật vai trò:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên vai trò</label>
                <Input {...register("name")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} placeholder="Nhập mô tả vai trò" />
            </div>
            <Button type="submit">Lưu thay đổi</Button>
        </form>
    );
};

export const ViewRoleDetail = ({ roleId }) => {
    const { register, handleSubmit, reset } = useForm();
    const [role, setRole] = useState(null); // Lưu dữ liệu chi tiết

    useEffect(() => {
        const fetchRole = async () => {
            await roleService.getById(roleId, (data) => {
                setRole(data);
                // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
                reset({
                    name: data.name || data.roleName || "",
                    description: data.description || "",
                });
            });
        };

        fetchRole();
    }, [roleId, reset]);

    return (
        <form className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên vai trò</label>
                <Input {...register("name")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} disabled />
            </div>
        </form>
    );
};
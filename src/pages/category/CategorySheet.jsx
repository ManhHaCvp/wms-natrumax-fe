import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import categoryService from "@/services/categoryService.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import toast from "react-hot-toast";

export const ViewCategoryDetail = ({ categoryId }) => {
    const { register, handleSubmit, reset } = useForm();
    const [category, setCategory] = useState(null); // Lưu dữ liệu chi tiết

    useEffect(() => {
        const fetchCategory = async () => {
            await categoryService.getById(categoryId, (data) => {
                setCategory(data);
                // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
                reset({
                    name: data.name || data.categoryName || "",
                    description: data.description || "",
                });
            });
        };

        fetchCategory();
    }, [categoryId, reset]);

    return (
        <form className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên nhóm hàng</label>
                <Input {...register("name")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} disabled />
            </div>
        </form>
    );
};

export const CreateCategory = ({ setData, onClose }) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            description: "",
        },
    });
    const onSubmit = async (formData) => {
        if (!formData.name?.trim()) {
            toast.error("Tên nhóm hàng là bắt buộc");
            return;
        }
        try {
            await categoryService.create({
                name: formData.name,
                description: formData.description,
            });
            await categoryService.getAll(setData);
            onClose?.(); // Gọi hàm đóng Sheet
            reset();
        } catch (error) {
            console.error("Lỗi cập nhật vai trò:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên vai trò</label>
                <Input {...register("name")} placeholder="Nhập tên nhóm hàng" />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} placeholder="Nhập mô tả nhóm hàng" />
            </div>
            <Button type="submit">Tạo mới</Button>
        </form>
    );
};

export const UpdateCategory = ({ categoryId, setData }) => {
    const { register, handleSubmit, reset } = useForm();
    const [category, setCategory] = useState(null); // Lưu dữ liệu chi tiết

    useEffect(() => {
        const fetchCategory = async () => {
            await categoryService.getById(categoryId, (data) => {
                setCategory(data);
                // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
                reset({
                    name: data.name || data.categoryName || "",
                    description: data.description || "",
                });
            });
        };

        fetchCategory();
    }, [categoryId, reset]);

    const onSubmit = async (formData) => {
        try {
            await categoryService.update(categoryId, {
                name: formData.name,
                description: formData.description,
            });
            // toast.success("Cập nhật thành công!");
            // window.location.reload();
            const data = await categoryService.getAll(setData);

        } catch (error) {
            console.error("Lỗi cập nhật vai trò:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên nhóm hàng</label>
                <Input {...register("name")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} />
            </div>
            <Button type="submit">Lưu thay đổi</Button>
        </form>
    );
};
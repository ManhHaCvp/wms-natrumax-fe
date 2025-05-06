import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import rewardService from "@/services/rewardService.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import toast from "react-hot-toast";

export const ViewRewardDetail = ({ rewardId }) => {
    const { register, reset } = useForm();
    const [reward, setReward] = useState(null);

    useEffect(() => {
        const fetchReward = async () => {
            await rewardService.getById(rewardId, (data) => {
                setReward(data);
                reset({
                    name: data.name || "",
                    description: data.description || "",
                });
            });
        };
        fetchReward();
    }, [rewardId, reset]);

    return (
        <form className="mt-6 space-y-4">
            {reward?.image && (
                <img src={reward.image} alt={reward.name || "Reward image"} className="w-full object-cover rounded" />
            )}
            <div>
                <label className="block mb-1 text-sm font-medium">Tên phần thưởng</label>
                <Input {...register("name")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} disabled />
            </div>
        </form>
    );
};

export const CreateReward = ({ onSuccess }) => {
    const { register, handleSubmit, reset, watch } = useForm();
    const [previewImage, setPreviewImage] = useState(null);
    const imageFile = watch("image");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    }, [imageFile]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("request", JSON.stringify({ name: data.name, description: data.description }));
            formData.append("image", data.image[0]);

            await rewardService.create(formData);
            onSuccess?.();
            reset();
            setPreviewImage(null); // reset preview
        } catch (error) {
            console.error("Create reward failed:", error);
            toast.error("Tạo phần thưởng thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên phần thưởng</label>
                <Input {...register("name", { required: true })} placeholder="Nhập tên phần thưởng" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} placeholder="Nhập mô tả" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Hình ảnh</label>
                <Input type="file" {...register("image", { required: true })} accept="image/*" />
                {previewImage && (
                    <img src={previewImage} alt="Preview" className="w-32 h-32 mt-2 object-cover rounded border" />
                )}
            </div>

            <Button type="submit">Tạo mới</Button>
        </form>
    );
};

export const UpdateReward = ({ rewardId, onSuccess }) => {
    const { register, handleSubmit, reset, watch } = useForm();
    const [existingImage, setExistingImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const imageFile = watch("image");

    useEffect(() => {
        const fetchReward = async () => {
            await rewardService.getById(rewardId, (data) => {
                reset({
                    name: data.name || "",
                    description: data.description || "",
                });
                setExistingImage(data.image || null);
            });
        };
        fetchReward();
    }, [rewardId, reset]);

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    }, [imageFile]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            const requestBody = { name: data.name, description: data.description, status: true };
            formData.append("request", JSON.stringify(requestBody));
            if (data.image?.length > 0) {
                formData.append("image", data.image[0]);
            }
            await rewardService.update(rewardId, formData);
            onSuccess?.();
            reset();
        } catch (error) {
            console.error("Update reward failed:", error);
            toast.error("Cập nhật phần thưởng thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên phần thưởng</label>
                <Input {...register("name", { required: true })} placeholder="Nhập tên phần thưởng" />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} placeholder="Nhập mô tả" />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Hình ảnh hiện tại</label>
                {existingImage ? (
                    <img src={existingImage} alt="Current Reward" className="w-32 h-32 object-cover rounded border" />
                ) : (
                    <p className="text-sm text-gray-500">Chưa có hình ảnh</p>
                )}
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Chọn hình ảnh mới (nếu muốn thay đổi)</label>
                <Input type="file" {...register("image")} accept="image/*" />
                {previewImage && (
                    <img src={previewImage} alt="Preview" className="w-32 h-32 mt-2 object-cover rounded border" />
                )}
            </div>
            <Button type="submit">Cập nhật</Button>
        </form>
    );
};
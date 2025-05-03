import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import discountService from "@/services/discountService.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import formatDate from "@/utils/formatDate.jsx";

export const CreateDiscount = ({ setData, onClose }) => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (formData) => {
        try {
            const { description, discountPercent, minimumAmount, activeDate, expiryDate } = formData;

            if (!discountPercent || discountPercent > 100) {
                return toast.error("Phần trăm giảm không hợp lệ");
            }
            if (!minimumAmount || !activeDate || !expiryDate) {
                return toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            }

            if (new Date(activeDate) >= new Date(expiryDate)) {
                return toast.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
            }

            const payload = {
                description,
                discountPercent: Number(discountPercent),
                minimumAmount: Number(minimumAmount),
                activeDate: formatDate.formatDateToDateTime(activeDate),
                expiryDate: formatDate.formatDateToDateTime(expiryDate)
            };

            await discountService.create(payload);
            toast.success("Tạo mới thành công!");
            await discountService.getAll(setData);
            onClose?.();
            reset();
        } catch (error) {
            console.error("Lỗi tạo mới giảm giá:", error);
            toast.error("Tạo mới thất bại");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {renderDiscountFormFields(register)}
            <Button type="submit">Tạo mới</Button>
        </form>
    );
};

export const UpdateDiscount = ({ discountId, setData }) => {
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        discountService.getById(discountId, (data) => {
            reset({
                description: data.description,
                discountPercent: data.discountPercent,
                minimumAmount: data.minimumAmount,
                activeDate: formatDate.formatJsonToDateInput(data.activeDate),
                expiryDate: formatDate.formatJsonToDateInput(data.expiryDate)
            });
        });
    }, [discountId, reset]);

    const onSubmit = async (formData) => {
        try {
            const payload = {
                ...formData,
                discountPercent: Number(formData.discountPercent),
                minimumAmount: Number(formData.minimumAmount),
                activeDate: formatDate.formatDateToDateTime(formData.activeDate),
                expiryDate: formatDate.formatDateToDateTime(formData.expiryDate)
            };

            await discountService.update(discountId, payload);
            toast.success("Cập nhật thành công!");
            await discountService.getAll(setData);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {renderDiscountFormFields(register)}
            <Button type="submit">Lưu thay đổi</Button>
        </form>
    );
};

export const ViewDiscountDetail = ({ discountId }) => {
    const { register, reset } = useForm();

    useEffect(() => {
        discountService.getById(discountId, (data) => {
            reset({
                description: data.description,
                discountPercent: data.discountPercent,
                minimumAmount: data.minimumAmount,
                activeDate: formatDate.formatJsonToDateInput(data.activeDate),
                expiryDate: formatDate.formatJsonToDateInput(data.expiryDate),
                status: data.status === "1" ? "Đang hoạt động" : "Ngưng hoạt động"
            });
        });
    }, [discountId, reset]);

    return (
        <form className="mt-6 space-y-4">
            {renderDiscountFormFields(register, true)}
        </form>
    );
};

const renderDiscountFormFields = (register, disabled = false) => (
    <>
        <div>
            <label className="block mb-1 text-sm font-medium">Mô tả</label>
            <Input {...register("description")} disabled={disabled} />
        </div>
        <div>
            <label className="block mb-1 text-sm font-medium">Phần trăm giảm (%)</label>
            <Input type="number" {...register("discountPercent")} disabled={disabled} />
        </div>
        <div>
            <label className="block mb-1 text-sm font-medium">Số tiền tối thiểu (VND)</label>
            <Input type="number" {...register("minimumAmount")} disabled={disabled} />
        </div>
        <div>
            <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
            <Input type="date" {...register("activeDate")} disabled={disabled} />
        </div>
        <div>
            <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
            <Input type="date" {...register("expiryDate")} disabled={disabled} />
        </div>
        {disabled && (
            <div>
                <label className="block mb-1 text-sm font-medium">Trạng thái</label>
                <Input {...register("status")} disabled />
            </div>
        )}
    </>
);
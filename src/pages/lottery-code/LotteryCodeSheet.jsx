// ✅ LotteryCodeSheet.jsx (Updated with Labels)
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import lotteryCodeService from "@/services/lotteryCodeService.jsx";
import provinceService from "@/services/provinceService.jsx";
import productService from "@/services/productService.jsx";
import userService from "@/services/userService.jsx";

export const ViewLotteryCodeDetail = ({ lotteryCodeId }) => {
    const { register, reset } = useForm();
    const [lotteryCode, setLotteryCode] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await lotteryCodeService.getById(lotteryCodeId);
            setLotteryCode(data);
            reset({
                code: data.code || "",
                price: data.price || "",
                productName: data.productName || "",
                place: data.place || "",
                accountName: data.user?.accountName || "",
                phoneNumber: data.user?.phoneNumber || "",
                address: data.user?.address || "",
                province: data.user?.province?.name || "",
                status: data.status ? "Kích hoạt" : "Vô hiệu",
            });
        };
        fetchData();
    }, [lotteryCodeId, reset]);

    return (
        <form className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Mã quay thưởng</label>
                <Input {...register("code")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Giá trị</label>
                <Input {...register("price")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Tên sản phẩm</label>
                <Input {...register("productName")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Địa điểm</label>
                <Input {...register("place")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Họ và tên</label>
                <Input {...register("accountName")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Số điện thoại</label>
                <Input {...register("phoneNumber")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Địa chỉ</label>
                <Input {...register("address")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Khu vực</label>
                <Input {...register("province")} disabled />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Trạng thái</label>
                <Input {...register("status")} disabled />
            </div>
        </form>
    );
};

export const CreateLotteryCode = ({ onSuccess }) => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            await lotteryCodeService.create(data);
            reset();
            onSuccess?.();
        } catch (error) {
            console.error("Tạo mã thất bại:", error);
            toast.error("Tạo mã thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <div>
                <label className="block mb-1 text-sm font-medium">Số lượng</label>
                <Input {...register("quantity", { required: true })} />
            </div>
            <Button type="submit">Tạo mới</Button>
        </form>
    );
};

export const UpdateLotteryCode = ({ lotteryCodeId, onSuccess }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [provinces, setProvinces] = useState([]);
    const [products, setProducts] = useState([]);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await lotteryCodeService.getById(lotteryCodeId);
            reset({
                code: data.code || "",
                price: data.price || "",
                productName: data.productName || "",
                productId: data.productId?.toString() || "",
                place: data.place || "",
                accountName: data.user?.accountName || "",
                phoneNumber: data.user?.phoneNumber || "",
                address: data.user?.address || "",
                provinceId: data.user?.province?.provinceId?.toString() || "",
            });
        };
        fetchData();
    }, [lotteryCodeId, reset]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [provinceRes, productRes, placeRes] = await Promise.all([
                    provinceService.getAll(),
                    productService.getAll(setProducts),
                    userService.getByRole("ROLE_BRANCH_OWNER"),
                ]);

                setProvinces(provinceRes);
                setProducts(productRes);
                setPlaces(placeRes);
            } catch (err) {
                console.error("Lỗi tải dữ liệu dropdown:", err);
                toast.error("Không thể tải dữ liệu danh sách!");
            }
        };

        fetchDropdownData();
    }, []);

    const onSubmit = async (data) => {
        try {
            await lotteryCodeService.update(lotteryCodeId, data);
            toast.success("Cập nhật mã thành công!");
            onSuccess?.();
        } catch (error) {
            console.error("Cập nhật thất bại:", error);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <div>
                <label className="block mb-1 text-sm font-medium">Mã quay thưởng</label>
                <Input {...register("code")} disabled />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Giá trị</label>
                <Input {...register("price")} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Tên sản phẩm</label>
                <Select
                    onValueChange={(value) => {
                        const selected = products.find(p => p.productId.toString() === value);
                        setValue("productId", value);
                        setValue("productName", selected?.name || "");
                    }}
                    defaultValue={watch("productId")}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map((item) => (
                            <SelectItem key={item.productId} value={item.productId.toString()}>{item.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <input type="hidden" {...register("productId")} />
            <input type="hidden" {...register("productName")} />

            <div>
                <label className="block mb-1 text-sm font-medium">Địa điểm</label>
                <Select
                    onValueChange={(value) => setValue("place", value)}
                    defaultValue={watch("place")}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                        {places.map((item) => (
                            <SelectItem key={item.id} value={item.accountName}>{item.accountName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Họ và tên</label>
                <Input {...register("accountName", { required: true })} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Số điện thoại</label>
                <Input {...register("phoneNumber", { required: true })} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Địa chỉ</label>
                <Input {...register("address")} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Khu vực</label>
                <Select
                    onValueChange={(value) => setValue("provinceId", value)}
                    defaultValue={watch("provinceId")}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành" />
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((p) => (
                            <SelectItem key={p.provinceId} value={p.provinceId.toString()}>{p.provinceName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit">Cập nhật</Button>
        </form>
    );
};
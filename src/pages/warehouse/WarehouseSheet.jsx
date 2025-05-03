import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import warehouseService from "@/services/warehouseService.jsx";
import toast from "react-hot-toast";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import provinceService from "@/services/provinceService.jsx";

export const ViewWarehouseDetail = ({ warehouseId }) => {
    const { register, handleSubmit, reset } = useForm();
    const [warehouse, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết

    useEffect(() => {
        const fetchRole = async () => {
            await warehouseService.getById(warehouseId, (data) => {
                setWarehouse(data);
                console.log(data);
                // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
                reset({
                    name: data.name || data.warehouseName || "",
                    description: data.description || "",
                    province: data.province.name || "",
                    accessCode: data.accessCode,
                });
            });
        };

        fetchRole();
    }, [warehouseId, reset]);

    return (
        <form className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Tên kho</label>
                <Input {...register("name")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Access code</label>
                <Input {...register("accessCode")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Tỉnh</label>
                <Input {...register("province")} />
            </div>
        </form>
    );
};

export const UpdateWarehouse = ({ warehouseId, setData }) => {
    const { register, handleSubmit, reset } = useForm();
    const [warehouse, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết
    const [provinces, setProvinces] = useState([]);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    useEffect(() => {
        const fetchData = async () => {
            await warehouseService.getById(warehouseId, (data) => {
                setWarehouse(data);
                // Nếu data là 1 object đơn thì truyền trực tiếp, nếu là array thì lấy phần tử đầu
                reset({
                    name: data.name || data.warehouseName || "",
                    description: data.description || "",
                    province: data.province?.provinceId || "", // Sử dụng provinceId để gán vào select
                    // accessCode: data.accessCode
                });
            });

        };

        fetchData();
    }, [warehouseId, reset]);

    const onSubmit = async (formData) => {
        try {
            if (!formData.name?.trim()) {
                toast.error("Tên kho là bắt buộc");
                return;
            }
            await warehouseService.update(warehouseId, {
                name: formData.name,
                description: formData.description,
                provinceId: formData.province,
                userId: user.id,
                // accessCode: formData.accessCode
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
            {/* <div>
        <label className="block mb-1 text-sm font-medium">Access Code</label>
        <Input {...register("accessCode")}  />
      </div> */}
            <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} />
            </div>
            <Button type="submit">Lưu thay đổi</Button>
        </form>
    );
};

export const CreateWarehouse = ({ setData, onClose }) => {
    const { register, handleSubmit, reset } = useForm();
    const [warehouse, setWarehouse] = useState(null); // Lưu dữ liệu chi tiết
    const [provinces, setProvinces] = useState([]);
    const [openCreateSheet, setOpenCreateSheet] = useState(false);

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
        if (!formData.province?.trim()) {
            toast.error("Tên tỉnh là bắt buộc");
            return;
        }
        try {
            await warehouseService.create({
                name: formData.name,
                description: formData.description,
                provinceId: formData.province,
                accessCode: formData.accessCode,
            });
            toast.success("Thêm mới thành công!");
            const data = await warehouseService.getAll(setData);
            onClose?.(); // Gọi hàm đóng Sheet
            reset();
            // window.location.reload();
        } catch (error) {
            console.error("Lỗi thêm mới  kho:", error);
            // toast.error("Thêm mới thất bại!");
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
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <Input {...register("description")} />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium">Tỉnh</label>
                <select
                    {...register("province")}
                    className="w-full border rounded p-2"
                    defaultValue=""
                >
                    <option value="" disabled>Chọn tỉnh</option>
                    {provinces.map((province) => (
                        <option key={province.provinceId} value={province.provinceId}>
                            {province.provinceName}
                        </option>
                    ))}
                </select>
            </div>
            <Button type="submit">Thêm kho</Button>
        </form>
    );
};
import React, {useEffect, useState} from "react";
import productService from "@/services/productService.jsx";
import toast from "react-hot-toast";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useForm} from "react-hook-form";
import categoryService from "@/services/categoryService.jsx";

const CreateProduct = () => {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            misaCode: "",
            barcode: "",
            categoryId: "",
        },
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll(setCategories);
                // Nếu service trả về data, không dùng set trong service thì dùng: setCategories(data)
            } catch (error) {
                console.error("Lỗi lấy danh sách danh mục:", error);
            }
        };

        fetchCategories().catch(console.error);
    }, []);

    const onSubmit = async (formData) => {
        try {
            await productService.create({
                misaCode: formData.misaCode,
                barcode: formData.barcode,
                categoryId: Number(formData.categoryId),
            });
            toast.success("Tạo sản phẩm thành công!");
            window.location.reload();
        } catch (error) {
            console.error("Lỗi tạo sản phẩm:", error);
            toast.error("Lỗi khi tạo sản phẩm!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Mã MISA</label>
                <Input {...register("misaCode")} placeholder="Nhập mã MISA"/>
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Barcode</label>
                <Input {...register("barcode")} placeholder="Nhập mã barcode"/>
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Danh mục</label>
                <select {...register("categoryId")} className="w-full p-2 border rounded">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                        <option key={cat.categoryId} value={String(cat.categoryId)}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            <Button type="submit">Tạo sản phẩm</Button>
        </form>
    );
};

export default CreateProduct;
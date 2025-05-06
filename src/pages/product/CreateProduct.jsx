import React, {useEffect, useState} from "react";
import productService from "@/services/productService.jsx";
import categoryService from "@/services/categoryService.jsx";
import toast from "react-hot-toast";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Controller, useForm} from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {Save} from "lucide-react";
import LoadingOverlay from "@/components/common/LoadingOverlay.jsx";

const CreateProduct = ({onSuccess}) => {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: {errors},
    } = useForm({
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
                const data = await categoryService.getAll();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi lấy danh sách danh mục:", error);
                toast.error("Không thể tải danh mục.");
            }
        };

        fetchCategories();
    }, []);

    const [loading, setLoading] = useState(false);

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            await productService.create({
                misaCode: formData.misaCode,
                barcode: formData.barcode,
                categoryId: Number(formData.categoryId),
            });
            toast.success("Tạo sản phẩm thành công!");
            onSuccess?.();
        } catch (error) {
            console.error("Lỗi tạo sản phẩm:", error);
            //toast.error("Lỗi khi tạo sản phẩm!");

            // 👇 Set validation errors from server
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
            <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
                <div>
                    <label className="block mb-1 text-sm font-medium">Mã MISA</label>
                    <Input {...register("misaCode")} placeholder="Nhập mã MISA"/>
                    {errors.misaCode && <p className="text-sm text-red-500">{errors.misaCode.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Barcode</label>
                    <Input {...register("barcode")} placeholder="Nhập mã barcode"/>
                    {errors.barcode && <p className="text-sm text-red-500">{errors.barcode.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Danh mục</label>
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({field}) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn danh mục"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.categoryId} value={String(cat.categoryId)}>
                                            {cat.categoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
                </div>
                <Button type="submit" variant="default">
                    <Save className="mr-2 h-4 w-4"/> Lưu
                </Button>
            </form>
        </>
    );
};

export default CreateProduct;
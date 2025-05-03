import productApi from "@/api/productApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import toast from "react-hot-toast";
import warehouseApi from "@/api/warehouseApi.jsx";

const formatProduct = (product) => ({
    productId: product.productId,
    barcode: product.barcode,
    misaCode: product.misaCode,
    name: product.name,
    image: product.image,
    category: product.category ? product.category.categoryName : "",
    basePrice: product.basePrice,
    discount: product.discount,
    price: product.basePrice * (1 - product.discount / 100),
    quantity: product.quantity,
    unit: product.unit,
    quantityToGetPromotion: product.quantityToGetPromotion,
    description: product.description,
    status: product.status,
});

const productService = {
    async getAll(setData) {
        try {
            const response = await productApi.getAll();
            const products = Array.isArray(response.data)
                ? response.data
                : response.data?.products || [];

            setData(products.map(formatProduct));
        } catch (error) {
            handleApiError(error);
        }
    },

    async getPaging(setData, page, size) {
        try {
            const response = await productApi.getPaging(page, size);
            const products = Array.isArray(response.data.content)
                ? response.data.content
                : response.data.content?.products || [];

            setData(products.map(formatProduct));
        } catch (error) {
            handleApiError(error);
        }
    },

    async getById(id, setData) {
        try {
            const response = await productApi.getById(id);
            const product = response.data;

            const data = Array.isArray(product)
                ? product.map(formatProduct)
                : formatProduct(product);

            setData(data);
        } catch (error) {
            handleApiError(error);
        }
    },

    async getByWarehouseId(id, setData) {
        try {
            const response = await productApi.getByWarehouseId(id);
            const products = Array.isArray(response.data)
                ? response.data
                : response.data?.products || [];

            setData(products.map(formatProduct));
        } catch (error) {
            handleApiError(error);
        }
    },

    async getByWarehouseIdAndProductId(warehouseId, productId) {
        try {
            const response = await productApi.getByWarehouseIdAndProductId(warehouseId, productId);
            const product = response.data;

            const data = Array.isArray(product)
                ? product.map(formatProduct)
                : formatProduct(product);

            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async create(payload) {
        try {
            await productApi.create(payload);
            toast.success("Product created!");
        } catch (error) {
            handleApiError(error);
        }
    },

    async update(payload) {
        try {
            await productApi.update(payload);
            toast.success("Product updated!");
        } catch (error) {
            handleApiError(error);
        }
    },

    async changeStatus(id) {
        try {
            await productApi.changeStatus(id);
            toast.success("Product status updated!");
        } catch (error) {
            handleApiError(error);
        }
    },

    async fetchQuantity(id) {
        try {
            await productApi.fetchQuantity(id);
            toast.success("Product fetch quantity updated!");
        } catch (error) {
            handleApiError(error);
        }
    }
};

export default productService;
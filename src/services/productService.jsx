import productApi from "@/api/productApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import toast from "react-hot-toast";

const formatProduct = (product) => ({
  id: product.id,
  barcode: product.barcode || "",
  name: product.name || "Chưa cập nhật",
  price: product.basePrice,
  stock: product.quantity,
  status: product.status ? "Hoạt động" : "Bị khóa",
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
};

export default productService;
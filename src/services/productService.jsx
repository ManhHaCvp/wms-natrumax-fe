import productApi from "@/api/productApi.jsx";

const productService = {
  async getProductListPaging(setProducts, page, size) {
    try {
      const response = await productApi.getProductListPaging(page, size);

      // Ensure data is an array
      const products = Array.isArray(response.data.content) ? response.data.content : response.data.content?.products || [];

      const data = products.map((product) => ({
        id: product.id,
        code: product.barcode, // Fallback to accountName
        name: product.name || "Chưa cập nhật",
        price: product.basePrice,
        stock: product.quantity,
        status: product.status ? "Hoạt động" : "Bị khóa",
      }));

      setProducts(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    }
  },
};

export default productService;
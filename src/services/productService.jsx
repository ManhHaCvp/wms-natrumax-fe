import productApi from "@/api/productApi.jsx";

const productService = {
  async getProductList(setProducts) {
    try {
      const response = await productApi.getProductList();
      // Ensure data is an array
      const products = Array.isArray(response.data) ? response.data : response.data?.products || [];

      const data = products.map((product) => ({
        id: product.id,
        barcode: product.barcode, // Fallback to accountName
        name: product.name || "Chưa cập nhật",
        price: product.basePrice,
        stock: product.quantity,
        status: product.quantity !== 0,
      }));

      setProducts(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    }
  },

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
import categoryApi from "@/api/categoryApi.jsx";

const categoryService = {
  async getCategoryList(setData) {
    try {
      const response = await categoryApi.getCategoryList();

      // Ensure data is an array
      const categories = Array.isArray(response.data) ? response.data : response.data?.categories || [];

      const data = categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
      }));

      setData(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    }
  },
};

export default categoryService;
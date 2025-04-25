import categoryApi from "@/api/categoryApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import toast from "react-hot-toast";

const formatCategory = (category) => ({
  categoryId: category.categoryId,
  categoryName: category.categoryName,
  description: category.description,
});

const categoryService = {
  async getAll(setData) {
    try {
      const response = await categoryApi.getAll();
      const categories = Array.isArray(response.data)
        ? response.data
        : response.data?.categories || [];

      setData(categories.map(formatCategory));
    } catch (error) {
      handleApiError(error);
    }
  },

  async getById(id, setData) {
    try {
      const response = await categoryApi.getById(id);
      const category = response.data;

      // Nếu API trả về object thay vì array
      const data = Array.isArray(category)
        ? category.map(formatCategory)
        : formatCategory(category);

      setData(data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(payload) {
    try {
      await categoryApi.create(payload);
      toast.success("Tạo mới nhóm hàng thành công");
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(categoryId,payload) {
    try {
      await categoryApi.update(categoryId,payload);
      toast.success("Cập nhật thành công!");
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default categoryService;

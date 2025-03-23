import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const categoryApi = {
  getCategoryList: () => apiClient.get(`${BASE_URL}/v1/categories/all-categories`),

  getCategoryById: (id) => apiClient.get(`${BASE_URL}/v1/categories/${id}`),

  createCategory: (categoryRequest) => apiClient.post(`${BASE_URL}/v1/categories`, categoryRequest),

  updateCategory: (categoryRequest) => apiClient.put(`${BASE_URL}/v1/categories/${categoryRequest.id}`, categoryRequest),
}

export default categoryApi;
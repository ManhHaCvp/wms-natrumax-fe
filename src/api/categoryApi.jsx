import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const categoryApi = {
  getCategoryList: () => apiClient.get(`${BASE_URL}/v1/category/all-category`),

  getCategoryById: (id) => apiClient.get(`${BASE_URL}/v1/category/${id}`),

  createCategory: (categoryRequest) => apiClient.post(`${BASE_URL}/api/v1/category`, categoryRequest),

  updateCategory: (categoryRequest) => apiClient.put(`${BASE_URL}/api/v1/category/${categoryRequest.id}`, categoryRequest),
}

export default categoryApi;
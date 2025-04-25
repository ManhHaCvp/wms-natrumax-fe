import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const CATEGORY_BASE = `${BASE_URL}/v1/categories`;

const categoryApi = {
  getAll: () => apiClient.get(CATEGORY_BASE),
  getById: (id) => apiClient.get(`${CATEGORY_BASE}/${id}`),
  create: (payload) => apiClient.post(CATEGORY_BASE, payload),
  update: (id, payload) => apiClient.put(`${CATEGORY_BASE}/${id}`, payload),
};

export default categoryApi;
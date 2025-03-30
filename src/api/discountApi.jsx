import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const DISCOUNT_BASE = `${BASE_URL}/v1/discounts`;

const discountApi = {
  getAll: () => apiClient.get(DISCOUNT_BASE),
  getById: (id) => apiClient.get(`${DISCOUNT_BASE}/${id}`),
  create: (payload) => apiClient.post(DISCOUNT_BASE, payload),
  update: (payload) => apiClient.put(`${DISCOUNT_BASE}/${payload.id}`, payload),
  changeStatus: (id) => apiClient.put(`${DISCOUNT_BASE}/${id}/status`),
};

export default discountApi;
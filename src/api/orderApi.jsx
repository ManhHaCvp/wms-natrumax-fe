import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const ORDER_BASE = `${BASE_URL}/v1/orders`;

const orderApi = {
  create: (payload) => apiClient.post(`${ORDER_BASE}/create`, payload),
  getOrderList: () => apiClient.get(`${ORDER_BASE}`),
  getDetail: (id) => apiClient.get(`${ORDER_BASE}/${id}`),
  updateCodes: (payload) => apiClient.put(`${ORDER_BASE}/update-codes/${payload.id}`, payload),
  updateStatus: (id, status, title) => apiClient.put(`${ORDER_BASE}/update-status/${id}?status=${status}&title=${title}`),
};

export default orderApi;
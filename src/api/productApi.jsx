import apiClient from "@/utils/apiClient";
import { BASE_URL } from "@/utils/constants.jsx";

const PRODUCT_BASE = `${BASE_URL}/v1/products`;

const productApi = {
  getAll: () => apiClient.get(PRODUCT_BASE),
  getPaging: (page, size) =>
    apiClient.get(`${PRODUCT_BASE}/list-products-paging?page=${page}&size=${size}`),
  getById: (id) => apiClient.get(`${PRODUCT_BASE}/${id}`),
  create: (payload) => apiClient.post(PRODUCT_BASE, payload),
  update: (payload) => apiClient.put(`${PRODUCT_BASE}/${payload.id}`, payload),
  changeStatus: (id) => apiClient.put(`${PRODUCT_BASE}/${id}/status`),
};

export default productApi;
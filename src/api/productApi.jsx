import apiClient from "@/utils/apiClient";
import { BASE_URL } from "@/utils/constants.jsx";

const PRODUCT_BASE = `${BASE_URL}/v1/products`;
const WAREHOUSE_BASE = `${BASE_URL}/v1/warehouses`;

const productApi = {
  getAll: () => apiClient.get(PRODUCT_BASE),
  getPaging: (page, size) => apiClient.get(`${PRODUCT_BASE}/list-products-paging?page=${page}&size=${size}`),
  getById: (id) => apiClient.get(`${PRODUCT_BASE}/${id}`),
  getByWarehouseId: (id) => apiClient.get(`${WAREHOUSE_BASE}/${id}/products`),
  getByWarehouseIdAndProductId: (warehouseId, productId) => apiClient.get(`${WAREHOUSE_BASE}/${warehouseId}/products/${productId}`),
  create: (payload) => apiClient.post(PRODUCT_BASE, payload),
  update: (payload) => apiClient.put(`${PRODUCT_BASE}/${payload.id}`, payload),
  changeStatus: (id) => apiClient.put(`${PRODUCT_BASE}/${id}/status`),
  fetchQuantity: (id) => apiClient.get(`${BASE_URL}/v1/misa-products/warehouse/${id}/sync`),
};

export default productApi;
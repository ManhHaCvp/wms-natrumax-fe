import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const WAREHOUSE_BASE = `${BASE_URL}/v1/warehouses`;

const warehouseApi = {
  getAll: () => apiClient.get(WAREHOUSE_BASE),
  getById: (id) => apiClient.get(`${WAREHOUSE_BASE}/${id}`),
  create: (payload) => apiClient.post(WAREHOUSE_BASE, payload),
  update: (warehouseId,payload) => apiClient.put(`${WAREHOUSE_BASE}/${warehouseId}`, payload),
};

export default warehouseApi;
import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const warehouseApi = {
  getWarehouseList: () => apiClient.get(`${BASE_URL}/v1/warehouses`),

  getWarehouseById: (id) => apiClient.get(`${BASE_URL}/v1/warehouses/${id}`),

  createWarehouse: (warehouseRequest) => apiClient.post(`${BASE_URL}/v1/warehouses`, warehouseRequest),

  updateWarehouse: (warehouseRequest) => apiClient.put(`${BASE_URL}/v1/warehouses/${warehouseRequest.id}`, warehouseRequest),
}

export default warehouseApi;
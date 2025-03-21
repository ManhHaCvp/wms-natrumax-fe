import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const orderApi = {
  createOrder: (orderRequest) => apiClient.post(`${BASE_URL}/v1/orders/create`, orderRequest),

  updateOrderCodes: (orderRequest) => apiClient.put(`${BASE_URL}/v1/orders/update-codes/${orderRequest.id}`, orderRequest),

  updateOrderStatus: (id, status, title) => apiClient.put(`${BASE_URL}/v1/orders/update-status/${orderRequest.id}?status=${status}&title=${title}`),
}

export default orderApi;
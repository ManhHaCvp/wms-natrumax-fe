import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const discountApi = {
  getDiscountList: () => apiClient.get(`${BASE_URL}/v1/discounts`),

  getDiscountById: (id) => apiClient.get(`${BASE_URL}/v1/discounts/${id}`),

  createDiscount: (discountRequest) => apiClient.post(`${BASE_URL}/v1/discounts`, discountRequest),

  updateDiscount: (discountRequest) => apiClient.put(`${BASE_URL}/v1/discounts/${discountRequest.id}`, discountRequest),

  changeStatus: (id) => apiClient.put(`${BASE_URL}/v1/discounts/${id}/status`),
}

export default discountApi;
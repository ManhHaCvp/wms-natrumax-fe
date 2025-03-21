import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const promotionApi = {
  getPromotionList: () => apiClient.get(`${BASE_URL}/v1/promotions`),

  getPromotionById: (id) => apiClient.get(`${BASE_URL}/v1/promotions/${id}`),

  createPromotion: (promotionRequest) => apiClient.post(`${BASE_URL}/v1/promotions/create`, promotionRequest),

  checkPromotion: (checkPromotionRequest) => apiClient.post(`${BASE_URL}/v1/promotions/check-promotion`, checkPromotionRequest),

  updatePromotion: (promotionRequest) => apiClient.put(`${BASE_URL}/v1/promotions/${promotionRequest.id}`, promotionRequest),
}

export default promotionApi;
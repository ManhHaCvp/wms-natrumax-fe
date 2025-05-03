import apiClient from "@/utils/apiClient.jsx";
import {BASE_URL} from "@/utils/constants.jsx";

const PROMOTION_BASE = `${BASE_URL}/v1/promotions`;

const promotionApi = {
    getAll: () => apiClient.get(PROMOTION_BASE),
    getById: (id) => apiClient.get(`${PROMOTION_BASE}/${id}`),
    create: (payload) => apiClient.post(PROMOTION_BASE, payload),
    update: (payload) => apiClient.put(`${PROMOTION_BASE}/${payload.id}`, payload),
    check: (payload) => apiClient.post(`${PROMOTION_BASE}/check-promotion`, payload),
};

export default promotionApi;
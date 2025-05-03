import apiClient from "@/utils/apiClient.jsx";
import {BASE_URL} from "@/utils/constants.jsx";

const DISCOUNT_BASE = `${BASE_URL}/v1/discounts`;

const discountApi = {
    getAll: () => apiClient.get(DISCOUNT_BASE),
    getById: (id) => apiClient.get(`${DISCOUNT_BASE}/${id}`),
    getByTotalAmount: (payload) => apiClient.post(`${DISCOUNT_BASE}/get-by-total-amount`, payload),
    create: (payload) => apiClient.post(DISCOUNT_BASE, payload),
    update: (id, payload) => apiClient.put(`${DISCOUNT_BASE}/${id}`, payload),
    changeStatus: (id) => apiClient.put(`${DISCOUNT_BASE}/${id}/change-status`),
};

export default discountApi;
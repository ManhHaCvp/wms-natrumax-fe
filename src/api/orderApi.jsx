import apiClient from "@/utils/apiClient.jsx";
import {BASE_URL} from "@/utils/constants.jsx";

const ORDER_BASE = `${BASE_URL}/v1/orders`;
const ORDER_INVOICES_BASE = `${BASE_URL}/v1/order-invoices`;

const orderApi = {
    getAll: () => apiClient.get(`${ORDER_BASE}`),
    getById: (id) => apiClient.get(`${ORDER_BASE}/${id}`),
    getByUserId: (id) => apiClient.get(`${ORDER_BASE}/user/${id}`),
    create: (payload) => apiClient.post(`${ORDER_BASE}/create`, payload),
    uploadTransferImage: (id, formData) =>
        apiClient.post(`${ORDER_INVOICES_BASE}/transfer-image/${id}`, formData),
    uploadRefundImage: (id, formData) =>
        apiClient.post(`${ORDER_INVOICES_BASE}/refund-image/${id}`, formData),
    cancelOrder: (id) =>
        apiClient.put(`${ORDER_BASE}/cancel-order/${id}`),
};

export default orderApi;
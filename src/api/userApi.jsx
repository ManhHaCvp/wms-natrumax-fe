import apiClient from "@/utils/apiClient";
import {BASE_URL} from "@/utils/constants.jsx";

const USER_BASE = `${BASE_URL}/v1/users`;
const USER_WAREHOUSE_BASE = `${BASE_URL}/v1/user-warehouses`;

const userApi = {
    getAll: () => apiClient.get(USER_BASE),
    getPaging: (page, size) => apiClient.get(`${USER_BASE}/list-users-paging?page=${page}&size=${size}`),
    getById: (id) => apiClient.get(`${USER_BASE}/${id}`),
    getByRole: (role) => apiClient.get(`${USER_BASE}/role/${role}`),
    getReferralsByReferrerId: () => apiClient.get(`${USER_BASE}/roles`),
    getMembersByWarehouseId: (id) => apiClient.get(`${USER_WAREHOUSE_BASE}/members?warehouseId=${id}`),
    create: (payload) => apiClient.post(USER_BASE, payload),
    update: (payload) => apiClient.put(`${USER_BASE}/${payload.userId}`, payload),
    changePassword: (payload) => apiClient.put(`${USER_BASE}/${payload.id}/change-password`, payload),
    changeStatus: (id) => apiClient.put(`${USER_BASE}/${id}/change-status`),
};

export default userApi;
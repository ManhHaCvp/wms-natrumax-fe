import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const COMMISSION_BASE = `${BASE_URL}/v1/commissions`;

const commissionApi = {
    getAllReferrer: () => apiClient.get(`${COMMISSION_BASE}/referrers`),
    getPolicyByReferrerId: (id) => apiClient.get(`${COMMISSION_BASE}/referrer/${id}`),
    createPolicy: (payload) => apiClient.post(COMMISSION_BASE, payload),
    updatePolicy: (payload) => apiClient.put(`${COMMISSION_BASE}/update`, payload),
    createReport: (month, year) => apiClient.post(`${COMMISSION_BASE}/report?month=${month}&year=${year}`),
    createHistory: (month, year) => apiClient.post(`${COMMISSION_BASE}/history?month=${month}&year=${year}`),

};  

export default commissionApi;
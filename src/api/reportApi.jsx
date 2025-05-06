import {BASE_URL} from "@/utils/constants.jsx";
import apiClient from "@/utils/apiClient.jsx";

const REPORT_BASE = `${BASE_URL}/v1/reports`;

const reportApi = {
    getByUserId: (id, month, year) => apiClient.get(`${REPORT_BASE}/user?userId=${id}&month=${month}&year=${year}`),
    getSold: (month, year) => apiClient.get(`${REPORT_BASE}/sold?month=${month}&year=${year}`),
    getTopImported: () => apiClient.get(`${REPORT_BASE}/top-imported`),
    getTopUserOrder: () => apiClient.get(`${REPORT_BASE}/top-users-order`),
};

export default reportApi;
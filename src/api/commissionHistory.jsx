import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const COMMISSION_HISTORY_BASE = `${BASE_URL}/v1/commission-histories`;

const commissionHistoryApi = {
    getByReferrerId: (id) => apiClient.get(`${COMMISSION_HISTORY_BASE}/${id}/history`),
    getByReferrerIdAndTime: (id, month, year) => apiClient.get(`${COMMISSION_HISTORY_BASE}/commissions?referrerId=${id}&month=${month}&year=${year}`),
};

export default commissionHistoryApi;
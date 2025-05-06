import apiClient from "@/utils/apiClient.jsx";
import {BASE_URL} from "@/utils/constants.jsx";

const LOTTERY_CODE_BASE = `${BASE_URL}/v1/lottery-codes`;

const lotteryCodeApi = {
    getAll: () => apiClient.get(LOTTERY_CODE_BASE),
    getById: (id) => apiClient.get(`${LOTTERY_CODE_BASE}/${id}`),
    getByUserId: (id) => apiClient.get(`${LOTTERY_CODE_BASE}/user/${id}`),
    create: (payload) => apiClient.post(LOTTERY_CODE_BASE, payload),
    update: (id, payload) => apiClient.put(`${LOTTERY_CODE_BASE}/${id}`, payload),
    updateReward: (id, rewardId) => apiClient.put(`${LOTTERY_CODE_BASE}/${id}/reward/${rewardId}`),
};

export default lotteryCodeApi;
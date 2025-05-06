import apiClient from "@/utils/apiClient.jsx";
import {BASE_URL} from "@/utils/constants.jsx";

const REWARD_BASE = `${BASE_URL}/v1/rewards`;

const rewardApi = {
    getAll: () => apiClient.get(REWARD_BASE),
    getById: (id) => apiClient.get(`${REWARD_BASE}/${id}`),
    create: (formData) => apiClient.post(REWARD_BASE, formData),
    update: (id, formData) => apiClient.put(`${REWARD_BASE}/${id}`, formData),
    changeStatus: (id) => apiClient.put(`${REWARD_BASE}/${id}/change-status`),
};

export default rewardApi;
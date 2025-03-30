import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const ROLE_BASE = `${BASE_URL}/v1/roles`;

const roleApi = {
  getAll: () => apiClient.get(ROLE_BASE),
  getById: (id) => apiClient.get(`${ROLE_BASE}/${id}`),
  create: (payload) => apiClient.post(ROLE_BASE, payload),
  update: (payload) => apiClient.put(`${ROLE_BASE}/${payload.id}`, payload),
};

export default roleApi;
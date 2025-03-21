import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const roleApi = {
  getRoleList: () => apiClient.get(`${BASE_URL}/api/v1/roles`),

  getRoleById: (id) => apiClient.get(`${BASE_URL}/api/v1/roles/${id}`),

  createRole: (roleRequest) => apiClient.post(`${BASE_URL}/api/v1/roles`, roleRequest),

  updateRole: (roleRequest) => apiClient.put(`${BASE_URL}/api/v1/roles/${roleRequest.id}`, roleRequest),
}

export default roleApi;
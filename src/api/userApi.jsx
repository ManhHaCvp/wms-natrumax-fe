import apiClient from "@/utils/apiClient";
import { BASE_URL } from "@/utils/constants.jsx";

const userApi = {
  getUserList: () => apiClient.get(`${BASE_URL}/v1/users/all-user`),

  getUserListPaging: (page, size) => apiClient.get(`${BASE_URL}/v1/users/list-users-paging?page=${page}&size=${size}`),

  getUserById: (id) => apiClient.get(`${BASE_URL}/v1/users/${id}`),

  createUser: (userRequest) => apiClient.post(`${BASE_URL}/v1/users/create`, userRequest),

  updateUser: (userRequest) => apiClient.put(`${BASE_URL}/v1/users/update/${userRequest.id}`, userRequest),

  changePassword: (changePasswordRequest) => apiClient.put(`${BASE_URL}/v1/users/${changePasswordRequest.id}/change-password`, changePasswordRequest),

  changeStatus: (id) => apiClient.put(`${BASE_URL}/v1/users/${id}/toggle-status`),
};

export default userApi;
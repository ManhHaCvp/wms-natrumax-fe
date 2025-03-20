import axios from "axios";
import { BASE_URL } from "@/utils/constants.jsx";

const userApi = {
  getUserList: () => axios.get(`${BASE_URL}/api/v1/users/all-user`, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}),

  getUserById: (id) => axios.get(`${BASE_URL}/api/v1/users/${id}`, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}),
};

export default userApi;
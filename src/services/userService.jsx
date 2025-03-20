import axios from "axios";
import authApi from "@/api/authApi.jsx";
import toast from "react-hot-toast";
import userApi from "@/api/userApi.jsx";
import api from "@/api/userApi.jsx";

const userService = {
  async getUserList(setUsers, sampleUsers) {
    try {
      const response = await userApi.getUserList();

      // Ensure data is an array
      const users = Array.isArray(response.data) ? response.data : response.data?.users || [];

      const data = users.map((user) => ({
        id: user.id,
        name: user.fullName || user.accountName, // Fallback to accountName
        address: user.address || "Chưa cập nhật",
        phone: user.phoneNumber,
        createdAt: user.createDate,
        role: user.role?.name.replace("ROLE_", "") || "User",
        status: user.status ? "Hoạt động" : "Bị khóa",
      }));

      setUsers(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      setUsers(sampleUsers);
    }
  },

  async getUserById(id, setUser) {
    try {
      const response = await api.getUserById(id);
      const data = response.data;
      setUser({
        name: data.accountName,
        role: data.role,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        status: data.status ? 'Hoạt động' : 'Vô hiệu hóa',
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
};

export default userService;
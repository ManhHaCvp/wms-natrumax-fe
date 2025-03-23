import userApi from "@/api/userApi.jsx";

const userService = {
  async getUserList(setData) {
    try {
      const response = await userApi.getUserList();

      // Ensure data is an array
      const users = Array.isArray(response.data) ? response.data : response.data?.users || [];

      console.log(response);

      const data = users.map((user) => ({
        id: user.id,
        accountName: user.accountName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        status: user.status,
        role: user.role.name,
      }));

      setData(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    }
  },

  async getUserById(id, setUser) {
    try {
      const response = await userApi.getUserById(id);
      const data = response.data;
      setUser({
        accountName: data.accountName,
        role: data.role,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        status: data.status ? "Hoạt động" : "Vô hiệu hóa",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
};

export default userService;
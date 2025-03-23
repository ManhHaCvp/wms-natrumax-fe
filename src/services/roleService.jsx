import roleApi from "@/api/roleApi";

const roleService = {
  async getRoleList(setData) {
    try {
      const response = await roleApi.getRoleList();

      // Ensure data is an array
      const roles = Array.isArray(response.data) ? response.data : response.data?.roles || [];

      const data = roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      }));

      setData(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    }
  },
};

export default roleService;
import roleApi from "@/api/roleApi";
import handleApiError from "@/utils/HandleApiError.jsx";

const formatRole = (role) => ({
  roleId: role.id,
  roleName: role.name,
  description: role.description,
});

const roleService = {
  async getAll(setData) {
    try {
      const response = await roleApi.getAll();
      const roles = Array.isArray(response.data)
        ? response.data
        : response.data?.roles || [];

      setData(roles.map(formatRole));
    } catch (error) {
      handleApiError(error);
    }
  },

  async getById(id, setData) {
    try {
      const response = await roleApi.getById(id);
      const role = response.data;

      const data = Array.isArray(role)
        ? role.map(formatRole)
        : formatRole(role);

      setData(data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(payload) {
    try {
      await roleApi.create(payload);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(roleId,payload) {
    try {
      await roleApi.update(roleId,payload);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default roleService;
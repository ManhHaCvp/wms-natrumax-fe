import userApi from "@/api/userApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";

const formatUser = (user) => ({
  id: user.id,
  accountName: user.accountName,
  phoneNumber: user.phoneNumber,
  address: user.address,
  email: user.email,
  detail: user.detail,
  status: user.status,
  role: user.role || "Chưa phân quyền",
  provice: user.province
});

const userService = {
  async getAll(setData) {
    try {
      const response = await userApi.getAll();

      const users = Array.isArray(response.data)
        ? response.data
        : response.data?.users || [];

      setData(users.map(formatUser));
    } catch (error) {
      handleApiError(error);
    }
  },

  async getById(id, setData) {
    try {
      const response = await userApi.getById(id);
      const user = response.data;
      const data = Array.isArray(user)
        ? user.map(formatUser)
        : formatUser(user);

      setData(data);
      return user;
    } catch (error) {
      handleApiError(error);
    }
  },

  async getPaging(setData, page, size) {
    try {
      const response = await userApi.getPaging(page, size);
      const users = Array.isArray(response.data.content)
        ? response.data.content
        : response.data.content?.users || [];

      setData(users.map(formatUser));
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(payload) {
    try {
      await userApi.create(payload);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(payload) {
    try {
      await userApi.update(payload);
    } catch (error) {
      handleApiError(error);
    }
  },

  async changePassword(payload) {
    try {
      await userApi.changePassword(payload);
    } catch (error) {
      handleApiError(error);
    }
  },

  async changeStatus(id) {
    try {
      await userApi.changeStatus(id);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default userService;
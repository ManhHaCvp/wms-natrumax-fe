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
    provice: user.provice
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

    async getById(id) {
        try {
            const response = await userApi.getById(id);
            return response.data;
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

    async getReferralsByReferrerId(setData) {
        try {
            const response = await userApi.getReferralsByReferrerId();

            const users = Array.isArray(response.data)
                ? response.data
                : response.data?.users || [];

            setData(users.map(formatUser));
        } catch (error) {
            handleApiError(error);
        }
    },

    async getMembersByWarehouseId(id) {
        try {
            const response = await userApi.getMembersByWarehouseId(id);

            let users = Array.isArray(response.data)
                ? response.data
                : response.data?.users || [];

            users = users.sort((a, b) => {
                if (a.roleInWarehouse === "Owner") return -1;
                if (b.roleInWarehouse === "Owner") return 1;
                return 0;
            });

            return users;
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
    }
};

export default userService;
import lotteryCodeApi from "@/api/lotteryCodeApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import toast from "react-hot-toast";

const lotteryCodeService = {
    async getAll() {
        try {
            const response = await lotteryCodeApi.getAll();
            return Array.isArray(response.data)
                ? response.data : []
        } catch (error) {
            handleApiError(error);
        }
    },

    async getById(id) {
        try {
            const response = await lotteryCodeApi.getById(id);
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async getByUserId(id, setData) {
        try {
            const response = await lotteryCodeApi.getByUserId(id);
            const lotteryCode = response.data;

            // Nếu API trả về object thay vì array
            const data = Array.isArray(lotteryCode)
                ? lotteryCode : [];

            setData(data);
        } catch (error) {
            handleApiError(error);
        }
    },

    async create(payload) {
        try {
            await lotteryCodeApi.create(payload);
            toast.success("Tạo mới mã thành công");
        } catch (error) {
            handleApiError(error);
        }
    },

    async update(lotteryCodeId, payload) {
        try {
            await lotteryCodeApi.update(lotteryCodeId, payload);
            toast.success("Cập nhật mã thành công!");
        } catch (error) {
            handleApiError(error);
        }
    },

    async updateReward(lotteryCodeId, rewardId) {
        try {
            await lotteryCodeApi.updateReward(lotteryCodeId, rewardId);
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default lotteryCodeService;

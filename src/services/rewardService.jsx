import rewardApi from "@/api/rewardApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import toast from "react-hot-toast";

const rewardService = {
    async getAll() {
        try {
            const response = await rewardApi.getAll();
            return Array.isArray(response.data)
                ? response.data : [];
        } catch (error) {
            handleApiError(error);
        }
    },

    async getById(id, setData) {
        try {
            const response = await rewardApi.getById(id);
            const reward = response.data;

            setData(reward);
        } catch (error) {
            handleApiError(error);
        }
    },

    async create(formData) {
        try {
            await rewardApi.create(formData);
            toast.success("Tạo mới phần thưởng thành công");
        } catch (error) {
            handleApiError(error);
        }
    },

    async update(rewardId, formData) {
        try {
            await rewardApi.update(rewardId, formData);
            toast.success("Cập nhật phần thưởng thành công!");
        } catch (error) {
            handleApiError(error);
        }
    },

    async changeStatus(rewardId) {
        try {
            await rewardApi.changeStatus(rewardId);
            toast.success("Cập nhật trang thái phần thưởng thành công!");
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default rewardService;

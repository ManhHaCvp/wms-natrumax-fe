import handleApiError from "@/utils/HandleApiError.jsx";
import commissionApi from "@/api/commissionApi.jsx";
import toast from "react-hot-toast";

const formatReferrer = (referrer) => ({
    id: referrer.id,
    accountName: referrer.accountName,
    phoneNumber: referrer.phoneNumber,
    role: referrer.role || "Chưa phân quyền",
    address: referrer.address,
    province: referrer.province,
})

const commissionService = {
    async getAllReferrer(setData) {
        try {
            const response = await commissionApi.getAllReferrer();
            const referrers = Array.isArray(response.data)
                ? response.data : [];

            setData(referrers.map(formatReferrer));
        } catch (error) {
            handleApiError(error);
        }
    },

    async getPolicyByReferrerId(id, setData) {
        try {
            const response = await commissionApi.getPolicyByReferrerId(id);
            setData(response.data);
        } catch (error) {
            handleApiError(error);
        }
    },

    async createPolicy(payload) {
        try {
            await commissionApi.createPolicy(payload);
            toast.success("Tạo mới chính sách thành công");
        } catch (error) {
            handleApiError(error);
        }
    },

    async updatePolicy(categoryId,payload) {
        try {
            await commissionApi.updatePolicy(payload);
            toast.success("Cập nhật thành công!");
        } catch (error) {
            handleApiError(error);
        }
    },

    async createReport(month, year) {
        try {
            await commissionApi.createReport(month, year);
            toast.success("Tạo mới báo cáo thành công");
        } catch (error) {
            handleApiError(error);
        }
    },

    async createHistory(month, year) {
        try {
            await commissionApi.createHistory(month, year);
            toast.success("Tạo mới lịch sử hoa hồng thành công");
        } catch (error) {
            handleApiError(error);
        }
    },
}

export default commissionService;
import transactionApi from "@/api/transactionApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";

const transactionService = {
    async create(payload) {
        try {
           return await transactionApi.create(payload);
        } catch (error) {
            handleApiError(error);
        }
    },
    async getByWalletId(walletId) {
        try {
            return await transactionApi.getByWalletId(walletId);
        } catch (error) {
            handleApiError(error);
        }
    },
    async uploadTransferImage(id, formData) {
        try {
            return await transactionApi.uploadTransferImage(id, formData);
        } catch (error) {
            handleApiError(error);
        }
    },
    async uploadRefundImage(id, formData) {
        try {
            return await transactionApi.uploadRefundImage(id, formData);
        } catch (error) {
            handleApiError(error);
        }
    },
};
export default transactionService;
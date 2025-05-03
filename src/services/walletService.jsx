import walletApi from "@/api/walletApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";

const walletService = {
    async getWalletByUserId(id) {
        try {
            return await walletApi.getWalletByUserId(id);
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default walletService;
import transactionApi from "@/api/transactionApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
const transactionService = {
    async create(payload) {
      try {
        await transactionApi.create(payload);
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
    async uploadTranferImage(id,formdata) {
      try {
        return await transactionApi.uploadTranferImage(id,formdata);
      } catch (error) {
        handleApiError(error);
      }
    },
  };
export default transactionService;
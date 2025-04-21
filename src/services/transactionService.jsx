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
  };
export default transactionService;
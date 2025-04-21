import apiClient from "@/utils/apiClient";
import { BASE_URL } from "@/utils/constants.jsx";

const TRANSACTION_BASE = `${BASE_URL}/v1/transactions`;
const transactionApi = {
    create: (payload) => apiClient.post(TRANSACTION_BASE, payload),
  };
  
  export default transactionApi;
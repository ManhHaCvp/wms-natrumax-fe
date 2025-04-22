import apiClient from "@/utils/apiClient";
import { BASE_URL } from "@/utils/constants.jsx";

const TRANSACTION_BASE = `${BASE_URL}/v1/transactions`;
const transactionApi = {
    create: (payload) => apiClient.post(TRANSACTION_BASE, payload),
    getByWalletId: (id) => apiClient.get(`${TRANSACTION_BASE}/wallet/${id}`),
    uploadTranferImage: (id, formData) =>
      apiClient.post(`${TRANSACTION_BASE}/transfer-image/${id}`, formData),
    
  };
  
  export default transactionApi;
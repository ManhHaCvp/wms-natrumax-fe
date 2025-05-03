import apiClient from "@/utils/apiClient";
import {BASE_URL} from "@/utils/constants.jsx";

const WALLET_BASE = `${BASE_URL}/v1/wallets`;

const walletApi = {
    getWalletByUserId: (id) => apiClient.get(`${WALLET_BASE}/user/${id}`),
};

export default walletApi;
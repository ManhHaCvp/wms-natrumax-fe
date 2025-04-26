import apiClient from "@/utils/apiClient.jsx";
import { BASE_URL } from "@/utils/constants.jsx";

const PROVINCE_BASE = `${BASE_URL}/v1/provinces`;
const provinceApi = {
    getAll: () => apiClient.get(PROVINCE_BASE),
};

export default provinceApi;
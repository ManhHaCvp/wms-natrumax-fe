import axios from "axios";
import {BASE_URL} from "@/utils/constants.jsx";

const apiClient = axios.create({
    baseURL: BASE_URL,
});

// Function to attach the token dynamically
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
import categoryApi from "@/api/categoryApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import reportApi from "@/api/reportApi.jsx";

const reportService = {
    async getByUserId(id, month, year) {
        try {
            const response = await reportApi.getByUserId(id, month, year);
            return Array.isArray(response.data)
                ? response.data : [];
        } catch (error) {
            handleApiError(error);
        }
    },

    async getSold(month, year) {
        try {
            const response = await reportApi.getSold(month, year);
            return Array.isArray(response.data)
                ? response.data : [];
        } catch (error) {
            handleApiError(error);
        }
    },

    async getTopImported() {
        try {
            const response = await reportApi.getTopImported();
            return Array.isArray(response.data)
                ? response.data : [];
        } catch (error) {
            handleApiError(error);
        }
    },

    async getTopUserOrder() {
        try {
            const response = await reportApi.getTopUserOrder();
            return Array.isArray(response.data)
                ? response.data : [];
        } catch (error) {
            handleApiError(error);
        }
    }
}

export default reportService;
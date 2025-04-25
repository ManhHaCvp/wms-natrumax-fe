import provinceApi from "@/api/provinceApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";

const formatProvince = (province) => ({
    provinceId: province.provinceId,
    provinceName: province.name,

});

const provinceService = {
    async getAll() {
        try {
            const response = await provinceApi.getAll();

            const provinces = Array.isArray(response.data)
                ? response.data
                : response.data?.provinces || [];

            return provinces.map(formatProvince);
        } catch (error) {
            handleApiError(error);
        }
    }
};

export default provinceService;
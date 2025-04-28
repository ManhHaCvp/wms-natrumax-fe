import mockApi from "@/api/mockApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import toast from "react-hot-toast";

const mockApiService = {
    async getSales(setData) {
        try {
            const response = await mockApi.getSales();
            const sales = Array.isArray(response.data)
                ? response.data
                : response.data?.data || []; // fallback to .data

            setData(sales);
        } catch (error) {
            handleApiError(error);
        }
    },

    async getSaleByVoucherNo(voucherNo, setData) {
        try {
            const response = await mockApi.getSaleByVoucherNo(voucherNo);
            const sales = Array.isArray(response.data.data) ? response.data.data : [];
            const sale = sales[0] || null;
            setData(sale);
        } catch (error) {
            handleApiError(error);
        }
    },

    async createInventoryOutBySale(voucherNo, clientSecret) {
        try {
            await mockApi.createInventoryOutBySale(voucherNo, clientSecret);
            toast.success("Tạo phiếu xuất kho thành công!");
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default mockApiService;
import handleApiError from "@/utils/HandleApiError.jsx";
import commissionHistoryApi from "@/api/commissionHistoryApi.jsx";
import commissionService from "@/services/commissionService.jsx";

const formatCommissionHistory = (commissionHistory) => ({
    commissionHistoriesId: commissionHistory.commissionHistoriesId,
    totalAmount: commissionHistory.totalAmount,
    month: commissionHistory.month,
    year: commissionHistory.year,
})

const commissionHistoryService = {
    async getByReferrerId(id, setData) {
        try {
            const response = await commissionHistoryApi.getByReferrerId(id);
            const commissionHistories = Array.isArray(response.data)
                ? response.data : [];

            setData(commissionHistories.map(formatCommissionHistory));
        } catch (error) {
            handleApiError(error);
        }
    },

    async getByReferrerIdAndTime(id, month, year, setData) {
        try {
            await commissionService.createReport(month, year).catch(handleApiError);
            await commissionService.createHistory(month, year).catch(handleApiError);
            const response = await commissionHistoryApi.getByReferrerIdAndTime(id, month, year);
            setData(response.data);
        } catch (error) {
            handleApiError(error);
        }
    },
    async updateTransaction(referrerId, month, year, transactionId) {
        try {
            console.log(referrerId, month, year, transactionId);
            await commissionHistoryApi.updateTransaction(referrerId, month, year, transactionId);
            
        } catch (error) {
            handleApiError(error);
        }
    }
}

export default commissionHistoryService;
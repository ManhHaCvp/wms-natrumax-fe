import axios from "axios";

const MOCK_BASE = "https://mock-api-bice.vercel.app";

const mockApi = {
    getSales: () => axios.get(`${MOCK_BASE}/misa-sales`),
    getSaleByVoucherNo: (voucherNo) => axios.get(`${MOCK_BASE}/misa-sales?Voucher_no=${voucherNo}`),
    createInventoryOutBySale: (voucherNo, clientSecret) =>
        axios.get(`${MOCK_BASE}/getSaleByVoucher?Voucher_no=${voucherNo}`, {
            headers: {
                "clientSecret": clientSecret,
            },
        }),
};

export default mockApi;
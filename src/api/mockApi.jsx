import axios from "axios";

const MOCK_BASE = "https://mock-api-bice.vercel.app";

const mockApi = {
    getSales: () => axios.get(`${MOCK_BASE}/misa-sales`),
    getSaleByVoucherNo: (voucherNo) => axios.get(`${MOCK_BASE}/misa-sales?Voucher_no=${voucherNo}`),
    getInventoryOutsBySaleId: (clientSecret, saleId) =>
        axios.get(`${MOCK_BASE}/misa-inventory-outs?sale_id=${saleId}`, {
            headers: {
                "clientSecret": clientSecret,
            },
        }),
    createInventoryOut: (clientSecret, payload) =>
        axios.post(`${MOCK_BASE}/misa-inventory-outs`, payload, {
            headers: {
                "clientSecret": clientSecret,
            },
        }),
    getProductDetail: (retailerId, productCode) =>
        axios.get(`${MOCK_BASE}/kiotviet-products-branches/detail?productCode=${productCode}`, {
            headers: {
                retailerId,
            }
        }),
    getReceipts: () => axios.get(`${MOCK_BASE}/misa-receipts?pageSize=100`),
    getInventoryIns: (clientSecret) => axios.get(`${MOCK_BASE}/misa-inventory-ins`, {
        headers: {
            clientSecret,
        }
    }),
    getPurchaseOrders: () => axios.get(`${MOCK_BASE}/kiotViet-purchase-order?pageSize=100`),
};

export default mockApi;
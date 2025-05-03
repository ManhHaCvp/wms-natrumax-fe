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

    async getInventoryOutsBySaleId(clientSecret, saleId, setData) {
        try {
            const response = await mockApi.getInventoryOutsBySaleId(clientSecret, saleId);
            const inventoryOuts = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];

            setData(inventoryOuts);
        } catch (error) {
            handleApiError(error);
        }
    },

    async createInventoryOutBySale(voucherNo, clientSecret) {
        try {
            // 1. Get sale info by voucher number
            const response = await mockApi.getSaleByVoucherNo(voucherNo);
            const sale = response.data?.data?.[0];

            if (!sale) {
                toast.error("Sale not found!");
                return;
            }

            // 2. Build payload for inventory out
            const payload = {
                Customer_id: "MB.HD.107",
                Posted_date: new Date(),
                Voucher_date: new Date(),
                sale_id: sale._id,
                inventory_out_items: sale.sale_items.map(item => ({
                    Code: item.Good,
                    Quantity: item.Quantity.toString(),
                    Status: "Xuất đủ"
                }))
            };

            console.log(payload);

            // 3. Create inventory out
            const createResponse = await mockApi.createInventoryOut(clientSecret, payload);

            toast.success("Inventory out created successfully!");

            return createResponse.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async getProductDetail(retailerId, productCode, setData) {
        try {
            const response = await mockApi.getProductDetail(retailerId, productCode);
            console.log(response.data, retailerId, productCode);
            setData(response.data.quantity);
        } catch (error) {
            handleApiError(error);
        }
    },

    async getReceipts(clientSecret, setData) {
        try {
            const response = await mockApi.getReceipts();
            const receipts = Array.isArray(response.data)
                ? response.data
                : response.data?.data || []; // fallback to .data

            setData(receipts);
        } catch (error) {
            handleApiError(error);
        }
    },

    async getInventoryIns(clientSecret, setData) {
        try {
            const response = await mockApi.getInventoryIns(clientSecret);
            const inventoryIns = Array.isArray(response.data)
                ? response.data
                : response.data?.data || []; // fallback to .data

            setData(inventoryIns);
        } catch (error) {
            handleApiError(error);
        }
    },

    async getPurchaseOrders(retailerId, setData) {
        try {
            const response = await mockApi.getPurchaseOrders();
            const purchaseOrders = Array.isArray(response.data)
                ? response.data
                : response.data?.data || []; // fallback to .data

            setData(purchaseOrders);
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default mockApiService;
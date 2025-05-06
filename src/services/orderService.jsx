import orderApi from "@/api/orderApi.jsx";
import handleApiError from "@/utils/HandleApiError";
import axios from "axios";

const orderService = {
    async getAll(setData) {
        try {
            const response = await orderApi.getAll();

            // Ensure data is an array
            const orders = Array.isArray(response.data) ? response.data : response.data?.orders || [];

            const data = orders.map((order) => ({
                orderId: order.orderId,
                orderDate: order.orderDate,
                accountName: order.user.accountName,
                totalAmount: order.invoices.totalAmount,
                status: order.status,
            }));

            setData(data);
        } catch (error) {
            handleApiError(error);
        }
    },

    async getById(id, setOrder) {
        const response = await orderApi.getById(id);
        const data = response.data;
        setOrder({
            id: data.orderId,
            items: data.orderDetails, // update this when you have order item API
            discount: data?.invoices?.discount?.discountPercent ?? 0, // or data.discount if available
            paymentStatus: data.invoices.status, // convert from data.status if needed
            orderStatus: data.status,
            activities: [], // populate if available
            customer: {
                id: data.user.id,
                name: data.user.accountName,
                phone: data.user.phoneNumber,
                address: data.user.address,
                saleOrderCode: data.saleCode,
                inventoryOutCode: data.inventoryOutCode,
            },
            paymentMethod: data.invoices.paymentMethod,
            orderModifyHistories: data.orderModifyHistories,
            urlTransferImage: data.invoices.transferImage,
            urlRefundImage: data.invoices.refundImage,
            bank: data.user.bank
        });
    },

    async getByUserId(id) {
        try {
            const response = await orderApi.getByUserId(id);

            // Ensure data is an array
            const orders = Array.isArray(response.data) ? response.data : response.data?.orders || [];

            return orders.map((order) => ({
                orderId: order.orderId,
                orderDate: order.orderDate,
                accountName: order.user.accountName,
                totalAmount: order.invoices.totalAmount,
                status: order.status,
            }));
        } catch (error) {
            handleApiError(error);
        }
    },

    async create(payload) {
        const response = await axios.post("http://localhost:8080/api/v1/orders", payload);
        return response.data;
    },

    async uploadTransferImage(id, formData) {
        try {
            return await orderApi.uploadTransferImage(id, formData);
        } catch (error) {
            handleApiError(error);
        }
    },

    async uploadRefundImage(id, formData) {
        try {
            return await orderApi.uploadRefundImage(id, formData);
        } catch (error) {
            handleApiError(error);
        }
    },

    async cancelOrder(id) {
        try {
            await orderApi.cancelOrder(id);
        } catch (error) {
            handleApiError(error);
        }
    }
};

export default orderService;

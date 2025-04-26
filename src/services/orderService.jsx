import orderApi from "@/api/orderApi.jsx";
import handleApiError from "@/utils/HandleApiError";
import axios from "axios";
import handleApiError from "@/utils/HandleApiError.jsx";

const orderService = {
  async getOrderList(setData) {
    try {
      const response = await orderApi.getOrderList();

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

  async create(payload) {
    const response = await axios.post("http://localhost:8080/api/v1/orders", payload);
    return response.data;
  },
  async getDetail(id) {
    const response = await orderApi.getOrderList(id);
    return response.data;
  },
  async uploadTranferImage(id,formdata) {
    try {
      return await orderApi.uploadTranferImage(id,formdata);
    } catch (error) {
      handleApiError(error);
    }
  },
  async uploadRefundImage(id,formdata) {
    try {
      return await orderApi.uploadRefundImage(id,formdata);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default orderService;

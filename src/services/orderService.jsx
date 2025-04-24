import orderApi from "@/api/orderApi.jsx";
import axios from "axios";

const orderService = {
  async getAll(setData) {
    try {
      //const response = await orderApi.getOrderList();
      const response = [];

      // Ensure data is an array
      const orders = Array.isArray(response.data) ? response.data : response.data?.orders || [];

      const data = orders.map((order) => ({
        orderId: order.orderId,
        orderDate: order.orderDate,
        accountName: order.user.accountName,
        totalAmount: order.totalAmount,
        status: order.status,
      }));

      setData(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    }
  },

     async create (payload){
    const response = await axios.post("http://localhost:8080/api/v1/orders", payload);
    return response.data;
  }

};

export default orderService;
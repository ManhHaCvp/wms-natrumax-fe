import orderApi from "@/api/orderApi.jsx";

const orderService = {
  async getOrderList(setData) {
    try {
      //const response = await orderApi.getOrderList();
      const response = [];

      // Ensure data is an array
      const orders = Array.isArray(response.data) ? response.data : response.data?.orders || [];

      const data = orders.map((order) => ({
        id: order.id,
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
};

export default orderService;
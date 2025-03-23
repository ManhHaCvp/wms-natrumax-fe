import warehouseApi from "@/api/warehouseApi.jsx";

const warehouseService = {
  async getWarehouseList(setData) {
    try {
      const response = await warehouseApi.getWarehouseList();

      // Ensure data is an array
      const warehouses = Array.isArray(response.data) ? response.data : response.data?.warehouses || [];

      console.log(response);

      const data = warehouses.map((warehouse) => ({
        id: warehouse.id,
        name: warehouse.name,
        province: warehouse.province,
        description: warehouse.description,
      }));

      setData(data);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
    }
  },
};

export default warehouseService;
import warehouseApi from "@/api/warehouseApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";

const formatWarehouse = (warehouse) => ({
  id: warehouse.id,
  name: warehouse.name,
  province: warehouse.province,
  description: warehouse.description,
});

const warehouseService = {
  async getAll(setData) {
    try {
      const response = await warehouseApi.getAll();

      const warehouses = Array.isArray(response.data)
        ? response.data
        : response.data?.warehouses || [];

      setData(warehouses.map(formatWarehouse));
    } catch (error) {
      handleApiError(error);
    }
  },

  async getById(id, setData) {
    try {
      const response = await warehouseApi.getById(id);
      const warehouse = response.data;

      const data = Array.isArray(warehouse)
        ? warehouse.map(formatWarehouse)
        : formatWarehouse(warehouse);

      setData(data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(payload) {
    try {
      await warehouseApi.create(payload);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(payload) {
    try {
      await warehouseApi.update(payload);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default warehouseService;
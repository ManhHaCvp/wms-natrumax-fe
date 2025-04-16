import warehouseApi from "@/api/warehouseApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";

const formatWarehouse = (warehouse) => ({
  warehouseId: warehouse.warehouseId,
  warehouseName: warehouse.warehouseName,
  province: warehouse.province,
  description: warehouse.description,
  accessCode: warehouse.accessCode
});

const formatProvince = (province) => ({
  provinceId: province.provinceId,
  provinceName: province.name,

});

const warehouseService = {
  async getAll(setData) {
    try {
      const response = await warehouseApi.getAll();

      const warehouses = Array.isArray(response.data)
        ? response.data
        : response.data?.warehouses || [];

      setData(warehouses.map(formatWarehouse));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  async getAllProvinces() {
    try {
      const response = await warehouseApi.getAllProvinces();
      
      const provinces = Array.isArray(response.data)
        ? response.data
        : response.data?.provinces || [];

        return provinces.map(formatProvince);
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
      const res = await warehouseApi.create(payload);
      console.log(res);
      return res; // nếu cần trả kết quả
    } catch (error) {
      handleApiError(error);
      throw error; // QUAN TRỌNG: ném lỗi ra ngoài để component catch được
    }
  },
  
  async update(warehouseId,payload) {
    try {
      await warehouseApi.update(warehouseId,payload);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default warehouseService;
import warehouseApi from "@/api/warehouseApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";

const formatWarehouse = (warehouse) => ({
    warehouseId: warehouse.warehouseId,
    warehouseName: warehouse.warehouseName,
    province: warehouse.province,
    description: warehouse.description,
    accessCode: warehouse.accessCode
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

    async getById(id) {
        try {
            const response = await warehouseApi.getById(id);
            const warehouse = response.data;

            return Array.isArray(warehouse)
                ? warehouse.map(formatWarehouse)
                : formatWarehouse(warehouse);
        } catch (error) {
            handleApiError(error);
        }
    },

    async create(payload) {
        try {
            return await warehouseApi.create(payload)
        } catch (error) {
            handleApiError(error);
            throw error; // QUAN TRỌNG: ném lỗi ra ngoài để component catch được
        }
    },

    async update(warehouseId, payload) {
        try {
            await warehouseApi.update(warehouseId, payload);
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default warehouseService;
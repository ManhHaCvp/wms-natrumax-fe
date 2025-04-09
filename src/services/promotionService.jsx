import promotionApi from "@/api/promotionApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import toast from "react-hot-toast";

const formatPromotion = (promotion) => ({
  promotionId: promotion.promotionId,
  isSameProduct: promotion.isSameProduct,
  quantityToGetPromotion: promotion.quantityToGetPromotion,
  bonusQuantity: promotion.bonusQuantity,
});

const promotionService = {
  async getAll(setData) {
    try {
      const response = await promotionApi.getAll();
      const promotions = Array.isArray(response.data)
        ? response.data
        : response.data?.promotions || [];

      setData(promotions.map(formatPromotion));
    } catch (error) {
      handleApiError(error);
    }
  },

  async getById(id, setData) {
    try {
      const response = await promotionApi.getById(id);
      const promotion = response.data;

      const data = Array.isArray(promotion)
        ? promotion.map(formatPromotion)
        : formatPromotion(promotion);

      setData(data);
    } catch (error) {
      handleApiError(error);
    }
  },

  async create(payload) {
    try {
      await promotionApi.create(payload);
      toast.success("Promotion created!");
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(payload) {
    try {
      await promotionApi.update(payload);
      toast.success("Promotion updated!");
    } catch (error) {
      handleApiError(error);
    }
  },

  async check(payload, setResult) {
    try {
      const response = await promotionApi.check(payload);
      setResult?.(response.data);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default promotionService;
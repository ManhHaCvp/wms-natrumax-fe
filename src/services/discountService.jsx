import discountApi from "@/api/discountApi.jsx";
import handleApiError from "@/utils/HandleApiError.jsx";
import formatDate from "@/utils/formatDate.jsx";

const formatDiscount = (discount, now) => {
  const activeDate = new Date(discount.activeDate);
  const expiryDate = new Date(discount.expiryDate);

  const status = now < activeDate ? "-1" : now < expiryDate ? "0" : "1";

  return {
    discountId: discount.discountId,
    minimumAmount: discount.minimumAmount,
    discountPercent: discount.discountPercent,
    description: discount.description,
    activeDate: formatDate.formatJsonToDate(discount.activeDate),
    expiryDate: formatDate.formatJsonToDate(discount.expiryDate),
    status,
  };
};

const discountService = {
  async getAll(setData) {
    try {
      const response = await discountApi.getAll();
      const rawDiscounts = Array.isArray(response.data)
        ? response.data
        : response.data?.discounts || [];

      const now = new Date();
      const formatted = rawDiscounts.map((item) => formatDiscount(item, now));
      setData(formatted);
    } catch (error) {
      handleApiError(error);
    }
  },

  async getById(id, setData) {
    try {
      const response = await discountApi.getById(id);
      const raw = response.data;

      const now = new Date();
      const formatted = formatDiscount(raw, now);
      setData(formatted);
    } catch (error) {
      handleApiError(error);
    }
  },
  async getByTotalAmount(payload,setData) {
    try {
      const response = await discountApi.getByTotalAmount(payload);
      console.log(response);
      const raw = response.data;
      const now = new Date();
      const formatted = formatDiscount(raw, now);
      setData(formatted);
    } catch (error) {
      handleApiError(error);
    }
  },
  async create(payload) {
    try {
      await discountApi.create(payload);
    } catch (error) {
      handleApiError(error);
    }
  },

  async update(discountId,payload) {
    try {
      await discountApi.update(discountId,payload);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default discountService;
export const formatCurrency = (amount) => {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(parsedAmount);
};
import toast from "react-hot-toast";

const handleApiError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    "Đã xảy ra lỗi.";

  toast.error(`❌ ${message}`);
};

export default handleApiError;

import toast from "react-hot-toast";

const handleApiError = (error) => {
  toast.error(error?.response?.data?.error || "Đã xảy ra lỗi!");
  throw error;
};

export default handleApiError;

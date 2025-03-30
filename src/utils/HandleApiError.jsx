import toast from "react-hot-toast";

const handleApiError = (error) => {
  toast.error("API error:", error.response?.data || error.message);
};

export default handleApiError;
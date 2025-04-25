import toast from "react-hot-toast";

const handleApiError = (error) => {
  toast.error("API error:", error);
  throw error;
};

export default handleApiError;

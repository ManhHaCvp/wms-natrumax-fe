import toast from "react-hot-toast";
import authApi from "@/api/authApi";

const authService = {
  async loginRequestOtp(phoneNumber, password, handleShowOtpForm) {
    try {
      await authApi.loginRequestOtp(phoneNumber, password);
      handleShowOtpForm();
      toast.success(`Mã OTP đã được gửi đến ${phoneNumber}.`);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error(error.response?.data || "Số điện thoại hoặc mật khẩu không hợp lệ.");
    }
  },

  async loginVerifyOtp(phoneNumber, otp, setAuthData, navigate) {
    try {
      const response = await authApi.loginVerifyOtp(phoneNumber, otp);
      toast.success("Đăng nhập thành công.");
      const newToken = response.data.token;
      const userData = response.data;
      setAuthData(newToken, userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.");
    }
  },

  async resendOtp(phoneNumber) {
    try {
      await authApi.resendOtp(phoneNumber);
      toast.success(`Mã OTP đã được gửi lại đến ${phoneNumber}.`);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error(error.response?.data || "Không thể gửi lại OTP.");
    }
  },

  async forgotPasswordRequestOtp(phoneNumber, handleShowOtpForm) {
    try {
      await authApi.forgotPasswordRequestOtp(phoneNumber);
      handleShowOtpForm();
      toast.success(`Mã OTP đã được gửi đến ${phoneNumber}.`);
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error(error.response?.data || "Số điện thoại không hợp lệ.");
    }
  },

  async forgotPasswordVerifyOtp(phoneNumber, otp, handleShowResetPasswordForm) {
    try {
      await authApi.forgotPasswordVerifyOtp(phoneNumber, otp);
      toast.success("OTP hợp lệ.");
      handleShowResetPasswordForm();
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.");
    }
  },

  async resetPassword(phoneNumber, newPassword, confirmPassword, handleShowLoginForm) {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không trùng nhau.");
      return;
    }
    try {
      await authApi.resetPassword(phoneNumber, newPassword, confirmPassword);
      toast.success("Cài lại mật khẩu thành công.");
      handleShowLoginForm();
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      toast.error(error.response?.data || "Không thể cài lại mật khẩu.");
    }
  }
};

export default authService;

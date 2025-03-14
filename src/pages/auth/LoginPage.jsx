import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserContext);
  const [isResending, setIsResending] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/v1/auth/request-otp", { phonenumber: phone, password: password });
      toast.success("OTP đã được gửi!");
      setShowOtpForm(true);
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
       // Kiểm tra nếu lỗi trả về có thông điệp từ API
       if (error.response?.data || error.message) {
        toast.error(error.response?.data || error.message);
      } else {
        toast.error("Sai tài khoản hoặc mật khẩu");
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/verify-otp", { phoneNumber: phone, otp: otp });
      console.log("Response:", response);
      toast.success("OTP hợp lệ!"); 
      localStorage.setItem("accessToken", response.data.token);
      setUserAuth(response.data);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error.message);
      
      // Kiểm tra nếu lỗi trả về có thông điệp từ API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("OTP không hợp lệ hoặc đã hết hạn!");
      }
    }
  };
  
  

  const handleForgotPassword = async () => {
    try {
      await axios.post("http://localhost:8080/api/v1/auth/forgot-password", { phoneNumber: phone });
      toast.success("OTP đặt lại mật khẩu đã được gửi!");
      setShowForgotPasswordForm(true);
    } catch (error) {
      toast.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/v1/auth/reset-password", { phoneNumber: phone, otp, newPassword });
      toast.success("Mật khẩu đã được đặt lại thành công!");
      setShowForgotPasswordForm(false);
      setShowOtpForm(false);
      setOtp("");
    } catch (error) {
      toast.error("Không thể đặt lại mật khẩu!");
    }
  };

  return (
    <div className="flex h-screen w-screen p-2">
      <div className="flex flex-col justify-center items-center w-1/2 h-full bg-[#182F73] rounded-3xl">
        <img src="/icon-bgwhite.svg" alt="Logo" className="w-80 h-80" />
      </div>
      <div className="flex flex-col justify-center items-center w-1/2 h-full">
        <div className="w-94">
          {!showOtpForm && !showForgotPasswordForm ? (
            <form onSubmit={handleSendOtp} className="flex flex-col justify-center w-full">
              <h2 className="text-3xl font-semibold text-center mb-4">Login</h2>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full px-3 py-2 border rounded" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded mt-3" />
              <p className="text-gray-700 text-xs underline p-2 cursor-pointer" onClick={handleForgotPassword}>Forget password</p>
              <button type="submit" className="w-full bg-[#2a4181] text-white py-2 px-4 rounded">Get OTP</button>
            </form>
          ) : showForgotPasswordForm ? (
            <form onSubmit={handleResetPassword} className="flex flex-col justify-center w-full">
              <h2 className="text-3xl font-semibold text-center mb-4">Reset Password</h2>
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otp} onChange={setOtp} className="flex justify-center">
                <InputOTPGroup>
                  <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                  <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full px-3 py-2 border rounded mt-3" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full px-3 py-2 border rounded mt-3" />
              <button type="submit" className="w-full bg-[#2a4181] text-white py-2 px-4 rounded mt-4">Reset Password</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col justify-center w-full">
              <h2 className="text-3xl font-semibold text-center mb-4">Submit OTP</h2>
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otp} onChange={setOtp} className="flex justify-center">
                <InputOTPGroup>
                  <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                  <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <button type="submit" className="w-full bg-[#2a4181] text-white py-2 px-4 rounded mt-4">Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

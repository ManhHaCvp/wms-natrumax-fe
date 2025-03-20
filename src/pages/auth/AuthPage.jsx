import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { BASE_URL } from "@/utils/constants.jsx";
import { useAuth } from "@/providers/authProvider.jsx";
import authService from "@/services/authService";

const AuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleShowLoginForm = (e) => {
    setShowLoginForm(true);
    setShowOtpForm(false);
    setShowForgotPasswordForm(false);
    setShowResetPasswordForm(false);
    setIsResetPassword(false);
  };

  const handleShowOtpForm = (e) => {
    setOtp(null);
    setShowLoginForm(false);
    setShowOtpForm(true);
    setShowForgotPasswordForm(false);
    setShowResetPasswordForm(false);
  };

  const handleShowForgotPasswordForm = (e) => {
    setShowLoginForm(false);
    setShowOtpForm(false);
    setShowForgotPasswordForm(true);
    setShowResetPasswordForm(false);
    setIsResetPassword(true);
  };

  const handleShowResetPasswordForm = (e) => {
    setShowLoginForm(false);
    setShowOtpForm(false);
    setShowForgotPasswordForm(false);
    setShowResetPasswordForm(true);
    setIsResetPassword(true);
  };

  const handleLoginRequestOtp = async (e) => {
    e.preventDefault();
    await authService.loginRequestOtp(phoneNumber, password, handleShowOtpForm);
  };

  const handleLoginVerifyOtp = async (e) => {
    e.preventDefault();
    await authService.loginVerifyOtp(phoneNumber, otp, setAuthData, navigate);
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    await authService.resendOtp(phoneNumber);
  };

  const handleForgotPasswordRequestOtp = async (e) => {
    e.preventDefault();
    await authService.forgotPasswordRequestOtp(phoneNumber, handleShowOtpForm);
  };

  const handleForgotPasswordVerifyOtp = async (e) => {
    e.preventDefault();
    await authService.forgotPasswordVerifyOtp(phoneNumber, otp, handleShowResetPasswordForm);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    await authService.resetPassword(phoneNumber, newPassword, confirmPassword, handleShowLoginForm);
  };

  return (
    // layout chính chứa các form layout
    <div className="flex overflow-hidden w-screen h-screen p-[1.25rem]">
      {/*layout trái chứa backgound, logo, quote*/}
      <div
        className="flex flex-col justify-center items-center w-1/2 h-full bg-[#182F73] rounded-lg relative">
        <div className="flex items-center absolute top-4 left-4 px-4 py-4 rounded-md">
          <img src="src/assets/logos/dark/sm-name.svg" alt="Logo" className="w-[10.1rem] h-[2rem]" />
        </div>
        <img src="src/assets/logos/dark/xl.svg" alt="Logo" className="w-1/2 h-1/2" />
        <div className="absolute bottom-4 left-4 text-white text-sm leading-tight px-4 py-4">
          <p className="text-xl">“NATRUMAX - VÌ MỘT VIỆT NAM KHỎE MẠNH”</p>
          <p className="mt-2">Nguyễn Tất Tùng</p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-1/2 h-full">
        <div className="w-[15rem] text-center">
          {showLoginForm && (
            // layout phải: login form
            <form onSubmit={handleLoginRequestOtp} className="flex flex-col justify-center w-full">
              <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Đăng
                  nhập</h2>
                <p className="text-muted-foreground mt-3">Nhập số điện thoại và mật khẩu<br /> để
                  nhận
                  OTP</p>
              </div>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                     placeholder="Phone Number" className="w-full px-3 py-2 border rounded-md" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                     placeholder="Password" className="w-full px-3 py-2 border rounded-md mt-2" />
              <button type="submit"
                      className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Nhận OTP
              </button>
              <p className="text-[#4A63B5] cursor-pointer mt-3"
                 onClick={handleShowForgotPasswordForm}>Quên mật khẩu?</p>
            </form>
          )}
          {showOtpForm &&
            // layout phải: otp form
            <form onSubmit={isResetPassword ? handleForgotPasswordVerifyOtp : handleLoginVerifyOtp}
                  className="flex flex-col justify-center w-full">
              <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Xác nhận
                  OTP</h2>
                <p className="text-muted-foreground mt-3">Nhập OTP để<br /> truy cập vào hệ thống</p>
              </div>
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otp}
                        onChange={setOtp}
                        className="flex justify-center">
                <InputOTPGroup>
                  <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                  <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <button type="submit"
                      className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Xác nhận
              </button>
              <p className="text-[#4A63B5] cursor-pointer mt-3" onClick={handleResendOtp}>Gửi lại
                OTP</p>
            </form>
          }
          {showForgotPasswordForm && (
            // layout phải: forgot password form
            <form onSubmit={handleForgotPasswordRequestOtp}
                  className="flex flex-col justify-center w-full">
              <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Quên mật
                  khẩu</h2>
                <p className="text-muted-foreground mt-3">Nhập số điện thoại của bạn<br /> để nhận mã
                  xác
                  thực</p>
              </div>
              <input type="text" id="phone" value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     placeholder="Phone Number" className="w-full px-3 py-2 border rounded-md" />
              <button type="submit"
                      className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Xác nhận
              </button>
              <p className="text-[#4A63B5] cursor-pointer mt-3" onClick={handleShowLoginForm}>Đăng
                nhập</p>
            </form>
          )}
          {showResetPasswordForm && (
            // layout phải: reset password form
            <form onSubmit={handleResetPassword} className="flex flex-col justify-center w-full">
              <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Cài lại mật
                  khẩu</h2>
                <p className="text-muted-foreground mt-3">Nhập mật khẩu mới</p>
              </div>
              <input type="password" value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="Mật khẩu" className="w-full px-3 py-2 border rounded-md" />
              <input type="password" value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     placeholder="Xác nhận mật khẩu"
                     className="w-full px-3 py-2 border rounded-md mt-2" />
              <button type="submit"
                      className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Xác nhận
              </button>
              <p className="text-[#4A63B5] cursor-pointer mt-3" onClick={handleShowLoginForm}>Đăng
                nhập</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

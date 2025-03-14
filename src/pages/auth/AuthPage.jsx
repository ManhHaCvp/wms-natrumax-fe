import React, {useState, useContext} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../App";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS_AND_CHARS} from "input-otp";

const AuthPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
    const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
    const navigate = useNavigate();
    const {setUserAuth} = useContext(UserContext);
    const [isResending, setIsResending] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/v1/auth/request-otp", {phonenumber: phone, password: password});
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
            const response = await axios.post("http://localhost:8080/api/v1/auth/verify-otp", {
                phoneNumber: phone,
                otp: otp
            });
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

    const handleShowForgotPasswordForm = (e) => {
        setShowLoginForm(false);
        setShowForgotPasswordForm(true);
    }

    const handleForgotPassword = async () => {
        try {
            await axios.post("http://localhost:8080/api/v1/auth/forgot-password", {phoneNumber: phone});
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
            await axios.post("http://localhost:8080/api/v1/auth/reset-password", {
                phoneNumber: phone,
                otp,
                newPassword
            });
            toast.success("Mật khẩu đã được đặt lại thành công!");
            setShowForgotPasswordForm(false);
            setShowOtpForm(false);
            setOtp("");
        } catch (error) {
            toast.error("Không thể đặt lại mật khẩu!");
        }
    };

    const handleShowLoginForm = (e) => {
        setShowLoginForm(true);
        setShowForgotPasswordForm(false);
        setShowResetPasswordForm(false);
    }

    // layout chính chứa các form layout
    const AuthLayout = ({children}) => (
        <div className="flex overflow-hidden w-screen h-screen p-[1.25rem]">
            <LeftBackground/>
            <div className="flex flex-col justify-center items-center w-1/2 h-full">
                <div className="w-[15rem] text-center">
                    {children}
                </div>
            </div>
        </div>
    );

    // layout bên trái chứa backgound, logo, quote
    const LeftBackground = () => (
        <div className="flex flex-col justify-center items-center w-1/2 h-full bg-[#182F73] rounded-lg relative">
            <div className="flex items-center absolute top-4 left-4 px-4 py-4 rounded-md">
                <img src="src/assets/logos/dark/sm-name.svg" alt="Logo" className="w-[10rem] h-[2rem]"/>
            </div>
            <img src="src/assets/logos/dark/xl.svg" alt="Logo" className="w-1/2 h-1/2"/>
            <div className="absolute bottom-4 left-4 text-white text-sm leading-tight px-4 py-4">
                <p className="text-xl">“NATRUMAX - VÌ MỘT VIỆT NAM KHỎE MẠNH”</p>
                <p className="mt-2">Nguyễn Tất Tùng</p>
            </div>
        </div>
    );

    // layot phải: login form
    const LoginForm = ({handleSendOtp, phone, setPhone, password, setPassword, handleShowForgotPasswordForm}) => (
        <form onSubmit={handleSendOtp} className="flex flex-col justify-center w-full">
            <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Đăng nhập</h2>
                <p className="text-muted-foreground mt-3">Nhập số điện thoại và mật khẩu<br/> để nhận OTP</p>
            </div>
            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                   placeholder="Phone Number" className="w-full px-3 py-2 border rounded-md"/>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   placeholder="Password" className="w-full px-3 py-2 border rounded-md mt-2"/>
            <button type="submit"
                    className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Nhận OTP
            </button>
            <p className="text-[#4A63B5] cursor-pointer mt-3" onClick={handleShowForgotPasswordForm}>Quên mật khẩu?</p>
        </form>
    );

    // layot phải: otp form
    const OtpForm = ({handleVerifyOtp, otp, setOtp, handleSendOtp}) => (
        <form onSubmit={handleVerifyOtp} className="flex flex-col justify-center w-full">
            <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Xác nhận OTP</h2>
                <p className="text-muted-foreground mt-3">Nhập OTP để<br/> truy cập vào hệ thống</p>
            </div>
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otp} onChange={setOtp}
                      className="flex justify-center">
                <InputOTPGroup>
                    <InputOTPSlot index={0}/><InputOTPSlot index={1}/><InputOTPSlot index={2}/>
                    <InputOTPSlot index={3}/><InputOTPSlot index={4}/><InputOTPSlot index={5}/>
                </InputOTPGroup>
            </InputOTP>
            <button type="submit"
                    className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Xác nhận
            </button>
            <p className="text-[#4A63B5] cursor-pointer mt-3" onClick={handleSendOtp}>Gửi lại OTP</p>
        </form>
    );

    // layot phải: forgot password form
    const ForgotPasswordForm = ({handleSendOtp, phone, setPhone, handleShowLoginForm}) => (
        <form onSubmit={handleSendOtp} className="flex flex-col justify-center w-full">
            <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Quên mật khẩu</h2>
                <p className="text-muted-foreground mt-3">Nhập số điện thoại của bạn<br/> để nhận mã xác thực</p>
            </div>
            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                   placeholder="Phone Number" className="w-full px-3 py-2 border rounded-md"/>
            <button type="submit"
                    className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Xác nhận
            </button>
            <p className="text-[#4A63B5] cursor-pointer mt-3" onClick={handleShowLoginForm}>Đăng nhập</p>
        </form>
    );

    // layot phải: reset password form
    const ResetPasswordForm = ({handleResetPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, handleShowLoginForm}) => (
        <form onSubmit={handleResetPassword} className="flex flex-col justify-center w-full">
            <div className="py-4">
                <h2 className="text-card-foreground text-2xl leading-none font-semibold">Cài lại mật khẩu</h2>
                <p className="text-muted-foreground mt-3">Nhập mật khẩu mới</p>
            </div>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                   placeholder="Mật khẩu" className="w-full px-3 py-2 border rounded-md"/>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                   placeholder="Xác nhận mật khẩu" className="w-full px-3 py-2 border rounded-md mt-2"/>
            <button type="submit"
                    className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2 mt-2">
                Xác nhận
            </button>
            <p className="text-[#4A63B5] cursor-pointer mt-3" onClick={handleShowLoginForm}>Đăng nhập</p>
        </form>
    );

    return (
        <AuthLayout>
            {showLoginForm && (
                <LoginForm
                    handleSendOtp={handleSendOtp}
                    phone={phone}
                    setPhone={setPhone}
                    password={password}
                    setPassword={setPassword}
                    handleShowForgotPasswordForm={handleShowForgotPasswordForm}
                />
            )}
            {showOtpForm &&
                <OtpForm
                    handleVerifyOtp={handleVerifyOtp}
                    otp={otp}
                    setOtp={setOtp}
                    handleSendOtp={handleSendOtp}
                />
            }
            {showForgotPasswordForm && (
                <ForgotPasswordForm
                    handleResetPassword={handleResetPassword}
                    phone={phone}
                    setPhone={setPhone}
                    handleShowLoginForm={handleShowLoginForm}
                />
            )}
            {showResetPasswordForm && (
                <ResetPasswordForm
                    handleResetPassword={handleResetPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    handleShowLoginForm={handleShowLoginForm}
                />
            )}
        </AuthLayout>
    );
};

export default AuthPage;

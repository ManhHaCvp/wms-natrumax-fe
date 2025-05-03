import axios from "axios";
import {BASE_URL} from "@/utils/constants.jsx";

const authApi = {
    loginRequestOtp: (phoneNumber, password) =>
        axios.post(`${BASE_URL}/v1/auth/login/request-otp`, {phoneNumber, password}),

    loginVerifyOtp: (phoneNumber, otp) =>
        axios.post(`${BASE_URL}/v1/auth/login/verify-otp`, {phoneNumber, otp}),

    resendOtp: (phoneNumber) =>
        axios.post(`${BASE_URL}/v1/auth/resend-otp`, {phoneNumber}),

    forgotPasswordRequestOtp: (phoneNumber) =>
        axios.post(`${BASE_URL}/v1/auth/forgot-password/request-otp`, {phoneNumber}),

    forgotPasswordVerifyOtp: (phoneNumber, otp) =>
        axios.post(`${BASE_URL}/v1/auth/forgot-password/verify-otp`, {phoneNumber, otp}),

    resetPassword: (phoneNumber, newPassword, confirmPassword) =>
        axios.post(`${BASE_URL}/v1/auth/reset-password`, {phoneNumber, newPassword, confirmPassword}),
};

export default authApi;
import { useRef, useState } from "react";
import "./Otp.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Message from "./Message.jsx";
import useCooldown from "../hooks/useCooldown.jsx";
export default function Otp() {

    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputuseRef = useRef([]);
    const { isDisable, cooldown, startCooldown, startSecondCooldown, secondCooldown, issecondDisable } = useCooldown(10);
    const location = useLocation();
    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputuseRef.current[index + 1]?.focus();

        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key !== "Backspace") return;
        e.preventDefault();
        const newOtp = [...otp];

        if (newOtp[index]) {
            newOtp[index] = "";
            setOtp(newOtp);
        } else if (index > 0) {
            inputuseRef.current[index - 1]?.focus();
        }
    };
    const handlePaste = (e, index) => {
        e.preventDefault();
        const getPastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        getPastedData.split("").forEach((char, i) => {
            if (index + i < 6) {
                newOtp[index + i] = char;
            }

        })
        setOtp(newOtp);
        const nextIndex = index + getPastedData.length;
        if (nextIndex < 6) {
            inputuseRef.current[nextIndex]?.focus();

        } else {
            inputuseRef.current[5]?.focus();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisable) return;
        startCooldown();
        const code = otp.join("");
        if (code.length !== 6) {
            setMessage("Please enter a valid OTP")
            setSuccess(false);
            return;
        }
        const role = localStorage.getItem("role");
        if (!role) {
            setMessage("Please select a role");
            setSuccess(false);
            return;
        }
        let url = '';
        let redirect = '/dashboard';
        if (location.pathname === "/signup-otp") {
            url = 'http://localhost:8080/auth/verify-signup-otp';
            redirect = `/${role}/dashboard`;
        } else if (location.pathname === "/login-otp") {
            url = 'http://localhost:8080/auth/verify-login-otp';
            redirect = `/dashboard/${role}`;
        } else if (location.pathname === "/forgot-pass-otp") {
            url = 'http://localhost:8080/forgotPass/verify-forgot-pass-otp';
            redirect = '/reset-password';
        }
        else {
            setMessage("Invalid Otp Page");
            setSuccess(false);
            return;
        }
        try {
            const res = await axios.post(url, {
                otp: code,
            }, {
                withCredentials: true,
            });
            if (!res.data.success) {
                setMessage("Invalid Otp");
                setSuccess(false);
                return;
            }
            setMessage("Otp Verified");
            setSuccess(true);
            navigate(redirect);
        } catch (err) {
            console.log("Login error:", err);

            // Get message sent by backend
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong!";

            setMessage(errorMessage);
            setSuccess(false);
            return;
        }
    }
    const handleResendOtp = async (e) => {
        e.preventDefault();
        if (issecondDisable) return;
        let url = '';
        if (location.pathname === "/signup-otp") {
            url = 'http://localhost:8080/auth/resend-signup-otp';
        } else if (location.pathname === "/login-otp" || location.pathname === "/forgot-pass-otp") {
            url = 'http://localhost:8080/auth/resend-login-otp';
        } else {
            setMessage("Invalid Otp Page");
            setSuccess(false);
            return;
        }
        try {
            startSecondCooldown();
            const res = await axios.post(url, {
                withCredentials: true
            });
            if (!res.data.success) {
                setMessage(res.data.message);
                setSuccess(false);
                return;
            }
            setMessage("OTP resend successfully" || res.data.message);
            setSuccess(true);
        } catch (err) {
            console.log("Login error:", err);

            // Get message sent by backend
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong!";

            setMessage(errorMessage);
            setSuccess(false);
            return;
        }

    };

    return (
        <div className="otp-page-container">
            <div className="otp-card">
                <h1 className="otp-heading">OTP Verification</h1>
                <p className="otp-instruction">Please enter the 6-digit verification code sent to your device.</p>
                {message && <Message message={message} success={success} clearMessage={() => setMessage('')} />}
                <div className="otp-wrapper">
                    {otp.map((digit, index) => (
                        <input
                            ref={(el) => inputuseRef.current[index] = el}
                            value={digit}
                            maxLength={1}
                            type="text"
                            key={index}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={(e) => handlePaste(e, index)}
                            className="otp-input-box"
                        />
                    ))}
                </div>
                <button type="button" className={isDisable ? "verify-btn-disabled" : "verify-btn"} onClick={handleSubmit} disabled={isDisable} style={{
                    cursor: isDisable ? "not-allowed" : "pointer", width: "100%", backgroundColor: isDisable ? "#E5E7EB" : "#3B71CA",
                    color: isDisable ? "#6B7280" : "#FFFFFF", height: "55px"

                }}>{isDisable ? `Verify OTP (${cooldown})` : "Verify OTP"}</button>
                <div className="otp-footer">
                    <p className="otp-resend">Did not receive code? <button type="button" className="resend-btn" onClick={handleResendOtp} disabled={issecondDisable} style={{ cursor: issecondDisable ? "not-allowed" : "pointer" }}>{issecondDisable ? `Resend OTP (${secondCooldown})` : "Resend OTP"}</button></p>
                </div>
            </div>

        </div>
    )

}

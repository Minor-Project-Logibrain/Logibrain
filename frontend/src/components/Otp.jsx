import { useRef, useState } from "react";
import "./Otp.css";

export default function Otp() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputuseRef = useRef([]);
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
    return (
        <div className="otp-page-container">
            <div className="otp-card">
                <h1 className="otp-heading">OTP Verification</h1>
                <p className="otp-instruction">Please enter the 6-digit verification code sent to your device.</p>
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
                <button type="button" className="verify-btn">Verify OTP</button>
            </div>
        </div>
    )

}
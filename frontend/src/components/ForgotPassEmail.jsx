import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";
import "./ForgotPassEmail.css";
import useCooldown from "../hooks/useCooldown";
import axios from "axios";
import Message from "./Message";
export default function ForgotPassEmail() {
    const { isDisable, cooldown, startCooldown } = useCooldown(10);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisable) return;

        startCooldown();
        try {
            const res = await axios.post("http://localhost:8080/forgotPass/forgot/passhome-page", {
                email,
            }, {
                withCredentials: true
            });

            if (!res.data.success) {
                setMessage(res.data.message || "Failed to process request");
                setSuccess(false);
                return;
            }

            setMessage("Verification code sent successfully! Redirecting...");
            setSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/forgot-pass-otp");
            }, 2000);

        } catch (err) {
            console.log("Login error:", err);

            // Get message sent by backend
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong!";

            setMessage(errorMessage);
            setSuccess(false);
        }
    };

    return (
        <div className="forgot-pass-wrapper">
            <Message message={message} success={success} clearMessage={() => setMessage('')} />

            {/* Back to Login Link */}
            <div className="forgot-pass-header-nav">
                <Link to="/login" className="forgot-pass-back-link">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Login</span>
                </Link>
            </div>
            {/* Centered Form Card */}
            <div className="forgot-pass-container">
                <div className="forgot-pass-card">
                    <div className="forgot-pass-brand">
                        <img src={Logo} alt="LogiBrain Logo" className="forgot-pass-logo" />
                        <h1 className="forgot-pass-title">LogiBrain</h1>
                    </div>
                    <div className="forgot-pass-header-text">
                        <h2>Forgot Password?</h2>
                        <p>Enter your email address and we'll send you an OTP code to reset your password.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="forgot-pass-form">
                        <div className="forgot-pass-form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="forgot-pass-input-box">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <FontAwesomeIcon icon={faEnvelope} className="forgot-pass-input-icon" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="forgot-pass-submit-btn"
                            disabled={isDisable}
                        >
                            {isDisable ? `Send OTP (${cooldown}s)` : "Send OTP"}
                        </button>
                    </form>
                    <div className="forgot-pass-footer">
                        <p>Remember your password? <Link to={`/login?role=driver`} className="forgot-pass-login-link">Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

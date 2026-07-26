import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";
import "./updatePass.css";
import axios from "axios";
import Message from "./Message";

export default function UpdatePass() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const isMatch = password === confirmPassword && password.length > 0;
    const isLengthValid = password.length >= 6;
    const canSubmit = isLengthValid && isMatch && !isLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsLoading(true);
        setMessage("");
        try {
            const res = await axios.post("http://localhost:8080/forgot-pass-set-new-pass", {
                password: password,
                newPassword: confirmPassword,
            }, {
                withCredentials: true
            });

            if (!res.data.success) {
                setMessage(res.data.message || res.data.json || "Failed to update password");
                setSuccess(false);
                setIsLoading(false);
                return;
            }

            setMessage("Password updated successfully! Redirecting...");
            setSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setMessage(err.response?.data?.message || err.response?.data?.json || err.message || "Something went wrong!");
            setSuccess(false);
            setIsLoading(false);
        }
    };

    return (
        <div className="update-pass-wrapper">
            <Message message={message} success={success} />

            {/* Back to Login Link */}
            <div className="update-pass-header-nav">
                <Link to="/login" className="update-pass-back-link">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Login</span>
                </Link>
            </div>

            {/* Centered Form Card */}
            <div className="update-pass-container">
                <div className="update-pass-card">
                    <div className="update-pass-brand">
                        <img src={Logo} alt="LogiBrain Logo" className="update-pass-logo" />
                        <h1 className="update-pass-title">LogiBrain</h1>
                    </div>

                    <div className="update-pass-header-text">
                        <h2>Set New Password</h2>
                        <p>Create a secure new password for your LogiBrain account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="update-pass-form">
                        
                        {/* New Password Field */}
                        <div className="update-pass-form-group">
                            <label htmlFor="password">New Password</label>
                            <div className="update-pass-input-box">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <FontAwesomeIcon icon={faLock} className="update-pass-input-icon" />
                                <button
                                    type="button"
                                    className="update-pass-toggle-btn"
                                    onClick={togglePassword}
                                    aria-label="Toggle password visibility"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {password.length > 0 && (
                                <span className={`update-pass-hint ${isLengthValid ? "valid" : "invalid"}`}>
                                    {isLengthValid ? "✓ Password length is secure (6+ chars)" : "✗ Must be at least 6 characters"}
                                </span>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="update-pass-form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="update-pass-input-box">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <FontAwesomeIcon icon={faLock} className="update-pass-input-icon" />
                                <button
                                    type="button"
                                    className="update-pass-toggle-btn"
                                    onClick={toggleConfirmPassword}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <span className={`update-pass-hint ${isMatch ? "valid" : "invalid"}`}>
                                    {isMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="update-pass-submit-btn"
                            disabled={!canSubmit}
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

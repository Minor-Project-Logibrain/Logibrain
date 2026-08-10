import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft, faTruck } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";
import "./DriverLogin.css";
import useCooldown from "../hooks/useCooldown";
import axios from "axios";
import Message from "./Message";
export default function DriverLogin() {
    const { isDisable, cooldown, startCooldown } = useCooldown(10);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showpass, setShowpass] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const togglePassword = () => {
        setShowpass(!showpass);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisable) return;
        startCooldown();
        try {
            const res = await axios.post('http://localhost:8080/auth/login/driver', {
                email,
                phone,
                password,
            }, {
                withCredentials: true
            });
            if (!res.data.success) {
                setMessage(res.data.message);
                setSuccess(false);
                return;
            }
            setMessage("Login successfully" || res.data.message);
            setSuccess(true);
            localStorage.setItem("role", "driver");
            navigate("/driver/dashboard");

        } catch (err) {
            setMessage(err.message || "Something went wrong!");
            setSuccess(false);
        }
    }

    return (
        <div className="driver-login-wrapper">
            <Message message={message} success={success} />
            {/* Back to Home Link */}
            <div className="login-header-nav">
                <Link to="/" className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Centered Login Card */}
            <div className="login-box-container">
                <div className="login-card">
                    <div className="card-brand">
                        <img src={Logo} alt="LogiBrain Logo" className="card-logo" />
                        <span className="driver-portal-badge">
                            <FontAwesomeIcon icon={faTruck} style={{ marginRight: '6px' }} />
                            Driver Portal
                        </span>
                    </div>

                    <div className="card-header-text">
                        <h2>Driver Sign In</h2>
                        <p>Enter your credentials to access assigned routes & trips</p>
                    </div>

                    <form className="login-form" >
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="input-with-prefix">
                                <span className="country-prefix">+91</span>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your 10-digit phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    minLength={10}
                                    maxLength={10}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password" className="forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="password-input-box">
                                <input
                                    id="password"
                                    type={showpass ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={8}
                                    required
                                />
                                <button
                                    type="button"
                                    className="pass-toggle"
                                    onClick={togglePassword}
                                    aria-label="Toggle password visibility"
                                >
                                    <FontAwesomeIcon icon={showpass ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        <div className="remember-row">
                            <label className="remember-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button type="submit" className={isDisable ? "submit-login-btn-disabled" : "submit-login-btn"} disabled={isDisable} onClick={handleSubmit} >
                            Driver Login  {isDisable && ` (${cooldown}s)`}
                        </button>
                    </form>

                    <div className="card-footer">
                        <p>Not a driver? <Link to="/ask-role" className="signup-link">Switch Role</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
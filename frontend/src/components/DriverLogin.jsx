import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft, faTruck } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";
import "./DriverLogin.css";

export default function DriverLogin() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showpass, setShowpass] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const togglePassword = () => {
        setShowpass(!showpass);
    };

    return (
        <div className="driver-login-wrapper">
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

                    <form className="login-form">
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

                        <button type="submit" className="submit-login-btn">
                            Driver Login
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
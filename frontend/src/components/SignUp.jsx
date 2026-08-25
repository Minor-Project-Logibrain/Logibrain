import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import Logo from "../assets/logo.png";
import axios from 'axios';
import useCooldown from '../hooks/useCooldown';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import Message from './Message';
function Signup() {
    const [showpass, setShowpass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const { isDisable, startCooldown, cooldown } = useCooldown(10);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowpass(!showpass);
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPass(!showConfirmPass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisable) return;
        try {
            startCooldown();
            const res = await axios.post("http://localhost:8080/auth/signup", {
                fullName,
                company,
                phone,
                email,
                password,
                confirmPassword,
            },
                {
                    withCredentials: true,
                }
            );
            if (!res.data.success) {
                setMessage(res.data.message);
                setSuccess(false);
            } else {
                setMessage(res.data.message);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/signup-otp');
                }, 1000);
            }
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
        <div className="login-wrapper">
            {/* Back to Home Link */}
            <div className="login-header-nav">
                <Link to="/" className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Centered Signup Card */}
            <div className="login-box-container">
                <Message message={message} success={success} clearMessage={() => setMessage('')} />
                <div className="login-card">
                    <div className="card-brand">
                        <img src={Logo} alt="LogiBrain Logo" className="card-logo" />
                        <h1 className="card-title">LogiBrain</h1>
                    </div>

                    <div className="card-header-text">
                        <h2>Create an Account</h2>
                        <p>Enter your details to register your fleet</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="company">Company / Transport Name</label>
                            <input
                                id="company"
                                type="text"
                                placeholder="e.g. Apex Logistics Corp"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="company">Phone Number</label>
                            <input
                                id="phone"
                                type="text"
                                placeholder="e.g. 9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-box">
                                <input
                                    id="password"
                                    type={showpass ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-box">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPass ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="pass-toggle"
                                    onClick={toggleConfirmPassword}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    <FontAwesomeIcon icon={showConfirmPass ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="submit-login-btn" onClick={handleSubmit} disabled={isDisable} style={{ cursor: isDisable ? "not-allowed" : "pointer" }}>
                            {isDisable ? `Please wait ${cooldown} seconds` : "Create Account"}
                        </button>
                    </form>

                    <div className="card-footer">
                        <p>Already have an account? <Link to="/login?role=owner" className="signup-link">Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;

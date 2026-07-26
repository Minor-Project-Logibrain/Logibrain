import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft, faL } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./OwnerLogin.css";
import Logo from "../assets/logo.png";
import axios from "axios";
import useCooldown from "../hooks/useCooldown";
import Message from "./Message";

export default function OwnerLogin() {
    const { isDisable, cooldown, startCooldown } = useCooldown(10);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showpass, setShowpass] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const togglePassword = () => {
        setShowpass(!showpass);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisable) return;
        startCooldown();
        try {
            const res = await axios.post('http://localhost:8080/owner/login', {
                email,
                password,
            });
            if (!res.data.success) {
                setMessage(res.data.message);
                setSuccess(false);
                return;
            }
            setMessage("Login successfully" || res.data.message);
            setSuccess(true);
            localStorage.setItem("role", "owner");
            navigate("/owner/dashboard");


        } catch (err) {
            setMessage(err.message || "Something went wrong!");
            setSuccess(false);
        }
    }

    return (
        <div className="login-wrapper">
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
                        <h1 className="card-title">LogiBrain</h1>
                    </div>

                    <div className="card-header-text">
                        <h2>Welcome Back</h2>
                        <p>Please enter your details to sign in</p>
                    </div>

                    <form className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email or Fleet ID</label>
                            <input
                                id="email"
                                type="text"
                                placeholder="Enter your email or fleet ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
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

                        <button type="submit" className={isDisable ? "submit-login-btn-disabled" : "submit-login-btn"} disabled={isDisable} onClick={handleSubmit}>
                            {isDisable ? `Wait ${cooldown}s` : "Login"}
                        </button>
                    </form>

                    <div className="card-footer ">
                        <p className="pb-2">Don't have an account? <Link to="/signup" className="signup-link ">Sign up</Link></p>
                        <p>Not a Owner? <Link to="/ask-role" className="signup-link">Switch Role</Link></p>
                    </div>

                </div>
            </div>
        </div>
    )
}
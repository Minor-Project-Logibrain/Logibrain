import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import Logo from "../assets/logo.png";
import "./Login.css";

function Login() {
  const [showpass, setShowpass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const togglePassword = () => {
    setShowpass(!showpass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

          <form onSubmit={handleSubmit} className="login-form">
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

            <button type="submit" className="submit-login-btn">
              Login
            </button>
          </form>

          <div className="card-footer">
            <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;





import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserTie,
    faTruck,
    faArrowRight,
    faCheckCircle,
    faArrowLeft,
    faShieldHalved,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";
import "./AskRole.css";

export default function AskRole() {
    const [selectedRole, setSelectedRole] = useState("driver");
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!selectedRole) return;
        navigate(`/login?role=${selectedRole}`, { state: { role: selectedRole } });
    };

    return (
        <div className="ask-role-wrapper">
            {/* Ambient Background Glows */}
            <div className="bg-glow bg-glow-1"></div>
            <div className="bg-glow bg-glow-2"></div>

            {/* Header Navigation */}
            <header className="ask-role-header">
                <Link to="/" className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Home</span>
                </Link>

                <div className="brand-logo-container mr-45">
                    <img src={Logo} alt="LogiBrain Logo" className="header-logo" />
                    <span className="brand-name">LogiBrain</span>
                </div>

                <div className="header-login-prompt">

                </div>
            </header>

            {/* Main Content Area */}
            <main className="ask-role-container">
                <div className="title-section">
                    <span className="role-pill-badge">Workspace Setup</span>
                    <h1 className="main-title">Select Your Role</h1>
                    <p className="sub-title">
                        Tailor your LogiBrain experience. Choose your primary workspace function to unlock specialized tools and dashboards.
                    </p>
                </div>

                {/* Role Cards Grid */}
                <div className="roles-grid">
                    {/* Driver Card */}
                    <div
                        className={`role-card driver-card ${selectedRole === "driver" ? "selected" : ""}`}
                        onClick={() => setSelectedRole("driver")}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => e.key === "Enter" && setSelectedRole("driver")}
                    >
                        <div className="card-top-bar">
                            <span className="category-badge driver-badge">Driver Portal</span>
                            <div className="selection-indicator">
                                <FontAwesomeIcon icon={selectedRole === "driver" ? faCheck : faCheckCircle} />
                            </div>
                        </div>

                        <div className="icon-wrapper driver-icon-glow">
                            <FontAwesomeIcon icon={faTruck} className="role-icon" />
                        </div>

                        <div className="card-body">
                            <h2>Vehicle Driver</h2>
                            <p>For operators on the move managing real-time routes, delivery logs, and vehicle performance.</p>
                        </div>

                        <ul className="role-features">
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                <span>Real-time GPS Navigation & Route Optimization</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                <span>Instant Delivery & Fuel Log Tracking</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                <span>Automated Vehicle Diagnostics & Safety Alerts</span>
                            </li>
                        </ul>

                        <div className="card-footer-cta">
                            <span className="select-btn">
                                {selectedRole === "driver" ? "Selected ✓" : "Select Driver"}
                            </span>
                        </div>
                    </div>

                    {/* Owner Card */}
                    <div
                        className={`role-card owner-card ${selectedRole === "owner" ? "selected" : ""}`}
                        onClick={() => setSelectedRole("owner")}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => e.key === "Enter" && setSelectedRole("owner")}
                    >
                        <div className="card-top-bar">
                            <span className="category-badge owner-badge">Management</span>
                            <div className="selection-indicator">
                                <FontAwesomeIcon icon={selectedRole === "owner" ? faCheck : faCheckCircle} />
                            </div>
                        </div>

                        <div className="icon-wrapper owner-icon-glow">
                            <FontAwesomeIcon icon={faUserTie} className="role-icon" />
                        </div>

                        <div className="card-body">
                            <h2>Fleet Owner</h2>
                            <p>For fleet managers & owners monitoring enterprise dispatch, driver telemetry, and operational revenue.</p>
                        </div>

                        <ul className="role-features">
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                <span>Live Fleet Monitoring & Dispatch Control</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                <span>Driver Analytics & Performance Metrics</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="feature-check" />
                                <span>Financial Intelligence & Cost Optimization</span>
                            </li>
                        </ul>

                        <div className="card-footer-cta">
                            <span className="select-btn">
                                {selectedRole === "owner" ? "Selected ✓" : "Select Fleet Owner"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Section */}
                <div className="continue-section">
                    <button
                        className="continue-btn"
                        onClick={handleContinue}
                        disabled={!selectedRole}
                    >
                        <span>Continue as {selectedRole === "driver" ? "Driver" : "Fleet Owner"}</span>
                        <FontAwesomeIcon icon={faArrowRight} className="btn-arrow" />
                    </button>

                    <div className="trust-note">
                        <FontAwesomeIcon icon={faShieldHalved} className="shield-icon" />
                        <span>You can switch or manage role permissions anytime in settings.</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
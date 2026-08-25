import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, redirect, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png";
import "./OwnerLogin.css";
import Message from './Message';
import axios from 'axios';

export default function AddDriverForm() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [fullName, setFullName] = useState('');
    const [success, setSuccess] = useState(false);
    const [showpass, setShowpass] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !phone || !fullName) {
            setMessage("Please fill in all fields.");
            setSuccess(false);
            return;
        }

        const phoneRegex = /^[6-9][0-9]{9}$/;

        if (!phoneRegex.test(phone)) {
            setMessage("Invalid phone number! Must start with 6-9 and be 10 digits.");
            setSuccess(false);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/owners/add-driver",
                {
                    fullName,
                    phone,
                    email,
                },
                {
                    withCredentials: true,
                }
            );

            setMessage(res.data.message);
            setSuccess(true);

            setEmail("");
            setPhone("");
            setFullName("");
            navigate('/owner/dashboard')
        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );

            setSuccess(false);
        }
    };
    return (
        <div className="login-wrapper">
            <Message message={message} success={success} clearMessage={() => setMessage('')} />

            {/* Back Navigation Link */}
            <div className="login-header-nav">
                <button
                    onClick={() => navigate(-1)}
                    className="back-link"
                    style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back</span>
                </button>
            </div>

            {/* Centered Add Driver Card */}
            <div className="login-box-container">
                <div className="login-card">
                    <div className="card-brand">
                        <img src={Logo} alt="LogiBrain Logo" className="card-logo" />
                        <h1 className="card-title">LogiBrain</h1>
                    </div>

                    <div className="card-header-text">
                        <h2>Add Driver</h2>
                        <p>Register a new driver for your fleet management</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="driver@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="text"
                                placeholder="e.g. 9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <div className="input-box">
                                <input
                                    id="fullName"
                                    type={"text"}
                                    placeholder="Enter Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />

                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="submit-login-btn">
                            Add Driver
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

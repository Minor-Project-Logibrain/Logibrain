import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png";
import "./AddTruckForm.css";
import Message from './Message';
import axios from 'axios';

export default function AddTruckForm() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [drivers, setDrivers] = useState([]);

    const [imgFile, setImgFile] = useState(null);
    const [formData, setFormData] = useState({
        truckNo: '',
        chassisNo: '',
        vehicleModel: '',
        truckType: '',
        fuleType: 'Diesel',
        manufacturer: '',
        model: '',
        manufacturingYear: '',
        chassisNumber: '',
        engineNumber: '',
        loadCapacity: '',
        assignedDriver: '',
        rcNumber: '',
        insurenceNumber: '',
        insurenceExpiry: '',
        status: 'available',
    });

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await axios.get("http://localhost:8080/owners/drivers", {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setDrivers(res.data.result);
                }
            } catch (error) {
                console.error("Failed to load drivers", error);
            }
        };
        fetchDrivers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImgFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.truckNo || !formData.chassisNo) {
            setMessage("Truck Number and Primary Chassis Number are required.");
            setSuccess(false);
            return;
        }

        const payload = new FormData();
        Object.keys(formData).forEach((key) => {
            const value = formData[key];
            if (value !== '' && value !== null && value !== undefined) {
                payload.append(key, value);
            }
        });

        if (imgFile) {
            payload.append('img', imgFile);
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/owners/add-truck",
                payload,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setMessage(res.data.message);
            setSuccess(true);

            // Navigate back to owner dashboard (or trucks tab)
            setTimeout(() => {
                navigate('/owner/dashboard');
            }, 1500);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Something went wrong while adding the truck."
            );
            setSuccess(false);
        }
    };

    return (
        <div className="add-truck-wrapper">
            <Message message={message} success={success} clearMessage={() => setMessage('')} />

            {/* Navigation back header */}
            <div className="add-truck-header-nav">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="back-link-truck"
                    style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back</span>
                </button>
            </div>

            {/* Central Form Container */}
            <div className="add-truck-container">
                <div className="add-truck-card">
                    <div className="truck-brand">
                        <img src={Logo} alt="LogiBrain Logo" className="truck-logo" />
                        <h1 className="truck-title">LogiBrain</h1>
                    </div>

                    <div className="truck-header-text">
                        <h2>Add New Truck</h2>
                        <p>Enter specifications and compliance details for the fleet vehicle</p>
                    </div>

                    <form onSubmit={handleSubmit} className="add-truck-form">

                        {/* Section 1: General Details */}
                        <div className="form-section">
                            <h3 className="section-title">General Details</h3>
                            <div className="form-grid">
                                <div className="form-group-truck">
                                    <label htmlFor="truckNo">Truck Number *</label>
                                    <input
                                        id="truckNo"
                                        name="truckNo"
                                        type="text"
                                        placeholder="e.g. MH12AB1234"
                                        value={formData.truckNo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="chassisNo">Primary Chassis No *</label>
                                    <input
                                        id="chassisNo"
                                        name="chassisNo"
                                        type="text"
                                        placeholder="Enter primary chassis no"
                                        value={formData.chassisNo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="vehicleModel">Vehicle Model</label>
                                    <input
                                        id="vehicleModel"
                                        name="vehicleModel"
                                        type="text"
                                        placeholder="e.g. LPT 3118"
                                        value={formData.vehicleModel}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="manufacturer">Manufacturer</label>
                                    <input
                                        id="manufacturer"
                                        name="manufacturer"
                                        type="text"
                                        placeholder="e.g. Tata Motors"
                                        value={formData.manufacturer}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Technical Specifications */}
                        <div className="form-section">
                            <h3 className="section-title">Technical Specifications</h3>
                            <div className="form-grid">
                                <div className="form-group-truck">
                                    <label htmlFor="model">Model Name/No</label>
                                    <input
                                        id="model"
                                        name="model"
                                        type="text"
                                        placeholder="e.g. Signa 2823"
                                        value={formData.model}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="manufacturingYear">Manufacturing Year</label>
                                    <input
                                        id="manufacturingYear"
                                        name="manufacturingYear"
                                        type="number"
                                        placeholder="e.g. 2024"
                                        min="2000"
                                        max={new Date().getFullYear()}
                                        value={formData.manufacturingYear}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="truckType">Truck Type</label>
                                    <input
                                        id="truckType"
                                        name="truckType"
                                        type="text"
                                        placeholder="e.g. Open Body, Container"
                                        value={formData.truckType}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="fuleType">Fuel Type</label>
                                    <select
                                        id="fuleType"
                                        name="fuleType"
                                        value={formData.fuleType}
                                        onChange={handleChange}
                                    >
                                        <option value="Diesel">Diesel</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="engineNumber">Engine Number</label>
                                    <input
                                        id="engineNumber"
                                        name="engineNumber"
                                        type="text"
                                        placeholder="Enter engine number"
                                        value={formData.engineNumber}
                                        onChange={handleChange}
                                    />
                                </div>



                                <div className="form-group-truck">
                                    <label htmlFor="loadCapacity">Load Capacity (Tons)</label>
                                    <input
                                        id="loadCapacity"
                                        name="loadCapacity"
                                        type="number"
                                        placeholder="e.g. 25"
                                        step="0.1"
                                        value={formData.loadCapacity}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="img">Truck Image File</label>
                                    <input
                                        id="img"
                                        name="img"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Operations & Compliance */}
                        <div className="form-section">
                            <h3 className="section-title">Operations & Compliance</h3>
                            <div className="form-grid">
                                <div className="form-group-truck">
                                    <label htmlFor="assignedDriver">Assign Driver</label>
                                    <select
                                        id="assignedDriver"
                                        name="assignedDriver"
                                        value={formData.assignedDriver}
                                        onChange={handleChange}
                                    >
                                        <option value="">Unassigned</option>
                                        {drivers.map(driver => (
                                            <option key={driver._id} value={driver._id}>
                                                {driver.fullName} ({driver.phone})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="rcNumber">RC Book Number</label>
                                    <input
                                        id="rcNumber"
                                        name="rcNumber"
                                        type="text"
                                        placeholder="Enter RC number"
                                        value={formData.rcNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="insurenceNumber">Insurance Number</label>
                                    <input
                                        id="insurenceNumber"
                                        name="insurenceNumber"
                                        type="text"
                                        placeholder="Enter insurance policy number"
                                        value={formData.insurenceNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="insurenceExpiry">Insurance Expiry Date</label>
                                    <input
                                        id="insurenceExpiry"
                                        name="insurenceExpiry"
                                        type="date"
                                        value={formData.insurenceExpiry}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-truck">
                                    <label htmlFor="status">Truck Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="available">Available</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="sold">Sold</option>
                                        <option value="accidental">Accidental</option>
                                        <option value="insurance_expired">Insurance Expired</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="submit-row">
                            <button type="submit" className="submit-truck-btn">
                                Save Truck
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

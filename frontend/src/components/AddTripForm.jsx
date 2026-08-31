import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png";
import "./AddTripForm.css";
import { useState } from 'react';
import { useMemo } from 'react';
import Message from './Message';
import axios from 'axios';
import { useEffect } from 'react';
export default function AddTripForm() {
    const navigate = useNavigate();
    const [freightAmount, setFreigthAmount] = useState(0);
    const [fuelCost, setFuelCost] = useState(0);
    const [tollCost, setTollCost] = useState(0);
    const [otherExpenses, setOtherExpenses] = useState(0);
    const totalExpenses = Number(fuelCost) + Number(tollCost) + Number(otherExpenses);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [formData, setFormData] = useState({
        tripNumber: "",
        startDate: "",
        endDate: "",
        pickupLocation: {
            address: "",
            city: "",
            state: "",
            pinCode: "",
            latitude: "",
            longitude: ""
        },
        dropoffLocation: {
            address: "",
            city: "",
            state: "",
            pinCode: "",
            latitude: "",
            longitude: ""
        },
        cargoType: "",
        cargoWeight: 0,
        quantity: 0,
        cargovalue: 0,
        cargoDescription: "",
        freightAmount: 0,
        fuelCost: 0,
        tollCost: 0,
        otherExpenses: 0,
        notes: "",

    });
    const handleChange = (e) => {
        const [name, value] = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    };
    const getDriver = async () => {
        try {
            const res = await axios.get("http://localhost:8080/owners/available-drivers", {
                withCredentials: true,
            });
            console.log("DRIVER API RESPONSE:", res.data);
            setDrivers(res.data.result);
        } catch (err) {
            setSuccess(false);
            setMessage(err.response?.data?.message || "failed to fetch drivers");
            return;
        }
    }
    const getAvailableTrucks = async () => {
        try {
            const res = await axios.get("http://localhost:8080/owners/available-trucks", {
                withCredentials: true,
            });
            console.log("TRUCK API RESPONSE:", res.data);

            setTrucks(res.data.result);

        } catch (err) {
            setSuccess(false);
            setMessage(err.response?.data?.message || "failed to fetch trucks");
            return;
        }
    }

    useEffect(() => {
        getAvailableTrucks();
        getDriver();
    }, [])
    return (
        <div className="add-trip-wrapper">
            {/* Back Navigation Header */}
            <Message message={message} success={success} clearMessage={() => setMessage('')} />
            <div className="add-trip-header-nav">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="back-link-trip"
                    style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back</span>
                </button>
            </div>

            {/* Central Form Container */}
            <div className="add-trip-container">
                <div className="add-trip-card">
                    <div className="trip-brand">
                        <img src={Logo} alt="LogiBrain Logo" className="trip-logo" />
                        <h1 className="trip-title">LogiBrain</h1>
                    </div>

                    <div className="trip-header-text">
                        <h2>Create New Trip</h2>
                        <p>Enter routing, assignment, cargo, and financial information for the new trip</p>
                    </div>

                    <form onSubmit={handleSubmit} className="add-trip-form">

                        {/* Section 1: Trip Information */}
                        <div className="form-section">
                            <h3 className="section-title">1. General Trip Details</h3>
                            <div className="form-grid">
                                <div className="form-group-trip">
                                    <label htmlFor="tripNumber">Unique Trip Number *</label>
                                    <input
                                        type="text"
                                        id="tripNumber"
                                        name="tripNumber"
                                        placeholder="TRIP-2026-0001"
                                        value={formData.tripNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-group-trip">
                                    <label htmlFor="startDate">Trip Start Date *</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        required
                                    />
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="endDate">Trip End Date *</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Route Information */}
                        <div className="form-section">
                            <h3 className="section-title">2. Route Information</h3>

                            {/* Pickup Location */}
                            <div className="location-section">
                                <h4 className="location-title">Pickup Location</h4>

                                <div className="form-grid">

                                    <div className="form-group-trip full-width">
                                        <label htmlFor="pickupAddress">Address *</label>
                                        <input
                                            type="text"
                                            id="pickupAddress"
                                            name="pickupAddress"
                                            placeholder="e.g. Mumbai Port Terminal 2"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="pickupCity">City *</label>
                                        <input
                                            type="text"
                                            id="pickupCity"
                                            name="pickupCity"
                                            placeholder="e.g. Mumbai"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="pickupState">State *</label>
                                        <input
                                            type="text"
                                            id="pickupState"
                                            name="pickupState"
                                            placeholder="e.g. Maharashtra"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="pickupPinCode">PIN Code *</label>
                                        <input
                                            type="text"
                                            id="pickupPinCode"
                                            name="pickupPinCode"
                                            placeholder="e.g. 400001"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="pickupLatitude">Latitude *</label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="pickupLatitude"
                                            name="pickupLatitude"
                                            placeholder="e.g. 19.0760"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="pickupLongitude">Longitude *</label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="pickupLongitude"
                                            name="pickupLongitude"
                                            placeholder="e.g. 72.8777"
                                            required
                                        />
                                    </div>

                                </div>
                            </div>


                            {/* Drop-off Location */}
                            <div className="location-section">
                                <h4 className="location-title">Drop-off Location</h4>

                                <div className="form-grid">

                                    <div className="form-group-trip full-width">
                                        <label htmlFor="dropoffAddress">Address *</label>
                                        <input
                                            type="text"
                                            id="dropoffAddress"
                                            name="dropoffAddress"
                                            placeholder="e.g. Delhi Cargo Terminal"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="dropoffCity">City *</label>
                                        <input
                                            type="text"
                                            id="dropoffCity"
                                            name="dropoffCity"
                                            placeholder="e.g. Delhi"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="dropoffState">State *</label>
                                        <input
                                            type="text"
                                            id="dropoffState"
                                            name="dropoffState"
                                            placeholder="e.g. Delhi"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="dropoffPinCode">PIN Code *</label>
                                        <input
                                            type="text"
                                            id="dropoffPinCode"
                                            name="dropoffPinCode"
                                            placeholder="e.g. 110001"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="dropoffLatitude">Latitude *</label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="dropoffLatitude"
                                            name="dropoffLatitude"
                                            placeholder="e.g. 28.6139"
                                            required
                                        />
                                    </div>

                                    <div className="form-group-trip">
                                        <label htmlFor="dropoffLongitude">Longitude *</label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="dropoffLongitude"
                                            name="dropoffLongitude"
                                            placeholder="e.g. 77.2090"
                                            required
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Section 3: Vehicle & Driver Assignment */}
                        <div className="form-section">
                            <h3 className="section-title">3. Vehicle & Driver Assignment</h3>
                            <div className="form-grid">
                                <div className="form-group-trip">
                                    <label htmlFor="assignedTruck">Assigned Truck *</label>
                                    <select
                                        id="assignedTruck"
                                        name="assignedTruck"
                                        defaultValue=""
                                        required
                                    >
                                        <option value="" disabled>-- Select Truck --</option>
                                        {trucks.map((truck) => (
                                            <option key={truck._id} value={truck._id}>{truck.truckNo}-{truck.model}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="assignedDriver">Assigned Driver *</label>
                                    <select
                                        id="assignedDriver"
                                        name="assignedDriver"
                                        defaultValue=""
                                        required
                                    >
                                        <option value="" disabled>-- Select Driver --</option>
                                        {drivers.map((driver) => (
                                            <option key={driver._id} value={driver._id}>{driver.fullName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Cargo Information */}
                        <div className="form-section">
                            <h3 className="section-title">4. Cargo Information</h3>
                            <div className="form-grid">
                                <div className="form-group-trip">
                                    <label htmlFor="cargoType">Cargo Type *</label>
                                    <input
                                        type="text"
                                        id="cargoType"
                                        name="cargoType"
                                        placeholder="e.g. Industrial Goods, Electronics"
                                        required
                                    />
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="cargoWeight">Cargo Weight *</label>
                                    <input
                                        type="number"
                                        id="cargoWeight"
                                        name="cargoWeight"
                                        placeholder="Weight in kg/tons"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="quantity">Quantity *</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        placeholder="e.g. 50 boxes"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="cargoValue">Cargo Value (INR)</label>
                                    <div className="currency-input-container">
                                        <span className="currency-prefix">₹</span>
                                        <input
                                            type="number"
                                            id="cargoValue"
                                            name="cargoValue"
                                            placeholder="e.g. 15,00,000"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="form-group-trip full-width">
                                    <label htmlFor="cargoDescription">Cargo Description *</label>
                                    <input
                                        type="text"
                                        id="cargoDescription"
                                        name="cargoDescription"
                                        placeholder="Specify brand, handling instructions..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Financial Information */}
                        <div className="form-section">
                            <h3 className="section-title">5. Financial Information</h3>
                            <div className="form-grid">
                                <div className="form-group-trip">
                                    <label htmlFor="freightAmount">Freight Amount *</label>
                                    <div className="currency-input-container">
                                        <span className="currency-prefix">₹</span>
                                        <input
                                            type="number"
                                            id="freightAmount"
                                            name="freightAmount"
                                            placeholder="Freight revenue"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="fuelCost">Fuel Cost *</label>
                                    <div className="currency-input-container">
                                        <span className="currency-prefix">₹</span>
                                        <input
                                            type="number"
                                            id="fuelCost"
                                            name="fuelCost"
                                            placeholder="Fuel expenses"
                                            min="0"
                                            required
                                            onChange={(e) => setFuelCost(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="tollCost">Toll Cost *</label>
                                    <div className="currency-input-container">
                                        <span className="currency-prefix">₹</span>
                                        <input
                                            type="number"
                                            id="tollCost"
                                            name="tollCost"
                                            placeholder="Fastag / toll costs"
                                            min="0"
                                            onChange={(e) => setTollCost(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group-trip">
                                    <label htmlFor="otherExpenses">Other Expenses *</label>
                                    <div className="currency-input-container">
                                        <span className="currency-prefix">₹</span>
                                        <input
                                            type="number"
                                            id="otherExpenses"
                                            name="otherExpenses"
                                            placeholder="Miscellaneous expenses"
                                            min="0"
                                            onChange={(e) => setOtherExpenses(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group-trip full-width">
                                    <label htmlFor="totalExpense" className="highlight-label">Total Budget </label>
                                    <div className="currency-input-container">
                                        <span className="currency-prefix highlight-symbol">₹</span>
                                        <input
                                            type="number"
                                            id="totalExpense"
                                            name="totalExpense"
                                            placeholder="Calculated sum of expenses"
                                            className="highlight-input"
                                            readOnly
                                            value={totalExpenses}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Additional Information */}
                        <div className="form-section">
                            <h3 className="section-title">6. Additional Information</h3>
                            <div className="form-group-trip full-width">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    placeholder="Add any additional information about this trip..."
                                />
                            </div>
                        </div>

                        {/* Form Submit & Cancel Actions */}
                        <div className="form-actions-row">
                            <button
                                type="button"
                                className="btn-cancel-trip"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit-trip">
                                Create Trip
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

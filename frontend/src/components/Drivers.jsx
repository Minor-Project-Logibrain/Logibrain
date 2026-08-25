import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Message from "./Message";
import Loading from "../utils/Loading.jsx";
import "./Drivers.css";

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    // Edit states
    const [editingDriver, setEditingDriver] = useState(null);
    const [editFullName, setEditFullName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editEmail, setEditEmail] = useState("");

    // Delete states
    const [deletingDriver, setDeletingDriver] = useState(null);

    const handleDrivers = async (showToast = false) => {
        try {
            const res = await axios.get("http://localhost:8080/owners/drivers", {
                withCredentials: true
            });
            console.log("API RESPONSE:", res.data.result);
            if (!res.data.success) {
                setMessage(res.data.message);
                setSuccess(false);
                return;
            }
            if (showToast) {
                setMessage(res.data.message);
                setSuccess(true);
            }
            setDrivers(res.data.result);
            setLoading(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message;
            setMessage(errorMessage);
            setSuccess(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDrivers(false);
    }, []);

    const handleEditClick = (driver) => {
        setEditingDriver(driver);
        setEditFullName(driver.fullName);
        setEditPhone(driver.phone);
        setEditEmail(driver.email);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!editFullName || !editPhone || !editEmail) {
            setMessage("Please fill in all fields.");
            setSuccess(false);
            return;
        }

        const phoneRegex = /^[6-9][0-9]{9}$/;
        if (!phoneRegex.test(editPhone)) {
            setMessage("Invalid phone number! Must start with 6-9 and be 10 digits.");
            setSuccess(false);
            return;
        }

        try {
            const res = await axios.put(
                `http://localhost:8080/owners/drivers/${editingDriver._id}`,
                {
                    fullName: editFullName,
                    phone: editPhone,
                    email: editEmail,
                },
                {
                    withCredentials: true,
                }
            );

            setMessage(res.data.message);
            setSuccess(true);
            setEditingDriver(null);
            handleDrivers(false);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update driver");
            setSuccess(false);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:8080/owners/drivers/${deletingDriver._id}`,
                {
                    withCredentials: true,
                }
            );

            setMessage(res.data.message);
            setSuccess(true);
            setDeletingDriver(null);
            handleDrivers(false);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to delete driver");
            setSuccess(false);
            setDeletingDriver(null);
        }
    };

    return (
        <div>
            <Message message={message} success={success} clearMessage={() => setMessage('')} />
            <div className="drivers-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Drivers</h2>
                    <Link to="/owner/add-driver" className="db-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', width: '32px', height: '32px', boxShadow: 'none' }} title="Add Driver">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                    </Link>
                </div>
                <Link to="/owner/add-driver" className="db-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                    Add Driver
                </Link>
            </div>
            {
                loading ? <Loading size="large" /> : (
                    <div className="driverContainer">
                        {drivers.map((driver) => (
                            <div key={driver._id} className="driver-card">
                                <h3>{driver.fullName}</h3>
                                <p><span>Phone: </span>{driver.phone}</p>
                                <p><span>Email: </span>{driver.email}</p>
                                <div className="driver-card-actions">
                                    <button
                                        type="button"
                                        className="btn-edit"
                                        onClick={() => handleEditClick(driver)}
                                        title="Edit Driver"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-delete"
                                        onClick={() => setDeletingDriver(driver)}
                                        title="Delete Driver"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            {/* Edit Modal */}
            {editingDriver && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-in">
                        <div className="modal-header">
                            <h3>Edit Driver Details</h3>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setEditingDriver(null)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="editFullName">Full Name</label>
                                <input
                                    id="editFullName"
                                    type="text"
                                    value={editFullName}
                                    onChange={(e) => setEditFullName(e.target.value)}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editPhone">Phone Number</label>
                                <input
                                    id="editPhone"
                                    type="text"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    placeholder="e.g. 9876543210"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editEmail">Email Address</label>
                                <input
                                    id="editEmail"
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    placeholder="driver@company.com"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setEditingDriver(null)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingDriver && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal animate-slide-in">
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setDeletingDriver(null)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body" style={{ margin: "12px 0" }}>
                            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
                                Are you sure you want to delete driver <strong>{deletingDriver.fullName}</strong>?
                            </p>
                            <p className="warning-text">
                                This action cannot be undone and will permanently remove the driver.
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setDeletingDriver(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-confirm-delete"
                                onClick={handleDeleteSubmit}
                            >
                                Delete Driver
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
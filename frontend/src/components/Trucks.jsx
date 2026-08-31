import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Message from "./Message";
import Loading from "../utils/Loading.jsx";
import "./Trucks.css";

export default function Trucks() {
    const [trucks, setTrucks] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    // Edit states
    const [editingTruck, setEditingTruck] = useState(null);
    const [editImgFile, setEditImgFile] = useState(null);
    const [editFormData, setEditFormData] = useState({
        truckNo: '',
        chassisNo: '',
        vehicleModel: '',
        truckType: '',
        fuleType: '',
        manufacturer: '',
        model: '',
        manufacturingYear: '',
        chassisNumber: '',
        engineNumber: '',
        loadCapacity: '',
        assignedDriver: '',
        img: '',
        rcNumber: '',
        insurenceNumber: '',
        insurenceExpiry: '',
        status: 'available',
    });

    // Delete states
    const [deletingTruck, setDeletingTruck] = useState(null);

    const handleTrucks = async (showToast = false) => {
        try {
            const res = await axios.get("http://localhost:8080/owners/trucks", {
                withCredentials: true
            });
            console.log("TRUCKS API RESPONSE:", res.data.result);
            if (!res.data.success) {
                setMessage(res.data.message);
                setSuccess(false);
                setTrucks([]);
                setLoading(false);
                return;
            }
            if (showToast) {
                setMessage(res.data.message);
                setSuccess(true);
            }
            setTrucks(res.data.result || []);
            setLoading(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to load trucks";
            // If it's just "no trucks found", we don't need to show a critical error screen, just display "No trucks found"
            if (err.response?.status !== 200) {
                setMessage(errorMessage);
                setSuccess(false);
            }
            setTrucks([]);
            setLoading(false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/owners/drivers", {
                withCredentials: true
            });
            if (res.data.success) {
                setDrivers(res.data.result || []);
            }
        } catch (err) {
            console.error("Failed to fetch drivers for select field:", err);
        }
    };

    useEffect(() => {
        handleTrucks(false);
        fetchDrivers();
    }, []);

    const handleEditClick = (truck) => {
        setEditingTruck(truck);
        setEditImgFile(null);
        setEditFormData({
            truckNo: truck.truckNo || '',
            chassisNo: truck.chassisNo || '',
            vehicleModel: truck.vehicleModel || '',
            truckType: truck.truckType || '',
            fuleType: truck.fuleType || 'Diesel',
            manufacturer: truck.manufacturer || '',
            model: truck.model || '',
            manufacturingYear: truck.manufacturingYear || '',
            chassisNumber: truck.chassisNumber || '',
            engineNumber: truck.engineNumber || '',
            loadCapacity: truck.loadCapacity || '',
            assignedDriver: truck.assignedDriver?._id || truck.assignedDriver || '',
            img: truck.img || '',
            rcNumber: truck.rcNumber || '',
            insurenceNumber: truck.insurenceNumber || '',
            insurenceExpiry: truck.insurenceExpiry ? new Date(truck.insurenceExpiry).toISOString().split('T')[0] : '',
            status: truck.status || 'available',
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditFileChange = (e) => {
        setEditImgFile(e.target.files[0]);
    };

    const getImgUrl = (img) => {
        if (!img) return null;
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        return `http://localhost:8080/${img}`;
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!editFormData.truckNo || !editFormData.chassisNo) {
            setMessage("Truck Number and Primary Chassis Number are required.");
            setSuccess(false);
            return;
        }

        const payload = new FormData();
        Object.keys(editFormData).forEach((key) => {
            if (key !== 'img') {
                const value = editFormData[key];
                if (value !== '' && value !== null && value !== undefined) {
                    payload.append(key, value);
                }
            }
        });

        if (editImgFile) {
            payload.append('img', editImgFile);
        }

        try {
            const res = await axios.put(
                `http://localhost:8080/owners/trucks/${editingTruck._id}`,
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
            setEditingTruck(null);
            handleTrucks(false);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update truck details");
            setSuccess(false);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:8080/owners/trucks/${deletingTruck._id}`,
                {
                    withCredentials: true,
                }
            );

            setMessage(res.data.message);
            setSuccess(true);
            setDeletingTruck(null);
            handleTrucks(false);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to delete truck");
            setSuccess(false);
            setDeletingTruck(null);
        }
    };

    // Format dates nicely
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="trucks-section">
            <Message message={message} success={success} clearMessage={() => setMessage('')} />

            <div className="trucks-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Trucks</h2>
                    <Link to="/owner/add-truck" className="db-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', width: '32px', height: '32px', boxShadow: 'none' }} title="Add Truck">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                    </Link>
                </div>
                <Link to="/owner/add-truck" className="db-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_shipping</span>
                    Add Truck
                </Link>
            </div>

            {loading ? <Loading size="large" /> : (
                trucks.length === 0 ? (
                    <div className="empty-trucks-state">
                        <span className="material-symbols-outlined empty-icon">local_shipping</span>
                        <h3>No Trucks Registered</h3>
                        <p>Get started by adding the first truck to your logistics fleet management.</p>
                        <Link to="/owner/add-truck" className="db-btn-primary" style={{ textDecoration: 'none', marginTop: '12px' }}>
                            Add First Truck
                        </Link>
                    </div>
                ) : (
                    <div className="truckContainer">
                        {trucks.map((truck) => (
                            <div key={truck._id} className="truck-card">
                                <div className="truck-card-header">
                                    <div className="truck-avatar">
                                        {truck.img ? (
                                            <img src={getImgUrl(truck.img)} alt={truck.truckNo} className="truck-card-img" />
                                        ) : (
                                            <span className="material-symbols-outlined truck-fallback-icon">local_shipping</span>
                                        )}
                                    </div>
                                    <div className="truck-header-info">
                                        <h3>{truck.truckNo}</h3>
                                        <span className={`status-badge status-${truck.status}`}>
                                            {truck.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="truck-card-body">
                                    <p><span>Chassis No:</span> {truck.chassisNo}</p>
                                    <p><span>Model:</span> {truck.vehicleModel || truck.model || "N/A"}</p>
                                    <p><span>Fuel Type:</span> {truck.fuleType || "N/A"}</p>
                                    <p><span>Load Capacity:</span> {truck.loadCapacity ? `${truck.loadCapacity} Tons` : "N/A"}</p>
                                    <p><span>Driver:</span> {truck.assignedDriver?.fullName || "Unassigned"}</p>
                                    <p><span>Insurance Expiry:</span> {formatDate(truck.insurenceExpiry)}</p>
                                </div>

                                <div className="truck-card-actions">
                                    <button
                                        type="button"
                                        className="btn-edit"
                                        onClick={() => handleEditClick(truck)}
                                        title="Edit Truck"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-delete"
                                        onClick={() => setDeletingTruck(truck)}
                                        title="Delete Truck"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* Edit Modal */}
            {editingTruck && (
                <div className="modal-overlay">
                    <div className="modal-content truck-modal-content animate-slide-in">
                        <div className="modal-header">
                            <h3>Edit Truck Details</h3>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setEditingTruck(null)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="modal-form">
                            <div className="modal-form-grid">
                                <div className="form-group">
                                    <label htmlFor="editTruckNo">Truck Number</label>
                                    <input
                                        id="editTruckNo"
                                        name="truckNo"
                                        type="text"
                                        value={editFormData.truckNo}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editChassisNo">Chassis No</label>
                                    <input
                                        id="editChassisNo"
                                        name="chassisNo"
                                        type="text"
                                        value={editFormData.chassisNo}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editVehicleModel">Vehicle Model</label>
                                    <input
                                        id="editVehicleModel"
                                        name="vehicleModel"
                                        type="text"
                                        value={editFormData.vehicleModel}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editManufacturer">Manufacturer</label>
                                    <input
                                        id="editManufacturer"
                                        name="manufacturer"
                                        type="text"
                                        value={editFormData.manufacturer}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editModel">Model Name</label>
                                    <input
                                        id="editModel"
                                        name="model"
                                        type="text"
                                        value={editFormData.model}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editManufacturingYear">Year</label>
                                    <input
                                        id="editManufacturingYear"
                                        name="manufacturingYear"
                                        type="number"
                                        value={editFormData.manufacturingYear}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editFuleType">Fuel Type</label>
                                    <select
                                        id="editFuleType"
                                        name="fuleType"
                                        value={editFormData.fuleType}
                                        onChange={handleEditChange}
                                    >
                                        <option value="Diesel">Diesel</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editLoadCapacity">Load Capacity (Tons)</label>
                                    <input
                                        id="editLoadCapacity"
                                        name="loadCapacity"
                                        type="number"
                                        step="0.1"
                                        value={editFormData.loadCapacity}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editAssignedDriver">Assign Driver</label>
                                    <select
                                        id="editAssignedDriver"
                                        name="assignedDriver"
                                        value={editFormData.assignedDriver}
                                        onChange={handleEditChange}
                                    >
                                        <option value="Unassigned">Unassigned</option>
                                        {drivers.map(driver => (
                                            <option key={driver._id} value={driver._id}>
                                                {driver.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editStatus">Status</label>
                                    <select
                                        id="editStatus"
                                        name="status"
                                        value={editFormData.status}
                                        onChange={handleEditChange}
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
                                <div className="form-group">
                                    <label htmlFor="editInsurenceNumber">Insurance No</label>
                                    <input
                                        id="editInsurenceNumber"
                                        name="insurenceNumber"
                                        type="text"
                                        value={editFormData.insurenceNumber}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editInsurenceExpiry">Insurance Expiry</label>
                                    <input
                                        id="editInsurenceExpiry"
                                        name="insurenceExpiry"
                                        type="date"
                                        value={editFormData.insurenceExpiry}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="editImg">Truck Image File</label>
                                    <input
                                        id="editImg"
                                        name="img"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditFileChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setEditingTruck(null)}
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
            {deletingTruck && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal animate-slide-in">
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setDeletingTruck(null)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body" style={{ margin: "12px 0" }}>
                            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
                                Are you sure you want to delete truck <strong>{deletingTruck.truckNo}</strong>?
                            </p>
                            <p className="warning-text">
                                This action cannot be undone and will permanently remove the vehicle specification record.
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setDeletingTruck(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-confirm-delete"
                                onClick={handleDeleteSubmit}
                            >
                                Delete Truck
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useEffect, useState } from "react";
import "./OwnerDashBoard.css";
import "./DriverCheckTrip.css";
import Message from "./Message";
import axios from "axios";

export default function DriverCheckTrip({ onAddBill }) {
    // ==========================================
    // 1. COMPONENT STATE
    // ==========================================
    const [trips, setTrips] = useState([]);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    // ==========================================
    // 2. API CALL: GET DRIVER TRIPS
    // ==========================================
    const getTrips = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/driver/trips/get-trips",
                {
                    withCredentials: true,
                }
            );

            if (!res.data.success) {
                setSuccess(false);
                setMessage(res.data.message);
                return;
            }

            console.log("CHECK TRIP API: ", res.data);
            setTrips(res.data.result);
        } catch (err) {
            setSuccess(false);
            setMessage(
                err.response?.data?.message || "Failed to get trips"
            );
        }
    };

    useEffect(() => {
        getTrips();
    }, []);

    // Handle clicking a trip to add bills
    const handleTripClick = (trip) => {
        if (onAddBill) {
            onAddBill(trip);
        }
    };

    // ==========================================
    // 3. RENDER UI
    // ==========================================
    return (
        <div className="dashboard-page animate-fade-in driver-trips-page">
            {/* Page Header */}
            <div className="driver-page-header">
                <div>
                    <h2>Trips & Routes</h2>
                    <p>Check your active assigned routes and file expense bills.</p>
                </div>

                <div className="db-date-badge driver-mode-badge">
                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "16px" }}
                    >
                        route
                    </span>
                    Active Driver Mode
                </div>
            </div>

            {/* Message Alert */}
            <Message
                success={success}
                message={message}
                clearMessage={() => setMessage("")}
            />

            {/* Active Assigned Trips Card */}
            <div className="db-card driver-trips-card">
                <div className="db-table-header">
                    <div className="db-table-title-wrap">
                        <h3 className="db-table-title">Active Assigned Trips</h3>
                        <p className="driver-table-hint">Click on any trip to add expense bills</p>
                    </div>
                    <span className="driver-last-trips">
                        {trips.length} Active Trip{trips.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="driver-table-wrapper">
                    {trips.length === 0 ? (
                        /* Empty State */
                        <div className="driver-no-trips">
                            <span className="material-symbols-outlined">
                                local_shipping
                            </span>
                            <h3>No Trips Assigned</h3>
                            <p>You currently don't have any assigned trips.</p>
                        </div>
                    ) : (
                        /* Trips Table */
                        <table className="db-table driver-trips-table">
                            <thead>
                                <tr>
                                    <th>Trip No</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Route</th>
                                    <th>Truck</th>
                                    <th>Cargo</th>
                                    <th>Status</th>
                                    <th className="driver-th-action">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {trips.map((trip) => {
                                    const tripStatus = trip.status || "Planned";
                                    const statusLower = tripStatus.toLowerCase();

                                    const isCompleted = statusLower === "completed";
                                    const isDelayed =
                                        statusLower === "delayed" ||
                                        statusLower === "cancelled";

                                    return (
                                        <tr
                                            key={trip._id || trip.tripNo}
                                            className="driver-table-row-clickable"
                                            onClick={() => handleTripClick(trip)}
                                            title="Click to add bills for this trip"
                                        >
                                            {/* Trip Number */}
                                            <td className="db-table-id">
                                                <div className="driver-trip-id-cell">
                                                    <span className="material-symbols-outlined driver-trip-icon">
                                                        confirmation_number
                                                    </span>
                                                    {trip.tripNo}
                                                </div>
                                            </td>

                                            {/* Start Date */}
                                            <td>
                                                {trip.startDate || trip.plannedStartDate
                                                    ? new Date(
                                                          trip.startDate || trip.plannedStartDate
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            {/* End Date */}
                                            <td>
                                                {trip.endDate || trip.plannedEndDate
                                                    ? new Date(
                                                          trip.endDate || trip.plannedEndDate
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            {/* Route */}
                                            <td className="db-table-route">
                                                <span className="driver-route-text">
                                                    {trip.pickupLocation?.city || trip.source || "-"}
                                                    <span className="driver-route-arrow"> → </span>
                                                    {trip.deliveryLocation?.city || trip.destination || "-"}
                                                </span>
                                            </td>

                                            {/* Truck */}
                                            <td>
                                                <span className="db-table-mono driver-truck-chip">
                                                    <span className="material-symbols-outlined driver-truck-icon">
                                                        local_shipping
                                                    </span>
                                                    {trip.truck?.truckNo ||
                                                        (typeof trip.truck === "string" ? trip.truck : "-")}
                                                </span>
                                            </td>

                                            {/* Cargo */}
                                            <td>
                                                <span className="driver-cargo-text">
                                                    {trip.cargo?.type ||
                                                        (typeof trip.cargo === "string" ? trip.cargo : "-")}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span
                                                    className={`db-status-badge driver-trip-status ${
                                                        isCompleted
                                                            ? "db-status-delivered"
                                                            : isDelayed
                                                            ? "db-status-delayed"
                                                            : "db-status-transit"
                                                    }`}
                                                >
                                                    {tripStatus}
                                                </span>
                                            </td>

                                            {/* Action: Add Bill Button */}
                                            <td className="driver-td-action">
                                                <button
                                                    type="button"
                                                    className="driver-add-bill-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTripClick(trip);
                                                    }}
                                                    title={`Add bill for ${trip.tripNo}`}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        receipt_long
                                                    </span>
                                                    Add Bill
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
import { Link } from "react-router-dom";
import "./Trips.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Trips() {

    // Total trips
    const [totleTrips, setTotleTrips] = useState(0);

    // All trips
    const [trips, setTrips] = useState([]);


    // ==========================================
    // GET TOTAL NUMBER OF TRIPS
    // ==========================================

    const getTotleTrips = async () => {
        try {

            const res = await axios.get(
                "http://localhost:8080/owner/trips/totle-numbers-trips",
                {
                    withCredentials: true,
                }
            );

            console.log("TOTAL TRIPS:", res.data);

            setTotleTrips(res.data.result);

        } catch (err) {

            console.log(err);

        }
    };


    // ==========================================
    // GET ALL TRIPS
    // ==========================================

    const getTrips = async () => {
        try {

            const res = await axios.get(
                "http://localhost:8080/owner/trips/get-trips",
                {
                    withCredentials: true,
                }
            );

            console.log("TRIPS API RESPONSE:", res.data);

            // Store result array in trips state
            setTrips(res.data.result);

        } catch (err) {

            console.log(err);

        }
    };


    // ==========================================
    // CALL APIs WHEN COMPONENT LOADS
    // ==========================================

    useEffect(() => {

        getTotleTrips();

        getTrips();

    }, []);


    console.log("TRIPS STATE:", trips);


    return (

        <div className="trips-section">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div
                className="drivers-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #e2e8f0",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >

                    <h2
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#0f172a",
                            margin: 0,
                        }}
                    >
                        Trips
                    </h2>


                    {/* ADD TRIP BUTTON */}

                    <Link
                        to="/owner/add-trip"
                        className="db-btn-primary"
                        style={{
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "6px",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            boxShadow: "none",
                        }}
                        title="Create New Trip"
                    >

                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "20px" }}
                        >
                            add
                        </span>

                    </Link>

                </div>


                {/* CREATE TRIP BUTTON */}

                <Link
                    to="/owner/add-trip"
                    className="db-btn-primary"
                    style={{
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >

                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "18px" }}
                    >
                        route
                    </span>

                    Create Trip

                </Link>

            </div>


            {/* ==========================================
                STATISTICS CARDS
            ========================================== */}

            <div className="trips-stats-grid">


                {/* TOTAL TRIPS */}

                <div className="trip-stat-card">

                    <div className="trip-stat-icon-box blue">

                        <span className="material-symbols-outlined">
                            analytics
                        </span>

                    </div>

                    <div className="trip-stat-info">

                        <h4>Total Trips</h4>

                        <p>{totleTrips}</p>

                    </div>

                </div>


                {/* IN TRANSIT */}

                <div className="trip-stat-card">

                    <div className="trip-stat-icon-box orange">

                        <span className="material-symbols-outlined">
                            local_shipping
                        </span>

                    </div>

                    <div className="trip-stat-info">

                        <h4>In Transit</h4>

                        <p>3</p>

                    </div>

                </div>


                {/* PLANNED */}

                <div className="trip-stat-card">

                    <div className="trip-stat-icon-box yellow">

                        <span className="material-symbols-outlined">
                            pending_actions
                        </span>

                    </div>

                    <div className="trip-stat-info">

                        <h4>Planned / Assigned</h4>

                        <p>8</p>

                    </div>

                </div>


                {/* COMPLETED */}

                <div className="trip-stat-card">

                    <div className="trip-stat-icon-box green">

                        <span className="material-symbols-outlined">
                            check_circle
                        </span>

                    </div>

                    <div className="trip-stat-info">

                        <h4>Completed</h4>

                        <p>3</p>

                    </div>

                </div>

            </div>


            {/* ==========================================
                TRIPS TABLE
            ========================================== */}

            <div className="trips-list-card">

                <h3>Trips Register</h3>


                <div className="trips-table-wrapper">

                    <table className="trips-table">


                        {/* TABLE HEADER */}

                        <thead>

                            <tr>

                                <th>Trip ID</th>

                                <th>Route (From - To)</th>

                                <th>Truck No</th>

                                <th>Driver</th>

                                <th>Cargo</th>

                                <th>Total Cost</th>

                                <th>Status</th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>


                            {/* IF NO TRIPS */}

                            {trips.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign: "center",
                                            padding: "20px",
                                        }}
                                    >
                                        No trips found
                                    </td>

                                </tr>

                            ) : (


                                /* SHOW ALL TRIPS */

                                trips.map((trip) => (

                                    <tr key={trip._id}>


                                        {/* TRIP NUMBER */}

                                        <td className="trip-num-cell">

                                            {trip.tripNo}

                                        </td>


                                        {/* ROUTE */}

                                        <td>

                                            <div
                                                style={{
                                                    fontWeight: "600",
                                                }}
                                            >

                                                {trip.pickupLocation?.city}

                                                {" → "}

                                                {trip.deliveryLocation?.city}

                                            </div>


                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#64748b",
                                                }}
                                            >

                                                {trip.pickupLocation?.address}

                                                {" → "}

                                                {trip.deliveryLocation?.address}

                                            </span>


                                            <br />


                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#94a3b8",
                                                }}
                                            >

                                                {trip.plannedStartDate
                                                    ? new Date(
                                                        trip.plannedStartDate
                                                    ).toLocaleDateString()
                                                    : ""
                                                }

                                                {" to "}

                                                {trip.plannedEndDate
                                                    ? new Date(
                                                        trip.plannedEndDate
                                                    ).toLocaleDateString()
                                                    : ""
                                                }

                                            </span>

                                        </td>


                                        {/* TRUCK */}

                                        <td
                                            style={{
                                                fontFamily: "monospace",
                                            }}
                                        >

                                            {trip.truck?.truckNo || trip.truck || "Not Assigned"}

                                        </td>


                                        {/* DRIVER */}

                                        <td>

                                            {trip.driver?.fullName || trip.driver || "Not Assigned"}

                                        </td>


                                        {/* CARGO */}

                                        <td>

                                            <div>

                                                <strong>
                                                    {trip.cargo?.type}
                                                </strong>

                                            </div>


                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#64748b",
                                                }}
                                            >

                                                {trip.cargo?.quantity}

                                                {" "}

                                                {trip.cargo?.weightUnit}

                                            </span>

                                        </td>


                                        {/* TOTAL COST */}

                                        <td
                                            style={{
                                                fontWeight: "600",
                                            }}
                                        >

                                            ₹{trip.freightAmount}

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`trip-badge status-${trip.status
                                                    ?.toLowerCase()
                                                    .replace(/\s+/g, "-")
                                                    }`}
                                            >

                                                {trip.status}

                                            </span>

                                        </td>


                                    </tr>

                                ))

                            )}


                        </tbody>


                    </table>

                </div>

            </div>


        </div>

    );
}
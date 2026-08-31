import { Link } from "react-router-dom";
import "./Trips.css";

// =========================================================================
// DEV GUIDE FOR CONNECTING REACT STATE:
// To wire this UI to your backend / state management:
// 1. Import useState:
//    import { useState } from "react";
// 2. Add an state variable for opening/closing the form modal:
//    const [isFormOpen, setIsFormOpen] = useState(true); // default true for testing
// 3. Replace the static `const showCreateTripForm = true;` below with:
//    // const showCreateTripForm = isFormOpen;
// 4. Bind the "Create Trip" button in the header and empty state:
//    onClick={() => setIsFormOpen(true)}
// 5. Bind the modal close button (X) and Cancel button at the bottom:
//    onClick={() => setIsFormOpen(false)}
// 6. Bind form controls to your own `formData` state object and hand it over to onSubmit.
// =========================================================================

export default function Trips() {
    // Static toggle flag to display the Create Trip form modal overlay.
    // Set to `true` by default so you can inspect the visual layout.
    // Change to `false` to see only the background Trips list dashboard.
    const showCreateTripForm = true;

    // Static placeholder data for the Trips list
    const placeholderTrips = [
        {
            tripNo: "TRIP-2026-0001",
            startDate: "2026-09-01",
            endDate: "2026-09-05",
            pickup: "Mumbai Port, Maharashtra",
            destination: "Delhi Warehouse, Okhla",
            truck: "GJ01AB1234",
            driver: "Driver 1",
            cargo: "Electronics (2.5 tons)",
            cost: "₹45,000",
            status: "Planned"
        },
        {
            tripNo: "TRIP-2026-0002",
            startDate: "2026-08-28",
            endDate: "2026-09-02",
            pickup: "Chennai Port, Tamil Nadu",
            destination: "Bangalore Hub, Whitefield",
            truck: "GJ01CD5678",
            driver: "Driver 2",
            cargo: "Auto Parts (4.0 tons)",
            cost: "₹28,500",
            status: "In Transit"
        },
        {
            tripNo: "TRIP-2026-0003",
            startDate: "2026-08-20",
            endDate: "2026-08-22",
            pickup: "Pune Plant, Maharashtra",
            destination: "Ahmedabad depot, Gujarat",
            truck: "GJ01EF9012",
            driver: "Driver 3",
            cargo: "Textiles (1.2 tons)",
            cost: "₹18,000",
            status: "Completed"
        }
    ];

    return (
        <div className="trips-section">
            {/* Header Area */}
            <div className="drivers-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Trips</h2>
                    {/* Add Trip Circle Link */}
                    <Link 
                        to="/owner/add-trip" 
                        className="db-btn-primary" 
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', width: '32px', height: '32px', boxShadow: 'none' }} 
                        title="Create New Trip"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                    </Link>
                </div>
                {/* Main Create Trip Link */}
                <Link 
                    to="/owner/add-trip" 
                    className="db-btn-primary" 
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>route</span>
                    Create Trip
                </Link>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="trips-stats-grid">
                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box blue">
                        <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>Total Trips</h4>
                        <p>14</p>
                    </div>
                </div>

                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box orange">
                        <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>In Transit</h4>
                        <p>3</p>
                    </div>
                </div>

                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box yellow">
                        <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>Planned / Assigned</h4>
                        <p>8</p>
                    </div>
                </div>

                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box green">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>Completed</h4>
                        <p>3</p>
                    </div>
                </div>
            </div>

            {/* Trips List Dashboard Container */}
            <div className="trips-list-card">
                <h3>Trips Register</h3>
                <div className="trips-table-wrapper">
                    <table className="trips-table">
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
                        <tbody>
                            {placeholderTrips.map((trip) => (
                                <tr key={trip.tripNo}>
                                    <td className="trip-num-cell">{trip.tripNo}</td>
                                    <td>
                                        <div className="trip-route-cell">{trip.pickup.split(',')[0]} ➔ {trip.destination.split(',')[0]}</div>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                                            {trip.startDate} to {trip.endDate}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'monospace' }}>{trip.truck}</td>
                                    <td>{trip.driver}</td>
                                    <td>{trip.cargo}</td>
                                    <td style={{ fontWeight: '600' }}>{trip.cost}</td>
                                    <td>
                                        <span className={`trip-badge status-${trip.status.toLowerCase().replace(" ", "-")}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

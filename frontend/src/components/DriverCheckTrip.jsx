import React from "react";
import "./OwnerDashBoard.css";

export default function DriverCheckTrip() {
    const activeTrip = {
        id: "TRIP-8042",
        source: "Delhi (Ncr)",
        destination: "Mumbai Port",
        vehicle: "MH-12-GQ-1234 (Tata Signa)",
        cargo: "Electronic Appliances (12 Tons)",
        driverShare: "₹18,500",
        distance: "1,420 km",
        completedDistance: "980 km",
        status: "In Transit",
        eta: "14 hrs (Approx)",
        checkpoints: [
            { name: "Delhi (NCR)", time: "Aug 24, 08:00 AM", completed: true },
            { name: "Jaipur Bypass", time: "Aug 24, 04:30 PM", completed: true },
            { name: "Udaipur Hub", time: "Aug 25, 09:15 AM", completed: true },
            { name: "Vadodara Bypass", time: "Aug 25, 05:00 PM", completed: false },
            { name: "Mumbai Port", time: "Pending", completed: false }
        ]
    };

    const pastTrips = [
        { id: "TRIP-7981", date: "Aug 18, 2026", route: "Pune to Bangalore", vehicle: "MH-12-GQ-1234", cargo: "Industrial Machinery", amount: "₹24,000", status: "Delivered" },
        { id: "TRIP-7854", date: "Aug 12, 2026", route: "Chennai to Hyderabad", vehicle: "MH-12-GQ-1234", cargo: "Auto Parts", amount: "₹15,200", status: "Delivered" },
        { id: "TRIP-7712", date: "Aug 04, 2026", route: "Mumbai to Ahmedabad", vehicle: "MH-12-GQ-1234", cargo: "Textiles", amount: "₹12,800", status: "Delivered" },
        { id: "TRIP-7601", date: "Jul 28, 2026", route: "Delhi to Indore", vehicle: "MH-12-GQ-1234", cargo: "Pharma Supplies", amount: "₹19,000", status: "Delayed" }
    ];

    return (
        <div className="dashboard-page animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Page Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Trips & Routes</h2>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>Check your active assigned routes and historical trip records.</p>
                </div>
                <div className="db-date-badge" style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>route</span>
                    Active Driver Mode
                </div>
            </div>

            {/* Active Trip Section */}
            <div className="db-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                    <div>
                        <span className="db-status-badge db-status-transit" style={{ marginBottom: "8px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", marginRight: "4px" }}>local_shipping</span>
                            {activeTrip.status}
                        </span>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                            Active Trip: {activeTrip.source} ➔ {activeTrip.destination}
                        </h3>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>Trip ID: <span className="db-table-id">{activeTrip.id}</span></p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Estimated Time (ETA)</p>
                        <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#2563eb", margin: 0 }}>{activeTrip.eta}</h4>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ margin: "24px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                        <span>Progress ({Math.round((980/1420)*100)}%)</span>
                        <span>{activeTrip.completedDistance} completed of {activeTrip.distance}</span>
                    </div>
                    <div style={{ height: "8px", width: "100%", backgroundColor: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(980/1420)*100}%`, backgroundColor: "#2563eb", borderRadius: "9999px", transition: "width 1s ease-in-out" }} />
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", marginBottom: "24px" }}>
                    <div>
                        <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>Vehicle Info</span>
                        <p style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a", margin: "4px 0 0" }}>{activeTrip.vehicle}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>Cargo & Weight</span>
                        <p style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a", margin: "4px 0 0" }}>{activeTrip.cargo}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>Driver Share Pay</span>
                        <p style={{ fontSize: "13.5px", fontWeight: "600", color: "#16a34a", margin: "4px 0 0" }}>{activeTrip.driverShare}</p>
                    </div>
                </div>

                {/* Vertical Checkpoint Timeline */}
                <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>Route Timeline</h4>
                    <div style={{ position: "relative", paddingLeft: "24px" }}>
                        {/* Timeline Line */}
                        <div style={{ position: "absolute", left: "9px", top: "12px", bottom: "12px", width: "2px", backgroundColor: "#e2e8f0" }} />
                        
                        {activeTrip.checkpoints.map((cp, idx) => (
                            <div key={idx} style={{ position: "relative", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {/* Checkpoint Dot */}
                                <div style={{ 
                                    position: "absolute", 
                                    left: "-20px", 
                                    top: "4px", 
                                    width: "12px", 
                                    height: "12px", 
                                    borderRadius: "50%", 
                                    backgroundColor: cp.completed ? "#2563eb" : "#cbd5e1",
                                    border: cp.completed ? "3px solid #dbeafe" : "3px solid #f1f5f9",
                                    boxSizing: "content-box",
                                    zIndex: 2
                                }} />
                                
                                <div>
                                    <p style={{ fontSize: "13.5px", fontWeight: cp.completed ? "600" : "500", color: cp.completed ? "#0f172a" : "#64748b", margin: 0 }}>
                                        {cp.name}
                                    </p>
                                    <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>{cp.time}</span>
                                </div>

                                {cp.completed ? (
                                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#16a34a", backgroundColor: "#d1fae5", padding: "2px 8px", borderRadius: "9999px" }}>Passed</span>
                                ) : (
                                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "9999px" }}>Upcoming</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Past Trips Table Section */}
            <div className="db-card">
                <div className="db-table-header">
                    <h3 className="db-table-title">Past Trips Log</h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Showing last 4 trips</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Date</th>
                                <th>Route</th>
                                <th>Vehicle</th>
                                <th>Cargo</th>
                                <th>Earnings</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastTrips.map((trip) => (
                                <tr key={trip.id}>
                                    <td className="db-table-id">{trip.id}</td>
                                    <td>{trip.date}</td>
                                    <td className="db-table-route">{trip.route}</td>
                                    <td className="db-table-mono">{trip.vehicle}</td>
                                    <td>{trip.cargo}</td>
                                    <td style={{ fontWeight: "600", color: "#0f172a" }}>{trip.amount}</td>
                                    <td>
                                        <span className={`db-status-badge ${trip.status === "Delivered" ? "db-status-delivered" : "db-status-delayed"}`}>
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

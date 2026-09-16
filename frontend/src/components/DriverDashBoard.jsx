import React, { useState } from "react";
import DriverNavBar from "./DriverNavBar";
import DriverSideBar from "./DriverSideBar";
import DriverCheckTrip from "./DriverCheckTrip";
import DriverBills from "./DriverBills";
import "./OwnerDashBoard.css";

export default function DriverDashBoard() {
    const [activeNav, setActiveNav] = useState("check-trip");
    const [selectedTrip, setSelectedTrip] = useState(null);

    // Handler when driver clicks a trip to view its bills
    const handleOpenTripBills = (trip) => {
        setSelectedTrip(trip);
        setActiveNav("bills");
    };

    // Handler to go back to trips list
    const handleBackToTrips = () => {
        setSelectedTrip(null);
        setActiveNav("check-trip");
    };

    return (
        <div className="owner-dashboard">
            <DriverNavBar />

            <DriverSideBar activeNav={activeNav} setActiveNav={setActiveNav} />

            <main className="dashboard-content">
                {activeNav === "check-trip" && (
                    <DriverCheckTrip onAddBill={handleOpenTripBills} />
                )}
                {activeNav === "bills" && (
                    <DriverBills
                        initialTrip={selectedTrip}
                        onNavigateCheckTrip={handleBackToTrips}
                    />
                )}
            </main>
        </div>
    );
}

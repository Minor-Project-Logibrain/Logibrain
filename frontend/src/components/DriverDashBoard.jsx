import React, { useState } from "react";
import DriverNavBar from "./DriverNavBar";
import DriverSideBar from "./DriverSideBar";
import DriverCheckTrip from "./DriverCheckTrip";
import DriverAddBill from "./DriverAddBill";
import "./OwnerDashBoard.css";

export default function DriverDashBoard() {
    const [activeNav, setActiveNav] = useState("check-trip");
    const [selectedTrip, setSelectedTrip] = useState(null);

    // Handler when driver clicks a trip or "Add Bill" button from the trips table
    const handleOpenAddBill = (trip) => {
        setSelectedTrip(trip);
        setActiveNav("add-bill");
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
                    <DriverCheckTrip onAddBill={handleOpenAddBill} />
                )}
                {activeNav === "add-bill" && (
                    <DriverAddBill
                        selectedTrip={selectedTrip}
                        onBack={handleBackToTrips}
                    />
                )}
            </main>
        </div>
    );
}

import React, { useState } from "react";
import DriverNavBar from "./DriverNavBar";
import DriverSideBar from "./DriverSideBar";
import DriverCheckTrip from "./DriverCheckTrip";
import DriverAddBill from "./DriverAddBill";
import "./OwnerDashBoard.css";

export default function DriverDashBoard() {
    const [activeNav, setActiveNav] = useState("check-trip");

    return (
        <div className="owner-dashboard">
            <DriverNavBar />

            <DriverSideBar activeNav={activeNav} setActiveNav={setActiveNav} />

            <main className="dashboard-content">
                {activeNav === "check-trip" && <DriverCheckTrip />}
                {activeNav === "add-bill" && <DriverAddBill />}
            </main>
        </div>
    );
}

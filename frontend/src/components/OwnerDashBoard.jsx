
import Navbar from "./OwnerNavBar";
import Sidebar from "./SideBar";
import "./OwnerDashBoard.css";
import { useEffect, useState } from "react";
import Drivers from "./Drivers";
import Dashboard from "./DashBoard";

export default function OwnerDashboard() {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [drivers, setDrivers] = useState([]);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoding] = useState(false);

    return (
        <div className="owner-dashboard">

            <Navbar />

            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            <main className="dashboard-content">
                {activeNav === "dashboard" && <Dashboard />}
                {activeNav === "drivers" && <Drivers />}


            </main>

        </div>
    );
}


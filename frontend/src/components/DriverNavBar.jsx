import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OwnerNavBar.css";

export default function DriverNavBar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:8080/auth/check", {
                    withCredentials: true,
                });
                if (res.data.success && res.data.result) {
                    setUser(res.data.result);
                }
            } catch (err) {
                console.error("Failed to fetch driver profile:", err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        navigate("/login");
    };

    const userName = user?.fullName || "Digvijay Sinh";
    const userRole = user?.role || "Driver";

    return (
        <nav className="db-navbar">
            {/* Brand + Navigation */}
            <div className="navbar-left">
                <span className="db-navbar-brand">
                    LogiBrain
                </span>

                <div className="db-navbar-links">
                    <a href="#" className="db-navbar-link active">
                        Driver Panel
                    </a>

                    <a href="#" className="db-navbar-link">
                        My Route
                    </a>

                    <a href="#" className="db-navbar-link">
                        Assigned Tasks
                    </a>
                </div>
            </div>

            {/* Right Actions */}
            <div className="db-navbar-actions">
                <button
                    className="db-icon-btn"
                    title="Notifications"
                >
                    <span className="material-symbols-outlined">
                        notifications
                    </span>
                </button>

                <button
                    className="db-icon-btn"
                    title="Messages"
                >
                    <span className="material-symbols-outlined">
                        mail
                    </span>
                </button>

                <button
                    className="db-icon-btn"
                    title="Logout"
                    onClick={handleLogout}
                >
                    <span className="material-symbols-outlined">
                        logout
                    </span>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                            {userName}
                        </span>
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
                            {userRole}
                        </span>
                    </div>

                    <div className="db-avatar">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0f172a&color=fff&bold=true&size=72`}
                            alt={userName}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

import { useNavigate } from "react-router-dom";
import "./OwnerNavBar.css";

export default function DriverNavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("role");
        navigate("/login");
    };

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

                <div className="db-avatar">
                    <img
                        src="https://ui-avatars.com/api/?name=Driver&background=0f172a&color=fff&bold=true&size=72"
                        alt="Driver"
                    />
                </div>
            </div>
        </nav>
    );
}

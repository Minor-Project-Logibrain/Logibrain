
import { useNavigate } from "react-router-dom";
import "./OwnerNavbar.css";



export default function OwnerNavbar() {
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
                        Dashboard
                    </a>

                    <a href="#" className="db-navbar-link">
                        Analytics
                    </a>

                    <a href="#" className="db-navbar-link">
                        Fleet Status
                    </a>
                </div>
            </div>

            {/* Right Actions */}
            <div className="db-navbar-actions">

                <button className="db-btn-primary">
                    <span className="material-symbols-outlined">
                        add
                    </span>
                    Quick Create
                </button>

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
                        src="https://ui-avatars.com/api/?name=Owner&background=2563eb&color=fff&bold=true&size=72"
                        alt="Owner"
                    />
                </div>

            </div>

        </nav>
    );
}

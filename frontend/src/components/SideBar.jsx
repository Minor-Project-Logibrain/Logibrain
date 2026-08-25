
import { useState } from "react";
import "./Sidebar.css";

const NAV_ITEMS = [
    { icon: "dashboard", label: "Dashboard", id: "dashboard", section: "main" },
    { icon: "route", label: "Trips", id: "trips", section: "main" },
    { icon: "local_shipping", label: "Trucks", id: "trucks", section: "main" },
    { icon: "person", label: "Drivers", id: "drivers", section: "main" },
    { icon: "groups", label: "Customers", id: "customers", section: "main" },

    { icon: "payments", label: "Expenses", id: "expenses", section: "finance" },
    { icon: "build", label: "Maintenance", id: "maintenance", section: "finance" },
    { icon: "assessment", label: "Reports", id: "reports", section: "finance" },

    { icon: "description", label: "Documents", id: "documents", section: "tools" },
    { icon: "notifications", label: "Notifications", id: "notifications", section: "tools" },
    { icon: "smart_toy", label: "AI Assistant", id: "ai", section: "tools" },
    { icon: "settings", label: "Settings", id: "settings", section: "tools" },
];

const SECTIONS = [
    { id: "main", label: "Operations" },
    { id: "finance", label: "Finance" },
    { id: "tools", label: "Tools" },
];

export default function Sidebar({ activeNav, setActiveNav }) {

    return (
        <aside className="db-sidebar">

            {/* Brand */}
            <div className="db-sidebar-header">

                <div className="db-sidebar-brand">

                    <div className="db-sidebar-icon-box">
                        <span className="material-symbols-outlined">
                            local_shipping
                        </span>
                    </div>

                    <div>
                        <div className="db-sidebar-title">
                            LogiBrain
                        </div>

                        <div className="db-sidebar-subtitle">
                            Fleet Management
                        </div>
                    </div>

                </div>

                <button className="db-sidebar-quick-btn">
                    <span className="material-symbols-outlined">
                        add
                    </span>

                    Quick Dispatch
                </button>

            </div>

            <div className="db-sidebar-divider" />

            {/* Navigation */}
            <nav className="db-sidebar-nav">

                {SECTIONS.map((section) => {

                    const items = NAV_ITEMS.filter(
                        (item) => item.section === section.id
                    );

                    return (
                        <div key={section.id}>

                            <div className="db-sidebar-section-label">
                                {section.label}
                            </div>

                            {items.map((item) => (

                                <a
                                    key={item.id}
                                    href="#"
                                    className={`db-nav-link ${activeNav === item.id ? "active" : ""
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveNav(item.id);
                                    }}
                                >

                                    <span className="material-symbols-outlined">
                                        {item.icon}
                                    </span>

                                    {item.label}

                                </a>

                            ))}

                        </div>
                    );
                })}

            </nav>

            <div className="db-sidebar-divider" />

            {/* Profile */}
            <div className="db-sidebar-footer">

                <a href="#" className="db-nav-link">

                    <span className="material-symbols-outlined">
                        account_circle
                    </span>

                    Profile

                </a>

            </div>

        </aside>
    );
}


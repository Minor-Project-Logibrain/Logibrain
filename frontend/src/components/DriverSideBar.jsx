import { useState } from "react";
import "./SideBar.css";

const NAV_ITEMS = [
    { icon: "route", label: "Check Trip", id: "check-trip", section: "operations" },
    { icon: "receipt_long", label: "Bills", id: "bills", section: "operations" },
];

const SECTIONS = [
    { id: "operations", label: "Operations" },
];

export default function DriverSideBar({ activeNav, setActiveNav }) {
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
                            Driver Portal
                        </div>
                    </div>
                </div>
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
                                    className={`db-nav-link ${activeNav === item.id ? "active" : ""}`}
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
                    Driver Profile
                </a>
            </div>
        </aside>
    );
}

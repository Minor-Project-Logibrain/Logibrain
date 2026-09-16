import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import ReceiptModal from "./ReceiptModal";
import DriverAddBill from "./DriverAddBill";
import "./OwnerDashBoard.css";
import "./OwnerExpenses.css";
import "./DriverBills.css";

export default function DriverBills({ initialTrip, onNavigateCheckTrip }) {
    // =========================================================================
    // 1. STATE MANAGEMENT
    // =========================================================================
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(
        initialTrip?._id || initialTrip?.tripNo || "all"
    );
    const [bills, setBills] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [loadingBills, setLoadingBills] = useState(false);
    const [activeTab, setActiveTab] = useState("all"); // "all", "pending", "approved", "rejected"
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [previewReceipt, setPreviewReceipt] = useState(null);
    const [showAddBillModal, setShowAddBillModal] = useState(false);

    // Alerts
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    // =========================================================================
    // 2. FETCH DRIVER TRIPS
    // =========================================================================
    const fetchTrips = async () => {
        setLoadingTrips(true);
        try {
            const res = await axios.get("http://localhost:8080/driver/trips/get-trips", {
                withCredentials: true,
            });
            if (res.data.success) {
                setTrips(res.data.result || []);
            }
        } catch (err) {
            console.error("Failed to load driver trips:", err);
        } finally {
            setLoadingTrips(false);
        }
    };

    // =========================================================================
    // 3. FETCH BILLS FOR SELECTED TRIP (OR ALL TRIPS)
    // =========================================================================
    const fetchBills = async (tripIdToFetch) => {
        setLoadingBills(true);
        try {
            const target = tripIdToFetch || selectedTripId || "all";
            const res = await axios.get(
                `http://localhost:8080/driver/trips/get-bills/${target}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setBills(res.data.result || []);
            } else {
                setMessage(res.data.message || "Failed to load bills");
                setSuccess(false);
            }
        } catch (err) {
            console.error("Failed to fetch bills:", err);
            setMessage(
                err.response?.data?.message || "Failed to load expense bills."
            );
            setSuccess(false);
        } finally {
            setLoadingBills(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    useEffect(() => {
        if (initialTrip) {
            setSelectedTripId(initialTrip._id || initialTrip.tripNo || "all");
        }
    }, [initialTrip]);

    useEffect(() => {
        fetchBills(selectedTripId);
    }, [selectedTripId]);

    // Handle when user selects a trip from dropdown or trip pill
    const handleTripChange = (e) => {
        const newTripId = e.target.value;
        setSelectedTripId(newTripId);
    };

    // Helper to get currently active trip object
    const currentActiveTrip =
        selectedTripId !== "all"
            ? trips.find(
                  (t) =>
                      String(t._id) === String(selectedTripId) ||
                      t.tripNo === selectedTripId
              )
            : trips.length > 0
            ? trips[0]
            : null;

    // =========================================================================
    // 4. FILTERING & STATS
    // =========================================================================
    const pendingBills = bills.filter(
        (b) => (b.status || "pending").toLowerCase() === "pending"
    );
    const approvedBills = bills.filter(
        (b) => (b.status || "").toLowerCase() === "approved"
    );
    const rejectedBills = bills.filter(
        (b) => (b.status || "").toLowerCase() === "rejected"
    );

    const totalClaimed = bills.reduce(
        (sum, b) => sum + (Number(b.amount) || 0),
        0
    );
    const totalPending = pendingBills.reduce(
        (sum, b) => sum + (Number(b.amount) || 0),
        0
    );
    const totalApproved = approvedBills.reduce(
        (sum, b) => sum + (Number(b.amount) || 0),
        0
    );
    const totalRejected = rejectedBills.reduce(
        (sum, b) => sum + (Number(b.amount) || 0),
        0
    );

    let filteredBills = bills;
    if (activeTab === "pending") filteredBills = pendingBills;
    else if (activeTab === "approved") filteredBills = approvedBills;
    else if (activeTab === "rejected") filteredBills = rejectedBills;

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filteredBills = filteredBills.filter(
            (b) =>
                (b.trip?.tripNo || "").toLowerCase().includes(q) ||
                (b.description || "").toLowerCase().includes(q) ||
                (b.billType || "").toLowerCase().includes(q)
        );
    }

    const getCategoryIcon = (category) => {
        const cat = (category || "").toLowerCase();
        switch (cat) {
            case "fuel":
                return "local_gas_station";
            case "toll":
                return "toll";
            case "food":
                return "restaurant";
            case "maintenance":
                return "build";
            case "loading":
                return "move_to_inbox";
            case "unloading":
                return "unarchive";
            case "parking":
                return "local_parking";
            default:
                return "receipt";
        }
    };

    return (
        <div className="driver-bills-page animate-fade-in">
            {/* =================================================================
                HEADER
               ================================================================= */}
            <div className="driver-bills-header">
                <div>
                    <h2>Trip Expense Bills</h2>
                    <p>
                        Track all expense claims, view approval status, and submit new bills for your trips.
                    </p>
                </div>

                <div className="driver-bills-header-actions">
                    <button
                        type="button"
                        className="btn-add-bill-primary"
                        onClick={() => setShowAddBillModal(true)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            add_circle
                        </span>
                        + File New Bill
                    </button>
                </div>
            </div>

            {/* Alert Message */}
            <Message
                success={success}
                message={message}
                clearMessage={() => setMessage("")}
            />

            {/* =================================================================
                STATS KPI CARDS
               ================================================================= */}
            <div className="driver-stats-grid">
                <div className="driver-stat-card">
                    <div className="driver-stat-icon-wrap all">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div className="driver-stat-info">
                        <span className="driver-stat-label">Total Claimed</span>
                        <span className="driver-stat-val">
                            ₹{totalClaimed.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="driver-stat-card">
                    <div className="driver-stat-icon-wrap pending">
                        <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div className="driver-stat-info">
                        <span className="driver-stat-label">Pending Approval</span>
                        <span className="driver-stat-val" style={{ color: "#d97706" }}>
                            ₹{totalPending.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="driver-stat-card">
                    <div className="driver-stat-icon-wrap approved">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div className="driver-stat-info">
                        <span className="driver-stat-label">Approved & Settled</span>
                        <span className="driver-stat-val" style={{ color: "#059669" }}>
                            ₹{totalApproved.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="driver-stat-card">
                    <div className="driver-stat-icon-wrap rejected">
                        <span className="material-symbols-outlined">cancel</span>
                    </div>
                    <div className="driver-stat-info">
                        <span className="driver-stat-label">Rejected / Cancelled</span>
                        <span className="driver-stat-val" style={{ color: "#dc2626" }}>
                            ₹{totalRejected.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* =================================================================
                FILTER & TRIP SELECTOR BAR
               ================================================================= */}
            <div className="driver-filter-bar">
                <div className="driver-filter-left">
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#475569" }}>
                        Trip:
                    </label>
                    <select
                        className="driver-trip-select"
                        value={selectedTripId}
                        onChange={handleTripChange}
                    >
                        <option value="all">🌐 All Trips ({trips.length})</option>
                        {trips.map((t) => {
                            const routeStr =
                                t.pickupLocation?.city && t.deliveryLocation?.city
                                    ? `${t.pickupLocation.city} → ${t.deliveryLocation.city}`
                                    : "";
                            return (
                                <option key={t._id} value={t._id}>
                                    {t.tripNo} {routeStr ? `(${routeStr})` : ""}
                                </option>
                            );
                        })}
                    </select>

                    <div className="expenses-search-wrap" style={{ minWidth: "200px" }}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="Search remarks, category..."
                            className="expenses-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="driver-tabs-pills">
                    <button
                        type="button"
                        className={`driver-tab-pill ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => setActiveTab("all")}
                    >
                        All
                        <span className="tab-pill-badge all">{bills.length}</span>
                    </button>
                    <button
                        type="button"
                        className={`driver-tab-pill ${activeTab === "pending" ? "active" : ""}`}
                        onClick={() => setActiveTab("pending")}
                    >
                        Pending
                        <span className="tab-pill-badge pending">
                            {pendingBills.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        className={`driver-tab-pill ${activeTab === "approved" ? "active" : ""}`}
                        onClick={() => setActiveTab("approved")}
                    >
                        Approved
                        <span className="tab-pill-badge approved">
                            {approvedBills.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        className={`driver-tab-pill ${activeTab === "rejected" ? "active" : ""}`}
                        onClick={() => setActiveTab("rejected")}
                    >
                        Rejected
                        <span className="tab-pill-badge rejected">
                            {rejectedBills.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* =================================================================
                ACTIVE TRIP HERO BANNER OR ASSIGNED TRIPS STRIP
               ================================================================= */}
            {selectedTripId !== "all" && currentActiveTrip ? (
                <div className="driver-selected-trip-hero animate-fade-in">
                    <div className="selected-trip-hero-left">
                        <div className="selected-trip-badge-box">
                            <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                                local_shipping
                            </span>
                        </div>
                        <div className="selected-trip-details">
                            <h3>
                                {currentActiveTrip.tripNo}
                                <span
                                    className={`db-status-badge ${
                                        currentActiveTrip.status === "completed"
                                            ? "db-status-delivered"
                                            : "db-status-transit"
                                    }`}
                                    style={{ fontSize: "11px", textTransform: "capitalize" }}
                                >
                                    {currentActiveTrip.status || "In Transit"}
                                </span>
                            </h3>
                            <div className="selected-trip-route">
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                    near_me
                                </span>
                                {currentActiveTrip.pickupLocation?.city || "Origin"} →{" "}
                                {currentActiveTrip.deliveryLocation?.city || "Destination"}
                                {currentActiveTrip.truck?.truckNo && (
                                    <span>• Truck: {currentActiveTrip.truck.truckNo}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="selected-trip-hero-actions">
                        <button
                            type="button"
                            className="btn-file-bill-hero"
                            onClick={() => setShowAddBillModal(true)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                add
                            </span>
                            + Add Bill for This Trip
                        </button>
                    </div>
                </div>
            ) : trips.length > 0 ? (
                <div className="driver-trips-strip animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                            Assigned Trips ({trips.length})
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Click any trip to filter bills or file a new claim
                        </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                        {trips.map((t) => {
                            const route = t.pickupLocation?.city && t.deliveryLocation?.city
                                ? `${t.pickupLocation.city} → ${t.deliveryLocation.city}`
                                : "Route";
                            return (
                                <div
                                    key={t._id}
                                    onClick={() => setSelectedTripId(t._id)}
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "10px",
                                        padding: "12px 14px",
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "#2563eb";
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                        e.currentTarget.style.transform = "none";
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                                            {t.tripNo}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                            {route}
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined" style={{ color: "#2563eb", fontSize: "20px" }}>
                                        chevron_right
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {/* =================================================================
                BILLS GRID / LIST
               ================================================================= */}
            {loadingBills ? (
                <div className="driver-bills-empty">
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    <h3>Loading expense bills...</h3>
                </div>
            ) : filteredBills.length === 0 ? (
                <div className="driver-bills-empty">
                    <span className="material-symbols-outlined">receipt_long</span>
                    <h3>No bills found</h3>
                    <p>
                        {selectedTripId !== "all"
                            ? "No expense bills have been submitted for this trip yet."
                            : "You have not submitted any expense claims yet."}
                    </p>
                    <button
                        type="button"
                        className="btn-add-bill-primary"
                        onClick={() => setShowAddBillModal(true)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            add
                        </span>
                        Submit Your First Bill
                    </button>
                </div>
            ) : (
                <div className="driver-bills-grid">
                    {filteredBills.map((bill) => {
                        const billStatus = (bill.status || "pending").toLowerCase();
                        const isPending = billStatus === "pending";
                        const isApproved = billStatus === "approved";
                        const isRejected = billStatus === "rejected";

                        const tripNo =
                            bill.trip?.tripNo ||
                            (typeof bill.trip === "string" ? bill.trip : "TRIP");

                        // Build Receipt URL
                        let receiptUrl = null;
                        if (bill.receipt && typeof bill.receipt === "string" && bill.receipt.trim()) {
                            const clean = bill.receipt.replace(/\\/g, "/").trim();
                            if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) {
                                receiptUrl = clean;
                            } else {
                                receiptUrl = `http://localhost:8080/${clean.replace(/^\/+/, "")}`;
                            }
                        }

                        const isPdf = receiptUrl && receiptUrl.toLowerCase().endsWith(".pdf");

                        return (
                            <div
                                key={bill._id}
                                className={`driver-bill-card status-border-${billStatus}`}
                            >
                                {/* Card Top */}
                                <div className="driver-bill-card-top">
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className={`bill-category-badge cat-${bill.billType || "other"}`}>
                                            <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                                                {getCategoryIcon(bill.billType)}
                                            </span>
                                            {bill.billType || "Expense"}
                                        </span>

                                        <span
                                            className={`db-status-badge ${
                                                isApproved
                                                    ? "db-status-delivered"
                                                    : isRejected
                                                    ? "db-status-delayed"
                                                    : "db-status-transit"
                                            }`}
                                            style={{ textTransform: "capitalize", fontSize: "11px" }}
                                        >
                                            {billStatus}
                                        </span>
                                    </div>

                                    <div className="driver-bill-amount">
                                        <span>₹</span>
                                        {Number(bill.amount).toLocaleString()}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="driver-bill-details-grid">
                                    <div className="driver-bill-item">
                                        <span className="driver-bill-item-label">Trip No</span>
                                        <span className="driver-bill-item-val">{tripNo}</span>
                                    </div>

                                    <div className="driver-bill-item">
                                        <span className="driver-bill-item-label">Expense Date</span>
                                        <span className="driver-bill-item-val">
                                            {bill.date
                                                ? new Date(bill.date).toLocaleDateString()
                                                : "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Remarks */}
                                {bill.description && (
                                    <div className="driver-bill-remarks">
                                        <strong>Note:</strong> {bill.description}
                                    </div>
                                )}

                                {/* If Rejected: Show Rejection Reason */}
                                {isRejected && bill.rejectionReason && (
                                    <div className="driver-bill-rejection-callout">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: "18px", color: "#dc2626", flexShrink: 0 }}
                                        >
                                            error
                                        </span>
                                        <div>
                                            <strong>Rejected by Owner:</strong> {bill.rejectionReason}
                                        </div>
                                    </div>
                                )}

                                {/* Card Footer: Receipt Preview Button */}
                                <div className="driver-bill-card-footer">
                                    <div>
                                        {receiptUrl ? (
                                            isPdf ? (
                                                <button
                                                    type="button"
                                                    className="btn-view-receipt"
                                                    onClick={() => setPreviewReceipt({ url: receiptUrl, bill })}
                                                    title="Click to view PDF receipt"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#dc2626" }}>
                                                        picture_as_pdf
                                                    </span>
                                                    PDF Receipt
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="receipt-thumbnail-btn"
                                                    onClick={() => setPreviewReceipt({ url: receiptUrl, bill })}
                                                    title="Click to view full receipt image"
                                                >
                                                    <img
                                                        src={receiptUrl}
                                                        alt="Receipt Thumb"
                                                        className="receipt-thumb-img"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                                                            image
                                                        </span>
                                                        View Receipt
                                                    </span>
                                                </button>
                                            )
                                        ) : (
                                            <span className="no-receipt-tag" style={{ fontSize: "11.5px" }}>
                                                No Receipt Attached
                                            </span>
                                        )}
                                    </div>

                                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                                        Submitted:{" "}
                                        {bill.createdAt
                                            ? new Date(bill.createdAt).toLocaleDateString()
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* =================================================================
                RECEIPT LIGHTBOX MODAL
               ================================================================= */}
            {previewReceipt && (
                <ReceiptModal
                    receipt={previewReceipt}
                    onClose={() => setPreviewReceipt(null)}
                />
            )}

            {/* =================================================================
                ADD BILL MODAL / EMBED
               ================================================================= */}
            {showAddBillModal && (
                <div
                    className="trip-modal-overlay"
                    onClick={() => setShowAddBillModal(false)}
                >
                    <div
                        className="trip-modal-content"
                        style={{ maxWidth: "850px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="trip-modal-header">
                            <div>
                                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span className="material-symbols-outlined" style={{ color: "#2563eb" }}>
                                        receipt_long
                                    </span>
                                    File Trip Expense Bills
                                </h3>
                                <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                                    Upload receipt proofs and specify costs incurred during your route.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="trip-modal-close-btn"
                                onClick={() => setShowAddBillModal(false)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div style={{ padding: "20px" }}>
                            <DriverAddBill
                                selectedTrip={currentActiveTrip}
                                onBack={() => {
                                    setShowAddBillModal(false);
                                    fetchBills(selectedTripId);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

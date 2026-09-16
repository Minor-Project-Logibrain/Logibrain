import { Link } from "react-router-dom";
import "./Trips.css";
import "./OwnerExpenses.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import ReceiptModal from "./ReceiptModal";

export default function Trips({ onNavigateExpenses }) {
    // Total trips
    const [totleTrips, setTotleTrips] = useState(0);

    // All trips
    const [trips, setTrips] = useState([]);

    // Modal state for viewing a trip's bills
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [tripBills, setTripBills] = useState([]);
    const [loadingBills, setLoadingBills] = useState(false);
    const [cancellingBillId, setCancellingBillId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [previewReceipt, setPreviewReceipt] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [modalSuccess, setModalSuccess] = useState(false);

    // ==========================================
    // GET TOTAL NUMBER OF TRIPS
    // ==========================================
    const getTotleTrips = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/owner/trips/totle-numbers-trips",
                { withCredentials: true }
            );
            setTotleTrips(res.data.result);
        } catch (err) {
            console.log("Error fetching total trips:", err);
        }
    };

    // ==========================================
    // GET ALL TRIPS
    // ==========================================
    const getTrips = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/owner/trips/get-trips",
                { withCredentials: true }
            );
            setTrips(res.data.result || []);
        } catch (err) {
            console.log("Error fetching trips:", err);
        }
    };

    useEffect(() => {
        getTotleTrips();
        getTrips();
    }, []);

    // ==========================================
    // FETCH BILLS FOR A SELECTED TRIP
    // ==========================================
    const handleOpenTripBills = async (trip) => {
        setSelectedTrip(trip);
        setLoadingBills(true);
        setTripBills([]);
        setCancellingBillId(null);
        setRejectionReason("");
        setModalMessage("");

        try {
            const tripIdentifier = trip?._id || trip?.tripNo || "";
            const res = await axios.get(
                `http://localhost:8080/owners/bills?tripId=${encodeURIComponent(tripIdentifier)}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setTripBills(res.data.result || []);
                setModalMessage("");
            } else {
                setModalMessage(res.data.message || "Failed to load trip bills");
                setModalSuccess(false);
            }
        } catch (err) {
            console.error("Error fetching trip bills:", err);
            setModalMessage(
                err.response?.data?.message || "Failed to load bills for this trip."
            );
            setModalSuccess(false);
        } finally {
            setLoadingBills(false);
        }
    };

    const handleCloseTripModal = () => {
        setSelectedTrip(null);
        setTripBills([]);
        setCancellingBillId(null);
        setRejectionReason("");
    };

    // ==========================================
    // APPROVE BILL ACTION (FROM TRIP MODAL)
    // ==========================================
    const handleApproveBill = async (billId) => {
        setActionLoadingId(billId);
        setModalMessage("");

        try {
            const res = await axios.put(
                `http://localhost:8080/owners/bills/${billId}/status`,
                { status: "approved" },
                { withCredentials: true }
            );

            if (res.data.success) {
                setModalSuccess(true);
                setModalMessage("Bill approved successfully!");
                setTripBills((prev) =>
                    prev.map((b) =>
                        b._id === billId
                            ? { ...b, status: "approved", rejectionReason: "" }
                            : b
                    )
                );
                // Refresh trips to show updated expense totals
                getTrips();
            }
        } catch (err) {
            console.error("Error approving bill:", err);
            setModalSuccess(false);
            setModalMessage(err.response?.data?.message || "Failed to approve bill.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // ==========================================
    // CANCEL BILL ACTION (FROM TRIP MODAL)
    // ==========================================
    const handleConfirmCancelBill = async (billId) => {
        if (!rejectionReason.trim()) {
            setModalSuccess(false);
            setModalMessage("Please specify a cancellation reason.");
            return;
        }

        setActionLoadingId(billId);
        setModalMessage("");

        try {
            const res = await axios.put(
                `http://localhost:8080/owners/bills/${billId}/status`,
                {
                    status: "rejected",
                    rejectionReason: rejectionReason.trim(),
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                setModalSuccess(true);
                setModalMessage("Bill cancelled / rejected successfully.");
                setTripBills((prev) =>
                    prev.map((b) =>
                        b._id === billId
                            ? {
                                  ...b,
                                  status: "rejected",
                                  rejectionReason: rejectionReason.trim(),
                              }
                            : b
                    )
                );
                setCancellingBillId(null);
                setRejectionReason("");
                // Refresh trips
                getTrips();
            }
        } catch (err) {
            console.error("Error cancelling bill:", err);
            setModalSuccess(false);
            setModalMessage(err.response?.data?.message || "Failed to cancel bill.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Helper for category icons
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

    // Calculate trip statistics
    const plannedCount = trips.filter(
        (t) => (t.status || "").toLowerCase() === "planned"
    ).length;
    const inTransitCount = trips.filter(
        (t) =>
            (t.status || "").toLowerCase() === "in-progress" ||
            (t.status || "").toLowerCase() === "in transit"
    ).length;
    const completedCount = trips.filter(
        (t) => (t.status || "").toLowerCase() === "completed"
    ).length;

    return (
        <div className="trips-section animate-fade-in">
            {/* ==========================================
                HEADER
            ========================================== */}
            <div
                className="drivers-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #e2e8f0",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#0f172a",
                            margin: 0,
                        }}
                    >
                        Trips Management
                    </h2>

                    {/* ADD TRIP BUTTON */}
                    <Link
                        to="/owner/add-trip"
                        className="db-btn-primary"
                        style={{
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "6px",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            boxShadow: "none",
                        }}
                        title="Create New Trip"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "20px" }}
                        >
                            add
                        </span>
                    </Link>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {onNavigateExpenses && (
                        <button
                            type="button"
                            className="btn-dismiss-cancel"
                            onClick={onNavigateExpenses}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 14px",
                                borderRadius: "8px",
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: "18px", color: "#2563eb" }}
                            >
                                payments
                            </span>
                            All Expenses
                        </button>
                    )}

                    {/* CREATE TRIP BUTTON */}
                    <Link
                        to="/owner/add-trip"
                        className="db-btn-primary"
                        style={{
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "18px" }}
                        >
                            route
                        </span>
                        Create Trip
                    </Link>
                </div>
            </div>

            {/* ==========================================
                STATISTICS CARDS
            ========================================== */}
            <div className="trips-stats-grid">
                {/* TOTAL TRIPS */}
                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box blue">
                        <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>Total Trips</h4>
                        <p>{totleTrips || trips.length}</p>
                    </div>
                </div>

                {/* IN TRANSIT */}
                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box orange">
                        <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>In Transit</h4>
                        <p>{inTransitCount}</p>
                    </div>
                </div>

                {/* PLANNED */}
                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box yellow">
                        <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>Planned / Assigned</h4>
                        <p>{plannedCount}</p>
                    </div>
                </div>

                {/* COMPLETED */}
                <div className="trip-stat-card">
                    <div className="trip-stat-icon-box green">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div className="trip-stat-info">
                        <h4>Completed</h4>
                        <p>{completedCount}</p>
                    </div>
                </div>
            </div>

            {/* ==========================================
                TRIPS TABLE
            ========================================== */}
            <div className="trips-list-card">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "14px",
                    }}
                >
                    <div>
                        <h3 style={{ margin: 0 }}>Trips Register</h3>
                        <p className="trip-table-hint">
                            Tap on any trip to inspect routing details, cargo, and driver expense bills.
                        </p>
                    </div>
                    <span
                        style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                        }}
                    >
                        {trips.length} Total Trip{trips.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="trips-table-wrapper">
                    <table className="trips-table">
                        {/* TABLE HEADER */}
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Route (From - To)</th>
                                <th>Truck No</th>
                                <th>Driver</th>
                                <th>Cargo</th>
                                <th>Freight / Cost</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody>
                            {trips.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        style={{
                                            textAlign: "center",
                                            padding: "24px",
                                            color: "#64748b",
                                        }}
                                    >
                                        No trips found
                                    </td>
                                </tr>
                            ) : (
                                trips.map((trip) => (
                                    <tr
                                        key={trip._id || trip.tripNo}
                                        className="trip-row-clickable"
                                        onClick={() => handleOpenTripBills(trip)}
                                        title={`Click to view bills and details for ${trip.tripNo}`}
                                    >
                                        {/* TRIP NUMBER */}
                                        <td className="trip-num-cell">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined"
                                                    style={{
                                                        fontSize: "16px",
                                                        color: "#2563eb",
                                                    }}
                                                >
                                                    route
                                                </span>
                                                {trip.tripNo}
                                            </div>
                                        </td>

                                        {/* ROUTE */}
                                        <td>
                                            <div style={{ fontWeight: "600" }}>
                                                {trip.pickupLocation?.city || "Origin"}
                                                {" → "}
                                                {trip.deliveryLocation?.city || "Destination"}
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: "11.5px",
                                                    color: "#64748b",
                                                }}
                                            >
                                                {trip.plannedStartDate
                                                    ? new Date(
                                                          trip.plannedStartDate
                                                      ).toLocaleDateString()
                                                    : ""}{" "}
                                                to{" "}
                                                {trip.plannedEndDate
                                                    ? new Date(
                                                          trip.plannedEndDate
                                                      ).toLocaleDateString()
                                                    : ""}
                                            </span>
                                        </td>

                                        {/* TRUCK */}
                                        <td style={{ fontFamily: "monospace", fontWeight: 600 }}>
                                            {trip.truck?.truckNo ||
                                                (typeof trip.truck === "string"
                                                    ? trip.truck
                                                    : "Unassigned")}
                                        </td>

                                        {/* DRIVER */}
                                        <td style={{ fontWeight: 500 }}>
                                            {trip.driver?.fullName ||
                                                (typeof trip.driver === "string"
                                                    ? trip.driver
                                                    : "Unassigned")}
                                        </td>

                                        {/* CARGO */}
                                        <td>
                                            <div>
                                                <strong>
                                                    {trip.cargo?.type || "General"}
                                                </strong>
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#64748b",
                                                }}
                                            >
                                                {trip.cargo?.weight || trip.cargo?.quantity || "0"}{" "}
                                                {trip.cargo?.weightUnit || "kg"}
                                            </span>
                                        </td>

                                        {/* TOTAL FREIGHT AMOUNT */}
                                        <td style={{ fontWeight: "700", color: "#0f172a" }}>
                                            ₹{Number(trip.freightAmount || 0).toLocaleString()}
                                        </td>

                                        {/* STATUS */}
                                        <td>
                                            <span
                                                className={`trip-badge status-${(
                                                    trip.status || "planned"
                                                )
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`}
                                            >
                                                {trip.status || "Planned"}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                type="button"
                                                className="btn-view-trip-bills"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenTripBills(trip);
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined"
                                                    style={{ fontSize: "15px" }}
                                                >
                                                    receipt_long
                                                </span>
                                                View Bills
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =====================================================================
                TRIP BILLS & EXPENSE INSPECTOR MODAL
               ===================================================================== */}
            {selectedTrip && (
                <div
                    className="trip-modal-overlay"
                    onClick={handleCloseTripModal}
                >
                    <div
                        className="trip-modal-content trip-bills-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="trip-modal-header">
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <h3 style={{ margin: 0 }}>
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: "#2563eb" }}
                                        >
                                            local_shipping
                                        </span>
                                        {selectedTrip.tripNo}
                                    </h3>
                                    <span
                                        className={`trip-badge status-${(
                                            selectedTrip.status || "planned"
                                        )
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                    >
                                        {selectedTrip.status || "Planned"}
                                    </span>
                                </div>
                                <p
                                    style={{
                                        margin: "4px 0 0 0",
                                        fontSize: "13px",
                                        color: "#64748b",
                                    }}
                                >
                                    {selectedTrip.pickupLocation?.city || "Origin"} →{" "}
                                    {selectedTrip.deliveryLocation?.city || "Destination"}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="trip-modal-close-btn"
                                onClick={handleCloseTripModal}
                                title="Close"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="trip-modal-body">
                            {/* Alert Message inside modal */}
                            <Message
                                message={modalMessage}
                                success={modalSuccess}
                                clearMessage={() => setModalMessage("")}
                            />

                            {/* Trip Metadata Grid */}
                            <div className="trip-bills-meta-grid">
                                <div className="trip-meta-item">
                                    <span className="label">Assigned Driver</span>
                                    <span className="val">
                                        {selectedTrip.driver?.fullName || "Unassigned"}
                                    </span>
                                    {selectedTrip.driver?.phone && (
                                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                                            {selectedTrip.driver.phone}
                                        </span>
                                    )}
                                </div>

                                <div className="trip-meta-item">
                                    <span className="label">Assigned Truck</span>
                                    <span className="val" style={{ fontFamily: "monospace" }}>
                                        {selectedTrip.truck?.truckNo ||
                                            (typeof selectedTrip.truck === "string"
                                                ? selectedTrip.truck
                                                : "Unassigned")}
                                    </span>
                                </div>

                                <div className="trip-meta-item">
                                    <span className="label">Cargo Details</span>
                                    <span className="val">
                                        {selectedTrip.cargo?.type || "General Cargo"} (
                                        {selectedTrip.cargo?.weight || "0"}{" "}
                                        {selectedTrip.cargo?.weightUnit || "kg"})
                                    </span>
                                </div>
                            </div>

                            {/* Financials & Expense Totals */}
                            <div className="trip-financials-bar">
                                <div className="trip-fin-box">
                                    <p className="fin-title">Freight Revenue</p>
                                    <p className="fin-amount" style={{ color: "#2563eb" }}>
                                        ₹{Number(selectedTrip.freightAmount || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="trip-fin-box">
                                    <p className="fin-title">Fuel Cost</p>
                                    <p className="fin-amount">
                                        ₹{Number(selectedTrip.fuelCost || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="trip-fin-box">
                                    <p className="fin-title">Toll Cost</p>
                                    <p className="fin-amount">
                                        ₹{Number(selectedTrip.tollCost || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="trip-fin-box">
                                    <p className="fin-title">Other Expenses</p>
                                    <p className="fin-amount">
                                        ₹{Number(selectedTrip.otherExpenses || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Bills Section Title */}
                            <div className="modal-bills-section-title">
                                <span>
                                    Expense Bills Filed For This Trip ({tripBills.length})
                                </span>
                            </div>

                            {/* Bills List */}
                            {loadingBills ? (
                                <div className="modal-bill-empty">
                                    <span className="material-symbols-outlined animate-spin">
                                        sync
                                    </span>
                                    <p style={{ margin: 0 }}>Loading trip bills...</p>
                                </div>
                            ) : tripBills.length === 0 ? (
                                <div className="modal-bill-empty">
                                    <span className="material-symbols-outlined">
                                        receipt_long
                                    </span>
                                    <h4 style={{ margin: "0 0 4px", color: "#334155" }}>
                                        No Bills Filed Yet
                                    </h4>
                                    <p style={{ margin: 0, fontSize: "13px" }}>
                                        The assigned driver has not submitted any expense claims for this trip.
                                    </p>
                                </div>
                            ) : (
                                <div className="modal-bills-list">
                                    {tripBills.map((bill, index) => {
                                        const billStatus = (bill.status || "pending").toLowerCase();
                                        const isPending = billStatus === "pending";
                                        const isApproved = billStatus === "approved";
                                        const isRejected = billStatus === "rejected";
                                        const isCancelling = cancellingBillId === bill._id;
                                        const isActionLoading = actionLoadingId === bill._id;

                                        // Robust Receipt URL builder handling local uploads and external URLs
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
                                                className={`modal-bill-item status-${billStatus}`}
                                            >
                                                <div className="modal-bill-header">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <span
                                                            className={`bill-category-badge cat-${
                                                                bill.billType || "other"
                                                            }`}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{ fontSize: "15px" }}
                                                            >
                                                                {getCategoryIcon(bill.billType)}
                                                            </span>
                                                            {bill.billType}
                                                        </span>

                                                        <span
                                                            className={`db-status-badge ${
                                                                isApproved
                                                                    ? "db-status-delivered"
                                                                    : isRejected
                                                                    ? "db-status-delayed"
                                                                    : "db-status-transit"
                                                            }`}
                                                            style={{
                                                                textTransform: "capitalize",
                                                                fontSize: "11px",
                                                            }}
                                                        >
                                                            {billStatus}
                                                        </span>
                                                    </div>

                                                    <div className="bill-amount-badge" style={{ fontSize: "18px" }}>
                                                        <span className="bill-amount-currency">₹</span>
                                                        {Number(bill.amount).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="modal-bill-body">
                                                    <div style={{ flex: 1 }}>
                                                        <p className="modal-bill-desc">
                                                            <strong>Remarks:</strong>{" "}
                                                            {bill.description || "No description"}
                                                        </p>
                                                        <span
                                                            style={{
                                                                fontSize: "11.5px",
                                                                color: "#94a3b8",
                                                                display: "block",
                                                                marginTop: "2px",
                                                            }}
                                                        >
                                                            Date:{" "}
                                                            {bill.date
                                                                ? new Date(bill.date).toLocaleDateString()
                                                                : "-"}
                                                        </span>
                                                    </div>

                                                    {/* Receipt Preview */}
                                                    <div>
                                                        {receiptUrl ? (
                                                            isPdf ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn-view-receipt"
                                                                    onClick={() => setPreviewReceipt({ url: receiptUrl, bill })}
                                                                    title="Click to view PDF receipt"
                                                                >
                                                                    <span
                                                                        className="material-symbols-outlined"
                                                                        style={{ fontSize: "15px", color: "#dc2626" }}
                                                                    >
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
                                                                        <span
                                                                            className="material-symbols-outlined"
                                                                            style={{ fontSize: "15px" }}
                                                                        >
                                                                            image
                                                                        </span>
                                                                        View Receipt
                                                                    </span>
                                                                </button>
                                                            )
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    fontSize: "11.5px",
                                                                    color: "#94a3b8",
                                                                }}
                                                            >
                                                                No Receipt
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons for Pending */}
                                                    {isPending && (
                                                        <div className="modal-bill-actions">
                                                            <button
                                                                type="button"
                                                                className="btn-cancel-bill"
                                                                style={{ padding: "5px 10px", fontSize: "12px" }}
                                                                onClick={() => {
                                                                    setCancellingBillId(bill._id);
                                                                    setRejectionReason("");
                                                                }}
                                                                disabled={isActionLoading}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn-approve-bill"
                                                                style={{ padding: "5px 12px", fontSize: "12px" }}
                                                                onClick={() => handleApproveBill(bill._id)}
                                                                disabled={isActionLoading}
                                                            >
                                                                {isActionLoading && !isCancelling ? (
                                                                    "Approving..."
                                                                ) : (
                                                                    <>
                                                                        <span
                                                                            className="material-symbols-outlined"
                                                                            style={{ fontSize: "15px" }}
                                                                        >
                                                                            check
                                                                        </span>
                                                                        Approve
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Rejection Reason display if already rejected */}
                                                {isRejected && bill.rejectionReason && (
                                                    <div
                                                        className="bill-rejection-callout"
                                                        style={{ marginTop: "10px", padding: "8px 12px" }}
                                                    >
                                                        <span
                                                            className="material-symbols-outlined"
                                                            style={{ fontSize: "16px", color: "#dc2626" }}
                                                        >
                                                            error
                                                        </span>
                                                        <span style={{ fontSize: "12px" }}>
                                                            <strong>Reason:</strong> {bill.rejectionReason}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Expandable Rejection Reason Panel */}
                                                {isCancelling && (
                                                    <div className="cancel-reason-panel" style={{ marginTop: "10px" }}>
                                                        <label className="cancel-reason-label">
                                                            Reason for Cancelling / Rejecting:
                                                        </label>
                                                        <textarea
                                                            rows={2}
                                                            className="cancel-reason-textarea"
                                                            placeholder="Enter reason for driver..."
                                                            value={rejectionReason}
                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <div className="cancel-panel-actions">
                                                            <button
                                                                type="button"
                                                                className="btn-dismiss-cancel"
                                                                onClick={() => {
                                                                    setCancellingBillId(null);
                                                                    setRejectionReason("");
                                                                }}
                                                            >
                                                                Dismiss
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn-confirm-cancel"
                                                                onClick={() => handleConfirmCancelBill(bill._id)}
                                                                disabled={isActionLoading}
                                                            >
                                                                Confirm Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="trip-modal-footer">
                            <button
                                type="button"
                                className="btn-dismiss-cancel"
                                onClick={handleCloseTripModal}
                            >
                                Close Inspector
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal Preview */}
            {previewReceipt && (
                <ReceiptModal
                    receipt={previewReceipt}
                    onClose={() => setPreviewReceipt(null)}
                />
            )}
        </div>
    );
}
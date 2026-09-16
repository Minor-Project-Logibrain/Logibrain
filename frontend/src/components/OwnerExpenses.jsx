import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import ReceiptModal from "./ReceiptModal";
import "./OwnerDashBoard.css";
import "./OwnerExpenses.css";

export default function OwnerExpenses() {
    // =========================================================================
    // 1. STATE MANAGEMENT
    // =========================================================================
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("pending"); // "pending", "approved", "rejected", "all"
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Cancellation panel state (track which bill ID is currently showing the textarea)
    const [cancellingBillId, setCancellingBillId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Receipt preview modal state
    const [previewReceipt, setPreviewReceipt] = useState(null);

    // Alert feedback
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    // =========================================================================
    // 2. FETCH BILLS FROM BACKEND
    // =========================================================================
    const fetchBills = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/owners/bills", {
                withCredentials: true,
            });
            if (res.data.success) {
                setBills(res.data.result || []);
            } else {
                setMessage(res.data.message || "Failed to load bills");
                setSuccess(false);
            }
        } catch (err) {
            console.error("Error fetching bills:", err);
            setMessage(
                err.response?.data?.message || "Failed to connect and fetch expenses."
            );
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    // =========================================================================
    // 3. APPROVE BILL ACTION
    // =========================================================================
    const handleApproveBill = async (billId) => {
        setActionLoadingId(billId);
        setMessage("");

        try {
            const res = await axios.put(
                `http://localhost:8080/owners/bills/${billId}/status`,
                { status: "approved" },
                { withCredentials: true }
            );

            if (res.data.success) {
                setSuccess(true);
                setMessage("Bill approved successfully!");
                // Update local state
                setBills((prev) =>
                    prev.map((b) =>
                        b._id === billId
                            ? { ...b, status: "approved", rejectionReason: "" }
                            : b
                    )
                );
            } else {
                setSuccess(false);
                setMessage(res.data.message || "Failed to approve bill.");
            }
        } catch (err) {
            console.error("Approve bill error:", err);
            setSuccess(false);
            setMessage(
                err.response?.data?.message || "Failed to approve bill."
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    // =========================================================================
    // 4. CANCEL / REJECT BILL ACTION (WITH TEXTAREA REASON)
    // =========================================================================
    const handleOpenCancelPanel = (billId) => {
        setCancellingBillId(billId);
        setRejectionReason("");
    };

    const handleDismissCancelPanel = () => {
        setCancellingBillId(null);
        setRejectionReason("");
    };

    const handleConfirmCancelBill = async (billId) => {
        if (!rejectionReason.trim()) {
            setSuccess(false);
            setMessage("Please enter a reason for cancelling / rejecting this bill.");
            return;
        }

        setActionLoadingId(billId);
        setMessage("");

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
                setSuccess(true);
                setMessage("Bill cancelled / rejected successfully.");
                // Update local state
                setBills((prev) =>
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
                handleDismissCancelPanel();
            } else {
                setSuccess(false);
                setMessage(res.data.message || "Failed to cancel bill.");
            }
        } catch (err) {
            console.error("Cancel bill error:", err);
            setSuccess(false);
            setMessage(
                err.response?.data?.message || "Failed to cancel bill."
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    // =========================================================================
    // 5. FILTERING & COMPUTED VALUES
    // =========================================================================
    const pendingBills = bills.filter((b) => (b.status || "pending").toLowerCase() === "pending");
    const approvedBills = bills.filter((b) => (b.status || "").toLowerCase() === "approved");
    const rejectedBills = bills.filter((b) => (b.status || "").toLowerCase() === "rejected");

    const totalPendingAmount = pendingBills.reduce(
        (sum, b) => sum + (Number(b.amount) || 0),
        0
    );
    const totalApprovedAmount = approvedBills.reduce(
        (sum, b) => sum + (Number(b.amount) || 0),
        0
    );
    const totalAllAmount = bills.reduce(
        (sum, b) => sum + (Number(b.amount) || 0),
        0
    );

    // Apply Active Tab Filter
    let filteredBills = bills;
    if (activeTab === "pending") filteredBills = pendingBills;
    else if (activeTab === "approved") filteredBills = approvedBills;
    else if (activeTab === "rejected") filteredBills = rejectedBills;

    // Apply Category Filter
    if (categoryFilter !== "all") {
        filteredBills = filteredBills.filter(
            (b) => (b.billType || "other").toLowerCase() === categoryFilter.toLowerCase()
        );
    }

    // Apply Search Query Filter (tripNo, driver name, description)
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filteredBills = filteredBills.filter(
            (b) =>
                (b.trip?.tripNo || "").toLowerCase().includes(q) ||
                (b.driver?.fullName || "").toLowerCase().includes(q) ||
                (b.description || "").toLowerCase().includes(q) ||
                (b.billType || "").toLowerCase().includes(q)
        );
    }

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

    return (
        <div className="owner-expenses-page animate-fade-in">
            {/* =====================================================================
                HEADER
               ===================================================================== */}
            <div className="expenses-page-header">
                <div className="expenses-header-left">
                    <h2>Trip Expenses & Driver Bills</h2>
                    <p>
                        Review, verify, approve, or cancel trip expense claims filed by drivers.
                    </p>
                </div>

                <div className="expenses-badge">
                    <span className="material-symbols-outlined">payments</span>
                    Finance & Claims
                </div>
            </div>

            {/* Alert Message */}
            <Message
                message={message}
                success={success}
                clearMessage={() => setMessage("")}
            />

            {/* =====================================================================
                STATISTICS OVERVIEW CARDS
               ===================================================================== */}
            <div className="expenses-stats-grid">
                {/* Pending Stat */}
                <div
                    className="expense-stat-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("pending")}
                >
                    <div className="expense-stat-icon-box pending">
                        <span className="material-symbols-outlined">
                            pending_actions
                        </span>
                    </div>
                    <div className="expense-stat-info">
                        <h4>Pending Approvals</h4>
                        <p className="stat-value">{pendingBills.length}</p>
                        <p className="stat-sub">
                            ₹{totalPendingAmount.toLocaleString()} to review
                        </p>
                    </div>
                </div>

                {/* Approved Stat */}
                <div
                    className="expense-stat-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("approved")}
                >
                    <div className="expense-stat-icon-box approved">
                        <span className="material-symbols-outlined">
                            check_circle
                        </span>
                    </div>
                    <div className="expense-stat-info">
                        <h4>Approved Expenses</h4>
                        <p className="stat-value">{approvedBills.length}</p>
                        <p className="stat-sub">
                            ₹{totalApprovedAmount.toLocaleString()} approved
                        </p>
                    </div>
                </div>

                {/* Rejected / Cancelled Stat */}
                <div
                    className="expense-stat-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("rejected")}
                >
                    <div className="expense-stat-icon-box rejected">
                        <span className="material-symbols-outlined">
                            cancel
                        </span>
                    </div>
                    <div className="expense-stat-info">
                        <h4>Cancelled / Rejected</h4>
                        <p className="stat-value">{rejectedBills.length}</p>
                        <p className="stat-sub">Disapproved claims</p>
                    </div>
                </div>

                {/* Total Stat */}
                <div
                    className="expense-stat-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("all")}
                >
                    <div className="expense-stat-icon-box total">
                        <span className="material-symbols-outlined">
                            receipt_long
                        </span>
                    </div>
                    <div className="expense-stat-info">
                        <h4>Total Claims</h4>
                        <p className="stat-value">{bills.length}</p>
                        <p className="stat-sub">
                            ₹{totalAllAmount.toLocaleString()} filed
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================================================
                SECTION TABS & CONTROLS BAR
               ===================================================================== */}
            <div className="expenses-controls-bar">
                {/* Tabs */}
                <div className="expenses-tabs-group">
                    <button
                        type="button"
                        className={`expense-tab-btn ${
                            activeTab === "pending" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("pending")}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            hourglass_top
                        </span>
                        Pending Bills
                        <span className="tab-pill-count pending">
                            {pendingBills.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`expense-tab-btn ${
                            activeTab === "approved" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("approved")}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            verified
                        </span>
                        Approved Bills
                        <span className="tab-pill-count approved">
                            {approvedBills.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`expense-tab-btn ${
                            activeTab === "rejected" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("rejected")}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            cancel
                        </span>
                        Cancelled Bills
                        <span className="tab-pill-count rejected">
                            {rejectedBills.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`expense-tab-btn ${
                            activeTab === "all" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("all")}
                    >
                        All Claims
                        <span className="tab-pill-count all">
                            {bills.length}
                        </span>
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="expenses-search-filter">
                    <div className="expenses-search-wrap">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="Search by trip, driver, or notes..."
                            className="expenses-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        className="expenses-filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="fuel">Fuel (Diesel/CNG)</option>
                        <option value="toll">Toll Taxes</option>
                        <option value="food">Food Allowance</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="loading">Loading</option>
                        <option value="unloading">Unloading</option>
                        <option value="parking">Parking</option>
                        <option value="other">Other</option>
                    </select>

                    <button
                        type="button"
                        className="btn-dismiss-cancel"
                        onClick={fetchBills}
                        title="Refresh bills list"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                            sync
                        </span>
                        Refresh
                    </button>
                </div>
            </div>

            {/* =====================================================================
                BILLS CARDS LIST
               ===================================================================== */}
            {loading ? (
                <div className="expenses-empty-state">
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    <h3>Loading bills...</h3>
                </div>
            ) : filteredBills.length === 0 ? (
                <div className="expenses-empty-state">
                    <span className="material-symbols-outlined">folder_open</span>
                    <h3>No {activeTab !== "all" ? activeTab : ""} bills found</h3>
                    <p>
                        {activeTab === "pending"
                            ? "There are currently no pending expense claims awaiting your review."
                            : activeTab === "approved"
                            ? "No approved bills match your current filter."
                            : "No bills match the selected criteria."}
                    </p>
                </div>
            ) : (
                <div className="expenses-cards-grid">
                    {filteredBills.map((bill) => {
                        const billStatus = (bill.status || "pending").toLowerCase();
                        const isPending = billStatus === "pending";
                        const isApproved = billStatus === "approved";
                        const isRejected = billStatus === "rejected";
                        const isCancelling = cancellingBillId === bill._id;
                        const isActionLoading = actionLoadingId === bill._id;

                        const tripNo = bill.trip?.tripNo || "TRIP ASSIGNMENT";
                        const routeText =
                            bill.trip?.pickupLocation?.city && bill.trip?.deliveryLocation?.city
                                ? `${bill.trip.pickupLocation.city} → ${bill.trip.deliveryLocation.city}`
                                : "Route Details";

                        const driverName = bill.driver?.fullName || "Assigned Driver";
                        const driverPhone = bill.driver?.phone || "";

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
                                className={`expense-bill-card status-border-${billStatus}`}
                            >
                                {/* Card Header */}
                                <div className="bill-card-top">
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span
                                            className={`bill-category-badge cat-${bill.billType || "other"}`}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
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
                                            style={{ textTransform: "capitalize" }}
                                        >
                                            {billStatus}
                                        </span>
                                    </div>

                                    {/* Amount */}
                                    <div className="bill-amount-badge">
                                        <span className="bill-amount-currency">₹</span>
                                        {Number(bill.amount).toLocaleString()}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="bill-details-grid">
                                    {/* Trip No */}
                                    <div className="bill-detail-item">
                                        <span className="bill-detail-label">
                                            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                                                route
                                            </span>
                                            Trip & Route
                                        </span>
                                        <span className="bill-detail-val bill-trip-badge">
                                            {tripNo}
                                        </span>
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                            {routeText}
                                        </span>
                                    </div>

                                    {/* Driver */}
                                    <div className="bill-detail-item">
                                        <span className="bill-detail-label">
                                            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                                                person
                                            </span>
                                            Filed By Driver
                                        </span>
                                        <span className="bill-detail-val bill-driver-badge">
                                            {driverName}
                                        </span>
                                        {driverPhone && (
                                            <span style={{ fontSize: "12px", color: "#64748b" }}>
                                                {driverPhone}
                                            </span>
                                        )}
                                    </div>

                                    {/* Expense Date */}
                                    <div className="bill-detail-item">
                                        <span className="bill-detail-label">
                                            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                                                calendar_today
                                            </span>
                                            Date of Expense
                                        </span>
                                        <span className="bill-detail-val">
                                            {bill.date
                                                ? new Date(bill.date).toLocaleDateString()
                                                : "-"}
                                        </span>
                                    </div>

                                    {/* Submission Date */}
                                    <div className="bill-detail-item">
                                        <span className="bill-detail-label">
                                            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                                                schedule
                                            </span>
                                            Submitted On
                                        </span>
                                        <span className="bill-detail-val">
                                            {bill.createdAt
                                                ? new Date(bill.createdAt).toLocaleDateString()
                                                : "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Remarks / Description */}
                                {bill.description && (
                                    <div className="bill-remarks-box">
                                        <strong>Driver Note:</strong>
                                        {bill.description}
                                    </div>
                                )}

                                {/* Cancellation / Rejection Reason Callout if Rejected */}
                                {isRejected && bill.rejectionReason && (
                                    <div className="bill-rejection-callout">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: "18px", color: "#dc2626" }}
                                        >
                                            error
                                        </span>
                                        <div>
                                            <strong>Cancellation Reason:</strong> {bill.rejectionReason}
                                        </div>
                                    </div>
                                )}

                                {/* Card Footer: Receipts and Approval/Cancel Actions */}
                                <div className="bill-card-footer">
                                    {/* Receipt Link / Thumbnail Button */}
                                    <div className="bill-receipt-action">
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
                                                    View PDF Receipt
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
                                                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                                            image
                                                        </span>
                                                        View Receipt
                                                    </span>
                                                </button>
                                            )
                                        ) : (
                                            <span className="no-receipt-tag">
                                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                                    receipt_long
                                                </span>
                                                No Receipt Attached
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions for Pending Bills */}
                                    {isPending && (
                                        <div className="bill-actions-btns">
                                            {/* Cancel / Reject Button */}
                                            <button
                                                type="button"
                                                className="btn-cancel-bill"
                                                onClick={() => handleOpenCancelPanel(bill._id)}
                                                disabled={isActionLoading}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                                    close
                                                </span>
                                                Cancel
                                            </button>

                                            {/* Approve Button */}
                                            <button
                                                type="button"
                                                className="btn-approve-bill"
                                                onClick={() => handleApproveBill(bill._id)}
                                                disabled={isActionLoading}
                                            >
                                                {isActionLoading && !isCancelling ? (
                                                    <>
                                                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: "16px" }}>
                                                            sync
                                                        </span>
                                                        Approving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                                            check_circle
                                                        </span>
                                                        Approve
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* =============================================================
                                    EXPANDABLE CANCELLATION TEXTAREA PANEL
                                   ============================================================= */}
                                {isCancelling && (
                                    <div className="cancel-reason-panel">
                                        <label className="cancel-reason-label">
                                            Specify Reason for Cancelling / Rejecting Bill:
                                        </label>
                                        <textarea
                                            rows={2}
                                            className="cancel-reason-textarea"
                                            placeholder="Enter reason for driver (e.g. 'Receipt photo unclear', 'Amount does not match receipt', 'Duplicate claim')..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="cancel-panel-actions">
                                            <button
                                                type="button"
                                                className="btn-dismiss-cancel"
                                                onClick={handleDismissCancelPanel}
                                            >
                                                Dismiss
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-confirm-cancel"
                                                onClick={() => handleConfirmCancelBill(bill._id)}
                                                disabled={isActionLoading}
                                            >
                                                {isActionLoading ? (
                                                    <>
                                                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: "14px" }}>
                                                            sync
                                                        </span>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                                            cancel
                                                        </span>
                                                        Confirm Cancellation
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* =====================================================================
                RECEIPT LIGHTBOX MODAL
               ===================================================================== */}
            {previewReceipt && (
                <ReceiptModal
                    receipt={previewReceipt}
                    onClose={() => setPreviewReceipt(null)}
                />
            )}
        </div>
    );
}

import React, { useState, useEffect } from "react";
import Message from "./Message";
import axios from "axios";
import "./OwnerDashBoard.css";
import "./DriverAddBill.css";

export default function DriverAddBill({ selectedTrip, onBack }) {
    // =========================================================================
    // 1. STATE MANAGEMENT
    // =========================================================================
    // All driver trips for fallback dropdown selection if no trip was pre-selected
    const [tripsList, setTripsList] = useState([]);
    const [currentTripId, setCurrentTripId] = useState(
        selectedTrip?._id || selectedTrip?.tripNo || ""
    );
    const [fetchingTrips, setFetchingTrips] = useState(false);

    // Multi-bill dynamic state array
    const [bills, setBills] = useState([
        {
            id: 1,
            billType: "fuel",
            amount: "",
            billDate: new Date().toISOString().split("T")[0],
            description: "",
            receipt: null,
            receiptName: "",
        },
    ]);

    // Alert & submission state
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch assigned trips if needed
    useEffect(() => {
        const fetchTrips = async () => {
            setFetchingTrips(true);
            try {
                const res = await axios.get(
                    "http://localhost:8080/driver/trips/get-trips",
                    { withCredentials: true }
                );
                if (res.data.success && res.data.result?.length > 0) {
                    setTripsList(res.data.result);
                    if (!selectedTrip) {
                        setCurrentTripId(
                            res.data.result[0]._id || res.data.result[0].tripNo
                        );
                    }
                }
            } catch (err) {
                console.error("Failed to fetch assigned trips:", err);
            } finally {
                setFetchingTrips(false);
            }
        };

        fetchTrips();

        if (selectedTrip) {
            setCurrentTripId(selectedTrip._id || selectedTrip.tripNo);
        }
    }, [selectedTrip]);

    // Active trip context data
    const activeTrip =
        selectedTrip ||
        tripsList.find(
            (t) => t._id === currentTripId || t.tripNo === currentTripId
        ) ||
        (tripsList.length > 0 ? tripsList[0] : null);

    // =========================================================================
    // 2. DYNAMIC BILL ITEM HANDLERS (Add More Bills, Remove, Edit)
    // =========================================================================
    // Add a new blank bill card to the list
    const handleAddMoreBill = () => {
        setBills((prev) => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                billType: "fuel",
                amount: "",
                billDate: new Date().toISOString().split("T")[0],
                description: "",
                receipt: null,
                receiptName: "",
            },
        ]);
    };

    // Remove a specific bill card by ID
    const handleRemoveBill = (idToRemove) => {
        if (bills.length === 1) return;
        setBills((prev) => prev.filter((b) => b.id !== idToRemove));
    };

    // Update field value of a specific bill
    const handleBillFieldChange = (id, field, value) => {
        setBills((prev) =>
            prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
        );
    };

    // Handle receipt file upload for a specific bill
    const handleReceiptFileChange = (id, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBills((prev) =>
                prev.map((b) =>
                    b.id === id
                        ? { ...b, receipt: file, receiptName: file.name }
                        : b
                )
            );
        }
    };

    // Calculate live total across all bills
    const totalExpenseAmount = bills.reduce(
        (sum, b) => sum + (parseFloat(b.amount) || 0),
        0
    );

    // =========================================================================
    // 3. SUBMIT BILLS HANDLER (CONNECT TO BACKEND)
    // =========================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const targetTripId = activeTrip?._id || currentTripId;
        if (!targetTripId) {
            setMessage("Please select an assigned trip for filing bills.");
            setSuccess(false);
            return;
        }

        // Validate each bill item
        for (let i = 0; i < bills.length; i++) {
            const b = bills[i];
            if (!b.amount || parseFloat(b.amount) <= 0) {
                setMessage(
                    `Please enter a valid expense amount for Bill #${i + 1}.`
                );
                setSuccess(false);
                return;
            }
            if (!b.billDate) {
                setMessage(`Please select a date for Bill #${i + 1}.`);
                setSuccess(false);
                return;
            }
            if (!b.description.trim()) {
                setMessage(
                    `Please enter a description/remarks for Bill #${i + 1}.`
                );
                setSuccess(false);
                return;
            }
        }

        setSubmitting(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("tripId", targetTripId);

            // Prepare bills payload metadata
            const billsPayload = bills.map((b, idx) => ({
                id: b.id,
                billType: (b.billType || "fuel").toLowerCase(),
                amount: parseFloat(b.amount),
                date: b.billDate,
                description: b.description.trim(),
                receiptName: b.receiptName || "",
            }));

            formData.append("bills", JSON.stringify(billsPayload));

            // Attach files with indexed fieldnames
            bills.forEach((b, idx) => {
                if (b.receipt instanceof File) {
                    formData.append(`receipt_${idx}`, b.receipt);
                }
            });

            const res = await axios.post(
                "http://localhost:8080/driver/trips/add-bill",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success) {
                setSuccess(true);
                setMessage(
                    `Successfully submitted ${bills.length} bill${
                        bills.length > 1 ? "s" : ""
                    } (Total: ₹${totalExpenseAmount.toLocaleString()}) for approval!`
                );

                // Reset to 1 fresh bill card
                setBills([
                    {
                        id: Date.now(),
                        billType: "fuel",
                        amount: "",
                        billDate: new Date().toISOString().split("T")[0],
                        description: "",
                        receipt: null,
                        receiptName: "",
                    },
                ]);
            } else {
                setSuccess(false);
                setMessage(res.data.message || "Failed to submit bills.");
            }
        } catch (err) {
            console.error("Add bill error:", err);
            setSuccess(false);
            setMessage(
                err.response?.data?.message ||
                    "Failed to submit bills. Please check connection and try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-page animate-fade-in driver-add-bill-page">
            {/* =====================================================================
                HEADER & NAVIGATION BAR (With Back to Trips Button)
               ===================================================================== */}
            <div className="driver-bill-header">
                <div className="driver-bill-header-left">
                    {onBack && (
                        <button
                            type="button"
                            className="driver-back-btn"
                            onClick={onBack}
                            title="Go back to assigned trips list"
                        >
                            <span className="material-symbols-outlined">
                                arrow_back
                            </span>
                            Back to Trips
                        </button>
                    )}
                    <div>
                        <h2>Claim Trip Expenses & Bills</h2>
                        <p>File fuel, toll, maintenance, or food bills for reimbursement.</p>
                    </div>
                </div>

                <div className="driver-reimburse-badge">
                    <span className="material-symbols-outlined">payments</span>
                    Expense Claims
                </div>
            </div>

            {/* =====================================================================
                ALERT / FEEDBACK MESSAGE
               ===================================================================== */}
            <Message
                message={message}
                success={success}
                clearMessage={() => setMessage("")}
            />

            {/* =====================================================================
                TRIP SELECTION (If navigated from sidebar or choosing between trips)
               ===================================================================== */}
            {!selectedTrip && tripsList.length > 1 && (
                <div className="db-card" style={{ padding: "16px 20px", marginBottom: "16px" }}>
                    <div className="bill-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="selectTrip" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#2563eb" }}>
                                alt_route
                            </span>
                            Select Assigned Trip for Expenses:
                        </label>
                        <select
                            id="selectTrip"
                            value={currentTripId}
                            onChange={(e) => setCurrentTripId(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                marginTop: "6px",
                            }}
                        >
                            {tripsList.map((t) => (
                                <option
                                    key={t._id || t.tripNo}
                                    value={t._id || t.tripNo}
                                >
                                    {t.tripNo} — {t.pickupLocation?.city || t.source || "Origin"} →{" "}
                                    {t.deliveryLocation?.city || t.destination || "Destination"} (
                                    {t.truck?.truckNo || "Assigned Truck"})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* =====================================================================
                ASSIGNED TRIP CONTEXT CARD
               ===================================================================== */}
            {activeTrip ? (
                <div className="driver-trip-context-card">
                    <div className="trip-context-info">
                        <span className="trip-context-pill">Assigned Trip</span>
                        <div className="trip-context-title">
                            <span className="material-symbols-outlined">
                                route
                            </span>
                            {activeTrip.tripNo || "TRIP ASSIGNMENT"}
                        </div>
                        <div className="trip-context-route">
                            {activeTrip.pickupLocation?.city ||
                                activeTrip.source ||
                                "Origin"}{" "}
                            →{" "}
                            {activeTrip.deliveryLocation?.city ||
                                activeTrip.destination ||
                                "Destination"}
                        </div>
                    </div>

                    <div className="trip-context-meta">
                        <span className="trip-context-tag">
                            <span className="material-symbols-outlined">
                                local_shipping
                            </span>
                            {activeTrip.truck?.truckNo ||
                                (typeof activeTrip.truck === "string"
                                    ? activeTrip.truck
                                    : "Fleet Truck")}
                        </span>
                        {activeTrip.cargo?.type && (
                            <span className="trip-context-tag">
                                <span className="material-symbols-outlined">
                                    inventory_2
                                </span>
                                {activeTrip.cargo.type}
                            </span>
                        )}
                        <span className="trip-context-tag">
                            <span className="material-symbols-outlined">
                                event
                            </span>
                            {activeTrip.plannedStartDate || activeTrip.startDate
                                ? new Date(
                                      activeTrip.plannedStartDate ||
                                          activeTrip.startDate
                                  ).toLocaleDateString()
                                : "Active"}
                        </span>
                    </div>
                </div>
            ) : !fetchingTrips && tripsList.length === 0 ? (
                <div
                    className="db-card"
                    style={{
                        padding: "24px",
                        textAlign: "center",
                        marginBottom: "20px",
                    }}
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "36px", color: "#94a3b8" }}
                    >
                        warning
                    </span>
                    <h3 style={{ margin: "8px 0 4px", color: "#334155" }}>
                        No Active Trips Assigned
                    </h3>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
                        You need to be assigned to a trip by the fleet owner before you can submit expense claims.
                    </p>
                </div>
            ) : null}

            {/* =====================================================================
                MULTI-BILL EXPENSE CLAIMS FORM
               ===================================================================== */}
            <form onSubmit={handleSubmit} className="driver-bills-form">
                {/* List of Dynamic Bill Cards */}
                <div className="driver-bills-list">
                    {bills.map((bill, index) => (
                        <div key={bill.id} className="driver-bill-item-card">
                            {/* Bill Card Header */}
                            <div className="bill-item-header">
                                <span className="bill-item-number-chip">
                                    <span className="material-symbols-outlined">
                                        receipt_long
                                    </span>
                                    Bill #{index + 1}
                                </span>

                                {/* Remove Button (Shown when more than 1 bill exists) */}
                                {bills.length > 1 && (
                                    <button
                                        type="button"
                                        className="bill-remove-btn"
                                        onClick={() => handleRemoveBill(bill.id)}
                                        title={`Remove Bill #${index + 1}`}
                                    >
                                        <span className="material-symbols-outlined">
                                            delete
                                        </span>
                                        Remove
                                    </button>
                                )}
                            </div>

                            {/* Bill Card Body */}
                            <div className="bill-item-body">
                                <div className="bill-inputs-grid">
                                    {/* Category / Bill Type */}
                                    <div className="bill-form-group">
                                        <label>Expense Category *</label>
                                        <select
                                            value={bill.billType}
                                            onChange={(e) =>
                                                handleBillFieldChange(
                                                    bill.id,
                                                    "billType",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="fuel">
                                                Fuel (Diesel / CNG)
                                            </option>
                                            <option value="toll">
                                                Toll Taxes / Fastag Recharge
                                            </option>
                                            <option value="food">
                                                Food & Daily Meals Allowance
                                            </option>
                                            <option value="maintenance">
                                                Emergency Vehicle Repair / Tyres
                                            </option>
                                            <option value="loading">
                                                Loading Charges
                                            </option>
                                            <option value="unloading">
                                                Unloading Charges
                                            </option>
                                            <option value="parking">
                                                Parking Charges
                                            </option>
                                            <option value="other">
                                                Other Miscellaneous
                                            </option>
                                        </select>
                                    </div>

                                    {/* Expense Amount */}
                                    <div className="bill-form-group">
                                        <label>Expense Amount (INR) *</label>
                                        <div className="bill-amount-input-wrap">
                                            <span className="bill-currency-symbol">
                                                ₹
                                            </span>
                                            <input
                                                type="number"
                                                min="1"
                                                step="any"
                                                placeholder="e.g. 3500"
                                                value={bill.amount}
                                                onChange={(e) =>
                                                    handleBillFieldChange(
                                                        bill.id,
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bill-inputs-grid">
                                    {/* Date of Expense */}
                                    <div className="bill-form-group">
                                        <label>Date of Expense *</label>
                                        <input
                                            type="date"
                                            value={bill.billDate}
                                            onChange={(e) =>
                                                handleBillFieldChange(
                                                    bill.id,
                                                    "billDate",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Upload Receipt / Attachment */}
                                    <div className="bill-form-group">
                                        <label>Attach Receipt (Optional)</label>
                                        <div className="bill-upload-box">
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={(e) =>
                                                    handleReceiptFileChange(
                                                        bill.id,
                                                        e
                                                    )
                                                }
                                            />
                                            <div className="bill-upload-content">
                                                <span className="material-symbols-outlined">
                                                    cloud_upload
                                                </span>
                                                <p className="bill-upload-text">
                                                    {bill.receiptName ||
                                                        "Click or drag receipt file"}
                                                </p>
                                                <span className="bill-upload-hint">
                                                    JPEG, PNG, or PDF up to 5MB
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description / Remarks */}
                                <div className="bill-form-group">
                                    <label>Remarks / Description *</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Add details (e.g. 'Filled 40L Diesel at HPCL pump' or 'Toll tax paid at toll plaza')"
                                        value={bill.description}
                                        onChange={(e) =>
                                            handleBillFieldChange(
                                                bill.id,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* =====================================================================
                    ACTIONS BAR: Add More Bill, Total Amount, Submit Claim
                   ===================================================================== */}
                <div className="driver-bill-actions-bar">
                    {/* Add More Bills Button */}
                    <button
                        type="button"
                        className="btn-add-more-bill"
                        onClick={handleAddMoreBill}
                    >
                        <span className="material-symbols-outlined">
                            add_circle
                        </span>
                        + Add More Bills
                    </button>

                    {/* Total & Submit */}
                    <div className="driver-bill-submit-group">
                        <div className="driver-total-expense-pill">
                            <span className="driver-total-label">
                                Total Claims ({bills.length} Bill
                                {bills.length > 1 ? "s" : ""})
                            </span>
                            <span className="driver-total-val">
                                ₹{totalExpenseAmount.toLocaleString()}
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="btn-submit-bills"
                            disabled={submitting || (!activeTrip && tripsList.length === 0)}
                        >
                            {submitting ? (
                                <>
                                    <span
                                        className="material-symbols-outlined animate-spin"
                                        style={{ fontSize: "18px" }}
                                    >
                                        sync
                                    </span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">
                                        send
                                    </span>
                                    Submit All Bills (₹
                                    {totalExpenseAmount.toLocaleString()})
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}


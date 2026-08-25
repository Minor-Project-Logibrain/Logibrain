import React, { useState } from "react";
import Message from "./Message";
import "./OwnerLogin.css";
import "./OwnerDashBoard.css";

export default function DriverAddBill() {
    const [trip, setTrip] = useState("TRIP-8042");
    const [billType, setBillType] = useState("Fuel");
    const [amount, setAmount] = useState("");
    const [billDate, setBillDate] = useState("");
    const [description, setDescription] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setReceipt(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || !billDate || !description) {
            setMessage("Please fill in all required fields.");
            setSuccess(false);
            return;
        }

        if (parseFloat(amount) <= 0) {
            setMessage("Expense amount must be greater than zero.");
            setSuccess(false);
            return;
        }

        setSubmitting(true);
        setMessage("");

        // Mock API submission on frontend
        setTimeout(() => {
            setSuccess(true);
            setMessage("Bill submitted successfully! Pending approval from Owner.");
            setAmount("");
            setBillDate("");
            setDescription("");
            setReceipt(null);
            setSubmitting(false);
        }, 1200);
    };

    return (
        <div className="dashboard-page animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Message message={message} success={success} clearMessage={() => setMessage("")} />

            {/* Page Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Add Bill / Claim Expense</h2>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>File fuel, toll, or food expenses for reimbursement.</p>
                </div>
                <div className="db-date-badge" style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>payments</span>
                    Reimbursements
                </div>
            </div>

            {/* Form Section */}
            <div className="db-card" style={{ padding: "32px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                <form onSubmit={handleSubmit} className="login-form" style={{ gap: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        {/* Select Trip */}
                        <div className="form-group">
                            <label htmlFor="trip">Select Assigned Trip *</label>
                            <select
                                id="trip"
                                value={trip}
                                onChange={(e) => setTrip(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "12px",
                                    outline: "none",
                                    fontSize: "14px",
                                    backgroundColor: "#ffffff",
                                    color: "#0f172a",
                                    boxSizing: "border-box"
                                }}
                            >
                                <option value="TRIP-8042">TRIP-8042 (Delhi to Mumbai - Active)</option>
                                <option value="TRIP-7981">TRIP-7981 (Pune to Bangalore - Delivered)</option>
                                <option value="TRIP-7854">TRIP-7854 (Chennai to Hyderabad - Delivered)</option>
                            </select>
                        </div>

                        {/* Bill Type */}
                        <div className="form-group">
                            <label htmlFor="billType">Bill Type / Category *</label>
                            <select
                                id="billType"
                                value={billType}
                                onChange={(e) => setBillType(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "12px",
                                    outline: "none",
                                    fontSize: "14px",
                                    backgroundColor: "#ffffff",
                                    color: "#0f172a",
                                    boxSizing: "border-box"
                                }}
                            >
                                <option value="Fuel">Fuel (Diesel / CNG)</option>
                                <option value="Toll">Toll Taxes / Fastag recharge</option>
                                <option value="Food">Food / Meals Allowance</option>
                                <option value="Maintenance">Emergency Vehicle Repair</option>
                                <option value="Other">Other Expenses</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        {/* Amount */}
                        <div className="form-group">
                            <label htmlFor="amount">Expense Amount (INR) *</label>
                            <input
                                id="amount"
                                type="number"
                                placeholder="Enter bill amount (e.g. 4500)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "12px",
                                    outline: "none",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Date */}
                        <div className="form-group">
                            <label htmlFor="billDate">Date of Expense *</label>
                            <input
                                id="billDate"
                                type="date"
                                value={billDate}
                                onChange={(e) => setBillDate(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "12px",
                                    outline: "none",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>
                    </div>

                    {/* Receipt Upload */}
                    <div className="form-group">
                        <label>Upload Receipt/Bill (Optional)</label>
                        <div style={{
                            border: "2px dashed #cbd5e1",
                            borderRadius: "14px",
                            padding: "24px",
                            textAlign: "center",
                            backgroundColor: "#f8fafc",
                            cursor: "pointer",
                            position: "relative",
                            transition: "border-color 0.2s"
                        }}>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer"
                                }}
                            />
                            <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#64748b", marginBottom: "8px" }}>
                                cloud_upload
                            </span>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "#475569", margin: "0 0 4px" }}>
                                {receipt ? receipt.name : "Drag & Drop or Click to Upload Receipt"}
                            </p>
                            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                                Supports JPEG, PNG, or PDF up to 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description">Remarks / Description *</label>
                        <textarea
                            id="description"
                            placeholder="Provide details about the expense (e.g. 'Filled 50L diesel at HP pump near Jaipur')"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "12px",
                                outline: "none",
                                fontSize: "14px",
                                fontFamily: "inherit",
                                boxSizing: "border-box",
                                resize: "none"
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-login-btn"
                        disabled={submitting}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                        }}
                    >
                        {submitting ? (
                            <>
                                <span className="material-symbols-outlined animate-spin" style={{ fontSize: "20px" }}>sync</span>
                                Submitting Bill...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>send</span>
                                Submit Expense Claim
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

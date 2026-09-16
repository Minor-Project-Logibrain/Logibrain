import React, { useState, useEffect } from "react";
import "./ReceiptModal.css";

export default function ReceiptModal({ receipt, onClose }) {
    // Zoom and Rotation State
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    // Normalize receipt data (supports string URL or bill object)
    let receiptUrl = "";
    let bill = null;

    if (typeof receipt === "string") {
        receiptUrl = receipt;
    } else if (receipt && typeof receipt === "object") {
        bill = receipt.bill || receipt;
        receiptUrl = receipt.url || receipt.receipt || "";
    }

    // Clean and build full backend URL if needed
    if (receiptUrl && !receiptUrl.startsWith("http://") && !receiptUrl.startsWith("https://") && !receiptUrl.startsWith("data:")) {
        const clean = receiptUrl.replace(/\\/g, "/").trim();
        receiptUrl = `http://localhost:8080/${clean.replace(/^\/+/, "")}`;
    }

    const isPdf = receiptUrl && receiptUrl.toLowerCase().endsWith(".pdf");

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "+" || e.key === "=") {
                handleZoomIn();
            } else if (e.key === "-") {
                handleZoomOut();
            } else if (e.key === "0") {
                handleReset();
            } else if (e.key === "r" || e.key === "R") {
                handleRotate();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Reset zoom when receipt URL changes
    useEffect(() => {
        setScale(1);
        setRotation(0);
        setImgLoading(true);
        setImgError(false);
    }, [receiptUrl]);

    // Zoom Controls
    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
    const handleReset = () => {
        setScale(1);
        setRotation(0);
    };

    // Category Icon Helper
    const getCategoryIcon = (cat) => {
        switch ((cat || "").toLowerCase()) {
            case "fuel": return "local_gas_station";
            case "toll": return "toll";
            case "food": return "restaurant";
            case "maintenance": return "build";
            case "loading": return "move_to_inbox";
            case "unloading": return "unarchive";
            case "parking": return "local_parking";
            default: return "receipt_long";
        }
    };

    const billType = bill?.billType || "Expense";
    const amount = bill?.amount != null ? Number(bill.amount).toLocaleString() : null;
    const tripNo = bill?.trip?.tripNo || (typeof bill?.trip === "string" ? bill.trip : null);
    const driverName = bill?.driver?.fullName || (typeof bill?.driver === "string" ? bill.driver : null);
    const billStatus = (bill?.status || "").toLowerCase();
    const billDate = bill?.date ? new Date(bill.date).toLocaleDateString() : null;
    const description = bill?.description || "";

    return (
        <div className="lb-receipt-backdrop" onClick={onClose}>
            <div className="lb-receipt-modal" onClick={(e) => e.stopPropagation()}>
                {/* =========================================================
                    HEADER
                   ========================================================= */}
                <div className="lb-receipt-header">
                    <div className="lb-receipt-header-left">
                        <div className="lb-receipt-title-wrap">
                            <h3>
                                <span className="material-symbols-outlined" style={{ color: "#2563eb", fontSize: "20px" }}>
                                    {getCategoryIcon(billType)}
                                </span>
                                Expense Receipt Proof
                            </h3>
                            <div className="lb-receipt-subtitle">
                                {tripNo && <span><strong>Trip:</strong> {tripNo}</span>}
                                {driverName && <span>• <strong>Driver:</strong> {driverName}</span>}
                                {billDate && <span>• <strong>Date:</strong> {billDate}</span>}
                            </div>
                        </div>

                        {amount && (
                            <div className="lb-receipt-amount-badge">
                                <span>₹</span>{amount}
                            </div>
                        )}
                    </div>

                    <div className="lb-receipt-header-actions">
                        {/* Zoom & Rotation Toolbar (for images) */}
                        {!isPdf && (
                            <div className="lb-receipt-toolbar">
                                <button
                                    type="button"
                                    className="lb-receipt-tool-btn"
                                    onClick={handleZoomOut}
                                    disabled={scale <= 0.5}
                                    title="Zoom Out (-)"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                        zoom_out
                                    </span>
                                </button>
                                <span className="lb-receipt-zoom-text">
                                    {Math.round(scale * 100)}%
                                </span>
                                <button
                                    type="button"
                                    className="lb-receipt-tool-btn"
                                    onClick={handleZoomIn}
                                    disabled={scale >= 3}
                                    title="Zoom In (+)"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                        zoom_in
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="lb-receipt-tool-btn"
                                    onClick={handleRotate}
                                    title="Rotate 90° (R)"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                        rotate_right
                                    </span>
                                </button>
                                {(scale !== 1 || rotation !== 0) && (
                                    <button
                                        type="button"
                                        className="lb-receipt-tool-btn"
                                        onClick={handleReset}
                                        title="Reset View (0)"
                                        style={{ color: "#2563eb" }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                            restart_alt
                                        </span>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Open in New Tab */}
                        {receiptUrl && (
                            <a
                                href={receiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="lb-receipt-action-btn"
                                title="Open full file in new tab"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                                    open_in_new
                                </span>
                                Open Original
                            </a>
                        )}

                        {/* Close Modal Button */}
                        <button
                            type="button"
                            className="lb-receipt-close-btn"
                            onClick={onClose}
                            title="Close preview (Esc)"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                                close
                            </span>
                        </button>
                    </div>
                </div>

                {/* =========================================================
                    BODY (IMAGE OR PDF)
                   ========================================================= */}
                <div className="lb-receipt-body">
                    {/* PDF Viewer */}
                    {isPdf ? (
                        <iframe
                            src={receiptUrl}
                            title="PDF Receipt Viewer"
                            className="lb-receipt-pdf-frame"
                        />
                    ) : (
                        /* Image Viewer with Zoom & Rotate Stage */
                        <div
                            className="lb-receipt-img-stage"
                            style={{
                                transform: `scale(${scale}) rotate(${rotation}deg)`,
                            }}
                        >
                            {/* Loading Spinner */}
                            {imgLoading && !imgError && (
                                <div className="lb-receipt-loader">
                                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: "36px", color: "#60a5fa" }}>
                                        sync
                                    </span>
                                    <span>Loading receipt image...</span>
                                </div>
                            )}

                            {/* Error Box */}
                            {imgError ? (
                                <div className="lb-receipt-error-box">
                                    <span className="material-symbols-outlined">
                                        broken_image
                                    </span>
                                    <h4>Receipt Image Unavailable</h4>
                                    <p>
                                        The file could not be loaded directly. You can try opening it directly in a new tab.
                                    </p>
                                    <a
                                        href={receiptUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="lb-receipt-action-btn"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                            open_in_new
                                        </span>
                                        Open Direct Link
                                    </a>
                                </div>
                            ) : (
                                <img
                                    src={receiptUrl}
                                    alt="Expense Receipt Document"
                                    className="lb-receipt-full-img"
                                    style={{ display: imgLoading ? "none" : "block" }}
                                    onLoad={() => setImgLoading(false)}
                                    onError={() => {
                                        setImgLoading(false);
                                        setImgError(true);
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* =========================================================
                    FOOTER (METADATA & HINTS)
                   ========================================================= */}
                <div className="lb-receipt-footer">
                    <div className="lb-receipt-footer-tags">
                        {billStatus && (
                            <span
                                className={`db-status-badge ${
                                    billStatus === "approved"
                                        ? "db-status-delivered"
                                        : billStatus === "rejected"
                                        ? "db-status-delayed"
                                        : "db-status-transit"
                                }`}
                                style={{ textTransform: "capitalize", fontSize: "11px" }}
                            >
                                Status: {billStatus}
                            </span>
                        )}

                        {description && (
                            <span className="lb-receipt-footer-tag" title={description}>
                                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#64748b" }}>
                                    notes
                                </span>
                                <strong>Note:</strong> {description.length > 60 ? `${description.slice(0, 60)}...` : description}
                            </span>
                        )}
                    </div>

                    <div className="lb-receipt-footer-hint">
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                            keyboard
                        </span>
                        Press <strong>ESC</strong> to close • <strong>+/-</strong> to zoom • <strong>R</strong> to rotate
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";

export default function Message({ message, success, clearMessage }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!message) return;
        setShow(true);
        const timer = setTimeout(() => {
            setShow(false);
            clearMessage();
        }, 4000); // 4 seconds gives slightly more time to read premium alerts
        return () => clearTimeout(timer);
    }, [message, success]);

    if (!show) return null;

    return (
        <div
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3.5 min-w-[320px] max-w-[420px] p-4 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-xl animate-slide-in border-l-4 ${
                success ? "border-l-emerald-500" : "border-l-rose-500"
            }`}
        >
            <span
                className={`material-symbols-outlined text-[22px] shrink-0 ${
                    success ? "text-emerald-500" : "text-rose-500"
                }`}
            >
                {success ? "check_circle" : "error"}
            </span>

            <div className="flex-1 text-slate-800 text-[13.5px] font-medium leading-normal">
                {message}
            </div>

            <button
                type="button"
                onClick={() => {
                    setShow(false);
                    clearMessage();
                }}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 p-1 rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Close message"
            >
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
}
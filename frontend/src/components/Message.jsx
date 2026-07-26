import { useEffect, useState } from "react";

export default function Message({ message, success }) {
    const [show, setShow] = useState(false);


    useEffect(() => {
        if (!message) return;
        setShow(true);
        const timer = setTimeout(() => {
            setShow(false);
        }, 3000)
        return () => clearTimeout(timer);
    }, [message, success]);

    if (!show) return null;

    return (
        <div
            className={`fixed top-5 right-5 flex items-center justify-between gap-4 min-w-[320px] px-5 py-3 rounded-lg shadow-lg text-white ${success ? "bg-green-500" : "bg-red-500"
                }`}
        >
            <span>{message}</span>

            <button
                type="button"
                onClick={() => setShow(false)}
                className="text-white text-lg font-bold hover:opacity-70"
                aria-label="Close message"
            >
                &times;
            </button>
        </div>
    );
};
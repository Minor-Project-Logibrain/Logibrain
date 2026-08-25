import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedDriverRoutes() {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            console.log("🔥 checkDriver started");

            try {
                // Ensure local storage role is driver
                const role = localStorage.getItem("role");
                if (role !== "driver") {
                    throw new Error("User role is not driver");
                }

                console.log("🔥 Sending request to /auth/check");
                const res = await axios.get("http://localhost:8080/auth/check", {
                    withCredentials: true,
                });

                console.log("✅ Driver verified:", res.data);
                setVerified(true);
            } catch (err) {
                console.log("❌ checkDriver error:", err);
                setVerified(false);
            } finally {
                console.log("🔥 checkDriver finished");
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    return <Outlet />;
}

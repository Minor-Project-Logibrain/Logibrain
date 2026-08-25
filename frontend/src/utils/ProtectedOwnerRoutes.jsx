import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedOwnerRoutes() {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            console.log("🔥 checkUser started");

            try {
                console.log("🔥 Sending request to /user/check");

                const res = await axios.get("http://localhost:8080/auth/check", {
                    withCredentials: true,
                });

                console.log("✅ User verified:", res.data);

                setVerified(true);
            } catch (err) {
                console.log("❌ checkUser error:", err);
                setVerified(false);
            } finally {
                console.log("🔥 checkUser finished");
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (loading) {
        return <Loading size="large" fullScreen />;
    }

    if (!verified) {
        return <Navigate to="/ask-role" replace />;
    }

    return <Outlet />;
}
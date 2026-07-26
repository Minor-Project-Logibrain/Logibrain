import { useEffect, useState } from "react"

export default function useCooldown(time = 30) {
    const [cooldown, setCooldown] = useState(0);
    const [secondCooldown, setSecondCooldown] = useState(0);
    const [isFirstison, setIsFirstison] = useState(false);
    useEffect(() => {
        if (time < 0) return;
        const timer = setTimeout(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    useEffect(() => {
        if (secondCooldown < 0) return;
        const timer = setTimeout(() => {
            setSecondCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [secondCooldown]);

    const startCooldown = () => {
        setCooldown(time);

    };
    const startSecondCooldown = () => {
        setSecondCooldown(time);
    };
    return {
        isDisable: cooldown > 0,
        cooldown,
        startCooldown,
        secondCooldown,
        startSecondCooldown,
        issecondDisable: secondCooldown > 0,
    };
};
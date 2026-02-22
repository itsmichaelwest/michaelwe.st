import { useState, useEffect } from "react";

export function useWindowSize(): { w: number; h: number } {
    const [size, setSize] = useState({ w: 0, h: 0 });
    useEffect(() => {
        const update = () =>
            setSize({ w: window.innerWidth, h: window.innerHeight });
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return size;
}

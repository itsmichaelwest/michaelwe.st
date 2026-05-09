import { useState, useEffect } from "react";

export function useWindowSize(): { w: number; h: number } {
    // Starts at {0, 0} and updates after mount. Callers must guard against
    // the initial 0 values (or the parent should render a placeholder
    // until they resolve) — initializing from `window` here would cause
    // SSR hydration mismatches for any descendant whose layout depends on
    // {w, h}.
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

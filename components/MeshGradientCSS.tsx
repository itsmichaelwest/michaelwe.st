import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

export interface MeshPointCSS {
    id: string;
    x: number; // 0..1
    y: number; // 0..1
    color: string;
    radius: number; // relative in 0..1 where 1 == full width of box
}

interface MeshGradientCSSProps {
    className?: string;
    points: MeshPointCSS[];
    blur?: number; // CSS blur in px
    opacity?: number;
    editable?: boolean;
    showHandles?: boolean;
    onChange?: (points: MeshPointCSS[]) => void;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const MeshGradientCSS: React.FC<MeshGradientCSSProps> = ({
    className,
    points,
    blur = 40,
    opacity = 1,
    editable = false,
    showHandles = true,
    onChange,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [local, setLocal] = useState(points);
    const [dragId, setDragId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{
        dx: number;
        dy: number;
    } | null>(null);

    useEffect(() => setLocal(points), [points]);

    const backgroundImage = useMemo(() => {
        // Build comma-separated radial-gradients
        const layers = local.map((p) => {
            const px = Math.round(p.x * 1000) / 10;
            const py = Math.round(p.y * 1000) / 10;
            const rPercent = Math.max(8, Math.min(45, p.radius * 100));
            // Hard edge at 0%, fade to transparent by rPercent
            return `radial-gradient(circle at ${px}% ${py}%, ${p.color} 0%, rgba(0,0,0,0) ${rPercent}%)`;
        });
        return layers.join(", ");
    }, [local]);

    const startDrag = useCallback(
        (e: React.PointerEvent, id: string) => {
            if (!editable) return;
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const p = local.find((n) => n.id === id);
            if (!p) return;
            const currentX = rect.left + p.x * rect.width;
            const currentY = rect.top + p.y * rect.height;
            setDragId(id);
            setDragOffset({
                dx: e.clientX - currentX,
                dy: e.clientY - currentY,
            });
            (e.target as Element).setPointerCapture(e.pointerId);
        },
        [editable, local],
    );

    const onMove = useCallback(
        (e: React.PointerEvent) => {
            if (!editable || !dragId) return;
            const el = containerRef.current;
            if (!el || !dragOffset) return;
            const rect = el.getBoundingClientRect();
            const x = clamp01(
                (e.clientX - rect.left - dragOffset.dx) / rect.width,
            );
            const y = clamp01(
                (e.clientY - rect.top - dragOffset.dy) / rect.height,
            );
            setLocal((prev) =>
                prev.map((p) => (p.id === dragId ? { ...p, x, y } : p)),
            );
        },
        [editable, dragId, dragOffset],
    );

    const endDrag = useCallback(
        (e: React.PointerEvent) => {
            if (!editable) return;
            if (dragId) {
                setDragId(null);
                setDragOffset(null);
                onChange?.(local);
            }
            try {
                (e.target as Element).releasePointerCapture(e.pointerId);
            } catch {
                /* noop */
            }
        },
        [editable, dragId, local, onChange],
    );

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                backgroundImage,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                filter: `blur(${blur}px)`,
                opacity,
            }}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
        >
            {editable && showHandles && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {local.map((p, i) => (
                        <button
                            key={p.id}
                            style={{
                                position: "absolute",
                                left: `${p.x * 100}%`,
                                top: `${p.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                border: "2px solid #000",
                                background: "#fff",
                                cursor: "grab",
                                userSelect: "none",
                            }}
                            onPointerDown={(e) => startDrag(e, p.id)}
                            aria-label={`Gradient handle ${i + 1}`}
                            type="button"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeshGradientCSS;

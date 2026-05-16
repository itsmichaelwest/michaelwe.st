// Layout
export const GALLERY_H = 0.6;
export const GALLERY_PAD = 32;
export const RAIL_PAD = 16;
export const RAIL_GAP = 24;

// Spring configs. restDelta is tightened from motion's default (0.01) so
// the spring's auto-rest snap is sub-pixel — a 1% snap on a long
// rail-to-hero translation is visible (~5px on mobile), 0.001 keeps the
// final landing imperceptible.
export const MAIN_SPRING = {
    stiffness: 300,
    damping: 35,
    restDelta: 0.001,
};
export const PAGE_SPRING = {
    stiffness: 450,
    damping: 50,
    restDelta: 0.001,
};

// Drag thresholds
export const RUBBER_BAND_K = 0.5;
export const DRAG_DECAY = 0.96;

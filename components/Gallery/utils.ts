import { GALLERY_H, GALLERY_PAD, RAIL_PAD, RAIL_GAP } from "./constants";
import type { ItemData } from "./types";

export function itemFullW(items: ItemData[], i: number, vh: number) {
    return GALLERY_H * vh * items[i].aspect;
}

export function itemGalleryScale(items: ItemData[], i: number, vw: number, vh: number) {
    return Math.min(1, (vw - GALLERY_PAD * 2) / itemFullW(items, i, vh));
}

export function itemRailScale(items: ItemData[], i: number, containerH: number, vh: number) {
    return (items[i].railH * containerH) / (GALLERY_H * vh);
}

export function railItemW(items: ItemData[], i: number, containerH: number) {
    return items[i].aspect * items[i].railH * containerH;
}

export function railLeftOf(items: ItemData[], i: number, containerH: number) {
    let x = RAIL_PAD;
    for (let j = 0; j < i; j++) x += railItemW(items, j, containerH) + RAIL_GAP;
    return x;
}

export function totalRailW(items: ItemData[], containerH: number) {
    let total = RAIL_PAD * 2;
    for (let i = 0; i < items.length; i++) {
        total += railItemW(items, i, containerH);
        if (i < items.length - 1) total += RAIL_GAP;
    }
    return total;
}

export function maxRailScroll(items: ItemData[], containerH: number, containerW: number) {
    return Math.max(0, totalRailW(items, containerH) - containerW);
}

export interface Vector2 {
    x: number;
    y: number;
}

export function sub(a: Vector2, b: Vector2): Vector2 {
    return { x: a.x - b.x, y: a.y - b.y };
}

export function add(a: Vector2, b: Vector2): Vector2 {
    return { x: a.x + b.x, y: a.y + b.y };
}

export function scale(v: Vector2, s: number): Vector2 {
    return { x: v.x * s, y: v.y * s };
}

export function dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
}

export function lenSq(v: Vector2): number {
    return dot(v, v);
}

export function length(v: Vector2): number {
    return Math.sqrt(lenSq(v));
}

export function normalize(v: Vector2): Vector2 {
    const len = length(v);
    return { x: v.x / len, y: v.y / len };
}

export function min(a: Vector2, b: Vector2): Vector2 {
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) };
}

export function max(a: Vector2, b: Vector2): Vector2 {
    return { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) };
}

export function lerp2(a: Vector2, b: Vector2, t: number): Vector2 {
    return add(scale(a, 1 - t), scale(b, t));
}

export function rotate(v: Vector2, angle: number): Vector2 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

export function perpendicular(v: Vector2): Vector2 {
    return { x: -v.y, y: v.x };
}
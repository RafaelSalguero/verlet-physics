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

export function dot (a: Vector2, b: Vector2): number {
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
import { CircleCircleCollisionResponse, CircleCollisionResponse } from "./collision";
import { Line } from "./line.ts";
import { normalize, Vector2 } from "./vector2";
import { add, sub, dot, scale, length } from "./vector2";

/** Return the nearest point on the line segment ab to the point p
 */
export function nearestPointInLine(a: Vector2, b: Vector2, p: Vector2): { p: Vector2, t: number } {
    const ab = sub(b, a);
    const ap = sub(p, a);
    const t = Math.min(Math.max(dot(ap, ab) / dot(ab, ab), 0), 1);
    return { p: add(a, scale(ab, t)), t };
}

export type LineCollisionResponse = CircleCircleCollisionResponse;
export interface CircleLineCollisionResponse {
    circle: CircleCollisionResponse;
    line: LineCollisionResponse;
}


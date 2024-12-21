import { Circle } from "./circle";
import { sub, length, add, scale, normalize, Vector2 } from "./vector2";

/**
 * Returns null on no collision or the point of collision between the circles a and b.
 * @param a 
 * @param b 
 */
export function collideCircleCircleCheck(a: Circle, b: Circle): boolean {
    const ab = sub(b.center, a.center);
    const d = length(ab);
    return d <= a.radius + b.radius;
}

/** True if a circle contains a point */
export function collideCirclePoint(a:Circle, p:Vector2):boolean {
    return length(sub(a.center, p)) < a.radius;
}

interface CircleCircleCollisionResponse {
    aOffset: Vector2;
    bOffset: Vector2;
}

export function lerp2(a: Vector2, b: Vector2, t: number): Vector2 {
    return add(scale(a, 1 - t), scale(b, t));
}

export function collideCircleCircle(a: Circle,  b: Circle): CircleCircleCollisionResponse {
    // consider all circles of equal density
    const aMass = a.radius * a.radius;
    const bMass = b.radius * b.radius;

    const ab = sub(b.center, a.center);
    const d = length(ab);
    const n = normalize(ab);
    // total movement needed to separate the circles
    const mtd = scale(n, (a.radius + b.radius) - d);

    return {
        aOffset: scale(mtd, -bMass / (aMass + bMass)),
        bOffset: scale(mtd, aMass / (aMass + bMass))
    }
}
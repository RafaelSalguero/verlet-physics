import { Circle } from "../circle";
import { sub, length, add, scale, normalize, Vector2 } from "../vector2";

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
export function collideCirclePoint(a: Circle, p: Vector2): boolean {
    return length(sub(a.center, p)) < a.radius;
}

export interface CircleCollisionResponse {
    offset: Vector2;
}

export interface CircleCircleCollisionResponse {
    a: CircleCollisionResponse;
    b: CircleCollisionResponse;
}

export function applyCircleCircleCollision(a: Circle, b: Circle, response: CircleCircleCollisionResponse) {
    a.center = add(a.center, response.a.offset);
    b.center = add(b.center, response.b.offset);
}



export function collideCircleCircle(a: Circle, b: Circle): CircleCircleCollisionResponse {
    // consider all circles of equal density
    const aMass = a.radius * a.radius;
    const bMass = b.radius * b.radius;

    const ab = sub(b.center, a.center);
    const d = length(ab);
    const n = normalize(ab);
    // total movement needed to separate the circles
    const mtd = scale(n, (a.radius + b.radius) - d);

    return {
        a: {
            offset: scale(mtd, -bMass / (aMass + bMass)),
        },
        b: {
            offset: scale(mtd, aMass / (aMass + bMass))
        }
    }
}


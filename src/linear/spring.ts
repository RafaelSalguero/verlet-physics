import { Particle } from "./circle";
import { CircleCircleCollisionResponse } from "./collision";
import { add, sub, length, scale } from "./vector2";
export interface Spring {
    distance: number;
    a: Particle;
    b: Particle;
}

/** Ensure that the distance between a and b is equal to the spring distance: */
export function solveSpring( s: Spring): CircleCircleCollisionResponse {
    const { a, b} = s;
    const aMass = a.radius * a.radius;
    const bMass = b.radius * b.radius;

    const ab = sub(b.center, a.center);
    const d = length(ab);
    
    const delta = d - s.distance;
    const totalOffset = scale(ab, delta / d);

    const aOffset = scale(totalOffset, bMass / (aMass + bMass));
    const bOffset = scale(totalOffset, - aMass / (aMass + bMass));

    return {
        aOffset,
        bOffset
    }
}
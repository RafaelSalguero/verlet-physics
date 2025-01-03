import { Particle } from "./circle";
import { CircleCircleCollisionResponse } from "./collision";
import { calcMassRatio } from "./collision/util";
import { add, sub, length, scale } from "./vector2";
export interface Spring {
  distance: number;
  a: Particle;
  b: Particle;
}

/** Ensure that the distance between a and b is equal to the spring distance: */
export function solveSpring(s: Spring): CircleCircleCollisionResponse {
  const { a, b } = s;
  const aMass = a.fixed ? Number.POSITIVE_INFINITY : a.radius * a.radius;
  const bMass = b.fixed ? Number.POSITIVE_INFINITY : b.radius * b.radius;

  const ab = sub(b.center, a.center);
  const d = length(ab);

  const delta = d - Math.max(s.distance, a.radius + b.radius);
  const totalOffset = scale(ab, delta / Math.max(d, 0.001)); // avoid division by zero

  const aOffset = scale(totalOffset, calcMassRatio(bMass, aMass));
  const bOffset = scale(totalOffset, - calcMassRatio(aMass, bMass));

  return {
    a: {
      offset: aOffset,
    }, b: {
      offset: bOffset
    }
  }
}

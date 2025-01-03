import { Circle } from "../circle";
import { sub, length, add, scale, normalize, Vector2 } from "../vector2";
import { calcMassRatio } from "./util";

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

export function applyCircleCollision(a: Circle, response: CircleCollisionResponse) {
  a.center = add(a.center, response.offset);
}

export function applyCircleCircleCollision(a: Circle, b: Circle, response: CircleCircleCollisionResponse) {
  applyCircleCollision(a, response.a);
  applyCircleCollision(b, response.b);
}



export function collideCircleCircle(a: Circle, b: Circle): CircleCircleCollisionResponse {
  // consider all circles of equal density
  const aMass = a.fixed ? Number.POSITIVE_INFINITY : a.radius * a.radius;
  const bMass = b.fixed ? Number.POSITIVE_INFINITY : b.radius * b.radius;

  const ab = sub(b.center, a.center);
  const d = length(ab);
  const n = normalize(ab);
  // total movement needed to separate the circles
  const mtd = scale(n, (a.radius + b.radius) - d);

  return {
    a: {
      offset: scale(mtd, -calcMassRatio(aMass, bMass)),
    },
    b: {
      offset: scale(mtd, calcMassRatio(bMass, aMass)),
    }
  }
}


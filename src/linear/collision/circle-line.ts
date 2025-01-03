import { Circle } from "../circle.ts";
import { dragLine, Line } from "../line.ts";
import { normalize, Vector2, zero2 } from "../vector2";
import { add, sub, dot, scale, length } from "../vector2";
import { applyCircleCollision, CircleCircleCollisionResponse, CircleCollisionResponse } from "./circle-circle.ts";
import { calcMassRatio } from "./util.ts";

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

interface LineOfCircles {
  a: Circle;
  b: Circle;
}

export function applyCircleLineCollision(circle: Circle, line: LineOfCircles, response: CircleLineCollisionResponse) {
  applyCircleCollision(circle, response.circle);
  applyCircleCollision(line.a, response.line.a);
  applyCircleCollision(line.b, response.line.b);
}

export function circleLineCollision(circle: Circle, line: LineOfCircles): CircleLineCollisionResponse | null {
  // determines the proportion of movement to apply to the circle and the line:
  const circleMass = circle.fixed ? Number.POSITIVE_INFINITY : circle.radius * circle.radius;
  const lineMass = (
    line.a.fixed && line.b.fixed
  ) ? Number.POSITIVE_INFINITY : (line.a.radius * line.a.radius + line.b.radius * line.b.radius);

  const { p, t } = nearestPointInLine(line.a.center, line.b.center, circle.center);
  const lineWidth = 10; // we consider that all lines have the same width
  const distance = length(sub(p, circle.center));

  if (distance > circle.radius + lineWidth) {
    // no response:
    return null;
  }

  // calculate the penetration vector:
  const n = normalize(sub(circle.center, p));
  const pv = scale(n, circle.radius + lineWidth - distance);

  // the line and circles will move inversely to their mass:
  const lineOffset = scale(pv, -calcMassRatio(lineMass, circleMass));
  const circleOffset = scale(pv, calcMassRatio(circleMass, lineMass));

  const newLine = dragLine({
    a: line.a.center,
    b: line.b.center
  }, t, add(p, lineOffset));

  return {
    line: {
      a: { offset: line.a.fixed ? zero2 : sub(newLine.a, line.a.center) },
      b: { offset: line.b.fixed ? zero2 : sub(newLine.b, line.b.center) }
    },
    circle: { offset: circleOffset }
  }
}

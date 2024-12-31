import { add, scale, sub, Vector2, length, normalize, dot } from "./vector2";

export interface Line {
    a: Vector2;
    b: Vector2;
}

/**
 * "Grabs" a line segment at a given t parameter where 0 is at 1 and 1 is at b
 * and moves that point to p while maintaining the length of the line segment.
 */
export function dragLine(line: Line, t: number, p: Vector2): Line {
    let { a, b } = line;
    const originalLength = length(sub(b, a));
    // o is the original point at t
    const o = add(a, scale(sub(b, a), t));

    // delta is the difference between the original point and the new point
    const delta = sub(p, o);

    // Split delta onto 2 components, one parallel to ab and one perpendicular to ab:
    const ab = sub(b, a);
    const abn = normalize(ab);
    const d = dot(delta, abn);
    // Delta parallel to ab
    const dp = scale(abn, d);
    // Delta perpendicular to ab
    const dq = sub(delta, dp);

    // Move the line by the parallel component
    a = add(a, dp);
    b = add(b, dp);

    // Translate the line by the perpendicular component, depending on how far we are from the center
    const fromCenterDistance = (t - 0.5) * 2;
    const translateRotateRatio = 1 - fromCenterDistance * fromCenterDistance;
    a = add(a, scale(dq, translateRotateRatio));
    b = add(b, scale(dq, translateRotateRatio));

    // Rotate the line by moving the points in opposite directions along the perpendicular component
    b = add(b, scale(dq, fromCenterDistance));
    a = add(a, scale(dq, -fromCenterDistance));

    // Correct the lenght, with center at t
    const newLength = length(sub(b, a));
    const lenCorrection = scale(normalize(ab), (newLength - originalLength));
    a = add(a, scale(lenCorrection, t));
    b = sub(b, scale(lenCorrection, 1 - t));

    return { a, b };
}
import { Circle } from "./circle";
import { Vector2, min, max, sub, add } from "./vector2";
export interface Box2 {
    min: Vector2;
    max: Vector2;
}

/** Shink a box from all sides a given amount */
export function shrinkBox2(box: Box2, amount: number): Box2 { 
    return {
        min: add(box.min, { x: amount, y: amount }),
        max: sub(box.max, { x: amount, y: amount })
    }
}

/** Returns the offset of the collision response between a point and an immovable container  */
export function collidePointContainer(point: Vector2, container: Box2): Vector2 {
    return sub(min(max(point, container.min), container.max), point);
}

export function collideCircleContainer(circle: Circle, container: Box2): Vector2 {
    return collidePointContainer(circle.center, shrinkBox2(container, circle.radius));
}
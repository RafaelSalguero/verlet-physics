import { range } from "lodash";
import { Box2 } from "./linear/box2";
import { Circle, Particle } from "./linear/circle";
import { Spring } from "./linear/spring";
import { sub, length } from "./linear/vector2";

export interface World {
    circles: Particle[];
    springs: Spring[];
}

export function initRandomWorld(canvas: Box2): World {
    const size = sub(canvas.max, canvas.min);
    return {
        circles: range(10).map<Circle>(x => ({
            center: { x: Math.random() * size.x, y: Math.random() * size.y },
            radius: 10 + Math.random() * 100
        })).map(circle => ({ ...circle, oldCenter: circle.center })),
        springs: []
    }
};

export function initLineTestWorld(canvas: Box2): World {
    const circles = [
        {
            center: { x: 100, y: 100 },
        },
        {
            center: { x: 400, y: 100 },
        }
    ].map(circle => ({ ...circle, radius: 10, oldCenter: circle.center }));
    return {
        circles: circles,
        springs: [
            {
                a: circles[0],
                b: circles[1],
                distance: length(sub(circles[0].center, circles[1].center))
            }
        ]
    }
}

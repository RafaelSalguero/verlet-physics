import { Vector2, add, sub, scale } from "./vector2";

export interface Circle {
    center: Vector2;
    radius: number; 
}

export interface Particle extends Circle {
    oldCenter: Vector2;
}

export function verletIntegrate(p: Particle, a: Vector2, dt: number) {
    const velocity = sub(p.center, p.oldCenter);
    p.oldCenter = p.center;
    p.center = add(p.center, add(velocity, scale(a, dt * dt)));
}
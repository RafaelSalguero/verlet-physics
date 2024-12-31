import { Circle } from "./linear/circle";
import { Vector2 } from "./linear/vector2";

export function drawCircle(ctx: CanvasRenderingContext2D, c: Circle, strokeStyle: string = "#4800ff", fillStyle: string = "#8c3bfe60", lineWidth: number = 2) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.ellipse(c.center.x, c.center.y, c.radius, c.radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

export function drawLine(ctx: CanvasRenderingContext2D, a: Vector2, b: Vector2, strokeStyle: string = "#ff5500", lineWidth: number = 2) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}

export function drawPoint(ctx: CanvasRenderingContext2D, p: Vector2, strokeStyle: string, fillStyle: string, lineWidth: number = 2) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    ctx.strokeRect(p.x - 2, p.y - 2, 4, 4);
}
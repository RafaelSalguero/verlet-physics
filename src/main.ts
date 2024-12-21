import { drawCircle, drawLine, drawPoint } from "./draw";
import { Box2, collideCircleContainer } from "./linear/box2";
import { Circle, Particle, verletIntegrate } from "./linear/circle";
import { applyCircleCircleCollision, collideCircleCircle, collideCircleCircleCheck, collideCirclePoint } from "./linear/collision";
import { add, length, sub } from "./linear/vector2";
import { range } from "lodash";
import "./style.css";
import { solveSpring, Spring } from "./linear/spring";


const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
export function gameLoop() {
    const circles: Particle[] = (range(10).map<Circle>(x => ({
        center: { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
        radius: 10 + Math.random() * 100

    }))).map<Particle>(circle => ({ ...circle, oldCenter: circle.center }));

    let springs: Spring[] = [];

    let selectedCircle: Particle | null = null;
    let dragging = false;
    let offset = { x: 0, y: 0 };
    let shiftPressed = false;
    let paused = false;


    //select a circle on mouse down
    addEventListener("mousedown", e => {
        const mouse = { x: e.offsetX, y: e.offsetY };
        for (const circle of circles) {
            if (collideCirclePoint(circle, mouse)) {
                if (shiftPressed && selectedCircle) {
                    if (springs.some(spring => spring.a === selectedCircle && spring.b === circle)) {
                        springs = springs.filter(spring => spring.a !== selectedCircle || spring.b !== circle);
                    } else {
                        springs.push({ a: selectedCircle, b: circle, distance: length(sub(selectedCircle.center, circle.center)) });
                    }
                }
                selectedCircle = circle;
                dragging = true;
                offset = { x: mouse.x - circle.center.x, y: mouse.y - circle.center.y };
            }
        }
    });

    //deselect a circle on mouse up
    addEventListener("mouseup", e => {
        dragging = false;
    });

    //move the circle on mouse move
    addEventListener("mousemove", e => {
        if (dragging && selectedCircle) {
            selectedCircle.oldCenter = selectedCircle.center;
            selectedCircle.center = { x: e.offsetX - offset.x, y: e.offsetY - offset.y };
         }
    });

    addEventListener("keydown", e => {
        if (e.key === " ") {
            paused = !paused;
        }
        if (e.key === "Shift") {
            shiftPressed = true;
        }
    });

    addEventListener("keyup", e => {
        if (e.key === "Shift") {
            shiftPressed = false;
        }
    });


    function iteration() {
        // fill a white rectangle to clear all:
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        // draw a circle in the middle of the screen:
        ctx.fillStyle = "#8c3bfe60";

        // set stroke width and color;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#4800ff";

        for (const circle of circles) {
            if (selectedCircle === circle) {
                ctx.strokeStyle = "#ff0000";
            } else {
                ctx.strokeStyle = "#4800ff";
            }
            drawCircle(ctx, circle);
        }

        for (const spring of springs) {
            ctx.strokeStyle = "#ff55 00";
            ctx.lineWidth = 2;
            drawLine(ctx, spring.a.center, spring.b.center);
        }

        const container: Box2 = {
            min: { x: 0, y: 0 },
            max: { x: canvas.width, y: canvas.height }
        }

        // circle circle collisions:
        if (!paused) {
            for (const s of springs) {
                applyCircleCircleCollision(s.a, s.b, solveSpring(s));
            }
            for (let i = 0; i < circles.length; i++) {
                if (selectedCircle !== circles[i] || !dragging) {
                    verletIntegrate(circles[i], { x: 0, y: 1 }, 1);
                }

                for (let j = i + 1; j < circles.length; j++) {
                    const circle1 = circles[i];
                    const circle2 = circles[j];

                    const collide = collideCircleCircleCheck(circle1, circle2);
                    if (collide) {
                        const response = collideCircleCircle(circle1, circle2);
                        applyCircleCircleCollision(circle1, circle2, response);
                    }
                }

                // circle container collisions:
                circles[i].center = add(circles[i].center, collideCircleContainer(circles[i], container));
            }
        }



        requestAnimationFrame(iteration);
    }

    requestAnimationFrame(iteration);
}

gameLoop();

import { drawCircle, drawPoint } from "./draw";
import { Box2, collideCircleContainer } from "./linear/box2";
import { Circle, Particle, verletIntegrate } from "./linear/circle";
import { collideCircleCircle, collideCircleCircleCheck, collideCirclePoint } from "./linear/collision";
import { add } from "./linear/vector2";
import { range } from "lodash";
import "./style.css";


const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
export function gameLoop() {
    const circles: Particle[] = (range(10).map<Circle>(x => ({
        center: { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
        radius: 10 + Math.random() * 100

    }))).map<Particle>(circle => ({ ...circle, oldCenter: circle.center }));

    let selectedCircle: Particle | null = null;
    let dragging = false;
    let offset = { x: 0, y: 0 };

    let paused = false;

    //select a circle on mouse down
    addEventListener("mousedown", e => {
        const mouse = { x: e.offsetX, y: e.offsetY };
        for (const circle of circles) {
            if (collideCirclePoint(circle, mouse)) {
                selectedCircle = circle;
                dragging = true;
                offset = { x: mouse.x - circle.center.x, y: mouse.y - circle.center.y };
            }
        }
    });

    //deselect a circle on mouse up
    addEventListener("mouseup", e => {
        dragging = false;
        selectedCircle = null;
    });

    //move the circle on mouse move
    addEventListener("mousemove", e => {
        if (dragging && selectedCircle) {
            selectedCircle.center = { x: e.offsetX - offset.x, y: e.offsetY - offset.y };
            if(paused) {
                selectedCircle.oldCenter = selectedCircle.center;
            }
        }
    });

    addEventListener("keydown", e => {
        if (e.key === " ") {
            paused = !paused;
        }
    });


    function iteration() {
        // fill a white rectangle to clear all:
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        
        // draw a circle in the middle of the screen:
        ctx.fillStyle ="#8c3bfe60";
    
        // set stroke width and color;
        ctx.lineWidth = 5;
        ctx.strokeStyle ="#4800ff";
    
        for (const circle of circles) {
            if (selectedCircle === circle) {
                ctx.strokeStyle = "#ff0000";
            } else {
                ctx.strokeStyle = "#4800ff";
            }
            drawCircle(ctx, circle);
        }

        const container: Box2 = { 
            min: { x: 0, y: 0 },
            max: { x: canvas.width, y: canvas.height }
        }

        // circle circle collisions:
        if(!paused) {
        for (let i = 0; i < circles.length; i++) {
            verletIntegrate(circles[i], { x: 0, y: 1 }, 1);

            for (let j = i + 1; j < circles.length; j++) {
                const circle1 = circles[i];
                const circle2 = circles[j];
                
                const collide = collideCircleCircleCheck(circle1, circle2);
                if(collide) {
                    const response = collideCircleCircle(circle1, circle2);
                    circle1.center = add (circle1.center, response.aOffset);
                    circle2.center = add (circle2.center, response.bOffset);
                }
            }

            // circle container collisions:
            circles[i].center =  add(circles[i].center, collideCircleContainer(circles[i], container));
        }
    }
        

    
        requestAnimationFrame(iteration);
    }
    
    requestAnimationFrame(iteration);
}

gameLoop();

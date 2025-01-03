import { drawCircle, drawLine, drawPoint } from "./draw";
import { Box2, collideCircleContainer } from "./linear/box2";
import { Circle, Particle, verletIntegrate } from "./linear/circle";
import { applyCircleCircleCollision, collideCircleCircle, collideCircleCircleCheck, collideCirclePoint } from "./linear/collision";
import { add, length, sub, Vector2 } from "./linear/vector2";
import { range } from "lodash";
import "./style.css";
import { solveSpring, Spring } from "./linear/spring";
import { nearestPointInLine } from "./linear/collision/circle-line";
import { initLineTestWorld, initRandomWorld, World } from "./world";
import { dragLine } from "./linear/line";
import { applyCircleLineCollision, circleLineCollision } from "./linear/collision/circle-line";

interface SelectedLine {
  spring: Spring;
  t: number;
}

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
export function gameLoop() {
  let { circles, springs } = initLineTestWorld({
    min: { x: 0, y: 0 },
    max: { x: canvas.width, y: canvas.height }
  });

  let selectedLine: SelectedLine | null = null;
  let selectedCircle: Particle | null = null;
  let dragging = false;
  let offset = { x: 0, y: 0 };
  let shiftPressed = false;
  let paused = false;
  let mouseDownPos: Vector2 = { x: 0, y: 0 };
  let mousePos: Vector2 = { x: 0, y: 0 };

  //select a circle on mouse down
  canvas.addEventListener("mousedown", e => {
    const mouse = { x: e.offsetX, y: e.offsetY };
    mouseDownPos = mouse;
    const lastSelectedCircle = selectedCircle;
    selectedCircle = null;
    selectedLine = null;

    dragging = true;
    for (const circle of circles) {
      if (collideCirclePoint(circle, mouse)) {
        // right click to delete
        if (e.button === 2) {
          circles.splice(circles.indexOf(circle), 1);
          springs = springs.filter(spring => spring.a !== circle && spring.b !== circle);
          dragging = false;
          return;
        }
        if (shiftPressed && lastSelectedCircle) {
          if (springs.some(spring => spring.a === selectedCircle && spring.b === circle)) {
            springs = springs.filter(spring => spring.a !== selectedCircle || spring.b !== circle);
          } else {
            springs.push({ a: lastSelectedCircle, b: circle, distance: length(sub(lastSelectedCircle.center, circle.center)) });
          }
        }
        selectedCircle = circle;
        offset = { x: mouse.x - circle.center.x, y: mouse.y - circle.center.y };
      }
    }

    if (selectedCircle == null) {
      for (const spring of springs) {
        const nearestPointPT = nearestPointInLine(spring.a.center, spring.b.center, mouse);
        const nearestPoint = nearestPointPT.p;

        const len = length(sub(nearestPoint, mouse));
        if (len < 10) {
          selectedLine = { spring, t: nearestPointPT.t };
          offset = { x: mouse.x - nearestPoint.x, y: mouse.y - nearestPoint.y };
        }
      }
    }

    if (selectedCircle == null && selectedLine == null) {
      circles.push({
        center: mouse,
        radius: 10,
        oldCenter: mouse
      })
    }
  });

  //deselect a circle on mouse up
  canvas.addEventListener("mouseup", e => {
    dragging = false;
  });

  //move the circle on mouse move
  canvas.addEventListener("mousemove", e => {
    mousePos = { x: e.offsetX, y: e.offsetY };


  });

  addEventListener("keydown", e => {
    if (e.key === " ") {
      paused = !paused;
    }
    if (e.key === "Shift") {
      shiftPressed = true;
    }
    // R to delete all:
    if (e.key === "r") {
      circles.length = 0;
      springs.length = 0;
    }

    if (e.key === "f" && selectedCircle) {
      selectedCircle.fixed = !selectedCircle.fixed;
    }
  });

  addEventListener("keyup", e => {
    if (e.key === "Shift") {
      shiftPressed = false;
    }
  });

  const container: Box2 = {
    min: { x: 0, y: 0 },
    max: { x: canvas.width, y: canvas.height }
  }


  function render() {
    // fill a white rectangle to clear all:
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // set stroke width and color;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#4800ff";

    for (const circle of circles) {
      drawCircle(ctx, circle,
        selectedCircle === circle ? "#ff0000" :
          collideCirclePoint(circle, mousePos) ? "#006040" : "#4800ff",
        collideCirclePoint(circle, mousePos) ? "#00604060" :
          circle.fixed ? "#8c430060" :
            "#8c3bfe60"
      );
    }

    for (const spring of springs) {
      drawLine(ctx, spring.a.center, spring.b.center, "#8c3bfe60", 20);

      const nearestPoint = nearestPointInLine(spring.a.center, spring.b.center, mousePos).p;
      const len = length(sub(nearestPoint, mousePos));
      if (len < 10) {
        drawPoint(ctx, nearestPoint, "#ff0000", "#ff0000");
      }
    }
  }

  function simulate() {
    for (const s of springs) {
      applyCircleCircleCollision(s.a, s.b, solveSpring(s));
    }
    for (let i = 0; i < circles.length; i++) {
      if ((selectedCircle !== circles[i] || !dragging) && !circles[i].fixed) {
        verletIntegrate(circles[i], { x: 0, y: 1 }, 0.7);
      }

      // circle-circle collisions:
      for (let j = i + 1; j < circles.length; j++) {
        const circle1 = circles[i];
        const circle2 = circles[j];

        const collide = collideCircleCircleCheck(circle1, circle2);
        if (collide) {
          const response = collideCircleCircle(circle1, circle2);
          applyCircleCircleCollision(circle1, circle2, response);
        }
      }

      // circle-line collisions:
      for (const spring of springs) {
        // do not collide with itself:
        if (spring.a === circles[i] || spring.b === circles[i]) {
          continue;
        }

        const response = circleLineCollision(circles[i], spring);

        if (response) {
          applyCircleLineCollision(circles[i], spring, response);
        }
      }

      // circle container collisions:
      circles[i].center = add(circles[i].center, collideCircleContainer(circles[i], container));

    }
  }

  function mouseMoveEvent() {
    if (dragging && selectedCircle) {
      selectedCircle.oldCenter = selectedCircle.center;
      selectedCircle.center = mousePos;
    } else if (dragging && selectedLine) {

      const newLine = dragLine({
        a: selectedLine.spring.a.center,
        b: selectedLine.spring.b.center,
      }, selectedLine.t, mousePos);

      if (paused) {
        selectedLine.spring.a.oldCenter = selectedLine.spring.a.center;
        selectedLine.spring.b.oldCenter = selectedLine.spring.b.center;
      }

      selectedLine.spring.a.center = newLine.a;
      selectedLine.spring.b.center = newLine.b;
    } else if (dragging) {
      circles[circles.length - 1].radius = Math.max(length(sub(mouseDownPos, mousePos)), 10);
    }
  }

  function iteration() {
    // circle circle collisions:
    if (!paused) {
      simulate();
    }
    mouseMoveEvent();
    render();


    requestAnimationFrame(iteration);
  }

  requestAnimationFrame(iteration);
}

gameLoop();

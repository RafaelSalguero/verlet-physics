import "./style.css";


const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
export function iteration() {
    // fill a white rectangle to clear all:
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    // draw a circle in the middle of the screen:
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 50, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(iteration);
}

requestAnimationFrame(iteration);
var DEBUG = false;

{
    
/*
    Bot voor het Chrome T-Rex Offline spelletje
    met "dezelfde" invoer en uitvoer als een menselijke speler.
    
    Veel betere implementatie mogelijk.
    - Deftige pixel-functies
    - Robustere strategie
    - Geen eigen timer gebruiken, maar adhv canvas snelheid bepalen!
*/

let canvasTarget = document.getElementsByTagName("canvas")[0];
let ctxTarget = canvasTarget.getContext("2d");

let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "absolute";
//canvas.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
canvas.style.zIndex = 1000;
canvas.style.pointerEvents = "none";
let ctx = canvas.getContext("2d");

let fps = 30;

setTimeout(function () {
    setInterval(loop, 1000/fps);
    jump();
}, 100);

let dx = 0;
let jumpTimer = 0;
let jumping = false;
let ducking = false;

function loop() {
    let pixels = ctxTarget.getImageData(0, 0, canvasTarget.width, canvasTarget.height).data;
    canvas.width = canvasTarget.width;
    canvas.height = canvasTarget.height;
    let rect = canvasTarget.getBoundingClientRect();
    canvas.style.left = (rect.left + scrollX) + "px";
    canvas.style.top = (rect.top + scrollY) + "px";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let w = canvasTarget.width;
    let h = canvasTarget.height;
    let x = Math.floor(150 + dx);
    let y = 120;
    
    let xx = x;
    let skyX = 125 + 10;
    let skyY = 88;
    let limit = w - 270;
    
    if (x < limit) {
        dx += 0.08;
    }
    
    jumping = !isPixel(pixels, 40, 120);
    if (DEBUG) {
        ctx.fillStyle = "orange";
        ctx.fillRect(40, 120, 3, 3);
    }
    
    let ducked = false;
    let found = false;
    for (let i = 0; i < 50; i++) {
        if (isPixel(pixels, skyX - i, skyY)) {
            skyX -= i;
            found = true;
            break;
        }
    }
    if (found && !jumping && !pixelInsideBox(pixels, skyX, skyY + 20, 30, 10)) {
        duck(250);
        ducked = true;
    }
    
    if (!ducked) {
        found = false;
        for (let i = 0; i < 60 + dx; i++) {
            if (isPixel(pixels, x - i, y)) {
                x -= i;
                found = true;
                break;
            }
        } 
        if (found) {
            let counter = 0;
            for (let i = 0; i < 200; i++) {
                if (isPixel(pixels, x + i, y)) {
                    xx = x + i;
                    counter = 0;
                } else if (counter < 30) {
                    counter += 1;
                } else {
                    break;
                }
            }
            
            if (xx < 160 + dx) {
                jumpTimer = 0;
                jump();
                //console.log("jump!");
            }
        }
    }
    
    jumpTimer += 1;
    if (jumpTimer === Math.floor(fps / 4)) {
        //console.log("duck!");
        duck(70);
    }
    
    if (DEBUG) {
        ctx.fillStyle = "lime";
        ctx.fillRect(x - dx - 1, y - 1, 2, 2);
        
        ctx.fillStyle = "red";
        ctx.fillRect(x - 1, y - 1, 2, 2);
        
        ctx.fillStyle = "blue";
        ctx.fillRect(xx - 1, y - 1, 2, 2);
        
        ctx.fillStyle = "fuchsia";
        ctx.fillRect(skyX - 1, skyY - 1, 2, 2);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
        ctx.strokeRect(skyX, skyY + 20, 30, 10);
        
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(limit, 0);
        ctx.lineTo(limit, w);
        ctx.stroke();
    }
}

function isPixel(pixels, x, y) {
    let index = (x + y * canvasTarget.width) * 4;
    return pixels[index + 3] > 200;
}

function pixelInsideBox(pixels, x, y, w, h) {
    for (let yy = y; yy < y + h; yy++) {
        for (let xx = x; xx < x + w; xx++) {
            let index = (xx + yy * w) * 4;
            if (pixels[index + 3] > 1) {
                return true;
            }
        }
    }
    return false;
}

function jump() {
    let event = new KeyboardEvent("keydown",
        {
            key: " ",
            code: "32",
            charCode: 32,
            keyCode: 32,
            which: 32
        }
    );
    document.dispatchEvent(event);
    
    setTimeout(function () {
        let event = new KeyboardEvent("keyup",
            {
                key: " ",
                code: "32",
                charCode: 32,
                keyCode: 32,
                which: 32
            }
        );
        document.dispatchEvent(event);
    }, 200);
}

function duck(duration) {
    let event = new KeyboardEvent("keydown",
        {
            key: "ArrowDown",
            code: "40",
            charCode: 40,
            keyCode: 40,
            which: 40
        }
    );
    document.dispatchEvent(event);
    
    setTimeout(function () {
        let event = new KeyboardEvent("keyup",
            {
                key: "ArrowDown",
                code: "40",
                charCode: 40,
                keyCode: 40,
                which: 40
            }
        );
        document.dispatchEvent(event);
    }, duration);
}

}
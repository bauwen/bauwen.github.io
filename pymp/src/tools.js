function gotoLevel(lvl) {
    switch ((lvl - 1) % 9 + 1) {
        case 1:
            backcolTarget = whiteMode ? {r: 240, g: 240, b: 240} : {r: 40, g: 40, b: 40};
            flashcolTarget = {r: 90, g: 90, b: 90};
            sidecolTarget = {r: 140, g: 140, b: 40};
            solidcolTarget = {r: 200, g: 40, b: 40};
            coincolTarget = {r: 200, g: 180, b: 40};
            playercolTarget = {r: 220, g: 140, b: 60};
            linecolTarget = {r: 200, g: 200, b: 200};
            flashalphaTarget = 0;
            sidealphaTarget = 0;
            break;
            
        case 2:
            // BLACK & WHITE
            
            backcolTarget = {r: 0, g: 0, b: 0};
            flashcolTarget = {r: 90, g: 90, b: 90};
            sidecolTarget = {r: 140, g: 140, b: 40};
            solidcolTarget = {r: 220, g: 220, b: 220};
            coincolTarget = {r: 220, g: 220, b: 220};
            playercolTarget = {r: 220, g: 220, b: 220};
            linecolTarget = {r: 220, g: 220, b: 220};
            flashalphaTarget = 1;
            sidealphaTarget = 0;
            flashType = collectMode ? 1 : 2;
            break;
            
        case 3:
            // LONGER SQUARES
            
            backcolTarget = {r: 180, g: 180, b: 40};
            flashcolTarget = {r: 40, g: 40, b: 180};
            sidecolTarget = {r: 40, g: 40, b: 180};
            solidcolTarget = {r: 40, g: 40, b: 180};
            coincolTarget = {r: 200, g: 40, b: 40};
            playercolTarget = {r: 40, g: 40, b: 180};//{r: 200, g: 40, b: 40};
            linecolTarget = {r: 40, g: 40, b: 180};
            flashalphaTarget = 0;
            sidealphaTarget = 1;
            flashType = 0;
            
            longSquare = true;
            break;
            
        case 4:
            // OSCILLATION
            
            backcolTarget = {r: 128, g: 128, b: 128};
            flashcolTarget = {r: 90, g: 90, b: 90};
            sidecolTarget = {r: 140, g: 140, b: 140};
            solidcolTarget = {r: 200, g: 200, b: 200};
            coincolTarget = {r: 40, g: 40, b: 40};
            playercolTarget = {r: 140, g: 140, b: 140};
            linecolTarget = {r: 40, g: 40, b: 40};
            flashalphaTarget = 1;
            sidealphaTarget = 1;
            flashType = 0;
            
            oscillation = true;
            break;
            
        case 5:
            // UPSIDE DOWN
            
            backcolTarget = {r: 160, g: 60, b: 60};
            flashcolTarget = {r: 90, g: 90, b: 90};
            sidecolTarget = {r: 100, g: 140, b: 140};
            solidcolTarget = {r: 160, g: 200, b: 200};
            coincolTarget = {r: 240, g: 240, b: 240};
            playercolTarget = {r: 140, g: 140, b: 140};
            linecolTarget = {r: 40, g: 40, b: 40};
            flashalphaTarget = 0;
            sidealphaTarget = 1;
            flashType = 1;
            
            upsideDown = true;
            sideNumber = 3;
            break;
            
        case 6:
            // GRAYSHIFT
            
            backcolTarget = {r: 0, g: 0, b: 0};
            flashcolTarget = {r: 220, g: 220, b: 220};
            sidecolTarget = {r: 220, g: 220, b: 220};
            solidcolTarget = {r: 220, g: 220, b: 220};
            coincolTarget = {r: 220, g: 220, b: 220};
            playercolTarget = {r: 220, g: 220, b: 220};
            linecolTarget = {r: 220, g: 220, b: 220};
            flashalphaTarget = 0;
            sidealphaTarget = 0;
            flashType = 0;
            
            grayShift = true;
            backForth = true;
            break;
            
        case 7:
            // PAUSE
            
            /*
            backcolTarget = {r: 0, g: 230, b: 0};
            flashcolTarget = {r: 220, g: 220, b: 220};
            sidecolTarget = {r: 220, g: 220, b: 220};
            solidcolTarget = {r: 230, g: 0, b: 230};
            coincolTarget = {r: 230, g: 0, b: 0};
            playercolTarget = {r: 0, g: 0, b: 220};
            linecolTarget = {r: 230, g: 0, b: 230};
            flashalphaTarget = 0;
            sidealphaTarget = 0;
            flashType = 1;*/
            
            backcolTarget = {r: 0, g: 255, b: 0};
            flashcolTarget = {r: 220, g: 220, b: 220};
            sidecolTarget = {r: 220, g: 220, b: 220};
            solidcolTarget = {r: 220, g: 220, b: 220};
            coincolTarget = {r: 220, g: 220, b: 220};
            playercolTarget = {r: 220, g: 220, b: 220};
            linecolTarget = {r: 220, g: 220, b: 220};
            flashalphaTarget = 1;
            sidealphaTarget = 1;
            flashType = 2;
            
            hueNess = true;
            sideNumber = 10;
            break;
            
        case 8:
            // HUE CRAZINESS
            
            backcolTarget = {r: 0, g: 255, b: 0};
            flashcolTarget = {r: 220, g: 220, b: 220};
            sidecolTarget = {r: 220, g: 220, b: 220};
            solidcolTarget = {r: 220, g: 220, b: 220};
            coincolTarget = {r: 220, g: 220, b: 220};
            playercolTarget = {r: 220, g: 220, b: 220};
            linecolTarget = {r: 220, g: 220, b: 220};
            flashalphaTarget = 1;
            sidealphaTarget = 1;
            flashType = 1;
            
            backForth = true;
            oscillation = true;
            hueNess = true;
            sideNumber = 10;
            break;
            
        case 9:
            // NO DANGER
            
            backcolTarget = {r: 128, g: 128, b: 128};
            flashcolTarget = {r: 90, g: 90, b: 90};
            sidecolTarget = {r: 140, g: 140, b: 140};
            solidcolTarget = {r: 200, g: 200, b: 200};
            coincolTarget = {r: 40, g: 40, b: 40};
            playercolTarget = {r: 140, g: 140, b: 140};
            linecolTarget = {r: 40, g: 40, b: 40};
            flashalphaTarget = 1;
            sidealphaTarget = 1;
            flashType = 0;
            
            noDanger = true;
            break;
    }
}

function getCoinTotal(lvl) {
    if (collectMode) {
        return 15;
    }
    
    lvl = (lvl - 1) % 9 + 1;
    return lvl === 9 ? 3 : (lvl === 1 ? 3 : 5);
}

function getColor(color, alpha) {
    var r = Math.floor(color.r);
    var g = Math.floor(color.g);
    var b = Math.floor(color.b);
    var a = alpha === undefined ? 1 : alpha;
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

function updateColor(current, target) {
    current.r += (target.r - current.r) / 30;
    current.g += (target.g - current.g) / 30;
    current.b += (target.b - current.b) / 30;
}

function updateAlpha(current, target) {
    return current + (target - current) / 10;
}

function fillQuad(x1, y1, x2, y2, x3, y3, x4, y4) {
    fillTriangle(x1, y1, x2, y2, x3, y3);
    fillTriangle(x1, y1, x3, y3, x4, y4);
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function strokeCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function fillCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function fillTriangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
}

function strokeTriangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();
}

function strokeFlatCircle(cx, cy, width, height) {
    ctx.beginPath();
    ctx.moveTo(cx - width / 2 - 2, cy - height / 2);
    ctx.lineTo(cx + width / 2 + 2, cy - height / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cx - width / 2 - 2, cy + height / 2);
    ctx.lineTo(cx + width / 2 + 2, cy + height / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx - width / 2, cy, height / 2, Math.PI / 2, Math.PI * 3 / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx + width / 2, cy, height / 2, Math.PI * 3 / 2, Math.PI * 5 / 2);
    ctx.stroke();
}

function mouseInBox(x, y, w, h) {
    var mx = game.mouseX + (WIDTH - game.ctx.canvas.width) / 2;
    var my = game.mouseY + (HEIGHT - game.ctx.canvas.height) / 2;
    
    return x < mx && mx <= x + w && y < my && my <= y + h;
}

function HSVToRGB(hsv) {
    var h = hsv.h;
    var s = hsv.s;
    var v = hsv.v;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    var r, g, b;

    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }

    return {r: Math.floor(255 * r), g: Math.floor(255 * g), b: Math.floor(255 * b)};
}

var globalColor = [255, 128, 0];

var wb = 192;
var hb = 160;
var gridsize = wb * hb;
var gridbuffer = new Uint8ClampedArray(gridsize * 6);

var ENTER = "13";
var SPACE = "32";
var LEFT = "37";
var UP = "38";
var RIGHT = "39";
var DOWN = "40";

var keyboard = {
    "13": false,
    "32": false,
    "37": false,
    "38": false,
    "39": false,
    "40": false,
};


function clearbuffer() {
    var len = gridsize * 6;
    for (var i = 5; i < len; i += 6) {
        gridbuffer[i] = 0;
    }
}

function setb(x, y, r, g, b, a) {
    if (x < 0 || wb <= x || y < 0 || hb <= y) return;
    
    var i = (x + y * wb) * 6;
    
    gridbuffer[i + 0] = x | 0;//+ 0.5;
    gridbuffer[i + 1] = y | 0;//+ 0.5;
    gridbuffer[i + 2] = r | 0;
    gridbuffer[i + 3] = g | 0;
    gridbuffer[i + 4] = b | 0;
    gridbuffer[i + 5] = a | 0;
}

function drawPixel(x, y, color) {
    //pcount += 1;
    
    color = color || globalColor;//[255, 128, 0, 255];
    setb(x, y, color[0], color[1], color[2], color[3]);
}

function setcolor(r, g, b) {
    globalColor = [Math.floor(r), Math.floor(g), Math.floor(b), 255];
}


function yLine(x, y1, y2) {
    // INEFFICIENT!
    for (var y = y1; y <= y2; y++) {
        drawPixel(x, y);
    }
}


function xLine(x1, x2, y) {
    for (var x = x1; x <= x2; x++) {
        drawPixel(x, y);
    }
}

function circleOutline(x, y, r) {
    var xx = Math.floor(r);
    var yy = 0;
    var d = 1 - xx;
    
    while (yy <= xx) {
        drawPixel(x + xx, y + yy);
        if (yy < xx) drawPixel(x + yy, y + xx);
        drawPixel(x - xx, y + yy);
        if (0 < yy && yy < xx) drawPixel(x - yy, y + xx);
        if (0 < yy) drawPixel(x - xx, y - yy);
        if (0 < yy && yy < xx) drawPixel(x - yy, y - xx);
        if (0 < yy && yy < xx) drawPixel(x + xx, y - yy);
        drawPixel(x + yy, y - xx);
        
        yy += 1;
        
        if (d <= 0) {
            d += 2 * yy + 1;
        } else {
            xx -= 1;
            d += 2 * (yy - xx) + 1;
        }
    }
}

function circleFill(x, y, r) {
    var xx = Math.floor(r);
    var yy = 0;
    var d = 1 - xx;
    var prevx = xx;
    
    while (yy <= xx) {
        yLine(x + yy, y - xx, y + xx);
        if (0 < yy) yLine(x - yy, y - xx, y + xx);
        
        if (d <= 0) {
            yy += 1;
            d += 2 * yy + 1;
        } else {
            if (yy < xx) {
                yLine(x + xx, y - yy, y + yy);
                yLine(x - xx, y - yy, y + yy);
            }
            
            xx -= 1;
            yy += 1;
            d += 2 * (yy - xx) + 1;
        }
    }
}

function rectfill(x, y, w, h) {
    for (var i = y, yh = y + h; i < yh; i++) {
        xLine(x, x + w, i);
    }
}






// PROGRAM -------------------------------------

var x = 10;
var y = 10;

function update() {
    clearbuffer();
    
    x += (keyboard[RIGHT] - keyboard[LEFT]) * 3;
    y += (keyboard[DOWN] - keyboard[UP]) * 3;
    
    //for (var i = 0; i < 1; i++) circleFill(x, y, (x + y) / 10);
    
    var s = Math.floor(x + y) / 10;
    
    if (keyboard[SPACE]) {
        setcolor(200, 200, 200);
        rectfill(0, 0, 192, 160);
    }
    
    if (!keyboard[ENTER]) {
        setcolor(0, 255, 55);
    } else {
        setcolor(255, 0, 0);
    }
    
    rectfill(10, 20, 20, 100);
    rectfill(180, 140, 30, 30);
    
    setcolor(255, 128, 0);
    
    for (var i = 0; i < 100; i++) circleFill(x, y, s); //rectfill(x, y, s, s);
    
    postMessage(gridbuffer.buffer, [gridbuffer.buffer]);
}

onmessage = function (m) {
    gridbuffer = m.data.buffer;
    keyboard = m.data.keyboard;
    
    update();
};

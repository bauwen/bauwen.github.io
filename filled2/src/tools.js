function unlockAllLevels() {
    for (var i = 0; i <= 40; i++) {
        CONTROLLER.unlockedLevels[i] = true;
    }
    
    game.setLocalStorage("giflevel", 40);
}

parent.unlockAllLevels = unlockAllLevels;

function checkCorrectSite() {
    var hostname = parent.location.hostname;
    
    return (hostname === "" || hostname.indexOf("coolmath-games.com") >= 0);
}

function cmgStart() {
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("start");
    }
}

function cmgStartLevel(n) {
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("start", "" + n);
    }
}

function cmgReplay(n) {
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("replay", "" + n);
    }
}

var DRAWINGS = {};
var IMAGES = [];
var LEVELGRIDS = [];
var SURFACE = document.createElement("canvas");
var SURFACECTX = SURFACE.getContext("2d");


var tmp = WIDTH;
WIDTH = HEIGHT;
HEIGHT = tmp;
//*/

SURFACE.width = WIDTH * CELL + 10;
SURFACE.height = HEIGHT * CELL + 10;

function loadDrawings() {
    var size = 48;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    
    canvas.width = size;
    canvas.height = size;
    
    var getDrawing = function (drawingProcedure) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        drawingProcedure(ctx);
        
        var image = new Image();
        image.src = canvas.toDataURL();
        
        return image;
    };
    
    var spr_sound = function (ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        
        var s = 10;
        var cx = size / 2 - 3;
        var cy = size / 2;
        
        ctx.beginPath();
        ctx.moveTo(cx - s / 2, cy);
        ctx.lineTo(cx + s, cy - s + 1);
        ctx.lineTo(cx + s, cy + s - 1);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillRect(cx - s + 5, cy - s / 2, s + 5, s);
        
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 4, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    var spr_music = function (ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        
        var cx = size / 2 + 4;
        var cy = size / 2;
        
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 10 + 2 + 2);
        ctx.lineTo(cx - 8 + 12, cy - 10 + 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 10 + 1 + 2);
        ctx.lineTo(cx - 8, cy - 10 + 14 + 1 + 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx - 8 + 12, cy - 10 + 1);
        ctx.lineTo(cx - 8 + 12, cy - 10 + 14 + 1 + 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(cx - 11, cy + 6, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(cx - 11 + 12, cy + 6, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 4, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    DRAWINGS["spr_sound_on"] = getDrawing(spr_sound);
    DRAWINGS["spr_sound_off"] = getDrawing(function (ctx) {
        spr_sound(ctx);
        
        var r = size / 2 - 10;
        
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(size / 2 - r, size / 2 + r);
        ctx.lineTo(size / 2 + r, size / 2 - r);
        ctx.stroke();
    });
    
    DRAWINGS["spr_music_on"] = getDrawing(spr_music);
    DRAWINGS["spr_music_off"] = getDrawing(function (ctx) {
        spr_music(ctx);
        
        var r = size / 2 - 10;
        
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(size / 2 - r, size / 2 + r);
        ctx.lineTo(size / 2 + r, size / 2 - r);
        ctx.stroke();
    });
    
    DRAWINGS["spr_restart"] = getDrawing(function (ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        
        var r = 14;
        var s = 8;
        var cx = size / 2;
        var cy = size / 2;
        
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI / 2 * 3);
        ctx.stroke();
        
        var sx = cx;
        var sy = cy - r;
        
        ctx.beginPath();
        ctx.moveTo(sx + s, sy);
        ctx.lineTo(sx - 1, sy - s);
        ctx.lineTo(sx - 1, sy + s);
        ctx.closePath();
        ctx.fill();
    });
    
    DRAWINGS["spr_prev"] = getDrawing(function (ctx) {
        ctx.fillStyle = "white";
        
        var s = 16;
        var cx = size / 2 - s / 4;
        var cy = size / 2;
        
        ctx.beginPath();
        ctx.moveTo(cx - s / 2, cy);
        ctx.lineTo(cx + s, cy - s);
        ctx.lineTo(cx + s, cy + s);
        ctx.closePath();
        ctx.fill();
    });
    
    DRAWINGS["spr_next"] = getDrawing(function (ctx) {
        ctx.fillStyle = "white";
        
        var s = 16;
        var cx = size / 2 + s / 4;
        var cy = size / 2;
        
        ctx.beginPath();
        ctx.moveTo(cx + s / 2, cy);
        ctx.lineTo(cx - s, cy - s);
        ctx.lineTo(cx - s, cy + s);
        ctx.closePath();
        ctx.fill();
    });
}

function loadLevels() {
    var loadLevel = function (n) {
        var level = LEVELS[n];
        var list = [];
        var tiles = 0;
        var playerX = -1;
        var playerY = -1;
        var bridges = [];
        
        //** rotate grid 90 degrees
        if (HEIGHT > WIDTH) {
        var str = [];
        for (var i = 0; i < level.length; i++) str.push("");
        for (var i = 0; i < HEIGHT; i++) {
            for (var j = 0; j < WIDTH; j++) {
                str[j + (HEIGHT - 1 - i) * WIDTH] = level.charAt(i + j * HEIGHT);
            }
        }
        level = str.join("");
        }
        //**
        
        for (var i = 0; i < level.length; i++) {
            var c = level.charAt(i);
            switch (c) {
                case "o":
                    list.push({
                        type: "nothing"
                    });
                    break;
                    
                case ".":
                    list.push({
                        type: "tile"
                    });
                    tiles += 1;
                    break;
                    
                case "#":
                    list.push({
                        type: "wall"
                    });
                    break;
                    
                case "@":
                    list.push({
                        type: "player"
                    });
                    playerX = i % WIDTH;
                    playerY = Math.floor(i / WIDTH);
                    break;
                    
                case "x":
                    list.push({
                        type: "target"
                    });
                    tiles += 1;
                    break;
                    
                case "%":
                    list.push({
                        type: "bridge"
                    });
                    bridges.push({
                        x: i % WIDTH,
                        y: Math.floor(i / WIDTH),
                        state: 0
                    });
                    tiles += 2;
                    break;
                    
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    var other = null;
                    var cx = i % WIDTH;
                    var cy = Math.floor(i / WIDTH);
                    
                    for (var j = 0; j < level.length; j++) {
                        var d = level.charAt(j);
                        var dx = j % WIDTH;
                        var dy = Math.floor(j / WIDTH);
                        
                        if (d === c && (dx !== cx || dy !== cy)) {
                            other = {
                                x: dx,
                                y: dy
                            };
                            break;
                        }
                    }
                    
                    list.push({
                        type: "tunnel",
                        id: parseInt(c) - 1,
                        other: other
                    });
                    tiles += 1;
                    break;
            }
        }
        
        var levelgrid = {
            get: function (x, y) {
                return list[x + y * WIDTH];
            },
            startX: playerX,
            startY: playerY,
            tiles: tiles,
            bridges: bridges
        };
        
        IMAGES.push(getLevelImage(levelgrid));
        LEVELGRIDS.push(levelgrid);
    }
    
    for (var n = 0; n < LEVELS.length; n++) {
        loadLevel(n);
    }
}

function getLevelImage(level) {
    var ctx = SURFACECTX;
    ctx.clearRect(0, 0, SURFACE.width, SURFACE.height);
    
    var dx = 5;
    var dy = 5;
    
    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            var obj = level.get(i, j);
            var type = obj.type;
            
            var x = dx + i * CELL;
            var y = dy + j * CELL;
            var s = 0;
            
            if (type !== "nothing") {
                ctx.fillStyle = COLLAYER;
                ctx.fillRect(x + 2, y + 2, CELL + 4, CELL + 4);
                ctx.lineWidth = 4;
                ctx.strokeStyle = COLGRID;
                ctx.strokeRect(x, y, CELL, CELL);
                /*
                var w = 4;
                
                if (i === 0 || level.get(i - 1, j).type === "nothing") {
                    ctx.lineWidth = w;
                    ctx.beginPath();
                    ctx.moveTo(x - w/2, y);
                    ctx.lineTo(x - w/2, y + CELL);
                    ctx.stroke();
                }
                
                if (j === 0 || level.get(i, j - 1).type === "nothing") {
                    ctx.lineWidth = w;
                    ctx.beginPath();
                    ctx.moveTo(x, y - w/2);
                    ctx.lineTo(x + CELL, y - w/2);
                    ctx.stroke();
                }
                
                if (i === WIDTH - 1 || level.get(i + 1, j).type === "nothing") {
                    ctx.lineWidth = w;
                    ctx.beginPath();
                    ctx.moveTo(x + CELL + w/2, y);
                    ctx.lineTo(x + CELL + w/2, y + CELL);
                    ctx.stroke();
                }
                
                if (j === HEIGHT - 1 || level.get(i, j + 1).type === "nothing") {
                    ctx.lineWidth = w;
                    ctx.beginPath();
                    ctx.moveTo(x, y + CELL + w/2);
                    ctx.lineTo(x + CELL, y + CELL + w/2);
                    ctx.stroke();
                }    
                */
            }
            
            switch (type) { 
                case "wall":
                    s = 2;
                    
                    ctx.fillStyle = COLWALL;
                    ctx.fillRect(x + s, y + s, CELL - 2 * s, CELL - 2 * s);
                    
                    break;
                    
                case "target":
                    s = 12;
                    
                    ctx.strokeStyle = COLTARGET;
                    ctx.lineWidth = 7;
                    
                    ctx.beginPath();
                    ctx.moveTo(x + s, y + s);
                    ctx.lineTo(x + CELL - s, y + CELL - s);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(x + s, y + CELL - s);
                    ctx.lineTo(x + CELL - s, y + s);
                    ctx.stroke();
                    
                    break;
                    
                case "tunnel":
                    s = 3;
                    
                    ctx.lineWidth = 6;
                    ctx.strokeStyle = COLTUNNELS[obj.id];
                    ctx.strokeRect(x + s + 3, y + s + 3, CELL - 2 * s - 6, CELL - 2 * s - 6);
                    
                    break;
            }
        }
    }
    
    var g = ctx.createLinearGradient(0, 0, 0, CELL * HEIGHT + 10);
    g.addColorStop(0, "white");
    g.addColorStop(1, "black");
    
    ctx.fillStyle = g;
    ctx.globalCompositeOperation = "source-atop";
    ctx.globalAlpha = 0.1;
    //ctx.fillRect(0, 0, CELL * WIDTH + 10, CELL * HEIGHT + 10);
    
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    
    var image = new Image();
    image.src = SURFACE.toDataURL();
    
    return image;
}

function IsMouseInBox(x, y, w, h) {
    return x < game.mouseX && game.mouseX <= x + w && y < game.mouseY && game.mouseY <= y + h;
}

function detectEnv() {
    var ua = navigator.userAgent;
    
    if (/Android/.test(ua)) {
        deviceOS = "android";
    }
    else if (/iP[ao]d|iPhone/i.test(ua)) {
        deviceOS = "ios";
    }
    else if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
        deviceOS = "windowsphone";
    }
    else if (/Linux/.test(ua)) {
        deviceOS = "linux";
    }
    else if (/Mac OS/.test(ua)) {
        deviceOS = "macos";
    }
    else if (/Windows/.test(ua)) {
        deviceOS = "windows";
    }
    
    if (/Safari/.test(ua) && !(/Chrome\/(\d+)/.test(ua)) && (deviceOS === "ios" || deviceOS === "macos")) {
        console.log("safari detected");
        browserSafari = true;
    }
    
    deviceMobile = deviceOS === "ios" || deviceOS === "android" || deviceOS === "windowsphone";
    if (deviceOS) console.log(deviceOS + " detected");
}

var DRAWINGS = {};
var IMAGES = [];
var LEVELGRIDS = [];
var SURFACE = document.createElement("canvas");
var SURFACECTX = SURFACE.getContext("2d");

/*
var tmp = WIDTH;
WIDTH = HEIGHT;
HEIGHT = tmp;
//*/

SURFACE.width = WIDTH * CELL + CELL / 2;
SURFACE.height = HEIGHT * CELL + CELL / 2;

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
        var dx = 2;
        
        ctx.beginPath();
        ctx.moveTo(cx - s / 2 + 3 - dx, cy);
        ctx.lineTo(cx + s - dx, cy - s + 1);
        ctx.lineTo(cx + s - dx, cy + s - 1);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillRect(cx - s + 5 + 3 - dx, cy - s / 2, s + 5 - 3, s);
        
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 4 + 2, 0, 2 * Math.PI);
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
        ctx.arc(size / 2, size / 2, size / 2 - 4 + 2, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    DRAWINGS["spr_sound_on"] = getDrawing(spr_sound);
    DRAWINGS["spr_sound_off"] = getDrawing(function (ctx) {
        spr_sound(ctx);
        
        var r = size / 2 - 10 + 2;
        
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(size / 2 - r, size / 2 + r);
        ctx.lineTo(size / 2 + r, size / 2 - r);
        ctx.stroke();
    });
    
    DRAWINGS["spr_music_on"] = getDrawing(spr_music);
    DRAWINGS["spr_music_off"] = getDrawing(function (ctx) {
        spr_music(ctx);
        
        var r = size / 2 - 10 + 2;
        
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(size / 2 - r, size / 2 + r);
        ctx.lineTo(size / 2 + r, size / 2 - r);
        ctx.stroke();
    });
    
    DRAWINGS["spr_restart"] = getDrawing(function (ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        
        var r = 14 + 1;
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
    var floodfill = function (list, x, y, visited) {
        if (x < 0 || WIDTH <= x || y < 0 || HEIGHT <= y) {
            return true;
        }
        
        var index = x + y * WIDTH;
        if (list.charAt(index) !== "o" || visited.indexOf(index) >= 0) {
            return false;
        }
        visited.push(index);
        
        var r = floodfill(list, x + 1, y, visited);
        var l = floodfill(list, x - 1, y, visited);
        var d = floodfill(list, x, y + 1, visited);
        var u = floodfill(list, x, y - 1, visited);
        return r || l || d || u;
    };
        
    var loadLevel = function (n) {
        var level = LEVELS[n];
        var list = [];
        var tiles = 0;
        var playerX = -1;
        var playerY = -1;
        var bridges = [];
        
        /*
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
        */
        
        for (var i = 0; i < level.length; i++) {
            var c = level.charAt(i);
            switch (c) {
                case "o":
                    list.push({
                        type: "wall"//"nothing"
                    });
                    break;
                    
                case ".":
                    list.push({
                        type: "tile"
                    });
                    tiles += 1;
                    break;
                    
                /*
                case "#":  // TODO: not in use
                    list.push({
                        type: "wall"
                    });
                    break;
                */
                
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
        
        for (var i = 0; i < WIDTH * HEIGHT; i++) {
            if (list[i].type === "wall" && floodfill(level, i % WIDTH, Math.floor(i / WIDTH), [])) {
                list[i].type = "nothing";
            }
        }
                
        var x1 = WIDTH;
        var y1 = HEIGHT;
        var x2 = -1;
        var y2 = -1;
        
        for (var y = 0; y < HEIGHT; y++) {
            for (var x = 0; x < WIDTH; x++) {
                if (list[x + y * WIDTH].type === "nothing") {
                    continue;
                }
                if (x < x1) x1 = x;
                if (x2 < x) x2 = x;
                if (y < y1) y1 = y;
                if (y2 < y) y2 = y;
            }
        }
        
        var croppedGrid = [];
        for (var y = y1; y <= y2; y++) {
            var croppedRow = [];
            for (var x = x1; x <= x2; x++) {
                var obj = list[x + y * WIDTH];
                if (obj.type === "tunnel") {
                    obj.other.x -= x1;
                    obj.other.y -= y1;
                }
                croppedRow.push(obj);
            }
            croppedGrid.push(croppedRow);
        }
        
        var width = x2 - x1 + 1;
        var height = y2 - y1 + 1;
        //***
        /*
        var table = [];
        for (var y = 0; y < height; y++) {
            var str = "";
            for (var x = 0; x < width; x++) {
                var g = croppedGrid[y][x];
                switch (g.type) {
                    case "nothing": str += "o"; break;
                    case "wall": str += "#"; break;
                    case "tile": str += "."; break;
                    case "player": str += "@"; break;
                    case "target": str += "x"; break;
                    case "bridge": str += "%"; break;
                    case "tunnel": str += g.id + 1; break;
                }
            }
            table.push(str);
        }
        console.log(width, height);
        console.log(table.join("\n"));
        */
        //***
        
        for (var i = 0; i < bridges.length; i++) {
            bridges[i].x -= x1;
            bridges[i].y -= y1;
        }
        
        var levelgrid = {
            get: function (x, y) {
                return croppedGrid[y][x];//list[x + y * WIDTH];
            },
            width: width,
            height: height,
            startX: playerX - x1,
            startY: playerY - y1,
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
    var width = level.width;
    var height = level.height;
    
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var obj = level.get(i, j);
            var type = obj.type;
            
            var x = dx + i * CELL;
            var y = dy + j * CELL;
            var s = 0;
            
            if (type !== "nothing" && type !== "wall") {
                ctx.fillStyle = "rgb(70, 75, 70)";
                ctx.fillRect(x + 2, y + 2, CELL + 5, CELL + 5);
                ctx.fillStyle = COLLAYER;
                ctx.fillRect(x, y, CELL, CELL);
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
                    //ctx.fillRect(x + s, y + s, CELL - 2 * s, CELL - 2 * s);
                    
                    var wallG = ctx.createLinearGradient(x + s, y + s, x+s+CELL - 2 * s, y+s+CELL - 2 * s);
                    wallG.addColorStop(0, "white");
                    wallG.addColorStop(1, "black");
                    ctx.fillStyle = wallG;
                    ctx.globalAlpha = 0.1;
                    //ctx.fillRect(x + s, y + s, CELL - 2 * s, CELL - 2 * s);
                    ctx.globalAlpha = 1;
                    
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
                    s = 4;
                    
                    ctx.lineWidth = 8;
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


var update;

(function () {

var canvas = {
    width: 192,
    height: 160
};

/* OPTIES */

// RANGE geeft aan hoeveel blokken ver je kan kijken
var RANGE = 20;

// MAPSIZE geeft aan hoe groot de wereld is in het aantal blokken langs één zijde
var MAPSIZE = 128;

// FOV geeft de Field Of View (aantal radialen van het gezichtsveld) van de speler
var FOV = Math.PI / 3;

// PARTS geef het aantal rechthoeken dat worden getekend (hoe hoger, hoe vloeiender)
var PARTS = 220;


/* WERKING */

var ADVANCED = true;
var CELLSHADING = false;
var THICKNESS = 2;

var CIRCLE = 2 * Math.PI;

var player = {
    x: MAPSIZE / 2 + 0.5,
    y: MAPSIZE / 2 + 0.5,
    direction: 0,
};

var grid = [];
for (var i = 0; i < MAPSIZE * MAPSIZE; i += 1) {
    var r = Math.floor(Math.random() * 200) + 1;
    var g = Math.floor(Math.random() * 200) + 1;
    var b = Math.floor(Math.random() * 200) + 1;
    grid.push((Math.random() < 0.3 ? r + g * 256 + b * 256 * 256 : 0));
}
grid[Math.floor(player.y) * MAPSIZE + Math.floor(player.x)] = 0;

var getCell = function (x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || MAPSIZE <= x || y < 0 || MAPSIZE <= y) {
        return -1;
    }
    return grid[y * MAPSIZE + x];
};

var getDirection = function (x, y) {
    return Math.atan2(y, x) + Math.PI / 2;
};

var getDistance = function (x, y) {
    return Math.sqrt(x * x + y * y);
};

function fillRect(x, y, w, h, r, g, b) {
    x = Math.floor(x);
    y = Math.floor(y);
    w = Math.ceil(w);
    h = Math.ceil(h);
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    
    setcolor(r, g, b, 255);
    rectfill(x, y, w, h);
}

var pressed = false;

update = function () {
    if (keyboard[ENTER]) {
        if (!pressed) {
            pressed = true;
            CELLSHADING = !CELLSHADING;
        }
    } else {
        pressed = false;
    }
    
    var dx = 0;
    var dy = 0;

    if (keyboard[UP]) {
        dx = Math.cos(player.direction) * 0.05;
        dy = -Math.sin(player.direction) * 0.05;
    }
    if (keyboard[DOWN]) {
        dx = -Math.cos(player.direction) * 0.05;
        dy = Math.sin(player.direction) * 0.05;
    }
    if (keyboard[LEFT]) {
        if (keyboard[SHIFT]) {
            dx = Math.cos(player.direction + Math.PI/2) * 0.05;
            dy = -Math.sin(player.direction + Math.PI/2) * 0.05;
        } else {
            player.direction = player.direction + 0.04;
        }
    }
    if (keyboard[RIGHT]) {
        if (keyboard[SHIFT]) {
            dx = Math.cos(player.direction - Math.PI/2) * 0.05;
            dy = -Math.sin(player.direction - Math.PI/2) * 0.05;
        } else {
            player.direction = player.direction - 0.04 + CIRCLE;
        }
    }

    if (getCell(player.x + dx, player.y) <= 0) {
        player.x += dx;
    }
    if (getCell(player.x, player.y + dy) <= 0) {
        player.y += dy;
    }
    player.direction %= 2 * Math.PI;

    /*
    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
    gradient.addColorStop(0, "cyan");
    gradient.addColorStop(0.9, "white");
    ctx.fillStyle = gradient;
    //ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

    gradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.1, "beige");
    ctx.fillStyle = gradient;
    //ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    */
    
    
    setcolor(128, 255, 255);
    rectfill(0, 0, 192, 80);
    setcolor(255, 220, 128);
    rectfill(0, 80, 192, 80);
    //*/
    
    var prevwall = -1;
    var prevheight = -1;
    var prevdist = -1;
    for (var i = 0; i < PARTS; i += 1) {
        var angle = player.direction - FOV / 2 + FOV / PARTS * i;
        var cos = Math.cos(angle);
        var sin = -Math.sin(angle);
        var x = player.x;
        var y = player.y;
        var wallX = -1;
        var wallY = -1;
    
        if (ADVANCED) {
        
            // Advanced raycasting - optimal effect
            
            var dist = 0;
            while (dist < RANGE) {
                var horX, horY, verX, verY;
                var distX = Infinity;
                var distY = Infinity;

                if (cos != 0) {
                    horX = (cos > 0) ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
                    horY = horX * sin / cos;
                    distX = Math.sqrt(Math.pow(horX, 2) + Math.pow(horY, 2));
                }
                if (sin != 0) {
                    verY = (sin > 0) ? Math.floor(y + 1) - y: Math.ceil(y - 1) - y;
                    verX = verY * cos / sin;
                    distY = Math.sqrt(Math.pow(verX, 2) + Math.pow(verY, 2));
                }

                if (distX < distY) {
                    x += horX;
                    y += horY;
                    dist += distX;

                    if (cos < 0) {
                        if (getCell(x - 0.5, y) > 0) {
                            wallX = Math.floor(x - 0.5);
                            wallY = Math.floor(y);
                        }
                    } else {
                        if (getCell(x + 0.5, y) > 0) {
                            wallX = Math.floor(x + 0.5);
                            wallY = Math.floor(y);
                        }
                    }
                } else {
                    x += verX;
                    y += verY;
                    dist += distY;

                    if (sin < 0) {
                        if (getCell(x, y - 0.5) > 0) {
                            wallX = Math.floor(x);
                            wallY = Math.floor(y - 0.5);
                        }
                    } else {
                        if (getCell(x, y + 0.5) > 0) {
                            wallX = Math.floor(x);
                            wallY = Math.floor(y + 0.5);
                        }
                    }
                }

                if (wallX >= 0 && wallY >= 0) {
                    break;
                }
            }
        } else {
        
            // Simple raycasting - suboptimal effect
            
            var step = 0.05;
            for (var dist = 0; dist < RANGE; dist += step) {
                if (getCell(x, y) > 0) {
                    wallX = Math.floor(x);
                    wallY = Math.floor(y);
                    break;
                }
                x += cos * step;
                y += sin * step;
            }
        }
        
        if (dist == 0) {
            dist = RANGE;
        }

        var height = -1;
        var z = -1;
        if (wallX >= 0 && wallY >= 0) {
            var cell = getCell(wallX, wallY);
            var r = cell % 256;
            var g = Math.floor(cell % (256 * 256) / 256);
            var b = Math.floor(cell / (256 * 356));

            z = dist * Math.cos(angle - player.direction);
            height = canvas.height / z;
            var top = canvas.height / 2 - height / 2;

            //ctx.globalAlpha = Math.max(0, 1 - z / RANGE);
            //ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            //ctx.fillRect((PARTS - i - 1) * canvas.width / PARTS, top, canvas.width / PARTS, height);
            fillRect(PARTS - i - 1, top, 1, height, r, g, b);
            
            if (CELLSHADING) {
                var w = (1 - z / RANGE) * THICKNESS;
                //ctx.fillStyle = "black";
                //ctx.fillRect((PARTS - i - 1) * canvas.width / PARTS, top, w, w);
                //ctx.fillRect((PARTS - i - 1) * canvas.width / PARTS, top + height, w, w);
                fillRect(PARTS - i - 1, top, w, w, 0, 0, 0);
                fillRect(PARTS - i - 1, top + height, w, w, 0, 0, 0);

                var wall = wallY * MAPSIZE + wallX;
                if (wall != prevwall) {
                    var maxheight = Math.max(prevheight, height);
                    var maxtop = canvas.height / 2 - maxheight / 2;
                    
                    if (maxheight > height) {
                        w = (1 - prevdist / RANGE) * THICKNESS;
                        //ctx.globalAlpha = Math.max(0, 1 - prevdist / RANGE);
                    }
                    
                    //ctx.fillRect((PARTS - i - 1) * canvas.width / PARTS, maxtop, w, maxheight);
                    fillRect(PARTS - i - 1, maxtop, w, maxheight, 0, 0, 0);
                }
            }
        } else if (CELLSHADING) {
            if (prevwall != -1) {
                var maxheight = Math.max(prevheight, height);
                var maxtop = canvas.height / 2 - maxheight / 2;
                var w = (1 - canvas.height / maxheight / RANGE) * THICKNESS;
                //ctx.fillRect((PARTS - i - 1) * canvas.width / PARTS, maxtop, w, maxheight);
                fillRect(PARTS - i - 1, maxtop, w, maxheight, 0, 0, 0);
            }
            wallX = -1;
            wallY = 0;
        }

        prevwall = wallY * MAPSIZE + wallX;
        prevheight = height;
        prevdist = z;
    }

    //ctx.globalAlpha = 1;
    //requestAnimationFrame(mainLoop);
};

})();

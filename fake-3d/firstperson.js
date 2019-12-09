var renderFirstPerson;
var addWallRaycastListener;

(function () {
    var canvas = document.getElementById("firstperson");
    var ctx = canvas.getContext("2d");
    
    var WIDTH = CANVAS_SIZE;
    var HEIGHT = CANVAS_SIZE;
    var HLINE = Math.floor(WIDTH / PARTS);
    
    var wallRaycastListeners = [];
    addWallRaycastListener = function (callback) {
        wallRaycastListeners.push(callback);
    };
    
    var gradientFloor = C_FLOOR;
    var gradientSky = C_SKY;
    
    addCanvasResizeListener(function () {
        gradientFloor = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
        gradientFloor.addColorStop(0, "white");
        gradientFloor.addColorStop(0.1, C_FLOOR);
        
        gradientSky = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
        gradientSky.addColorStop(0, C_SKY);
        gradientSky.addColorStop(0.9, "white");
    });
    
    var fillRect = function (x, y, w, h, c) {
        var r = c % 256;
        var g = Math.floor(c % (256 * 256) / 256);
        var b = Math.floor(c / (256 * 256));
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, y, w, h);
    };
    
    renderFirstPerson = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
            
        ctx.fillStyle = gradientSky;
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
        ctx.fillStyle = gradientFloor;
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
        
        var prevwall = -1;
        var prevheight = -1;
        var prevdist = -1;

        // ray casting
        for (var i = 0; i < PARTS; i++) {
            var angle = player.direction - FOV / 2 + FOV / PARTS * i;
            var c = Math.cos(angle);
            var s = -Math.sin(angle);
            var px = player.x;
            var py = player.y;
            var wallX = -1;
            var wallY = -1;
            var dist = 0;

            while (dist < RANGE) {
                var horX = (c > 0 ? Math.floor(px + 1) : Math.ceil(px - 1)) - px;
                var verY = (s > 0 ? Math.floor(py + 1) : Math.ceil(py - 1)) - py;
                var horY = horX * s / c;
                var verX = verY * c / s;
                var distX = Math.sqrt(horX * horX + horY * horY);
                var distY = Math.sqrt(verX * verX + verY * verY);
                var t = distX < distY;
                px += t ? horX : verX;
                py += t ? horY : verY;
                dist += t ? distX : distY;
                var dx = t ? Math.sign(c) * 0.5 : 0;
                var dy = t ? 0 : Math.sign(s) * 0.5;
                if (getCell(px + dx, py + dy) > 0) {
                    wallX = Math.floor(px + dx);
                    wallY = Math.floor(py + dy);
                }

                if (wallX >= 0 && wallY >= 0) break;
            }

            if (dist === 0) dist = RANGE;
            var height = -1;
            var z = -1;

            // rendering
            if (wallX >= 0 && wallY >= 0) {
                z = dist * (FISHEYE ? 1 : Math.cos(angle - player.direction));
                height = HEIGHT / z;
                var top = HEIGHT / 2 - height / 2;

                var cell = getCell(wallX, wallY);
                ctx.globalAlpha = Math.max(0, 1 - z / RANGE);
                fillRect((PARTS - i - 1) * HLINE, top, HLINE, height, cell);

                if (OUTLINE) {
                    var w = (1 - z / RANGE) * THICKNESS;
                    fillRect((PARTS - i - 1) * HLINE, top, w, w, 0);
                    fillRect((PARTS - i - 1) * HLINE, top + height, w, w, 0);

                    if (prevwall != wallY * GRID_SIZE + wallX) {
                        var maxheight = Math.max(prevheight, height);
                        var maxtop = HEIGHT / 2 - maxheight / 2;
                        if (maxheight > height) {
                            w = (1 - prevdist / RANGE) * THICKNESS;
                            ctx.globalAlpha = Math.max(0, 1 - prevdist / RANGE);
                        }
                        fillRect((PARTS - i - 1) * HLINE, maxtop, w, maxheight, 0);
                    }
                }
            } else if (OUTLINE) {
                if (prevwall != -1) {
                    var maxtop = HEIGHT / 2 - prevheight / 2;
                    var w = (1 - HEIGHT / prevheight / RANGE) * THICKNESS;
                    fillRect((PARTS - i - 1) * HLINE, maxtop, w, prevheight, 0);
                }
                wallX = -1;
                wallY = 0;
            }
            
            for (var k = 0; k < wallRaycastListeners.length; k++) {
                wallRaycastListeners[k](wallX, wallY);
            }

            prevwall = wallY * GRID_SIZE + wallX;
            prevheight = height;
            prevdist = z;
        }
        
        ctx.globalAlpha = 1;
    };
})();
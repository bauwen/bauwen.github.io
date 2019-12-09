var renderTopDown;

(function () {
    var canvas = document.getElementById("topdown");
    var ctx = canvas.getContext("2d");
    
    var RECT_SIZE = 32;
    
    var blocks;
    addNewGridListener(function () {
        blocks = [];
        for (var i = 0; i < grid.length; i++) {
            var c = grid[i]
            if (c > 0) {
                var x = i % GRID_SIZE;
                var y = Math.floor(i / GRID_SIZE);
                var r = c % 256;
                var g = Math.floor(c % (256 * 256) / 256);
                var b = Math.floor(c / (256 * 256));
                blocks.push(new Block(x, y, r, g, b));
            }
        }
    });
    
    var Block = function (x, y, r, g, b) {
        this.x = x * RECT_SIZE;
        this.y = y * RECT_SIZE;
        this.w = RECT_SIZE;
        this.h = RECT_SIZE;
        this.height = 1.4;
        this.depth = 0;
        this.r = r + 10;
        this.g = g + 10;
        this.b = b + 10;
        this.color = "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        this.onupdate = function () {
            ctx.fillStyle = this.color;
            this.depth = getDistance(this.x + this.w / 2, this.y + this.h / 2, player.x * RECT_SIZE, player.y * RECT_SIZE);
            
            if (this.depth < RECT_SIZE * 8) {
                drawBlock(this.x, this.y, this.w, this.h, 0, this.height, this.r, this.g, this.b);
            }
        };
    };
    
    var drawTetragon = function (x1, y1, x2, y2, x3, y3, x4, y4, r, g, b) {
        var col = ctx.fillStyle;
        
        if (LIGHTING) {
            var darkness = 10;
            r = Math.max(0, r - darkness);
            g = Math.max(0, g - darkness);
            b = Math.max(0, b - darkness);
            ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
        }
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x1, y1);
        ctx.fill();
        
        ctx.fillStyle = col;
        ctx.strokeStyle = "black";
    };
    
    var cross = function (p0, p1, p2) {
        return (p2.x - p0.x)*(p1.y - p0.y) - (p1.x - p0.x)*(p2.y - p0.y);
    };

    // jarvis march
    var convexHull = function (list) {
        var anchor = { x: -1, y: -1 };
        for (var i = 0; i < list.length; i++) {
            if (list[i].y > anchor.y) {
                anchor = list[i];
            }
        }
        
        var cov = [anchor];
        var initial = anchor;
        
        while (list.length > 0) {
            var best = list[0];
            for (var i = 1; i < list.length; i++) {
                var p = list[i];
                if (cross(anchor, best, p) > 0) {
                    best = p;
                }
            }
            list.splice(list.indexOf(best), 1);
            cov.push(best);
            anchor = best;
            if (best === initial) {
                break;
            }
        }
        
        return cov;
    };

    var drawBlock = function (x, y, width, height, z1, z2, r, g, b) {
        var col = ctx.fillStyle;
        
        var dx = x + width / 2 - player.x * RECT_SIZE;
        var dy = y + height / 2 - player.y * RECT_SIZE;
        
        var x1 = x + z1 * dx / 10;
        var y1 = y + z1 * dy / 10;
        var x2 = x + z2 * dx / 10;
        var y2 = y + z2 * dy / 10;
        var zz = z2 * 4;
        
        /*x1 -= player.x * RECT_SIZE;
        y1 -= player.y * RECT_SIZE;
        x2 -= player.x * RECT_SIZE;
        y2 -= player.y * RECT_SIZE;*/
        
        if (false && z1 > 0) {
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.1;
            ctx.fillRect(x, y, width, height);
            ctx.globalAlpha = 1;
        }
        
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        
        // bottom
        ctx.fillRect(x1, y1, width, height);
        
        // left
        drawTetragon(x1, y1, x2, y2, x2, y2 + height + zz, x1, y1 + height, r, g, b);
        // back
        drawTetragon(x1, y1, x1 + width, y1, x2 + width + zz, y2, x2, y2, r, g, b);
        // right
        drawTetragon(x1 + width, y1, x1 + width, y1 + height, x2 + width + zz, y2 + height + zz, x2 + width + zz, y2, r, g, b);
        // front
        drawTetragon(x1, y1 + height, x2, y2 + height + zz, x2 + width + zz, y2 + height + zz, x1 + width, y1 + height, r, g, b);
        
        // top
        ctx.fillRect(x2, y2, width + zz, height + zz);

        if (OUTLINE) {
            var list = [
                { x: x1, y: y1 },
                { x: x2, y: y2 },
                { x: x2, y: y2 + height + zz },
                { x: x1, y: y1 + height },
                { x: x1 + width, y: y1 },
                { x: x2 + width + zz, y: y2 },
                { x: x1 + width, y: y1 + height },
                { x: x2 + width + zz, y: y2 + height + zz },
            ];
            
            var hull = convexHull(list);
            ctx.lineWidth = Math.max(0, THICKNESS - 1);
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(hull[0].x, hull[0].y);
            for (var i = 1; i < hull.length; i += 1) {
                ctx.lineTo(hull[i].x, hull[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        ctx.fillStyle = col;
    };

    renderTopDown = function () {
        ctx.fillStyle = C_FLOOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        blocks.sort(function (a, b) {
            return b.depth - a.depth;
        });
        
        ctx.save();
        ctx.translate(canvas.width/2 - player.x * RECT_SIZE, canvas.height/2 - player.y * RECT_SIZE);
        for (var i = 0; i < blocks.length; i++) {
            blocks[i].onupdate();
        }
        ctx.restore();
        
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(canvas.width / 2 + 2, canvas.height / 2 + 2, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 + Math.cos(player.direction) * 6, canvas.height / 2 - Math.sin(player.direction) * 6);
        ctx.stroke();
    };
})();
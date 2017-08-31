var SURFACE = document.createElement("canvas");

function getLevelImage(level) {
    SURFACE.width = WIDTH * CELL + 10
    SURFACE.height = HEIGHT * CELL + 10;
    
    var ctx = SURFACE.getContext("2d");
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
                ctx.lineWidth = 2;
                ctx.strokeStyle = COLGRID;
                ctx.strokeRect(x, y, CELL, CELL);
            }
            
            switch (type) { 
                case "wall":
                    s = 2;
                    
                    ctx.fillStyle = COLWALL;
                    ctx.fillRect(x + s, y + s, CELL - 2 * s, CELL - 2 * s);
                    
                    break;
                    
                case "target":
                    s = 10;
                    
                    ctx.strokeStyle = COLTARGET;
                    ctx.lineWidth = 6;
                    
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
                    s = 2;
                    
                    ctx.lineWidth = 6;
                    ctx.strokeStyle = COLTUNNELS[obj.id];
                    ctx.strokeRect(x + s + 3, y + s + 3, CELL - 2 * s - 6, CELL - 2 * s - 6);
                    /*
                    ctx.beginPath();
                    ctx.arc(x + CELL / 2, y + CELL / 2, CELL / 2 - 2 * s, 0, 2 * Math.PI);
                    ctx.stroke();
                    */
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
    ctx.fillRect(0, 0, CELL * WIDTH + 10, CELL * HEIGHT + 10);
    
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    
    var image = new Image();
    image.src = SURFACE.toDataURL();
    return image;
}

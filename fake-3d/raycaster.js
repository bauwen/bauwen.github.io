var renderRaycaster;

(function () {
    var canvas = document.getElementById("raycaster");
    var ctx = canvas.getContext("2d");
    
    var CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
    
    addWallRaycastListener(function (x, y) {
        ctx.fillStyle = "black";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    
    renderRaycaster = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        
        for (var i = 0; i < GRID_SIZE; i++) {
            for (var j = 0; j < GRID_SIZE; j++) {
                if (getCell(i, j) > 0) {
                    ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        
        var xx = player.x * CELL_SIZE;
        var yy = player.y * CELL_SIZE;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(xx, yy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(xx, yy);
        ctx.lineTo(xx + Math.cos(player.direction) * RANGE * CELL_SIZE, yy - Math.sin(player.direction) * RANGE * CELL_SIZE);
        ctx.stroke();
        ctx.globalAlpha = 1;
    };
})();

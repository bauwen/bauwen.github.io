var collision = {
    grid: [],
    width: 22,
    height: 14,

    clear: function () {
        collision.freeRect(0, 0, collision.width * 32, collision.height * 32);
    },

    check: function (x, y) {
        var i = Math.floor(x / 32);
        var j = Math.floor(y / 32);

        if (i < 0 || collision.width <= i || j < 0 || collision.height <= j) {
            return false;
        }
        return collision.grid[i + j * collision.width];
    },

    free: function (x, y) {
        var i = Math.floor(x / 32);
        var j = Math.floor(y / 32);

        if (i < 0 || collision.width <= i || j < 0 || collision.height <= j) {
            return;
        }
        collision.grid[i + j * collision.width] = false;
    },

    freeRect: function (x, y, width, height) {
        for (var i = x; i < x + width; i += 32) {
            for (var j = y; j < y + height; j += 32) {
                collision.free(i, j);
            }
        }
    },

    fill: function (x, y) {
        var i = Math.floor(x / 32);
        var j = Math.floor(y / 32);

        if (i < 0 || collision.width <= i || j < 0 || collision.height <= j) {
            return;
        }
        collision.grid[i + j * collision.width] = true;
    },

    fillRect: function (x, y, width, height) {
        for (var i = x; i < x + width; i += 32) {
            for (var j = y; j < y + height; j += 32) {
                collision.fill(i, j);
            }
        }
    },

    drawGrid: function (color) {
        var len = collision.grid.length;
        var w = collision.width;
        var x1 = 0;
        var y1 = 0;
        var x2 = collision.grid.width * 32;
        var y2 = collision.grid.height * 32;

        for (var i = 0; i < len; i++) {
            if (!collision.grid[i]) {
                continue;
            }

            var x = i % w * 32;
            var y = Math.floor(i / w) * 32;

            if (x < x1 || x2 <= x || y < y1 || y2 <= y) {
                continue;
            }

            ctx.globalAlpha = 0.2;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 32, 32);
            ctx.globalAlpha = 1;
        }
    }
};

(function () {
    for (var i = 0; i < collision.width * collision.height; i++) {
        collision.grid.push(false);
    }
})();

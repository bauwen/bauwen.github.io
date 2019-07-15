assets.createObject("obj_darkness", {
    oncreate: function () {
        this.depth = -9999;
    },

    onupdate: function () {
        if (gameloop.room === "rm_start") {
            this.drawFireLight();
        } else {
            this.drawDarkness();
        }
    },

    drawDarkness: function () {
        var innerRadius = 32 * 2;
        var outerRadius = 32 * 5;
        var x = playerInstance.x + 16;
        var y = playerInstance.y + 16;
        //var dx = x - Math.floor(playerInstance.x / 32) * 32;
        //var dy = y - Math.floor(playerInstance.y / 32) * 32;
        ctx.fillStyle = "black";

        for (var i = -2; i < 22; i++) {
            for (var j = -2; j < 14; j++) {
                var bx = i * 32 + 16;// + dx;
                var by = j * 32 + 16;// + dy;

                var euclid = Math.sqrt((bx - x)*(bx - x) + (by - y)*(by - y));
                //var manhat = Math.abs(bx - x) + Math.abs(by - y);
                //var square = Math.max(Math.abs(bx - x), Math.abs(by - y));

                var alpha = (euclid - innerRadius) / outerRadius;

                alpha = Math.min(Math.max(0, alpha), 1);
                //alpha = Math.floor(alpha * 4) / 4;

                ctx.globalAlpha = alpha;
                ctx.fillRect(bx - 16, by - 16, 32, 32);
            }
        }

        ctx.globalAlpha = 1;
    },

    drawFireLight: function () {
        if (!campFire) return;

        var innerRadius = 32 * 1;
        var outerRadius = 32 * (3 + Math.random());
        var x = campFire.x + 16 + 32;
        var y = campFire.y + 16 + 32;
        ctx.fillStyle = "black";

        for (var i = -2; i < 22; i++) {
            for (var j = -2; j < 14; j++) {
                var bx = i * 32 + 16;// + dx;
                var by = j * 32 + 16;// + dy;

                var euclid = Math.sqrt((bx - x)*(bx - x) + (by - y)*(by - y));

                var alpha = (euclid - innerRadius) / outerRadius;

                alpha = Math.min(Math.max(0, alpha), 1) * sceneAlpha;

                ctx.globalAlpha = alpha;
                ctx.fillRect(bx - 16, by - 16, 32, 32);
            }
        }

        ctx.globalAlpha = 1;
    }
});

assets.createObject("obj_floorgradient", {
    oncreate: function () {
        this.depth = 1003;
    },

    onupdate: function () {
        if (gameloop.room === "rm_hq1") {
            var h = Math.floor((canvas.height - textBarHeight - 32*2) / 32);
            ctx.fillStyle = "black";
            for (var i = 0; i < h; i++) {
                ctx.globalAlpha = Math.max(0, 0.7 - i / h * 0.7);
                ctx.fillRect(0, i*32, canvas.width, 32);
            }
        }
        if (gameloop.room === "rm_hq2") {
            ctx.fillStyle = "black";
            var y = canvas.height - textBarHeight - 32*2;
            ctx.globalAlpha = 0.8;
            ctx.fillRect(0, y, canvas.width, 32);
            ctx.globalAlpha = 0.7;
            ctx.fillRect(0, y + 32, canvas.width, 32);

            if (openDoor1) {
                ctx.fillStyle = "white";
                ctx.globalAlpha = 0.3;
                ctx.fillRect(32*5, 0, 4*32, 32);
                ctx.globalAlpha = 0.2;
                ctx.fillRect(32*5, 32, 4*32, 32);
                ctx.globalAlpha = 0.1;
                ctx.fillRect(32*5, 64, 4*32, 32);
            }
            if (openDoor2) {
                ctx.fillStyle = "white";
                ctx.globalAlpha = 0.3;
                ctx.fillRect(32*13, 0, 4*32, 32);
                ctx.globalAlpha = 0.2;
                ctx.fillRect(32*13, 32, 4*32, 32);
                ctx.globalAlpha = 0.1;
                ctx.fillRect(32*13, 64, 4*32, 32);
            }
        }
        ctx.globalAlpha = 1;
    }
});

assets.createObject("obj_campfire", {
    oncreate: function () {
        this.depth = 999;
        campFire = this;
        //this.x += 32;
        //this.y += 32;
        this.cx = this.x + 48;
        this.cy = this.y + 48;
        this.sprite = ["img_stones"];
        this.flames = [];

        if (gameloop.room === "rm_start") {
            var n = 40;
            for (var i = 0; i < n; i++) {
                var flame = {};
                var r = 2*Math.PI * i/n * 2;
                var x = this.cx + Math.cos(r) * 14;
                var y = this.cy - Math.sin(r) * 14;
                flame.sx = x;
                flame.sy = y;

                r = Math.random() * Math.PI*2;
                flame.tx = this.cx + Math.cos(r) * (1 + Math.random() * 4);
                flame.ty = this.cy + Math.sin(r) * (1 + Math.random() * 4);

                this.restartFlame(flame);
                this.flames.push(flame);
            }
            
            for (var k = 0; k < 60; k++) {
                for (var i = 0; i < this.flames.length; i++) {
                    var flame = this.flames[i];
                    if (flame.size < 1) {
                        this.restartFlame(flame);
                    }
                    flame.size -= 0.08 * flame.spd;
                    flame.g -= 5 * flame.spd;
                    flame.x += Math.sign(flame.tx - flame.x) * 0.4 * flame.spd;
                    flame.y += Math.sign(flame.ty - flame.y) * 0.4 * flame.spd;

                    ctx.fillStyle = flame.g <= 0 ? "rgb(120, 120, 120)" : "rgb(255, " + Math.floor(Math.max(0, flame.g)) + ", 0)";
                    ctx.beginPath();
                    ctx.arc(flame.x, flame.y, Math.max(0, flame.size), 0, 2*Math.PI);
                    ctx.fill();
                }
            }
        }
    },

    onupdate: function () {
        draw.object(this, 2, 2);
        //ctx.fillStyle = "orange";
        //ctx.fillRect(this.x - 32, this.y - 32, 32, 32);

        if (this.flames.length > 0) {
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = "rgb(255, 200, 0)";
            ctx.beginPath();
            ctx.arc(this.cx, this.cy, 16 + Math.floor(Math.random() * 4), 0, 2*Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        for (var i = 0; i < this.flames.length; i++) {
            var flame = this.flames[i];
            if (flame.size < 1) {
                this.restartFlame(flame);
            }
            flame.size -= 0.08 * flame.spd;
            flame.g -= 3 * flame.spd;
            flame.x += Math.sign(flame.tx - flame.x) * 0.2 * flame.spd;
            flame.y += Math.sign(flame.ty - flame.y) * 0.2 * flame.spd;

            ctx.fillStyle = flame.g <= 40 ? "rgb(120, 120, 120)" : "rgb(255, " + Math.floor(Math.max(0, flame.g)) + ", 0)";
            ctx.beginPath();
            ctx.arc(flame.x, flame.y, Math.max(0, flame.size), 0, 2*Math.PI);
            ctx.fill();
        }

        this.flames.sort(function (a, b) { return b.size - a.size; });
    },

    restartFlame: function (flame) {/*
        var r = Math.random() * 2*Math.PI;
        var x = this.cx + Math.cos(r) * 16;
        var y = this.cy - Math.sin(r) * 16;*/
        flame.x = flame.sx;
        flame.y = flame.sy;
        flame.size = 6 + Math.floor(Math.random() * 2);
        flame.spd = 0.7 + Math.random() * 0.3;
        flame.g = 255 - 30;
    }
}, true, 3, 3);

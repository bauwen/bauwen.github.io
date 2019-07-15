assets.createObject("obj_blocktrail", {
    oncreate: function () {
        this.depth = 10000;
        this.alpha = 0.4;
    },

    onupdate: function () {
        if (this.alpha > 0) {
            this.alpha -= 0.006;

            ctx.fillStyle = "black";
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.save();
            ctx.translate(this.x + 16, this.y + 16);
            ctx.rotate(-this.rotation / 180 * Math.PI);
            var s = 10;
            var t = 2;
            var u = 0;
            ctx.fillRect(-16 - u, -16 + t, 32 - t*0 + u, s);
            ctx.fillRect(-16 - u, -16 + 32 - t - s, 32 - t*0 + u, s);
            ctx.restore();
            ctx.globalAlpha = 1;
        } else {
            gameloop.removeInstance(this);
        }
    }
}, true, 1, 1);

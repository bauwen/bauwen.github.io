assets.createObject("obj_gate", {
    oncreate: function () {
        if (!leverRed) {
            collision.fillRect(256, 32*1, 32 * 4, 32 * 1);
        }
        if (!leverGreen) {
            collision.fillRect(256, 32*2, 32 * 4, 32 * 1);
        }
    },

    onupdate: function () {
        var w = 4;
        var h = 12;
        var s = 2;
        var y1 = 32*1;
        var y2 = 32*2;

        ctx.fillStyle = "black";
        if (!leverRed) {
            ctx.fillRect(256, y1+16-h/2, 32*4, h);
        }
        if (!leverGreen) {
            ctx.fillRect(256, y2+16-h/2, 32*4, h);
        }

        if (!leverRed) {
            ctx.fillStyle = "red";
            ctx.globalAlpha = 0.7 + Math.random() * 0.3;
            ctx.fillRect(256, y1+16-h/2+s, 32*4, h-2*s);
            ctx.globalAlpha = ctx.globalAlpha * 0.2;
            ctx.fillRect(256, y1+16-h/2+s + 10, 32*4, h-2*s);
        }
        if (!leverGreen) {
            ctx.fillStyle = "lime";
            ctx.globalAlpha = 0.7 + Math.random() * 0.3;
            ctx.fillRect(256, y2+16-h/2+s, 32*4, h-2*s);
            ctx.globalAlpha = ctx.globalAlpha * 0.2;
            ctx.fillRect(256, y2+16-h/2+s + 10, 32*4, h-2*s);
        }

        ctx.globalAlpha = 1;

        ctx.fillStyle = "black";
        h += 2;
        ctx.fillRect(256, y1+16-h/2, w, h);
        ctx.fillRect(256+32*4-w, y1+16-h/2, w, h);
        ctx.fillRect(256, y2+16-h/2, w, h);
        ctx.fillRect(256+32*4-w, y2+16-h/2, w, h);
    }
}, true, 1, 1);

assets.createObject("obj_lever", {
    oncreate: function () {
        this.sprite = ["img_lever_red1", "img_lever_red2"];
        this.green = gameloop.room === "rm_snow4";
        if (this.green) {
            this.sprite = ["img_lever_green1", "img_lever_green2"];
        }
        this.index = this.green ? (leverGreen ? 1 : 0) : (leverRed ? 1 : 0);
    },

    onupdate: function () {
        draw.object(this, 1, 1);

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.index = 1 - this.index;
            if (this.green) {
                leverGreen = this.index === 1;
            } else {
                leverRed = this.index === 1;
            }
            playSound("snd_lever");
        }
    }
}, false, 1, 1);

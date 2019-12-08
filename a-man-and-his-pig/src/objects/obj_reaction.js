assets.createObject("obj_surprise", {
    oncreate: function () {
        this.depth = 10001;
        this.sprite = ["img_surprise"];
        this.alpha = 1;
        this.timer = 40;
        this.dy = 0;
    },

    onupdate: function () {
        if (this.dy < 30) {
            this.dy += 8;
            this.y -= 8;
        } else if (this.timer > 0) {
            this.timer -= 0.7;
        } else if (this.alpha > 0) {
            this.alpha -= 0.1;
        } else {
            gameloop.removeInstance(this);
        }

        ctx.globalAlpha = Math.max(0, this.alpha);
        draw.object(this, 0, 0);
        ctx.globalAlpha = 1;
    }
}, true, 1, 1);

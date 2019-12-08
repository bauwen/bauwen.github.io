assets.createObject("obj_butterfly", {
    oncreate: function () {
        this.depth = -1000;
        this.sprite = ["img_butterfly1", "img_butterfly2"];
        this.timerLength = 4;
        this.timer = 0;
        this.speed = 6;
        this.direction = Math.floor(Math.random() * Math.PI * 2);
    },

    onupdate: function () {
        draw.object(this, 8, 8);

        if (this.timer < this.timerLength) {
            this.timer += 1;
        } else {
            this.timer = 0;
            this.index = 1 - this.index;
        }

        if (this.timer > 3) {
            //this.direction += -1 + Math.floor(Math.random() * 2);
            //this.direction %= Math.PI * 2;
            this.direction = Math.floor(Math.random() * Math.PI * 2);
        }
        this.x += Math.cos(this.direction) * this.speed;
        this.y -= Math.sin(this.direction) * this.speed;

        this.rotation = this.direction / Math.PI * 180;
    }
}, true, 1, 1);

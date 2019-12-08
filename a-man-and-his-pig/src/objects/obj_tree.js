assets.createObject("obj_tree", {
    oncreate: function () {
        this.sprite = ["img_tree1", "img_tree2", "img_tree3"];
        this.index = 0;

        if (gameloop.room === "rm_grass2") {
            if (this.x < 300) {
                this.index = 1;
            }
        }
        else if (gameloop.room.indexOf("desert") > 0) {
            this.index = 1;
        }
        else if (gameloop.room.indexOf("snow") > 0) {
            this.index = 2;
        }

        this.rotation = Math.floor(Math.random() * 4) * 90;

        draw.stamp(this, 5, 5);
        gameloop.removeInstance(this);
    }
}, false, 2, 2);

assets.createObject("obj_rock", {
    oncreate: function () {
        this.sprite = ["img_rock", "img_blackwall", "img_blackwall2"];
        if (gameloop.room === "rm_snow6" || gameloop.room.indexOf("hq") > 0) {
            this.index = 1;
        }
        if (gameloop.room === "rm_hq2") {
            this.index = 2;
            //draw.stamp(this, 0, 0);
        } else {
            draw.stamp(this, 3, 3);
        }
        gameloop.removeInstance(this);
    }
}, false, 2, 2);

assets.createObject("obj_wall", {
    oncreate: function () {
        this.sprite = ["img_wall_stone", "img_wall_ice"];
        this.index = 0;

        if (gameloop.room.indexOf("snow") > 0) {
            this.index = 1;
        }
    },

    onupdate: function () {
        draw.object(this, 2, 2);
    }
}, false, 1, 1);

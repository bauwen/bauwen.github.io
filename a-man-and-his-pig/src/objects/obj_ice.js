assets.createObject("obj_ice", {
    oncreate: function () {
        this.depth = 1000;
        this.sprite = ["tile_ice"];
    },

    onupdate: function () {
        draw.object(this, 0, 0);
    }
}, true, 1, 1);

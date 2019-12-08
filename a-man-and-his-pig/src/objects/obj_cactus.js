assets.createObject("obj_cactus", {
    oncreate: function () {
        this.sprite = ["img_cactus1", "img_cactus2"];
        this.index = Math.floor(Math.random() * this.sprite.length);
        this.rotation = Math.floor(Math.random() * 4) * 90;
    },

    onupdate: function () {
        draw.object(this, 3, 3);
    }
}, false, 1, 1);

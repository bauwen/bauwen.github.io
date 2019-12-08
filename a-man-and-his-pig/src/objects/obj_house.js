assets.createObject("obj_house1", {
    oncreate: function () {
        this.sprite = ["img_house1"];
        draw.stamp(this, 4, 4);
        gameloop.removeInstance(this);
    }
}, false, 4, 4);

assets.createObject("obj_house2", {
    oncreate: function () {
        this.sprite = ["img_house2"];
        draw.stamp(this, 4, 4);
        gameloop.removeInstance(this);
    }
}, false, 4, 4);

assets.createObject("obj_house3", {
    oncreate: function () {
        this.sprite = ["img_house3"];
        draw.stamp(this, 4, 4);
        gameloop.removeInstance(this);
    }
}, false, 4, 4);

assets.createObject("obj_fence1", {
    oncreate: function () {
        this.sprite = ["img_fence1"];
        draw.stamp(this, 4, 4);
        gameloop.removeInstance(this);
    }
}, false, 1, 1);

assets.createObject("obj_fence2", {
    oncreate: function () {
        this.sprite = ["img_fence2"];
        draw.stamp(this, 4, 4);
        gameloop.removeInstance(this);
    }
}, false, 1, 1);

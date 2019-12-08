assets.createObject("obj_flower1", {
    oncreate: function () {
        this.sprite = ["tile_flower1"];
        //this.rotation = Math.floor(Math.random() * 4) * 90;
        draw.stamp(this, 0, 0);
        gameloop.removeInstance(this);
    }
}, true, 1, 1);

assets.createObject("obj_flower2", {
    oncreate: function () {
        this.sprite = ["tile_flower2"];
        this.rotation = Math.floor(Math.random() * 4) * 90;
        draw.stamp(this, 0, 0);
        gameloop.removeInstance(this);
    }
}, true, 1, 1);

assets.createObject("obj_flower3", {
    oncreate: function () {
        this.sprite = ["tile_flower3"];
        //this.rotation = Math.floor(Math.random() * 4) * 90;
        draw.stamp(this, 0, 0);
        gameloop.removeInstance(this);
    }
}, true, 1, 1);

assets.createObject("obj_grind", {
    oncreate: function () {
        this.sprite = ["tile_grind1"];
        this.rotation = Math.floor(Math.random() * 4) * 90;
        draw.stamp(this, 0, 0);
        gameloop.removeInstance(this);
    }
}, true, 1, 1);

assets.createObject("obj_flowerpot", {
    oncreate: function () {
        this.sprite = ["img_flowerpot"];
        draw.stamp(this, 2, 2);
        gameloop.removeInstance(this);
    }
}, false, 1, 1);

assets.createObject("obj_block", {
    oncreate: function () {
        this.sprite = ["img_block", "img_block", "img_block", "img_block"];
    },

    onupdate: function () {
        draw.object(this, 2, 2);
    }
}, false, 1, 1);

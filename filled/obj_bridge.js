obj_bridge = function () {
    this.depth = -100;
    this.width = 32;
    this.height = 32;
    this.first = null;

    this.main = function () {
        var collision = this.collides(this.x, this.y, obj_trail);

        if (!this.first) {
            this.depth = -100;
            this.first = collision;

            if (collision) {
                this.depth = collision.depth - 1;
                //this.first.depth = 2;
            }
        } else if (!collision) {
            this.depth = -100;
            this.first = null;
        }

        draw.sprite(spr_bridge, 0, this.x, this.y);
    }
}

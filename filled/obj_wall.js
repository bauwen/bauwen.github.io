obj_wall = function () {
    this.sprite = spr_wall;
    this.spriteSpeed = 0;
    this.ready = 0;

    if (this.x != rightArea && this.y != bottomArea)
        object.create(this.x, this.y, obj_shadow);

    this.main = function () {
        if (this.ready == 0) {
            this.ready = 1;

        } else if (this.ready == 1) {
            var right = this.collides(this.x + this.width, this.y, this.object) === null ? 0 : 1;
            var up = this.collides(this.x, this.y - this.height, this.object) === null ? 0 : 1;
            var left = this.collides(this.x - this.width, this.y, this.object) === null ? 0 : 1;
            var down = this.collides(this.x, this.y + this.height, this.object) === null ? 0 : 1;

            this.spriteImage = right + up * 2 + left * 4 + down * 8;
            this.ready = 2;

        } else if (this.ready == 2) {
            this.draw();
        }
    }
}

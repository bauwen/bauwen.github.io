obj_shadow = function () {
    this.width = 32;
    this.height = 32;
    this.depth = 99;
    this.offset = 2;

    this.main = function () {
        draw.color = color.make(140, 100, 0);
        draw.rectangle(this.x + this.offset, this.y + this.offset,
                                this.x + this.width + this.offset, this.y + this.height + this.offset);
    }
}

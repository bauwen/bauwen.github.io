obj_particle = function () {
    this.depth = 1000;
    this.direction = math.random(360);
    this.speed = math.random(10) / 100 + 0.5;
    this.turn = false;
    this.size = math.irandom_range(1, 2);
    this.alpha = math.random(5) / 10;

    this.main = function () {
        this.x += math.vectorX(this.speed, this.direction);
        this.y += math.vectorY(this.speed, this.direction);

        if (this.x < 0) this.x += world.width;
        if (this.x > world.width) this.x -= world.width;
        if (this.y < 0) this.y += world.height;
        if (this.y > world.height) this.y -= world.height;

        if (this.turn) {
            if (this.alpha > 0) {
                this.alpha -= this.speed / 500;
            } else {
                this.x = math.random(world.width);
                this.y = math.random(world.height);
                this.turn = false;
                this.direction = math.random(360);
            }
        } else {
            if (this.alpha < 0.5) {
                this.alpha += this.speed / 500;
            } else {
                this.turn = true;
            }
        }

        draw.color = color.CYAN;
        draw.alpha = this.alpha;
        draw.circle(this.x, this.y, this.size);
        draw.alpha = 1;
    }
}

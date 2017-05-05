obj_player = function () {
    this.width = 32;
    this.height = 32;
    this.trail = [];
    this.direction = -1;
    this.click = false;

    this.main = function () {
        var r, u, l, d;

        r = this.direction == 180 ? 2 : 1;
        u = this.direction == 270 ? 2 : 1;
        l = this.direction == 0 ? 2 : 1;
        d = this.direction == 90 ? 2 : 1;

        draw.color = color.YELLOW;
        draw.rectangle(this.x + 2 - l, this.y + 2 - u, this.x + this.width - 2 + r, this.y + this.height - 2 + d);

        draw.color = color.DARKYELLOW;
        draw.rectangle(this.x + 4 - l, this.y + 4 - u, this.x + this.width - 4 + r, this.y + this.height - 4 + d, 2);

        draw.color = color.BLACK;
        draw.rectangle(this.x + 2 - l, this.y + 2 - u, this.x + this.width - 2 + r, this.y + this.height - 2 + d, 2);

        if (levelCompleted)
            return;

        if (mouse.pressed(mouse.LEFT)
            && this.x < mouse.x && mouse.x < this.x + this.width
            && this.y < mouse.y && mouse.y < this.y + this.height) {
            this.click = true;
        }

        if (!mouse.hold(mouse.LEFT)) {
            this.click = false;
        }

        var xx, yy;

        if (this.click) {
            xx = Math.floor(mouse.x / 32) * 32 - 8;
            yy = Math.floor(mouse.y / 32) * 32 - 8;
            //draw.rectangle(xx, yy, xx + 32, yy + 32);
        }

        if ((key.pressed(key.RIGHT) || key.hold(key.SHIFT) && key.hold(key.RIGHT)) || (this.click && xx > this.x))
            this.move_player(0);

        if ((key.pressed(key.UP) || key.hold(key.SHIFT) && key.hold(key.UP)) || (this.click && yy < this.y))
            this.move_player(90);

        if ((key.pressed(key.LEFT) || key.hold(key.SHIFT) && key.hold(key.LEFT)) || (this.click && xx < this.x))
            this.move_player(180);

        if ((key.pressed(key.DOWN) || key.hold(key.SHIFT) && key.hold(key.DOWN)) || (this.click && yy > this.y))
            this.move_player(270);

        if (key.pressed(key.SPACE) && this.trail.length > 0)
            this.back_trail();
    }

    this.move_player = function (dir) {
        var dx = Math.round(this.width * Math.cos(dir / 180 * Math.PI));
        var dy = -Math.round(this.height * Math.sin(dir / 180 * Math.PI));

        if (!this.collides(this.x + dx, this.y + dy, obj_wall)) {
            if (!this.collides(this.x + dx, this.y + dy, obj_trail)) {
                var xx = this.x + dx;
                var yy = this.y + dy;
                var hole = this.collides(xx, yy, obj_hole);

                while (hole && !this.collides(xx, yy, obj_trail)) {
                    xx = hole.other.x + dx;
                    yy = hole.other.y + dy;
                    hole = this.collides(xx, yy, obj_hole);
                }

                var pot = this.collides(xx, yy, obj_trail);

                if (!this.collides(xx, yy, obj_wall) && (!pot || pot.collides(xx, yy, obj_bridge))) {
                    this.create_trail(dir);
                    this.x += dx;
                    this.y += dy;

                    hole = this.collides(this.x, this.y, obj_hole);

                    while (hole) {
                        this.create_trail(dir, 1);
                        this.x = hole.other.x;
                        this.y = hole.other.y;
                        this.create_trail(dir, 2);
                        this.x += dx;
                        this.y += dy;
                        hole = this.collides(this.x, this.y, obj_hole);
                    }
                }

            } else if (this.collides(this.x + dx, this.y + dy, obj_bridge)) {
                if (this.direction === (dir + 180) % 360 && this.trail.length > 0) {
                    this.back_trail();
                } else { // ONLY IF ONE TRAIL, IF TWO, BLOCK! ------------------------------
                    this.create_trail(dir);
                    this.x += dx;
                    this.y += dy;
                }

            } else if (this.direction === (dir + 180) % 360 && this.trail.length > 0) {
                this.back_trail();
            }
        }
    }

    this.create_trail = function (dest, inside) {
        var trail = object.create(this.x, this.y, obj_trail);

        if (inside) {
            this.click = false;

            var dir = (dest + 180) % 360;

            if (inside === 2)
                dir = (dir + 180) % 360;

            trail.spriteImage = 10 + Math.floor(dir / 90);
            trail.ready = true;
            trail.ground = true;
        }

        trail.src = this.direction;
        trail.dest = dest;
        trail.depth = --this.depth;

        this.trail.push(trail);
        this.direction = dest;

        //sound.play(snd_step);
    }

    this.back_trail = function () {
        var trail = this.trail.pop();

        while (trail.ground) {
            this.click = false;
            object.destroy(trail);
            object.destroy(this.trail.pop());
            trail = this.trail.pop();
        }

        this.x = trail.x;
        this.y = trail.y;
        this.direction = trail.src;
        this.depth = trail.depth;

        object.destroy(trail);

        sound.play(snd_undo);
    }
}

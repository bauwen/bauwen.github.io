obj_trail = function () {
    this.width = 32;
    this.height = 32;
    this.depth = -1;
    this.sprite = spr_trail;
    this.spriteSpeed = 0;
    this.spriteImage = 0;
    this.src = 0;
    this.dest = 0;
    this.ready = false;
    this.fade = 0;
    this.ground = false;

    this.main = function () {
        if (!this.ready) {
            if (this.src == -1) {
                if (this.dest == 0) this.spriteImage += 0;
                if (this.dest == 90) this.spriteImage += 1;
                if (this.dest == 180) this.spriteImage += 3;
                if (this.dest == 270) this.spriteImage += 6;

            } else if (this.src == 0) {
                if (this.dest == 0) this.spriteImage += 4;
                if (this.dest == 90) this.spriteImage += 5;
                if (this.dest == 270) this.spriteImage += 9;

            } else if (this.src == 90) {
                if (this.dest == 0) this.spriteImage += 7;
                if (this.dest == 90) this.spriteImage += 8;
                if (this.dest == 180) this.spriteImage += 9;

            } else if (this.src == 180) {
                if (this.dest == 90) this.spriteImage += 2;
                if (this.dest == 180) this.spriteImage += 4;
                if (this.dest == 270) this.spriteImage += 7;

            } else if (this.src == 270) {
                if (this.dest == 0) this.spriteImage += 2;
                if (this.dest == 180) this.spriteImage += 5;
                if (this.dest == 270) this.spriteImage += 8;
            }

            this.ready = true;
        }

        if (!this.ground && mouse.pressed(mouse.LEFT)
            && this.x < mouse.x && mouse.x < this.x + this.width
            && this.y < mouse.y && mouse.y < this.y + this.height &&
            !(Player.x < mouse.x && mouse.x < Player.x + Player.width
            && Player.y < mouse.y && mouse.y < Player.y + Player.height)) {
            while (Player.trail.length > 0 && Player.trail[Player.trail.length - 1] != this)
                Player.back_trail();

            if (Player.trail.length > 0)
                Player.back_trail();

            Player.click = true;
        }

        this.draw();

        if (this.fade > 0) {
            draw.alpha = this.fade;
            draw.sprite(this.sprite, this.spriteImage + 14, this.x, this.y);
            draw.alpha = 1;

            this.fade -= 0.025;
        }
    }
}

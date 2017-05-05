obj_cross = function () {
    this.width = 32;
    this.height = 32;
    this.depth = 1;
    this.sprite = spr_cross;
    this.spriteSpeed = 0;
    this.reached = false;

    this.main = function () {
        this.draw();

        if (!this.reached && currentCount == 0 && this.collides(this.x, this.y, obj_player)) {
            var trails = object.getInstances(obj_trail);

            for (var trail, i = 0, len = trails.length; i < len; i++) {
                var trail = trails[i];

                trail.fade = 1;
                trail.spriteImage += 14;

                sound.play(snd_finish);
            }

            levelCompleted = true;
            this.reached = true;
        }
    }
}

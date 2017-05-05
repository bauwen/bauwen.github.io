obj_fade = function () {
    this.depth = -1000;
    this.alpha = 1;
    this.alarm = -1;

    this.main = function () {
        draw.color = color.WHITE;
        draw.alpha = this.alpha;
        draw.rectangle(0, 0, view.width, view.height);
        draw.alpha = 1;

        if (levelCompleted) {
            if (this.alarm < 0)
                this.alarm = 75;
        } else {
            if (this.alpha > 0)
                this.alpha -= 0.05;
        }

        if (this.alarm > 0) {
            this.alarm -= 1;
        } else if (this.alarm == 0) {
            if (this.alpha < 1) {
                this.alpha += 0.05;
            } else {
                sound.play(snd_next);
                world.goto(worlds);
            }
        }
    }
}

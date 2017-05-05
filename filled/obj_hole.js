obj_hole = function () {
    this.depth = 1;
    this.sprite = spr_hole;
    this.spriteSpeed = 0;
    this.spriteImage = 0;
    this.ready = 0;
    this.other = null;

    this.main = function () {
        if (this.ready == 0) {
            this.ready = 1;
        } else if (this.ready == 1) {
            var holes = object.getInstances(this.object);

            for (var i = 0, len = holes.length; i < len; i++) {
                var hole = holes[i];

                if (hole !== this && hole.spriteImage === this.spriteImage) {
                    this.other = hole;
                    break;
                }
            }

            this.ready = 2;
        }

        this.draw();


    }
}

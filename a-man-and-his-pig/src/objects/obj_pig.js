assets.createObject("obj_pig", {
    oncreate: function () {
        this.sprite = ["img_pig1", "img_pig2", "img_pig1", "img_pig3"];

        if (gameloop.room === "rm_grass_village4") {
            cavePig = this;

            if (returnedSheep) {
                collision.free(this.x, this.y);
                this.x += 2 * 32;
                collision.fill(this.x, this.y);
            }
        }

        if (gameloop.room === "rm_white") {
            whitePig = this;
            collision.free(this.x, this.y);
            //this.y -= 64;
            this.y += 32;
        }

        if (gameloop.room === "rm_start") {
            startPig = this;
        }

        this.special = cavePig === this || whitePig === this || startPig === this;

        if (!this.special) {
            this.rotation = Math.floor(Math.random() * 4) * 90;
        }
    },

    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing) return;

        if (!this.special) {
            if (!this.following && Math.random() < 0.001) {
                this.rotation = Math.floor(Math.random() * 4) * 90;
            }
        }

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            if (!storyTruth) {
                act.start([
                    act.execSync(function () { playSound("snd_pig"); }),
                    act.say("...this is not the pig I am looking for.")
                ]);
            } else {
                act.start([
                    act.say("...so this is actually a sheep?")
                ]);
            }
        }
    }
});

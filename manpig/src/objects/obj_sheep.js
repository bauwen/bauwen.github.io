assets.createObject("obj_sheep", {
    oncreate: function () {
        this.sprite = ["img_sheep1", "img_sheep2", "img_sheep1", "img_sheep3"];
        this.following = false;

        this.special = gameloop.room === "rm_desert3";
        if (this.special && foundSheep) {
            gameloop.removeInstance(this);
        }

        this.pig = false;
        if (gameloop.room === "rm_grass_village2" && this.x === 576 && this.y === 224) {
            this.pig = true;
        }

        if (!this.special) {
            this.rotation = Math.floor(Math.random() * 4) * 90;
        }

        if (this.pig) {
            this.rotation = 270;
        }

        this.talking = false;
    },

    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing) return;
        var self = this;

        if (!this.special && !this.talking) {
            if (!this.following && Math.random() < 0.001) {
                this.rotation = Math.floor(Math.random() * 4) * 90;
            }
        }

        if (this.pig) {
            if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
                this.rotation = (playerInstance.rotation + 180) % 360;
                this.talking = true;
                stopMusic();
                act.start([
                    act.say("..."),
                    act.execSync(function () {
                        self.sprite = ["img_pig1", "img_pig2", "img_pig1", "img_pig3"];
                    }),
                    act.execSync(function () { playSound("snd_pig"); }),
                    act.say("YOU FOUND ME!")
                ], function () {
                    gameloop.gotoRoom("rm_credits");
                });
            }
        }

        if (this.special) {
            if (!foundSheep) {
                if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
                    this.rotation = (playerInstance.rotation + 180) % 360;
                    act.start([
                        act.execSync(function () { playSound("snd_bonus"); }),
                        act.say("Here you are!"),
                        act.say("Let's bring you home!")
                    ], function () {
                        /*if (this.following) {
                            this.following = false;
                            movement.unfollow(this, playerInstance);
                        } else {*/
                            foundSheep = true;
                            self.following = true;
                            self.rotation = (playerInstance.rotation + 180) % 360;
                            movement.follow(self, playerInstance);
                        //}
                    });
                }
            }
        }
    }
});

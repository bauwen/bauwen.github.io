assets.createObject("obj_credits", {
    oncreate: function () {
        playMusic("mus_credits");
        this.timer = 0;
        this.state = -1;
        this.alpha = 0;
        this.length = 5;
        textShowing = true;
        if (playerInstance) playerInstance.x = -100;
        this.subalpha = -2;

        if (openDoor1) {
            if (!ending1) {
                ending1 = true;
                updateSaveWithEnding();
            }
        } else if (openDoor2) {
            if (!ending2) {
                ending2 = true;
                updateSaveWithEnding();
            }
        } else {
            if (!ending3) {
                ending3 = true;
                updateSaveWithEnding();
            }
        }
    },

    onupdate: function () {
        if (this.state < 0) {
            if (this.timer < 120) {
                this.timer += 1;
            } else {
                this.state = 0;
                this.timer = 0;
            }
        }

        if (this.timer < 250) {
            this.timer += 1;
        } else {
            this.timer = 0;
            this.state += 1;
        }

        if (/*(this.timer > 30 && this.timer < 32) || (this.timer > 40 && this.timer < 42) || (this.timer > 60 && */(this.timer < 180)
            || (this.timer > 185 && this.timer < 188) || (this.timer > 192 && this.timer < 196)) {
            this.alpha = 1;
        } else {
            this.alpha = 0;
        }

        if (this.state >= this.length || (this.state === this.length - 1 && this.timer > 100)) {
            this.alpha = 1;
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "54px calibri, sans-serif";
        ctx.globalAlpha = this.alpha;

        if (this.state === 0) {
            ctx.font = "54px funnyfont, sans-serif";

            if (openDoor1 || openDoor2) {
                ctx.fillText("A Man and his " + (openDoor1 ? "Sheep" : "Pig"), canvas.width/2, 280);
            } else {
                var t = "A Man and his Pig";
                if (this.timer > 192) { t = "what?"; } else if (this.timer > 185) { t = "wait"; }
                ctx.fillText(t, canvas.width/2, 280);
            }
            //ctx.fillText("and his Pig", canvas.width/2, 300);
        }

        if (this.state === 1) {
            ctx.fillText("Game by", canvas.width/2, 240);
            ctx.fillText("Diamonax", canvas.width/2, 300);
        }

        if (this.state === 2) {
            ctx.fillText("Music from", canvas.width/2, 240);
            ctx.fillText("Kevin MacLeod", canvas.width/2, 300);
        }

        if (this.state === 3) {
            ctx.fillText("Sounds from", canvas.width/2, 240);
            ctx.fillText("various sources", canvas.width/2, 300);
        }

        if (this.state > this.length - 2) {
            ctx.fillText("Thanks for playing!", canvas.width/2, 280);
            this.subalpha += 0.01;
            ctx.globalAlpha = Math.max(0, Math.min(this.subalpha, 1));
            ctx.fillStyle = "rgb(100, 100, 100)";
            ctx.font = "16px calibri, sans-serif";
            if (storyTruth) {
                if (!ending2) {
                    ctx.fillText("Go talk to the old man in the cave.");
                } else if (!ending3) {
                    ctx.fillText("Go talk to one of the sheep.", canvas.width/2, 320);
                } else if (!ending1) {
                    ctx.fillText("Another code is CODE.", canvas.width/2, 320);
                } else {
                    ctx.fillText("You fully completed the game!", canvas.width/2, 320);
                }
            } else if (ending1 && ending2 && ending3) {
                ctx.fillText("Go discover the truth now.", canvas.width/2, 320);
            } else if (ending1 && ending2) {
                ctx.fillText("Go back to the desert village.", canvas.width/2, 320);
            } else {
                ctx.fillText("There are other ways to end the game.", canvas.width/2, 320);
            }
            ctx.globalAlpha = 1;
        }

        ctx.textAlign = "left";
    }
});

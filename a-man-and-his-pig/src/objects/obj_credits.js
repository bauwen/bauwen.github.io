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

        if (openDoor2) {
            if (!ending1) {
                ending1 = true;
                updateSaveWithEnding();
            }
        } else if (openDoor1) {
            if (!ending2) {
                ending2 = true;
                updateSaveWithEnding();
            }
        } else if (talkedPig) {
            if (!ending3) {
                ending3 = true;
                updateSaveWithEnding();
            }
        } else if (gameEnd) {
            updateSaveWithEnding();
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
                var t = "A Man and his " + (openDoor1 ? "Sheep" : "Pig");
                if (openDoor1) {
                    if (this.timer > 192) { t = "what?"; } else if (this.timer > 185) { t = "wait"; }
                }
                ctx.fillText(t, canvas.width/2, 280);
            } else {
                var t = "A Man and his Pig";
                if (gameEnd) {
                    if (this.timer > 192) { t = "done!"; } else if (this.timer > 185) { t = "well"; }
                } else {
                    if (this.timer > 192) { t = "what?"; } else if (this.timer > 185) { t = "wait"; }
                }
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

            if (gameEnd) {
                if (ending3) {
                    ctx.fillText("You fully completed the game!", canvas.width/2, 320);
                } else {
                    ctx.fillText("You completed the game! (although you missed one ending)", canvas.width/2, 320);
                }
            } else if (storyTruth) {
                ctx.fillText("Who is the boss of the desert lady?", canvas.width/2, 320);
            } else if (!ending1 && ending2 && ending3) {
                ctx.fillText("Try another CODE.", canvas.width/2, 320);
            } else if (!ending2 && ending1 && ending3) {
                ctx.fillText(doneQuiz ? "Solve the anagram." : "Talk to the old man in the cave.", canvas.width/2, 320);
            } else if (!ending3 && ending1 && ending2) {
                //ctx.fillText("One of the lady's sheep is acting weird.", canvas.width/2, 320);
                ctx.fillText("If you want, you can discover the truth (talk).", canvas.width/2, 320);
            } else if (ending1 && ending2 && ending3) {
                ctx.fillText("If you want, you can discover the truth (talk).", canvas.width/2, 320);
            } else if (ending3 && !ending1 && !ending2) {
                ctx.fillText("Nice catch! Now go north.", canvas.width/2, 320);
            } else if (ending2 && !ending1 && !ending3) {
                ctx.fillText("Try another CODE.", canvas.width/2, 320);
            } else if (ending1 && !ending2 && !ending3) {
                ctx.fillText(doneQuiz ? "Solve the anagram." : "Talk to the old man in the cave.", canvas.width/2, 320);
            } else {
                ctx.fillText("The game is not over yet.", canvas.width/2, 320);
            }
            ctx.globalAlpha = 1;
        }

        ctx.textAlign = "left";
    }
});

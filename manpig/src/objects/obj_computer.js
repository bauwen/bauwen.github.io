assets.createObject("obj_computer", {
    oncreate: function () {
        this.depth = -1000000;
        textShowing = true;

        this.maxLength = 8;
        this.input = "";
        this.inputBlinker = " ";
        this.inputBlinkTimer = 0;
        this.inputBlinkPeriod = 60;

        this.checking = false;
        this.progress = 0;
        this.blinkTimer = 0;
        this.blinkPeriod = 60;

        this.success = false;
        this.displaying = false;
        this.displayTimer = 0;
        this.displayPeriod = 100;

        this.spd = 4;
        this.t = 0;

        this.alpha = 0;
        this.show = true;

        this.CODE1 = "lostapig";
        this.CODE2 = "code";
    },

    onupdate: function () {
        var self = this;

        if (!this.checking && !this.displaying && nol.keyboardPressed("escape")) {
            textShowing = false;
            gameloop.removeInstance(this);
        }

        if (!this.checking && !this.displaying && this.input.length < this.maxLength) {
            for (var i = 48; i <= 57; i++) {
                var c = String.fromCharCode(i);
                if (nol.keyboardPressed(c)) {
                    this.input += c;
                }
            }
            for (var i = 97; i <= 122; i++) {
                var c = String.fromCharCode(i);
                if (nol.keyboardPressed(c)) {
                    this.input += c;
                }
            }
        }

        if (!this.checking && !this.displaying && this.input.length > 0 && nol.keyboardPressed("backspace")) {
            this.input = this.input.slice(0, this.input.length - 1);
        }

        if (!this.checking && !this.displaying && this.input.length > 0 && nol.keyboardPressed("enter")) {
            this.checkCode();
        }

        var height = canvas.height - textBarHeight;
        ctx.textAlign = "center";

        ctx.fillStyle = "rgb(20, 20, 30)";
        ctx.fillRect(0, 0, canvas.width, height);

        if (!this.show) {
            return;
        }

        this.alpha = 0.8 + Math.random() * 0.2;
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "lime";

        ctx.globalAlpha = this.alpha;
        ctx.font = "bold 36px 'courier new', monospace";
        ctx.fillText("Enter CODE:", canvas.width / 2, height / 2 - 120);

        let w = 400;
        let h = 90;

        if (this.displaying && !this.success) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        }

        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 3;
        ctx.fillRect(canvas.width / 2 - w / 2, height / 2 - h / 2, w, h);
        ctx.globalAlpha = this.alpha;
        ctx.strokeRect(canvas.width / 2 - w / 2, height / 2 - h / 2, w, h);

        this.inputBlinkTimer = (this.inputBlinkTimer + 1) % this.inputBlinkPeriod;
        if (this.inputBlinkTimer > this.inputBlinkPeriod / 2) {
            this.inputBlinker = "_";
        } else {
            this.inputBlinker = " ";
        }

        ctx.font = "bold 54px 'courier new', monospace";
        ctx.fillText(this.input.toUpperCase(), canvas.width / 2, height / 2 - h / 2 + 60);
        var blinker = this.checking || this.displaying ||
                        this.input.length === this.maxLength ? "" : " ".repeat(this.input.length === 0 ? 0 : this.input.length + 1) + this.inputBlinker;
        ctx.fillText(blinker, canvas.width / 2, height / 2 - h / 2 + 60 - 5);

        if (this.checking) {
            this.progress += this.spd;
            if (this.progress > w) {
                this.validateCode();
            }

            ctx.fillStyle = "rgb(200, 170, 0)";
            this.blinkTimer = (this.blinkTimer + 1) % this.blinkPeriod;
            if (this.blinkTimer < this.blinkPeriod / 2) {
                ctx.font = "bold 28px 'courier new', monospace";
                ctx.fillText("Checking code...", canvas.width / 2, height / 2 + 170 - 50);
            }

            ctx.fillRect(canvas.width / 2 - w / 2, height / 2 + 200 - 50, this.progress, 24);
        }

        if (this.displaying) {
            this.displayTimer += this.success ? 0.7 : 1;
            if (this.displayTimer > this.displayPeriod) {
                if (this.success) {
                    this.show = false;
                    setTimeout(function () {
                        if (self.input === self.CODE1) {
                            correctCode = 1;
                            openDoor1 = true;
                            collision.freeRect(32*5, 0, 32*4, 32*3);
                        }
                        if (self.input === self.CODE2) {
                            correctCode = 2;
                            openDoor2 = true;
                            collision.freeRect(32*13, 0, 32*4, 32*3);
                        }
                        textShowing = false;
                        gameloop.removeInstance(self);
                    }, 1);
                }
                this.displaying = false;
            }

            ctx.font = "bold 42px 'courier new', monospace";

            if (this.success) {
                ctx.fillText("ACCESS GRANTED", canvas.width / 2, height / 2 + 220 - 80);
            } else {
                ctx.fillStyle = "red";
                ctx.fillText("ACCESS DENIED", canvas.width / 2, height / 2 + 220 - 80);
            }
        }

        if (!this.checking && !this.displaying) {
           ctx.font = "16px 'courier new', monospace";
           ctx.textAlign = "left";
           ctx.fillText("Press escape to turn off the machine", 15, height - 10);
        }

        this.t = (this.t + 0.1) % 2;
        ctx.globalAlpha = 0.3;
        var img = assets.images["img_scanlines"];
        ctx.drawImage(img, 0, this.t, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, height);
        ctx.globalAlpha = 1;

        ctx.textAlign = "left";
    },

    checkCode: function () {
        this.progress = 0;
        this.checking = true;

        if (this.input === this.CODE1 || this.input === this.CODE2) {
            this.spd = 3;
        }
    },

    validateCode: function () {
        this.checking = false;
        this.success = this.input === this.CODE1 || this.input === this.CODE2;
        this.displaying = true;
        this.displayTimer = 0;

        if (this.success) {
            playSound("snd_doorlock");
        } else {
            playSound("snd_error");
        }
    }
}, true, 1, 1);

assets.createObject("obj_screen", {
    oncreate: function () {
        this.depth = -2;
        this.sprite = ["img_screen"];
    },

    onupdate: function () {
        draw.object(this, 0, 0);
        if (textShowing) return;

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y) && playerInstance.rotation === 90) {
            playSound("snd_computer");
            gameloop.addInstance("obj_computer", 0, 0);
        }
    }
}, false, 1, 1);

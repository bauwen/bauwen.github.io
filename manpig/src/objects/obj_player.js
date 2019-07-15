assets.createObject("obj_player", {
    oncreate: function () {
        this.spr_normal = ["img_man1", "img_man2", "img_man1", "img_man3"];
        this.spr_push = ["img_man_power1", "img_man_power2", "img_man_power1", "img_man_power3"];

        this.depth = -10;
        this.sprite = this.spr_normal;
        this.speed = 0;
        this.startup = 0;
        this.walking = false;
        this.pusing = false;
        this.pushTimer = 0;
        this.pushingBlock = null;
        this.sliding = false;

        playerInstance = this;
    },

    onupdate: function () {
        var self = this;
        draw.object(this, 2);

        var cx = Math.floor(this.x / 32) * 32;
        var cy = Math.floor(this.y / 32) * 32;

        this.checkRoomTransition();

        if (this.x !== cx || this.y !== cy) {
            return;
        }
        if (this.sliding) {
            return;
        }
        if (textShowing) {
            return;
        }

        var moved = false;
        var prevdir = this.rotation;

        if (!this.pushing) {
            if (nol.keyboardDown("right")) {
                this.rotation = 0;
                moved = true;
            }
            else if (nol.keyboardDown("left")) {
                this.rotation = 180;
                moved = true;
            }
            else if (nol.keyboardDown("up")) {
                this.rotation = 90;
                moved = true;
            }
            else if (nol.keyboardDown("down")) {
                this.rotation = 270;
                moved = true;
            }
        }

        var canMove = true;
        var hspeed = -((this.rotation - 90) % 180) / 90;
        var vspeed = ((this.rotation - 180) % 180) / 90;
        var x = this.x + Math.sign(hspeed) * 32;
        var y = this.y + Math.sign(vspeed) * 32;

        if (moved) {
            this.speed = 2//nol.keyboardDown("shift") ? 4 : 2;

            if (this.rotation == prevdir && this.startup == 3) {
                this.startup = 0;
            }

            canMove = !collision.check(x, y);

            if (!this.pushing) {
                if (!canMove) {
                    for (var i = 0; i < gameloop.instances.length; i++) {
                        var instance = gameloop.instances[i];
                        if (instance.asset === "obj_block" && instance.x === x && instance.y === y) {
                            x += Math.sign(hspeed) * 32;
                            y += Math.sign(vspeed) * 32;
                            if (!collision.check(x, y)) {
                                this.pushingBlock = instance;
                            }
                            break;
                        }
                    }
                }

                if (this.pushingBlock) {
                    if (powerDrink) {
                        this.speed = 1;
                        this.sprite = this.spr_push;
                        this.pushing = true;
                        this.pushTimer = 0;
                    } else {
                        this.pushingBlock = null;
                        act.start([
                            act.say("These blocks can be moved, but I am too weak to push them.")
                        ]);
                    }
                }
            }
        } else {
            this.startup = 4;
        }

        if (this.pushingBlock && this.pushTimer < 5) {
            this.pushTimer += 1;
            this.startup = 0;
        }

        if (this.startup > 0) {
            this.startup -= 1;
        } else {
            if (this.pushingBlock) {
                if (this.pushTimer >= 5) {
                    var trail = gameloop.addInstance("obj_blocktrail", this.pushingBlock.x, this.pushingBlock.y);
                    trail.rotation = this.rotation;
                    movement.push(this, this.speed, this.rotation, this.pushingBlock, function () {
                        self.pushing = false;
                        self.pushingBlock = null;
                    });
                }
            } else {
                if (canMove) {
                    canMove = this.checkRotatorObstacle(hspeed, vspeed);
                }

                if (canMove) {
                    movement.walk(this, this.speed, this.rotation, function () {
                        if (self.standingOnIce()) {
                            self.sprite = self.spr_normal;
                            self.index = (Math.floor(self.index / 2) * 2 + 3) % 4;
                            self.sliding = true;

                            movement.slide(self, 2, self.rotation, function () {
                                return !self.standingOnIce();
                            }, function () {
                                self.index = 0;
                                self.sliding = false;
                            });
                        }
                    });
                }
            }
        }

        if (!this.pushing && this.sprite === this.spr_push) {
            this.sprite = this.spr_normal;
            this.index = 0;
        }
    },

    standingOnIce: function () {
        for (var i = 0; i < gameloop.instances.length; i++) {
            var instance = gameloop.instances[i];
            if (instance.asset === "obj_ice") {
                if (instance.x === this.x && instance.y === this.y) {
                    return true;
                }
            }
        }
        return false;
    },

    checkRotatorObstacle: function (hspeed, vspeed) {
        var canMove = true;
        var move = 0;

        var actors = [];
        var collides = false;
        for (var i = 0; i < gameloop.instances.length; i++) {
            var rotator = gameloop.instances[i];
            if (rotator.asset === "obj_rotator") {
                var dx = Math.sign(hspeed);
                var dy = Math.sign(vspeed);
                move = rotator.determineMove(this.x, this.y, dx, dy);
                if (rotator.canPush(move)) {
                    (function (rotator, move) {
                        actors.push(function () {
                            rotator.doPush(move);
                        });
                    })(rotator, move);
                } else if (move !== 0) {
                    collides = true;
                }
            }
        }
        if (collides) {
            canMove = false;
        } else {
            for (var i = 0; i < actors.length; i++) {
                actors[i]();
            }
        }

        return canMove;
    },

    checkRoomTransition: function () {
        var self = this;
        var height = canvas.height - textBarHeight;
        var hor = (this.x + 16 >= canvas.width + 2) - (this.x + 16 < 0 - 2);
        var ver = (this.y + 16 >= height + 2) - (this.y + 16 < 0 - 2);

        if (hor !== 0) {
            var links = roomMatrix.horizontal;
            var index = (hor + 1) / 2;
            var link;
            for (var i = 0; i < links.length; i++) {
                if (links[i][1 - index] === gameloop.room) {
                    link = links[i];
                    break;
                }
            }
            if (link === undefined) return;
            roomStartX = hor < 0 ? canvas.width - 32 : 0;
            roomStartY = self.y;
            gameloop.gotoRoom(link[index], function () {
                self.x = hor < 0 ? canvas.width : -32;
                movement.walkThrough(self, self.speed, self.rotation);
                self.x += hor < 0 ? -16 : 16;

                if (self.follower) {
                    self.follower.y = self.y;
                    self.follower.x = hor < 0 ? canvas.width + 32 : -32 - 32;
                    movement.walkThrough(self.follower, self.speed, self.rotation);
                    self.follower.x += hor < 0 ? -16 : 16;
                }
            });
        }

        if (ver !== 0) {
            var links = roomMatrix.vertical;
            var index = (ver + 1) / 2;
            var link;
            for (var i = 0; i < links.length; i++) {
                if (links[i][1 - index] === gameloop.room) {
                    link = links[i];
                    break;
                }
            }
            if (link === undefined) return;
            roomStartX = self.x;
            roomStartY = ver < 0 ? height - 32 : 0;
            gameloop.gotoRoom(link[index], function () {
                if (gameloop.room === "rm_white") {
                    var tmp = self.x;
                    self.x = 32*11;
                    if (tmp < 32*10) {
                        self.playEndScene2();
                    } else {
                        self.playEndScene1();
                    }
                }

                self.y = ver < 0 ? height : -32;
                movement.walkThrough(self, self.speed, self.rotation);
                self.y += ver < 0 ? -16 : 16;

                if (self.follower) {
                    self.follower.x = self.x;
                    self.follower.y = ver < 0 ? height + 32 : -32 - 32;
                    movement.walkThrough(self.follower, self.speed, self.rotation);
                    self.follower.y += ver < 0 ? -16 : 16;
                }
            });
        }
    },

    playEndScene1: function () {
        openDoor1 = false;
        act.start([
            act.wait(2000),
            act.walkCount(this, 1, 90, 5),
            act.wait(1000),
            act.walkCount(whitePig, 1, 270, 7-3),
            act.wait(1000),
            act.say("..."),
            act.wait(1000),
            act.walkCount(this, 1, 90, 1),
            act.wait(500),
            act.walkCount(whitePig, 4, 270, 1),
            act.walkCount(whitePig, 4, 180, 1),
            act.walkCount(whitePig, 4, 270, 2),
            act.walkCount(whitePig, 4, 0, 2),
            act.walkCount(whitePig, 4, 90, 2),
            act.walkCount(whitePig, 4, 180, 1),
            act.face(whitePig, 270),
            act.wait(100),
            act.execSync(function () { playSound("snd_pig"); }),
            act.say("You found me!"),
            act.say("Yeey!"),
            act.execSync(function () {
                setTimeout(function () {
                    gameloop.gotoRoom("rm_credits");
                }, 800);
            }),
            act.say("LISTEN TO THE OLD MAN IN THE CAVE. GOATLIPS=LOSTAPIG. It's an anagram!"),
            //act.say("LET ME TELL YOU THE TRUTH. You had to enter LOSTAPIG into the computer! It is an anagram of GOATLIPS.")
        ], function () {
            gameloop.gotoRoom("rm_credits");
        });
    },

    playEndScene2: function () {
        openDoor2 = false;
        act.start([
            act.wait(2000),
            act.walkCount(this, 1, 90, 5),
            act.wait(1000),
            act.walkCount(whitePig, 1, 270, 7-3),
            act.wait(1000),
            act.say("..."),
            act.wait(1000),
            act.walkCount(whitePig, 1, 270, 1),
            act.wait(500),
            act.execSync(function () { playSound("snd_pig"); }),
            act.say("I am glad you found me."),
            act.say("I didn't tell you this, but..."),
            act.say("..."),
            act.say("I am not what you think I am..."),
            act.say("I am actually..."),
            act.say("..."),
            act.execSync(function () {
                whitePig.sprite = ["img_sheep1", "img_sheep2", "img_sheep1", "img_sheep3"];
                setTimeout(function () {

                }, 2000);
            }),
            act.say("A SHEEP!")
        ], function () {
            gameloop.gotoRoom("rm_credits");
        });
    }
});

assets.createObject("obj_reflection", {
    oncreate: function () {
        this.depth = 1002;
    },

    onupdate: function () {
        if ((gameloop.room === "rm_snow6" && !(256 <= playerInstance.x && playerInstance.x < 256+32*4 && playerInstance.y < 32*5))) {
            return;
        }
        draw.reflection(playerInstance, 0.3, 8, 8);
    }
});

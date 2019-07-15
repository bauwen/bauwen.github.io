assets.createObject("obj_npc1", {
    oncreate: function () {
        this.sprite = ["img_lady1"];
    },
    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing) return;

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.rotation = (playerInstance.rotation + 180) % 360;
            if (!foundSheep) {
                act.start([
                    act.say("Hi!"),
                    act.say("Do you like my beautiful sheep?"),
                    act.say("..."),
                    act.say("Oh, you are looking for a pig? The only pig I've seen is the one from the man standing in front of the cave in the north..."),
                    act.say("Maybe your pig went west from here, to the desert. You never know."),
                    act.say("I hope you find him!")
                ]);
            } else if (!returnedSheep) {
                act.start([
                    act.say("Hey, that's one adorable sheep that's following you right there!"),
                    act.say("I'd buy it from you if I didn't have so many sheep myself already.")
                ]);
            } else if (!ending2) {
                act.start([
                    act.say("I love flowers!"),
                    act.say("I really do!")
                ]);
            } else {
                act.start([
                    act.say("One of my sheep is acting weird!"),
                    act.say("By the way, you should talk to the lady in the desert village.")
                ]);
            }
        }
    }
}, false, 1, 1);

assets.createObject("obj_npc2", {
    oncreate: function () {
        this.sprite = ["img_human_bald", "img_human_bald", "img_human_bald", "img_human_bald"];
        this.rotation = Math.floor(Math.random() * 4) * 90;
        this.startX = this.x;
        this.startY = this.y;
        this.walking = false;
    },
    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing || this.walking) return;
        var self = this;

        if (Math.random() < 0.01) {
            if (this.x === this.startX && this.y === this.startY) {
                this.rotation = Math.floor(Math.random() * 4) * 90;
                this.walking = true;
                movement.walk(this, 2, this.rotation, function () { self.walking = false; });
            } else {
                if (this.x !== this.startX) this.rotation = this.x < this.startX ? 0 : 180;
                if (this.y !== this.startY) this.rotation = this.y < this.startY ? 270 : 90;
                this.walking = true;
                movement.walk(this, 2, this.rotation, function () { self.walking = false; });
            }
        }

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.rotation = (playerInstance.rotation + 180) % 360;
            act.start([
                act.say("There is a cave north from here. I have never been inside, but apparently it's very dark."),
                act.say("Legends say a crazy man lives in the cave somewhere. I have no idea whether it's true, though.")
            ]);
        }
    }
}, false, 1, 1);

assets.createObject("obj_npc3", {
    oncreate: function () {
        this.sprite = ["img_human_bald", "img_human_bald2", "img_human_bald", "img_human_bald3"];
        this.sheep = null;
        this.sheepDx = 0;
        this.sheepDy = 0;

        if (returnedSheep) {
            collision.free(this.x, this.y);
            this.x += 2 * 32;
            collision.fill(this.x, this.y);
            var s = gameloop.addInstance("obj_sheep", this.x + 2 * 32, this.y);
            s.rotation = 270;
            s.special = true;
        }
    },
    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing) return;
        var self = this;

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.rotation = (playerInstance.rotation + 180) % 360;
            if (!foundSheep) {
                if (!powerDrink) {
                    act.start([
                        act.say("Hello, young man!"),
                        act.say("..."),
                        act.alert(this.x, this.y),
                        act.say("You are searching for a pig?"),
                        act.say("Perhaps it went inside this cave behind me."),
                        act.say("However, before I let you through, I need to ask you a favor first."),
                        act.say("You see, I also lost an animal..."),
                        act.say("My sheep ran off into the desert and I am afraid she got lost."),
                        act.say("Can you go find her for me, please?"),
                        act.say("To reach the desert, you will need to push heavy blocks out of the way."),
                        act.say("I will give you a special power drink I made that gives you the strength you need to push them around. I give it to all my animals."),
                        act.execSync(function () { playSound("snd_bonus"); }),
                        act.say("Here you go!"),
                        act.execSync(function () { powerDrink = true; }),
                        //act.say("Oh, and one last piece of advice."),
                        //act.say("My brother lives in a village in the desert. Do not trust that guy!"),
                        act.say("I really hope you find my sheep. She will probably start following you when you talk to her.")
                    ]);
                } else {
                    act.start([
                        act.say("I really hope you find my sheep. She is probably somewhere in the desert.")
                    ]);
                }
            } else if (!returnedSheep) {
                this.sheep = playerInstance.follower;
                this.sheepDy = Math.floor((4 * 32 - this.sheep.y) / 32);
                this.sheepDx = Math.floor((16 * 32 - this.sheep.x) / 32);

                act.start([
                    act.say("Oh, you found my sheep!"),
                    act.say("Thank you so much!"),
                    act.execSync(function () { playSound("snd_bonus"); }),
                    act.say("I will let you enter the cave now."),
                    act.say("Be careful though, it's dark inside and there are some rotating obstacles along the way."),
                    act.execSync(function () {
                        returnedSheep = true;
                        movement.unfollow(playerInstance.follower, playerInstance);
                    }),
                    act.walkCount(cavePig, 2, 0, 2),
                    act.walkCount(this, 2, 0, 2),
                    act.walkCount(this.sheep, 2, 270, this.sheepDy),
                    act.walkCount(this.sheep, 2, 0, this.sheepDx),
                    act.walkCount(this.sheep, 2, 90, 2),
                    act.face(this.sheep, 270),
                    act.wait(200),
                    act.face(cavePig, 270),
                    act.wait(200),
                    act.face(this, 270)
                ]);
            } else {
                act.start([
                    act.say("Thank you once again for helping me find my adorable sheep!"),
                ]);
            }
        }
    }
}, false, 1, 1);

assets.createObject("obj_npc4", {
    oncreate: function () {
        this.sprite = ["img_woman1", "img_woman2", "img_woman1", "img_woman3"];
        this.rotation = Math.floor(Math.random() * 4) * 90;
        this.startX = this.x;
        this.startY = this.y;
        this.walking = false;
    },
    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing || this.walking) return;
        var self = this;

        if (Math.random() < 0.01) {
            if (this.x === this.startX && this.y === this.startY) {
                this.rotation = Math.floor(Math.random() * 4) * 90;
                this.walking = true;
                movement.walk(this, 2, this.rotation, function () { self.walking = false; });
            } else {
                if (this.x !== this.startX) this.rotation = this.x < this.startX ? 0 : 180;
                if (this.y !== this.startY) this.rotation = this.y < this.startY ? 270 : 90;
                this.walking = true;
                movement.walk(this, 2, this.rotation, function () { self.walking = false; });
            }
        }

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.rotation = (playerInstance.rotation + 180) % 360;
            if (ending1 || ending2) {
                act.start([
                    act.say("I manipulated sheep in my early days. On a massive scale."),
                    act.say("I made pigs out of them! It's crazy!"),
                    act.say("Whenever you see a pig or a sheep now, you cannot be certain that it is actually a pig or a sheep."),
                    act.say("..."),
                    act.say("My boss was a bald man who loved snow. And pigs. He always said his pigs were pretty amazing."),
                    act.execSync(function () { storyTruth = true; }),
                    act.say("I've seen things you don't want to now...")
                ]);
            } else {
                act.start([
                    act.say("I heard you lost a pig..."),
                    act.say("I'm so sorry."),
                    act.say("If you find him, let me know!")
                ]);
            }
        }
    }
}, false, 1, 1);

assets.createObject("obj_npc5", {
    oncreate: function () {
        this.sprite = ["img_human_sunglasses"];
    },
    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing) return;
        var self = this;

        /*
        if (foundSheep && !showedSheep && playerInstance.x >= 32 * 2) {
            showedSheep = true;
            var count = Math.floor((playerInstance.y - this.y) / 32);
            act.start([
                act.alert(this.x, this.y),
                act.face(this, 180),
                act.wait(1200),
                act.walkCount(this, 2, 270, count),
                act.walkCount(this, 2, 180, 3),
                act.say("You found the sheep!"),
                act.wait(500),
                act.face(this, 0),
                act.wait(1000),
                act.face(this, 180),
                act.wait(500),
                act.say("..."),
                act.say("You know what? I would like to make you an offer."),
                act.say("I know my brother wants his sheep back, but I would love to keep it here and take care of her myself."),
                act.say("I have a pair of shears and I can give you one. You can shear sheep with it!"),
                act.ask("What do you think? Wanna trade the sheep for shears?", function (yes, cb) {
                    if (yes) {
                        act.start([
                            act.say("Yes!?"),
                            act.say("Here, thanks a lot!"),
                            act.execSync(function () {
                                tradedSheep = true;
                                var follower = playerInstance.follower;
                                movement.unfollow(playerInstance.follower, playerInstance);
                                movement.follow(self, follower);
                            }),
                            act.walkCount(self, 2, 0, 3),
                            act.walkCount(self, 2, 90, count),
                            act.walk(self, 2, 180),
                            act.walk(self, 2, 0),
                            act.face(self, 270)
                        ], cb);
                    } else {
                        act.start([
                            act.say("No?!"),
                            act.say("Oh well..."),
                            act.say("If you change your mind, let me know."),
                            act.walkCount(self, 2, 0, 3),
                            act.walkCount(self, 2, 90, count),
                            act.face(self, 270)
                        ], cb);
                    }
                }),
            ]);
        }
        */

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.rotation = (playerInstance.rotation + 180) % 360;
            if (!foundSheep) {
                act.start([
                    act.say("Howdy!"),
                    act.say("..."),
                    act.say("You are looking for a pig and a sheep, you say?"),
                    act.say("I haven't seen no pig, but I think I did see a sheep pass by!"),
                    act.say("It must be somewhere in the desert now."),
                    act.say("Good luck finding it, I guess!"),
                ]);
            } else if (!returnedSheep) {
                act.start([
                    act.say("I see you found the sheep! Well done!")
                ]);
            } else {
                act.start([
                    act.say("ZZZzzz...")
                ]);
            }

            /*
            if (foundSheep && tradedSheep && !caveOpen) {
                act.start([
                    act.ask("Do you want to trade the shears back for the sheep?", function (yes, cb) {
                        if (yes) {
                            act.start([
                                act.say("If you change your mind again, please let me know!"),
                                act.
                            ], cb);
                        } else {
                            act.start([
                                act.say("Alrighty!");
                            ], cb);
                        }
                    });
                ]);
            }
            */
        }
    }
}, false, 1, 1);

assets.createObject("obj_npc6", {
    oncreate: function () {
        this.sprite = ["img_human_bald_gray"];
    },
    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing) return;

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.rotation = (playerInstance.rotation + 180) % 360;
            if (!storyTruth) {
                act.start([
                    act.say("Hey there!"),
                    act.say("It's been a long time since I saw someone here."),
                    act.say("Fortunately, I have my pigs to talk to. They are pretty amazing!"),
                    act.face(this, 180)
                ]);
            } else {
                act.start([
                    act.say("..."),
                    act.say("... !"),
                    act.say("She told you, didn't she?"),
                    act.say("..."),
                    act.say("Yes."),
                    act.say("Those pigs aren't real pigs. They are actually sheep..."),
                    act.say("I did not expect anyone to discover this. But you did."),
                    act.say("And because of that I must congratulate you."),
                    act.execSync(function () { playSound("snd_bonus"); }),
                    act.say("Congratulations!"),
                    act.say("I hope you liked the adventure! :)"),
                    act.face(this, 270),
                    act.wait(250),
                    act.face(this, 0),
                    act.wait(250),
                    act.face(this, 90),
                    act.wait(250),
                    act.face(this, 180),
                    act.wait(150),
                    act.face(this, 270),
                    act.wait(150),
                    act.face(this, 0),
                    act.wait(150),
                    act.face(this, 90),
                    act.wait(150),
                    act.face(this, 180),
                    act.wait(50),
                    act.face(this, 270),
                    act.wait(50),
                    act.face(this, 0),
                    act.wait(50),
                    act.face(this, 90),
                    act.wait(50),
                    act.face(this, 180),
                    act.wait(50),
                    act.face(this, 270),
                    act.wait(50),
                    act.face(this, 0),
                    act.wait(50),
                    act.face(this, 90),
                    act.wait(50),
                    act.face(this, 180)
                ], function () {
                    gameloop.gotoRoom("rm_credits");
                });
            }
        }
    }
}, false, 1, 1);

assets.createObject("obj_npc7", {
    oncreate: function () {
        this.sprite = ["img_human_beard"];
    },
    onupdate: function () {
        draw.object(this, 2, 2);
        if (textShowing) return;
        var self = this;

        if (nol.keyboardPressed("enter") && movement.isFacing(playerInstance, this.x, this.y)) {
            this.rotation = (playerInstance.rotation + 180) % 360;

            if (ending2) {
                act.start([
                    act.say("..."),
                    act.say("I remember the exact words now!"),
                    act.say("LOST A PIG!"),
                    act.say("..."),
                    act.say("Hey, you lost a pig, didn't you?"),
                    act.say("But you didn't say those words here, did you?"),
                    act.say("..."),
                    act.say("This is weird..."),
                    act.say("I'm gonna take a nap.")
                ], function () {
                    self.rotation = 180;
                });
            }
            else if (doneQuiz) {
                act.start([
                    act.say("Who are you?!"),
                    act.say("Let me tell you a secret!"),
                    act.say("GOAT LIPS!"),
                    act.say("It's an anagram!"),
                    act.say("...")
                ], function () {
                    self.rotation = 180;
                });
            } else {
                act.start([
                    act.say("..."),
                    act.say("If you give the correct answer to each question I ask, I will tell you a secret."),
                    act.say("..."),
                    act.ask("Do I have a beard?", function (yes, cb) {
                        if (yes) {
                            act.start([
                                act.say("I do indeed! Hehehe!"),
                                act.say("Next question..."),
                                act.ask("Is your answer to this question 'no'?", function (yes, cb) {
                                    act.start([
                                        //act.say("That's correct, I think! That was a tricky one, wasn't it?"),
                                        act.say((yes ? "Wait, how can it be 'no' if you answer 'yes'?" : "Wait, how can it not be 'no' if you answer 'no'?") + " That does not make any sense..."),
                                        act.say("Whatever, let me ask you a final question..."),
                                        act.ask("What is the meaning of life?", function (yes, cb) {
                                            act.start([
                                                act.say("..."),
                                                act.say("Erhm, that's a weird answer..."),
                                                act.say("But maybe you are right. I never thought of it that way..."),
                                                act.say("..."),
                                                act.say("Very well, I will tell you my secret now."),
                                                act.say("Not too long ago, I heard someone walking in this cave."),
                                                act.say("I did not see anyone, but I heard someone say something. It was something very important, apparently..."),
                                                act.say("I do not remember the exact words, but somehow I do remember every single letter!"),
                                                act.say("It was something like..."),
                                                act.say("..."),
                                                act.say('"goat lips"'),
                                                act.say("..."),
                                                act.say("The order of the letters may be wrong, though."),
                                                act.say("..."),
                                                act.say("Cool secret, isn't it? Hehehe!"),
                                                act.execSync(function () { doneQuiz = true; }),
                                                act.say("Now I'm gonna take a nap.")
                                            ], cb);
                                        })
                                    ], cb)
                                })
                            ], cb)
                        } else {
                            act.start([
                                act.say("No?!"),
                                act.say("That's wrong, I think I have one.")
                            ], cb)
                        }
                    })
                ], function () {
                    self.rotation = 180;
                });
            }
        }
    }
}, false, 1, 1);

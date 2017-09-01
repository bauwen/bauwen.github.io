var canvas = document.getElementById("display");

var game = new Game(canvas);
var ctx = game.ctx;

var hasLocalStorage = true;

try {
    if (!localStorage.getItem("highscore1")) {
        localStorage.setItem("highscore1", -1);
    }
    
    if (!localStorage.getItem("highscore2")) {
        localStorage.setItem("highscore2", -1);
    }
} catch (err) {
    hasLocalStorage = false;
}

var scoreMode1 = -1;
var scoreMode2 = -1;

var menuStarted = false;

function getMsTime() {
    //return (new Date()).getTime();
    return performance.now();
}

function Overlay() {
    this.scene = "";
    this.size = 500;
    this.out = false;
    
    this.update = function () {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.globalAlpha = Math.max(0, Math.min(this.size / 300, 1));
        
        if (this.out) {
            fillCircle(ctx.canvas.width / 2, ctx.canvas.height / 2, this.size);
            //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            if (this.size < 500) {
                this.size += (550 - this.size) / 8;
            } else {
                game.enterScene(this.scene);
            }
        } else {
            if (this.size > 5) {
                this.size += (0 - this.size) / 8;
                fillCircle(ctx.canvas.width / 2, ctx.canvas.height / 2, this.size);
                //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }
        
        ctx.globalAlpha = 1;
    };
    
    this.fade = function (scene) {
        this.scene = scene;
        this.out = true;
    };
}

function drawButton(text, x, y, callback) {
    var color1 = "rgb(240, 240, 240)";
    var color2 = "rgb(20, 20, 20)";
    var w = 230;
    var h = 60;
    var hover = mouseInBox(x - w / 2, y - h / 2, w, h);
    var l = 2;
    var s = 0;
    
    ctx.font = "24px gamefont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.fillStyle = color1;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    
    if (hover) {
        
        /*
        ctx.fillStyle = color2;
        ctx.fillRect(x - w / 2 + l, y - h / 2 + l, w - 2 * l, h - 2 * l);
        ctx.fillStyle = color1;
        ctx.fillRect(x - w / 2 + s, y - h / 2 + s, w - 2 * s, h - 2 * s);
        */
        
        ctx.fillStyle = color2;
        ctx.fillText(text, x, y);
        
        if (game.mousePressed("Left") && callback) {
            callback();
        }
    } else {
        ctx.fillStyle = color2;
        ctx.fillRect(x - w / 2 + l, y - h / 2 + l, w - 2 * l, h - 2 * l);
        ctx.fillStyle = color1;
        ctx.fillText(text, x, y);
    }
};

game.addObject("obj_menu", {
    create: function () {
        this.overlay = new Overlay();
        
        if (!menuStarted) {
            this.overlay.size = 0;
            menuStarted = true;
        }
        
        var self = this;
        
        this.gotoMode1 = function () {
            self.overlay.fade("scn_mode1");
        };
        
        this.gotoMode2 = function () {
            self.overlay.fade("scn_mode2");
        };
    },
    
    update: function () {
        var cx = ctx.canvas.width / 2;
        var cy = ctx.canvas.height / 2;
        
        drawButton("Play Mode 1", cx, cy - 100, this.gotoMode1);
        drawButton("Play Mode 2", cx, cy + 80, this.gotoMode2);
        
        ctx.font = "18px gamefont, sans-serif";
        ctx.fillStyle = "rgb(220, 220, 50)";
        
        ctx.fillText("Your highscore: " + (scoreMode1 < 0 ? "n/a" : scoreMode1 + " ms"), cx, cy - 100 + 65);
        ctx.fillText("Your highscore: " + (scoreMode2 < 0 ? "n/a" : scoreMode2 + " ms"), cx, cy + 80 + 65);
        
        this.overlay.update();
    }
});

game.addObject("obj_mode1", {
    create: function () {
        this.overlay = new Overlay();
        
        this.state = 0;
        this.wait = 0;
        this.timer = 0;
        this.time = 0;
        this.ms = 0;
        this.highscore = false;
        this.failMessage = "";
        this.tween = new Tween(0.9, 10);
        this.failMessages = [
            "Too soon.",
            "Nope.",
            "Just. Wait.",
            "Fail.",
            "...almost?",
            "infinity ms",
            "It's not green.",
            "It's red.",
            "Not good."
        ];
        
        var self = this;
        
        this.start = function () {
            self.highscore = false;
            self.wait = 20;
            self.timer = 90 + Math.floor(Math.random() * 270);
            self.state = 1;
        };
        
        this.succeed = function () {
            if (scoreMode1 < 0 || self.ms < scoreMode1) {
                scoreMode1 = self.ms;
                self.tween.set(20);
                self.highscore = true;
                
                if (scoreMode1 > 0) {
                    localStorage.setItem("highscore1", scoreMode1 * 1000);
                    window.api.submitStat(window.STAT_SCORE1, scoreMode1 * 1000);
                }
            } else {
                self.tween.set(20);
            }
            
            self.state = 3;
        };
        
        this.fail = function (timeout) {
            self.tween.set(-20);
            self.failMessage = timeout ? "Too late." : self.failMessages[Math.floor(Math.random() * self.failMessages.length)];
            self.state = 4;
        };
        
        this.stop = function () {
            self.overlay.fade("scn_menu");
        };
    },
    
    update: function () {
        ctx.font = "22px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        var cx = ctx.canvas.width / 2;
        var cy = ctx.canvas.height / 2;
        
        if (this.state === 0) {  // explaining
            ctx.fillStyle = "white";
            ctx.fillText("Tap when a white dot appears.", cx, cy - 100);
            ctx.fillText("As fast as you can.", cx, cy - 60);
            
            drawButton("Okay", cx, cy + 50, this.start);
            drawButton("Go Back", cx, cy + 130, this.stop);
        }
        else if (this.state === 1) {  // waiting
            ctx.fillStyle = "white";
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText("0 ms", cx, cy - 5);
            
            if (this.timer > 0) {
                this.timer -= 1;
            } else {
                game.playSound("snd_show");
                this.time = getMsTime();
                this.state = 2;
            }
            
            if (this.wait > 0) {
                this.wait -= 1;
            }
            else if (game.mousePressed("Left")) {
                this.fail();
            }
        }
        else if (this.state === 2) {  // counting
            //this.ms = Math.round(getMsTime() - this.time);
            this.ms = Math.round((getMsTime() - this.time) * 100) / 100;
            
            ctx.fillStyle = "white";
            fillCircle(cx, cy - 140, 60);
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText(this.ms + " ms", cx, cy - 5);
            
            if (game.mousePressed("Left")) {
                if (this.ms < 30) {
                    this.fail();
                } else {
                    this.succeed();
                }
            }
            else if (this.ms > 2000) {
                this.fail(true);
            }
        }
        else if (this.state === 3) {  // success
            if (this.highscore) {
                ctx.fillStyle = "rgb(100, 200, 100)";
                fillCircle(cx, cy - 140, 70 + this.tween.get());
                
                ctx.fillStyle = "black";
                ctx.font = "16px gamefont, sans-serif";
                ctx.fillText("NEW", cx, cy - 150);
                ctx.fillText("HIGHSCORE!", cx, cy - 130);
            } else {
                ctx.fillStyle = "rgb(100, 200, 100)";
                fillCircle(cx, cy - 140, 70 + this.tween.get());
            }
            
            ctx.fillStyle = this.highscore ? "rgb(230, 230, 30)" : "white";
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText(this.ms + " ms", cx, cy - 5);
            
            drawButton("Replay", cx, cy + 90, this.start);
            drawButton("Stop", cx, cy + 170, this.stop);
        }
        else if (this.state === 4) {  // fail
            ctx.fillStyle = "rgb(200, 100, 100)";
            fillCircle(cx, cy - 140, 70 + this.tween.get());
            
            ctx.fillStyle = "white";
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText(this.failMessage, cx, cy - 5);
            
            drawButton("Replay", cx, cy + 90, this.start);
            drawButton("Stop", cx, cy + 170, this.stop);
        }
        
        this.overlay.update();
    }
});

game.addObject("obj_mode2", {
    create: function () {
        this.overlay = new Overlay();
        
        this.state = 0;
        this.wait = 0;
        this.timer = 0;
        this.time = 0;
        this.ms = 0;
        this.highscore = false;
        this.failMessage = "";
        this.tween = new Tween(0.9, 10);
        this.failMessages = [
            "Too soon.",
            "Nope.",
            "Just. Wait.",
            "Fail.",
            "...almost?",
            "infinity ms",
            "It's not green.",
            "It's red.",
            "Not good."
        ];
        this.count = 0;
        this.clicks = 0;
        this.timeout = 0;
        
        var self = this;
        
        this.start = function () {
            self.highscore = false;
            self.wait = 20;
            self.timer = 90 + Math.floor(Math.random() * 270);
            self.count = 2 + Math.floor(Math.random() * 4);
            self.clicks = 0;
            self.state = 1;
        };
        
        this.succeed = function () {
            if (scoreMode2 < 0 || self.ms < scoreMode2) {
                scoreMode2 = self.ms;
                self.tween.set(20);
                self.highscore = true;
                
                if (scoreMode2 > 0) {
                    localStorage.setItem("highscore2", scoreMode2 * 1000);
                    window.api.submitStat(window.STAT_SCORE2, scoreMode2 * 1000);
                }
            } else {
                self.tween.set(20);
            }
            
            self.wait = 20;
            self.state = 3;
        };
        
        this.fail = function (timeout, over) {
            self.tween.set(-20);
            
            if (over) {
                self.failMessage = "Too many.";
            }
            else if (timeout) {
                self.failMessage = "Too slow.";
            }
            else {
                self.failMessage = self.failMessages[Math.floor(Math.random() * self.failMessages.length)];
            }
            
            self.wait = 20;
            self.state = 4;
        };
        
        this.stop = function () {
            self.overlay.fade("scn_menu");
        };
    },
    
    update: function () {
        ctx.font = "22px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        var cx = ctx.canvas.width / 2;
        var cy = ctx.canvas.height / 2;
        
        if (this.state === 0) {  // explaining
            ctx.fillStyle = "white";
            ctx.fillText("When a white dot appears,", cx, cy - 140);
            ctx.fillText("tap as many times as displayed.", cx, cy - 100);
            ctx.fillText("As fast as you can.", cx, cy - 60);
            
            drawButton("Okay", cx, cy + 50, this.start);
            drawButton("Go Back", cx, cy + 130, this.stop);
        }
        else if (this.state === 1) {  // waiting
            ctx.fillStyle = "white";
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText("0 ms", cx, cy - 5);
            
            if (this.timer > 0) {
                this.timer -= 1;
            } else {
                game.playSound("snd_show");
                this.time = getMsTime();
                this.state = 2;
            }
            
            if (this.wait > 0) {
                this.wait -= 1;
            }
            else if (game.mousePressed("Left")) {
                this.fail();
            }
        }
        else if (this.state === 2) {  // counting
            if (this.clicks === 0) {
                //this.ms = Math.round(getMsTime() - this.time);
                this.ms = Math.round((getMsTime() - this.time) * 100) / 100;
            } else {
                if (this.timeout > 0) {
                    this.timeout -= 1;
                } else {
                    if (this.clicks === this.count) {
                        this.succeed();
                    } else {
                        this.fail(true);
                    }
                }
            }
            
            ctx.fillStyle = "white";
            fillCircle(cx, cy - 140, 60);
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText(this.ms + " ms", cx, cy - 5);
            
            ctx.font = "64px gamefont, sans-serif";
            ctx.fillStyle = "rgb(20, 20, 20)";
            ctx.fillText(this.count - this.clicks*0, cx, cy - 140 + 2);
            
            if (game.mousePressed("Left")) {
                this.clicks += 1;
                this.timeout = 10;
                
                if (this.clicks > this.count) {
                    this.fail(true, true);
                }
                
                if (this.ms < 30) {
                    this.fail();
                }
            }
            else if (this.ms > 2000) {
                this.fail(true);
            }
        }
        else if (this.state === 3) {  // success
            if (this.highscore) {
                ctx.fillStyle = "rgb(100, 200, 100)";
                fillCircle(cx, cy - 140, 70 + this.tween.get());
                
                ctx.fillStyle = "black";
                ctx.font = "16px gamefont, sans-serif";
                ctx.fillText("NEW", cx, cy - 150);
                ctx.fillText("HIGHSCORE!", cx, cy - 130);
            } else {
                ctx.fillStyle = "rgb(100, 200, 100)";
                fillCircle(cx, cy - 140, 70 + this.tween.get());
            }
            
            ctx.fillStyle = this.highscore ? "rgb(230, 230, 30)" : "white";
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText(this.ms + " ms", cx, cy - 5);
            
            if (this.wait > 0) {
                this.wait -= 1;
            } else {
                drawButton("Replay", cx, cy + 90, this.start);
                drawButton("Stop", cx, cy + 170, this.stop);
            }
        }
        else if (this.state === 4) {  // fail
            ctx.fillStyle = "rgb(200, 100, 100)";
            fillCircle(cx, cy - 140, 70 + this.tween.get());
            
            ctx.fillStyle = "white";
            ctx.font = "48px gamefont, sans-serif";
            ctx.fillText(this.failMessage, cx, cy - 5);
            
            if (this.wait > 0) {
                this.wait -= 1;
            } else {
                drawButton("Replay", cx, cy + 90, this.start);
                drawButton("Stop", cx, cy + 170, this.stop);
            }
        }
        
        this.overlay.update();
    }
});

game.addScene("scn_menu", {
    enter: function () {
        game.createInstance("obj_menu");
    }
});

game.addScene("scn_mode1", {
    enter: function () {
        game.createInstance("obj_mode1");
    }
});

game.addScene("scn_mode2", {
    enter: function () {
        game.createInstance("obj_mode2");
    }
});

window.addEventListener("load", function () {
    canvas.width = Math.min(window.innerWidth, 720);
    
    APILoader(function (api) {
        
        window.api = api;
        window.STAT_SCORE1 = "Highscore Mode 1";
        window.STAT_SCORE2 = "Highscore Mode 2";
        
        if (hasLocalStorage) {
            if (localStorage.getItem("highscore1")) {
                scoreMode1 = parseInt(localStorage.getItem("highscore1"));
                
                if (scoreMode1 > 0) {
                    window.api.submitStat(window.STAT_SCORE1, scoreMode1);
                }
                
                scoreMode1 /= 1000;
            }
            
            if (localStorage.getItem("highscore2")) {
                scoreMode2 = parseInt(localStorage.getItem("highscore2"));
                
                if (scoreMode2 > 0) {
                    window.api.submitStat(window.STAT_SCORE2, scoreMode2);
                }
                
                scoreMode2 /= 1000;
            }
        }
        
        game.loadAssets({
            fonts: {
                timeout: 1000,
                "gamefont": "src/font.ttf"
            },
            
            sounds: {
                "snd_show": "src/snd_show.wav"
            }
        }, {
            finish: function () {
                game.run();
                game.enterScene("scn_menu");
            }
        });
    });
});

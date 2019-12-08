var canvas = document.getElementById("display");
var game = new Game(canvas);
var ctx = document.createElement("canvas").getContext("2d");

var hasLocalStorage = true;

try {
    if (!localStorage.getItem("music")) {
        localStorage.setItem("music", "on");
    }
    
    if (!localStorage.getItem("sounds")) {
        localStorage.setItem("sounds", "on");
    }
} catch (err) {
    hasLocalStorage = false;
}

var backcol = {r: 0, g: 0, b: 0};//{r: 40, g: 40, b: 40};
var flashcol = {r: 0, g: 0, b: 0};//{r: 90, g: 90, b: 90};
var sidecol = {r: 0, g: 0, b: 0};//{r: 140, g: 140, b: 40};
var solidcol = {r: 0, g: 0, b: 0};//{r: 200, g: 40, b: 40};
var coincol = {r: 0, g: 0, b: 0};//{r: 200, g: 200, b: 40};
var playercol = {r: 0, g: 0, b: 0};//{r: 220, g: 140, b: 60};
var linecol = {r: 0, g: 0, b: 0};//{r: 200, g: 200, b: 200};

var backcolTarget = {r: 240, g: 240, b: 240};
var flashcolTarget = {r: 90, g: 90, b: 90};
var sidecolTarget = {r: 140, g: 140, b: 40};
var solidcolTarget = {r: 200, g: 40, b: 40};
var coincolTarget = {r: 200, g: 200, b: 40};
var playercolTarget = {r: 220, g: 140, b: 60};
var linecolTarget = {r: 200, g: 200, b: 200};

var flashalpha = 0;
var sidealpha = 0;
var flashalphaTarget = 0;
var sidealphaTarget = 0;

var FACTOR = 1.2;

ctx.canvas.width = canvas.width * 1.2;
ctx.canvas.height = canvas.height * 1.2;
canvas.style.backgroundColor = getColor(backcol);

var WIDTH = ctx.canvas.width;
var HEIGHT = ctx.canvas.height;
var YVIEW = HEIGHT * 3 / 4;

var controller = null;
var health = 100;
var coinTotal = 10;
var coinCurrent = 0;
var coinAngle = 0;
var level = 1;

var playing = false;
var dead = false;
var deadTimer = 0;

var gameLoaded = false;
var gameLoadProgress = 0;

var menu = false;
var menuAlpha = 0;
var startState = 0;
var menuItem = 0;

var unlocked = false;
var unlockLevel = 5;
var firstTime = true;
var firstTimeCollect = true;

var text1X = 0;
var text2X = 0;
var text3Y = 0;
var textAllY = 0;
var textTimer = 0;

var startY = 0;

var solidTimer = 0;
var solidInterval = 20;
var coinTimer = 0;

var whiteMode = true;

var flashType = 0;

var triangleCount = 0;
var screenShake = 0;
var longSquare = false;
var upsideDown = false;
var oscillation = false;
var grayShift = false;
var backForth = false;
var hueNess = false;
var noDanger = false;

var grayValue = 0;
var grayUp = false;

var hueValue = 0;

var sideNumber = 5;

var exploAlpha = 0;
var newHighScoreAlpha = 0;

var avoidHighScore = 0;
var avoidLevel = 0;

var collectHighScore = 0;
var collectLevel = 0;
var collectMode = false;

var errorSize = 0;

var playerDelta = 0;
var playerDeltaBool = false;

var MUSIC = true;
var SOUNDS = true;

var efx = 0;
var efdx = 0;
var efbool = false;

var avoidAllLevelsDone = false;
var collectAllLevelsDone = false;
var avoidTopscore = false;
var collectTopscore = false;

var textScoreAlpha = 0;

var avoidInfoList = [
    "Control the disk",
    "Avoid the rectangles",
    "Collect the triangles"
];

var collectInfoList = [
    "Control the disk",
    "Collect the rings",
    "Don't miss one"
];

ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "20px fnt_menufont, sans-serif";

game.ctx.font = "bold 81px fnt_menufont, sans-serif";
game.ctx.textAlign = "right";
game.ctx.strokeStyle = "black";
game.ctx.lineWidth = 3;

var grad = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 300, WIDTH / 2, HEIGHT / 2, 0);
grad.addColorStop(0, "rgba(0, 0, 0, 0)");
grad.addColorStop(1, "rgba(0, 0, 0, 1)");

game.addObject("obj_foreground", {
    create: function () {
        this.depth = -1000;
    },
    
    update: function () {
        updateColor(backcol, backcolTarget);
        updateColor(flashcol, flashcolTarget);
        updateColor(sidecol, sidecolTarget);
        updateColor(solidcol, solidcolTarget);
        updateColor(coincol, coincolTarget);
        updateColor(playercol, playercolTarget);
        updateColor(linecol, linecolTarget);
        flashalpha = updateAlpha(flashalpha, flashalphaTarget);
        sidealpha = updateAlpha(sidealpha, sidealphaTarget);
        canvas.style.backgroundColor = getColor(backcol);
        
        if (newHighScoreAlpha > 0) {
            ctx.font = "bold 64px fnt_menufont, sans-serif";
            ctx.lineWidth = 3;
            ctx.globalAlpha = newHighScoreAlpha;
            ctx.fillStyle = getColor(playercol);
            ctx.fillText("NEW HIGHSCORE!", WIDTH / 2, HEIGHT / 2);
            ctx.strokeStyle = "black";
            ctx.strokeText("NEW HIGHSCORE!", WIDTH / 2, HEIGHT / 2);
            ctx.globalAlpha = 1;
            ctx.font = "20px fnt_menufont, sans-serif";
            
            if (newHighScoreAlpha > 0.6) {
                newHighScoreAlpha -= 0.005;
            } else {
                newHighScoreAlpha -= 0.02;
            }
        } else {
            newHighScoreAlpha = 0;
        }
        
        if (exploAlpha > 0) {
            ctx.globalAlpha = exploAlpha;
            ctx.fillStyle = getColor(playercol);
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 1;
            
            exploAlpha -= 0.05;
        } else {
            exploAlpha = 0;
        }
        
        var shx = 0;
        var shy = 0;
        
        if (screenShake > 0) {
            shx = Math.random() * screenShake;
            shy = Math.random() * screenShake;
        }
        
        game.ctx.save();
        game.ctx.translate(canvas.width / 2 + shx, canvas.height / 2 + shy);
        game.ctx.rotate(controller ? controller.angle : 0);
        game.ctx.drawImage(ctx.canvas, -ctx.canvas.width / 2, -ctx.canvas.height / 2);
        game.ctx.restore();
        
        if (playing) {
            if (textScoreAlpha < 1) {
                textScoreAlpha += 0.05;
            }
        } else {
            if (textScoreAlpha > 0) {
                textScoreAlpha -= 0.01;
            }
        }
        
        textScoreAlpha = Math.max(0, Math.min(textScoreAlpha, 1));
        
        if (textScoreAlpha > 0) {
            game.ctx.globalAlpha = textScoreAlpha * 1;
            //game.ctx.strokeText(triangleCount, game.canvas.width - 40, 80);
            
            var tsx = game.canvas.width - 40;
            var tsy = 90;
            
            //game.ctx.globalAlpha = textScoreAlpha * 1;
            /*game.ctx.fillStyle = "black";
            game.ctx.fillText(triangleCount, tsx + 1, tsy);
            game.ctx.fillText(triangleCount, tsx - 1, tsy);
            game.ctx.fillText(triangleCount, tsx, tsy + 1);
            game.ctx.fillText(triangleCount, tsx, tsy - 1);
            //*/
            
            game.ctx.font = "bold 81px fnt_menufont, sans-serif";
            game.ctx.fillStyle = getColor(coincol);
            game.ctx.fillText(triangleCount, tsx, tsy);
            
            game.ctx.globalAlpha = 1;
        }
    }
});

game.addObject("obj_midground", {
    create: function () {
        this.depth = 998;
    },
    
    update: function () {
        var l;
        var offset = 0;
        
        ctx.fillStyle = getColor(linecol);
        ctx.globalAlpha = 0.2;
        fillTriangle(offset, HEIGHT, WIDTH / 2, HEIGHT / 2, WIDTH - offset, HEIGHT);
        ctx.globalAlpha = 1;
        
        l = 12;
        //ctx.fillStyle = getColor(linecol);
        fillTriangle(offset, HEIGHT, WIDTH / 2, HEIGHT / 2, offset + l, HEIGHT);
        fillTriangle(WIDTH - offset, HEIGHT, WIDTH / 2, HEIGHT / 2, WIDTH - offset + l, HEIGHT);
        
        var n = sideNumber;
        var o = ctx.canvas.height / 20;
        
        l = 16 * 3;
        ctx.fillStyle = getColor(sidecol);
        ctx.globalAlpha = sidealpha;
        
        for (var i = 0; i < n; i++) {
            var yi = i / n * (HEIGHT - 2 * o);
            
            fillTriangle(-32, o + yi, WIDTH / 2, HEIGHT / 2, -32, o + yi + l);
            fillTriangle(WIDTH + 32, o + yi, WIDTH / 2, HEIGHT / 2, WIDTH + 32, o + yi + l);
        }
        
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = grad;
        fillCircle(WIDTH / 2, HEIGHT / 2, 300);
        ctx.globalCompositeOperation = "source-over";
    }
});

game.addObject("obj_background", {
    create: function () {
        this.depth = 1000;
    },
    
    update: function () {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
});

game.addObject("obj_decor", {
    create: function () {
        this.depth = 999;
        this.t = 0;
        this.r = 0;
        this.vel = 0;
        this.acc = 0.09 / 60;
        
        this.type = flashType;
    },
    
    update: function () {
        this.vel += this.acc;
        this.r += this.vel;
        
        var r = Math.pow(this.r, 3) * 2;
        ctx.strokeStyle = getColor(flashcol);
        ctx.globalAlpha = flashalpha;
        
        if (this.type === 0) {
            ctx.lineWidth = r / 12;
            strokeFlatCircle(WIDTH / 2, HEIGHT / 2, r / 4, r / 4);
            
            if (this.r > 9 * 1.2) {
                game.destroyInstance(this);
            }
        }
        else if (this.type === 1) {
            ctx.lineWidth = r / 30;
            strokeCircle(WIDTH / 2, HEIGHT / 2, r / 12);
            
            if (this.r > 9 * 1.6) {
                game.destroyInstance(this);
            }
        }
        else if (this.type === 2) {
            r /= 8;
            ctx.lineWidth = r / 2;
            ctx.strokeRect(WIDTH / 2 - r, HEIGHT / 2 - r, 2 * r, 2 * r);
            
            if (this.r > 9 * 1.4) {
                game.destroyInstance(this);
            }
        }
        
        ctx.globalAlpha = 1;
    }/*,
    
    destroy: function () {
        console.log("destroyed a decor piece");
    }
    */
});

game.addObject("obj_obstacle", {
    create: function () {
        this.depth = 0;
        this.dist = 0;
        this.vel = 20;
        this.acc = 0;
        this.test = 0;
        
        this.func = function (d) {
            return Math.pow(d / 5000, 2);
        };
        
        this.velocity = 3000; // less is faster (1500 is probably a limit)
        this.special = false;
        this.dx = 0;
        this.osc = 0;
        this.bf = 0;
        
        this.oscillation = oscillation;
        this.backForth = backForth;
        
        this.longsq = longSquare;
    },
    
    update: function () {
        this.dist += this.vel;
        this.vel += this.acc;
        this.acc += this.test;
        
        this.test = Math.pow(this.dist / this.velocity, 5);  // Math.pow(this.dist / 2000, 5);
        
        this.depth = -this.dist / (1400 * 10);
        
        if (this.dist > 1400 * 4) {
            this.depth = -2;
        }
        
        
        if (this.dist >= 1400 * 10) {
            game.destroyInstance(this);
            return;
        }
        
        if (this.oscillation) {
            this.osc = (this.osc + 0.1) % (2 * Math.PI);
        }
        
        if (this.backForth) {
            this.bf = (this.bf + 0.2) % (2 * Math.PI);
        }
        
        var t = this.func(this.dist + (this.backForth ? 400 * Math.cos(this.bf) : 0));
        var x = WIDTH / 2 + (this.x - WIDTH / 2) * t + (this.oscillation ? 10 * Math.cos(this.osc) : 0);
        var y = HEIGHT / 2 + (this.y - HEIGHT / 2) * t;
        var r = 64 * t;
        
        var h = this.longsq ? 2 : 1;
        
        if (this.special) {
            h = 1;
        }
        
        ctx.globalAlpha = Math.max(0, Math.min(10 * t, 1));
        
        var cxx = controller.xx;
        
        if (playing &&
            0.90 < t && t < 1.1 && Math.abs(YVIEW - this.y) < 50 &&
            x - h * r - WIDTH / 2 < cxx && cxx < x + h * r - WIDTH / 2) { 
            if (this.special) {
                coinCurrent += 1;
                triangleCount += 1;
                //playerDelta = -15;
                
                game.createInstance("obj_splash", x, y);
                game.destroyInstance(this);
                
                if (SOUNDS) game.playSound("snd_triangle");
            } else {
                dead = true;
                screenShake = 20;
                longSquare = false;
                upsideDown = false;
                oscillation = false;
                grayShift = false;
                backForth = false;
                hueNess = false;
                noDanger = false;
                
                exploAlpha = 1;
                
                if (triangleCount > avoidHighScore) {
                    newHighScoreAlpha = 1;
                    window.api.submitStat(window.STAT_AVOID_HIGHSCORE, triangleCount);
                }
                
                avoidHighScore = Math.max(triangleCount, avoidHighScore);
                avoidLevel = Math.max(level, avoidLevel);
                
                if (hasLocalStorage) {
                    localStorage.setItem("avoidlevel", avoidLevel);
                    localStorage.setItem("avoidhighscore", avoidHighScore);
                }
                
                if (MUSIC) game.pauseMusic("msc_play");
                game.setMusicTime("msc_play", 0);
                
                if (SOUNDS) game.playSound("snd_explosion");
            }
            
            //game.destroyInstance(this);
        }
        
        
        if (this.special) {
            r = r / 1.5;
            ctx.fillStyle = getColor(coincol);
            
            if (upsideDown) {
                fillTriangle(x - r, y - r, x, y + r, x + r, y - r);
            } else {
                fillTriangle(x - r, y + r, x, y - r, x + r, y + r);
            }
        } else {
            r = r / 1.5;
            
            ctx.fillStyle = getColor(solidcol);
            
            if (this.longsq) {
                ctx.fillRect(x - h * r, y - r, 2 * h * r, 2 * r);
            } else {
                ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
            }
        }
        
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_ring", {
    create: function () {
        this.depth = 0;
        this.dist = 0;
        this.vel = 20;
        this.acc = 0;
        this.test = 0;
        
        this.func = function (d) {
            return Math.pow(d / 5000, 2);
        };
        
        this.velocity = 3000; // less is faster (1500 is probably a limit)
        this.special = false;
        this.dx = 0;
        this.osc = 0;
        this.bf = 0;
        
        this.oscillation = oscillation;
        this.backForth = backForth;
        
        this.longsq = longSquare;
        
        this.touched = false;
        this.size = 0;
    },
    
    update: function () {
        
        if ((upsideDown && this.y > HEIGHT / 2) || (!upsideDown && this.y < HEIGHT / 2)) {
            game.destroyInstance(this);
            return;
        }
        
        this.dist += this.vel;
        this.vel += this.acc;
        this.acc += this.test;
        
        this.test = Math.pow(this.dist / this.velocity, 5);  // Math.pow(this.dist / 2000, 5);
        
        this.depth = -this.dist / (1400 * 10);
        
        if (this.dist > 1400 * 4) {
            this.depth = -2;
        }
        
        
        if (this.dist >= 1400 * 10) {
            game.destroyInstance(this);
            return;
        }
        
        if (this.oscillation) {
            this.osc = (this.osc + 0.1) % (2 * Math.PI);
        }
        
        if (this.backForth) {
            this.bf = (this.bf + 0.2) % (2 * Math.PI);
        }
        
        var t = this.func(this.dist + (this.backForth ? 400 * Math.cos(this.bf) : 0));
        var x = WIDTH / 2 + (this.x - WIDTH / 2) * t + (this.oscillation ? 10 * Math.cos(this.osc) : 0);
        var y = HEIGHT / 2 + (this.y - HEIGHT / 2) * t;
        var r = 64 * t;
        
        var h = 1.2 + (this.size > 0 ? 0.4 : 0);
        
        ctx.globalAlpha = Math.max(0, Math.min(10 * t, 1));
        
        if (playing && !this.touched &&
            0.90 < t && t < 1.1 && Math.abs(YVIEW - this.y) < 200) {
            
            var cxx = controller.xx / 1.3;
            
            if (x - h * r - WIDTH / 2 < cxx && cxx < x + h * r - WIDTH / 2) {
                //game.createInstance("obj_splash", x, y);
                if (SOUNDS) game.playSound("snd_triangle");
                triangleCount += 1;
                coinCurrent += 1;
                playerDelta = -15;
                this.touched = true;
                
                var splash = game.createInstance("obj_splashring", x, y);
                splash.r = r / 1.5;
                splash.startR = splash.r;
                splash.size = this.size;
            } else if (true) {
                dead = true;
                screenShake = 20;
                longSquare = false;
                upsideDown = false;
                oscillation = false;
                grayShift = false;
                backForth = false;
                hueNess = false;
                noDanger = false;
                
                exploAlpha = 1;
                
                if (triangleCount > collectHighScore) {
                    newHighScoreAlpha = 1;
                    window.api.submitStat(window.STAT_COLLECT_HIGHSCORE, triangleCount);
                }
                
                collectHighScore = Math.max(triangleCount, collectHighScore);
                collectLevel = Math.max(level, collectLevel);
                
                if (hasLocalStorage) {
                    localStorage.setItem("collectlevel", collectLevel);
                    localStorage.setItem("collecthighscore", collectHighScore);
                }
                
                if (MUSIC) game.pauseMusic("msc_play");
                game.setMusicTime("msc_play", 0);
                
                if (SOUNDS) game.playSound("snd_explosion");
            }
        }
        
        r = r / (this.size > 0 ? 0.75 : 1.5);
        
        ctx.fillStyle = getColor(solidcol);
        ctx.lineWidth = r / 5;
        ctx.strokeStyle = getColor(solidcol);
        strokeCircle(x, y, r);
        
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_deathparticle", {
    create: function () {
        this.depth = -2;
        this.speed = 1 + Math.random() * 50;
        //this.direction = Math.random() * 2 * Math.PI;
        this.size = 2 + Math.random() * 40;
        this.life = 1;
        this.rate = 0.007 + Math.random() * 0.009;
        
        this.direction = Math.PI / 1.5 - Math.atan2(HEIGHT / 2 - this.y, WIDTH / 2 - this.x) - 2 * Math.PI / 1.5 * Math.random();
    },
    
    update: function () {
        this.x += Math.cos(this.direction) * this.speed;
        this.y -= Math.sin(this.direction) * this.speed;
        this.speed *= 0.90;
        this.life -= this.rate;
        
        if (this.life < 0) {
            game.destroyInstance(this);
            return;
        }
        
        ctx.globalAlpha = this.life;
        ctx.fillStyle = getColor(playercol);
        fillCircle(this.x, this.y, this.size);
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_splashring", {
    create: function () {
        this.depth = -2;
        this.r = 0;
        this.dr = 50;
        this.startR = 0;
        this.size = 0;
    },
    
    update: function () {
        var s = this.startR + this.dr;
        
        this.r += (s - this.r) / 5;
        
        if (Math.abs(s - this.r) < 0.01) {
            game.destroyInstance(this);
            return;
        }
        
        ctx.strokeStyle = getColor(solidcol);
        ctx.lineWidth = this.r / 3;
        ctx.globalAlpha = Math.max(0, Math.min(1 - this.r / s, 1));
        strokeCircle(this.x, this.y, this.r + this.size);
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_splash", {
    create: function () {
        this.depth = -2;
        this.size = 0;
        this.r = 70;
        this.s = 0;
        
        this.popY = 0;
        this.popDy = 100;
    },
    
    update: function () {
        this.size += (this.r - this.size) / 5;
        
        if (Math.abs(this.r - this.size) < 20) {
            this.s += (this.size - this.s) / 4;
            
            if (Math.abs(this.size - this.s) < 0.01) {
                game.destroyInstance(this);
                return;
            }
        }
        
        ctx.strokeStyle = getColor(coincol);
        ctx.lineWidth = this.size - this.s + 1;
        ctx.globalAlpha = Math.max(0, Math.min(1 - this.s / this.r, 1));
        strokeCircle(this.x, this.y, this.size);
        
        /*this.popY += (this.popDy - this.popY) / 10;
        var py = upsideDown ? -this.popY : this.popY;
        //ctx.globalAlpha = Math.max(0, Math.min(1 - this.s / this.r, 1));
        ctx.font = "bold 36px fnt_menufont, sans-serif";
        ctx.fillStyle = getColor(coincol);
        ctx.fillText(triangleCount, this.x, this.y - py);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.strokeText(triangleCount, this.x, this.y - py);
        ctx.font = "20px fnt_menufont, sans-serif";*/
        
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_controller", {
    create: function () {
        this.depth = -1;
        this.timer = 0;
        this.angle = 0;
        this.angleTarget = 0 + 2 * Math.PI / 180;
        this.xx = 0;
        this.vel = 0;
    },
    
    update: function () {
        
        if (!gameLoaded) {
            var h = 420;//Math.max(330, window.innerHeight - 100);
            var w = 400;//bw * h / bh;
            
            ctx.font = "20px fnt_menufont, sans-serif";
            
            var loadw = 400;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "gray";
            //ctx.globalAlpha = 0.5;
            ctx.strokeRect(WIDTH / 2 - loadw / 2, HEIGHT / 5, loadw, 20);
            ctx.fillRect(WIDTH / 2 - loadw / 2 + 5, HEIGHT / 5 + 5, gameLoadProgress * (loadw - 10), 20 - 10);
            ctx.globalAlpha = 1;
            //ctx.fillText("Game by Diamonax.", WIDTH / 2, 180 + 30 - 1);
            ctx.fillText("Look at this awesome loading bar!", WIDTH / 2, 90);
        }
        
        if (errorSize > 0.1) {
            errorSize -= errorSize / 5;
        }
        
        if (screenShake > 0) {
            screenShake -= 0.3;
        }
        screenShake = Math.max(0, screenShake);
        
        if (grayShift) {
            if (grayUp) {
                if (grayValue < 219) {
                    grayValue += 1;
                } else {
                    grayUp = false;
                }
            } else {
                if (grayValue > 1) {
                    grayValue -= 1;
                } else {
                    grayUp = true;
                }
            }
            
            var gv = grayValue;
            
            backcolTarget = {r: 220 - gv, g: 220 - gv, b: 220 - gv};
            flashcolTarget = {r: gv, g: gv, b: gv};
            sidecolTarget = {r: gv, g: gv, b: gv};
            solidcolTarget = {r: gv, g: gv, b: gv};
            coincolTarget = {r: gv, g: gv, b: gv};
            playercolTarget = {r: gv, g: gv, b: gv};
            linecolTarget = {r: gv, g: gv, b: gv};
        }
        
        if (hueNess) {
            hueValue = (hueValue + 1) % 256;
            
            var hc1 = HSVToRGB({h: hueValue / 255, s: 1, v: 0.8});
            var hc2 = HSVToRGB({h: (hueValue + 50) % 256 / 255, s: 1, v: 0.8});
            var hc3 = HSVToRGB({h: (hueValue + 150) % 256 / 255, s: 1, v: 0.8});
            
            backcolTarget = {r: hc1.r, g: hc1.g, b: hc1.b};
            flashcolTarget = {r: hc2.r, g: hc2.g, b: hc2.b};
            sidecolTarget = {r: hc3.r, g: hc3.g, b: hc3.b};
            solidcolTarget = {r: hc2.r, g: hc2.g, b: hc2.b};
            coincolTarget = {r: hc3.r, g: hc3.g, b: hc3.b};
            playercolTarget = {r: hc2.r, g: hc2.g, b: hc2.b};
            linecolTarget = {r: hc3.r, g: hc3.g, b: hc3.b};
        }
        
        if (efx > 1.1) {
            efx += -efx / 5;
            efbool = false;
            efdx = 0;
        } else {
            if (efbool) {
                if (efdx < 1) {
                    efdx += 0.1;
                } else {
                    efbool = false;
                }
            } else {
                if (efdx > -1) {
                    efdx -= 0.1;
                } else {
                    efbool = true;
                }
            }
        }
        efx = Math.max(0, efx);
        
        if (playerDelta < -1.1) {
            playerDelta += (-1 - playerDelta) / 5;
        } else {
            if (playerDeltaBool) {
                if (playerDelta > -1) {
                    playerDelta -= 0.08;
                } else {
                    playerDeltaBool = false;
                }
            } else {
                if (playerDelta < 1) {
                    playerDelta += 0.08;
                } else {
                    playerDeltaBool = true;
                }
            }
        }
        
        // MENU
        
        if (menu) {
            
            var bx = 130;
            var by = 110 - 20;
            var bw = 200;
            var bh = 35;
            
            if (startState === 0) {
                collectMode = false;
                
                if (menuAlpha < 1) {
                    menuAlpha += 0.04;
                }
                menuAlpha = Math.min(menuAlpha, 1);
                
                if (Math.abs(this.angle - this.angleTarget) < 0.01) {
                    this.angleTarget = -this.angleTarget;
                }
                
                if (Math.abs(this.angle) > 2 * Math.PI / 180) {
                    this.angle += (this.angleTarget - this.angle) / 5;
                } else {
                    this.angle += (this.angleTarget - this.angle) / 100;
                }
                
                var efv = 10;
                
                if (menuItem > 0 && (game.keyboardPressed("ArrowUp") || game.keyboardPressed("z") || game.keyboardPressed("w"))) {
                    menuItem -= 1;
                    efx = efv;
                    //this.angleTarget = -2 * Math.PI / 180;
                }
                
                if (menuItem < 3 && (game.keyboardPressed("ArrowDown") || game.keyboardPressed("s"))) {
                    menuItem += 1;
                    efx = efv;
                    //this.angleTarget = 2 * Math.PI / 180;
                }
                
                var hover = false;
                
                if (mouseInBox(bx, by, bw, bh)) {
                    menuItem = 0;
                    hover = true;
                }
                if (mouseInBox(bx, by + 50, bw, bh)) {
                    menuItem = 1;
                    hover = true;
                }
                if (mouseInBox(bx, by + 100, bw, bh)) {
                    menuItem = 2;
                    hover = true;
                }
                if (mouseInBox(bx, by + 150, bw, bh)) {
                    menuItem = 3;
                    hover = true;
                }
                
                if (game.keyboardPressed("Enter") || (hover && game.mousePressed("Left"))) {
                    switch (menuItem) {
                        case 0:
                            startState = 1;
                            break;
                            
                        case 1:
                            if (unlocked) {
                                collectMode = true;
                                startState = 1;
                            } else {
                                errorSize = 30;
                            }
                            break;
                            
                        case 2:
                            MUSIC = !MUSIC;
                            if (hasLocalStorage) localStorage.setItem("music", MUSIC ? "on" : "off");
                            break;
                            
                        case 3:
                            SOUNDS = !SOUNDS;
                            if (hasLocalStorage) localStorage.setItem("sounds", SOUNDS ? "on" : "off");
                            break;
                    }
                }
            }
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = whiteMode ? "black" : "white";
            ctx.fillStyle = whiteMode ? "gray" : "rgb(200, 200, 200)";
            
            ctx.globalAlpha = Math.max(0, menuAlpha - 0.7);
            
            if (menuItem === 1 && !unlocked) {
                ctx.fillStyle = whiteMode ? "rgb(200, 40, 40)" : "rgb(240, 160, 160)";
            }
            
            var eefx = efx + efdx;//Math.cos((new Date()).getTime() / 100) * 1;
            var ort = 4;//4 * 1;
            var ortx = ort;
            var orty = ort;
            var eort = 1;
            
            ctx.fillRect(bx + ortx - eefx, by + menuItem * 50 + orty - eefx, bw + 2 * eefx + eort, bh + 2 * eefx + eort);
            
            var efx1 = menuItem === 0 ? eefx : 0;
            var efx2 = menuItem === 1 ? eefx : 0;
            var efx3 = menuItem === 2 ? eefx : 0;
            var efx4 = menuItem === 3 ? eefx : 0;
            var efxlist = [efx1, efx2, efx3, efx4];
            var efxx = efxlist[menuItem];
            
            ctx.fillStyle = whiteMode ? "black" : "white";
            ctx.strokeRect(bx - efx1, by - efx1, bw + 2 * efx1, bh + 2 * efx1);
            ctx.strokeRect(bx - efx2, by + 50 - efx2, bw + 2 * efx2, bh + 2 * efx2);
            ctx.strokeRect(bx - efx3, by + 100 - efx3, bw + 2 * efx3, bh + 2 * efx3);
            ctx.strokeRect(bx - efx4, by + 150 - efx4, bw + 2 * efx4, bh + 2 * efx4);
            ctx.globalAlpha = menuAlpha;
            
            ctx.strokeRect(bx - efxx, by + menuItem * 50 - efxx, bw + 2 * efxx, bh + 2 * efxx);
            
            ctx.fillText("Avoid Mode", bx + bw / 2, by + bh / 2);
            ctx.fillText("Collect Mode", bx + bw / 2, by + bh / 2 + 50);
            ctx.fillText(MUSIC ? "Mute Music" : "Unmute Music", bx + bw / 2, by + bh / 2 + 100);
            ctx.fillText(SOUNDS ? "Mute Sounds" : "Unmute Sounds", bx + bw / 2, by + bh / 2 + 150);
            
            var tx = WIDTH - 260;
            var ty = by + 40;
            
            ctx.strokeStyle = whiteMode ? "rgba(100, 100, 100, 0.3)" : "rgba(200, 200, 200, 0.3)";
            
            var subtextList = [
                "Let's give it a shot!",
                "Just give it another try.",
                "At least you did the first level.",
                "Are you even trying?",
                "True. Level 4 ain't easy.",
                "Upside Down! Yay!",
                "Level 7 is very cool...",
                "Wut? You died in level 7?",
                "Do you think you can reach 9?",
                "How did you even get here?",
                "You did it. Now reach 20! :)",
                "YOU. ARE. AWESOME."
            ];
            
            var subtextListCollect = [
                "Let's try this mode!",
                "Really? Only level 1?",
                "C'mon, you can do better!",
                "(-;",
                "True. Level 4 still ain't easy.",
                "It's easier than Avoid Mode, though!",
                "Level 7 is very cool...",
                "Wow, you are pretty good!",
                "I feel it. You can reach 9!",
                "...almost there!",
                "You did it. Now reach 30! :)",
                "YOU. ARE. AMAZING."
            ];
            
            var subindex = 11;
            var subindexCollect = 11;
            
            if (avoidLevel < 10) {
                subindex = avoidLevel;
            }
            else if (10 <= avoidLevel && avoidLevel < 20) {
                subindex = 10;
            }
            
            if (collectLevel < 10) {
                subindexCollect = collectLevel;
            }
            else if (10 <= collectLevel && collectLevel < 30) {
                subindexCollect = 10;
            }
            
            var dty = 60;
            
            switch (menuItem) {
                case 0:
                    //ctx.fillText("Current Highscore:", tx, ty);
                    //drawLine(tx - 75, ty + 20, tx + 75, ty + 20);
                    ctx.fillText(avoidHighScore + " triangle" + (avoidHighScore === 1 ? "" : "s"), tx + 20, ty + 70 - dty);
                    ctx.fillText("(level " + avoidLevel + ")", tx + 20, ty + 110 - dty);
                    
                    ctx.globalAlpha = Math.max(0, menuAlpha - 0.5);
                    ctx.fillStyle = "black";
                    ctx.fillText(subtextList[subindex], tx + 20, ty + 180 - dty);
                    ctx.globalAlpha = 1;
                    break;
                    
                case 1:
                    if (unlocked) {
                        //ctx.fillText("Current Highscore:", tx, ty);
                        //drawLine(tx - 75, ty + 20, tx + 75, ty + 20);
                        ctx.fillText(collectHighScore + " ring" + (collectHighScore === 1 ? "" : "s"), tx + 20, ty + 70 - dty);
                        ctx.fillText("(level " + collectLevel + ")", tx + 20, ty + 110 - dty);
                        
                        ctx.globalAlpha = Math.max(0, menuAlpha - 0.5);
                        ctx.fillStyle = "black";
                        ctx.fillText(subtextListCollect[subindexCollect], tx + 20, ty + 180 - dty);
                        ctx.globalAlpha = 1;
                    } else {
                        //ctx.fillText("Locked", tx, ty);
                        /*ctx.globalAlpha = Math.max(0, menuAlpha - 0.7);
                        ctx.strokeStyle = whiteMode ? "rgb(200, 40, 40)" : "rgb(240, 160, 160)";
                        drawLine(tx - 35 + 10, ty + 20, tx + 35 - 10, ty + 20);*/
                        //ctx.globalAlpha = menuAlpha;
                        /*ctx.fillText("Reach level 4 in", tx - 7, ty + 70);
                        ctx.fillText("Avoid Mode to unlock", tx + 35, ty + 110);*/
                        ctx.fillText("Reach level " + unlockLevel + " in Avoid Mode", tx - 10, ty + 70 - dty);
                        ctx.fillText("to unlock this mode", tx - 0 + 27, ty + 110 - dty);
                        
                        ctx.font = Math.floor(20 + errorSize) + "px fnt_menufont, sans-serif";
                        ctx.globalAlpha = Math.max(0, menuAlpha - 0.5);
                        ctx.fillStyle = "rgb(200, 40, 40)";//"rgb(150, 150, 150)";
                        ctx.fillText("(It's locked!)", tx + 20, ty + 180 - dty);
                        ctx.font = "20px fnt_menufont, sans-serif";
                        ctx.globalAlpha = 1;
                    }
                    break;
                    
                case 2:
                    //ctx.fillText("Music currently ON", tx, ty);
                    //drawLine(tx - 75, ty + 20, tx + 75, ty + 20);
                    ctx.fillText("Music by Kevin MacLeod", tx + 12 - 7, ty + 70 - dty / 4);
                    ctx.fillText("\"Blip Stream\"", tx + 52, ty + 110 - dty / 4);
                    break;
                    
                case 3:
                    //ctx.fillText("Sounds currently ON", tx, ty);
                    //drawLine(tx - 75, ty + 20, tx + 75, ty + 20);
                    ctx.fillText("Sounds made with Sfxr", tx + 10, ty + 70 - dty / 4);
                    ctx.fillText("from DrPetter", tx + 52, ty + 110 - dty / 4);
                    break;
            }
        }
        
        if (startState === 1) {
            if (menuAlpha > -1) {
                menuAlpha -= 0.02;
            } else {
                menu = false;
                startState = 2;
                text1X = 0;
                text2X = WIDTH;
                text3Y = HEIGHT;
                textAllY = 0;
                textTimer = 150;
                menuAlpha = Math.max(0, menuAlpha);
            }
            
            this.angleTarget = 0;
            this.angle += (this.angleTarget - this.angle) / 20;
        }
        
        if (startState === 2) {
            if ((!collectMode && firstTime) || (collectMode && firstTimeCollect)) {
                ctx.fillStyle = whiteMode ? "black" : "white";
                ctx.globalAlpha = 1;
                
                var tlist = collectMode ? collectInfoList : avoidInfoList;
                
                text1X += (WIDTH / 2 - text1X) / 15;
                ctx.globalAlpha = Math.max(1 - Math.abs(WIDTH / 2 - text1X) / 100 - textAllY / 20, 0);
                ctx.fillText(tlist[0], text1X, HEIGHT / 2 - 150 + textAllY);
                
                if (Math.abs(WIDTH / 2 - text1X) < 0.1) {
                    
                    text2X += (WIDTH / 2 - text2X) / 15;
                    ctx.globalAlpha = Math.max(1 - Math.abs(WIDTH / 2 - text2X) / 100 - textAllY / 20, 0);
                    ctx.fillText(tlist[1], text2X, HEIGHT / 2 - 110 + textAllY);
                    
                    if (Math.abs(WIDTH / 2 - text2X) < 0.1) {
                        
                        text3Y += (HEIGHT/ 2 - text3Y) / 15;
                        ctx.globalAlpha = Math.max(1 - Math.abs(HEIGHT / 2 - text3Y) / 100 - textAllY / 20, 0);
                        ctx.fillText(tlist[2], WIDTH / 2, text3Y - 70 + textAllY);
                        
                        if (Math.abs(HEIGHT / 2 - text3Y) < 0.1) {
                            
                            textTimer -= 1;
                            
                            if (textTimer < 50) {
                                textAllY += 1;
                            }
                            
                            if (textTimer < 0) {
                                if (collectMode) {
                                    firstTimeCollect = false;
                                } else {
                                    firstTime = false;
                                }
                            }
                        }
                    }
                }
            } else {
                level = 1;
                coinTotal = getCoinTotal(level);
                coinCurrent = 0;
                gotoLevel(level);
                startY = HEIGHT + 100;
                startState = 3;
            }
        }
        
        ctx.globalAlpha = 1;
        
        
        // PLAYER
        
        var yy = YVIEW;
        
        if (dead) {
            if (deadTimer <= 0) {
                for (var i = 0; i < 50; i++) {
                    game.createInstance("obj_deathparticle", WIDTH / 2 + this.xx, yy);
                }
                
                deadTimer = 120;
                playing = false;
            } else {
                deadTimer -= 1;
                
                if (deadTimer <= 0) {
                    this.angleTarget = 2 * Math.PI / 180;
                    startState = 0;
                    menu = true;
                    dead = false;
                    gotoLevel(1);
                }
            }
        }
        
        if (startState === 3) {
            startY += (YVIEW - startY) / 10;
            ctx.fillStyle = getColor(playercol);
            fillCircle(WIDTH / 2, startY, 24 + playerDelta);
            
            if (Math.abs(YVIEW - startY) < 0.5) {
                startState = 4;
                playing = true;
                triangleCount = 0;
                coinTimer = 5;// + Math.floor(Math.random() * 5);
                this.xx = 0;
                
                if (MUSIC) game.playMusic("msc_play", true);
            }
        }
        
        if (upsideDown) {
            YVIEW += (HEIGHT * 1 / 4 - YVIEW) / 20;
        }
        else if ((level - 1) % 9 + 1 > 1) {
            YVIEW += (HEIGHT * 3 / 4 - YVIEW) / 20;
        }
        
        if (playing) {
            this.angleTarget = 0;
            
            //YVIEW += ((game.keyboardDown("ArrowDown") ? 1 : 0) - (game.keyboardDown("ArrowUp") ? 1 : 0)) * 4;
            
            ctx.fillStyle = getColor(playercol);
            //ctx.fillRect(WIDTH / 2 + this.xx - 24, yy - 24, 48, 48);
            fillCircle(WIDTH / 2 + this.xx, yy, 24 + playerDelta);
            
            //ctx.fillStyle = "gray";
            //fillCircle(WIDTH / 2 + this.xx / 1.3, yy, 24);
            /*
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 10;
            ctx.strokeStyle = (playercol.r + playercol.g + playercol.b <= 180 * 3) ? "white" : "black";
            ctx.beginPath();
            ctx.arc(WIDTH / 2 + this.xx, yy, 20, -Math.PI / 2, -Math.PI / 2 + coinAngle);
            ctx.stroke();
            ctx.globalAlpha = 1;
            */
            
            if (game.keyboardDown("ArrowRight") || game.keyboardDown("d")) {
                this.vel = 10;
                this.angleTarget = 10 * Math.PI / 180;
            }
            
            if (game.keyboardDown("ArrowLeft") || game.keyboardDown("q") || game.keyboardDown("a")) {
                this.vel = -10;
                this.angleTarget = -10 * Math.PI / 180;
            }
            
            if (game.mouseDown("Left")) {
                var mdx = game.mouseX - WIDTH / 2 + (WIDTH - game.ctx.canvas.width) / 2 - this.xx;
                //this.xx = game.mouseX - WIDTH / 2 + (WIDTH - game.ctx.canvas.width) / 2;
                this.vel = mdx / 4;
                this.angleTarget = this.vel * Math.PI / 180;
            }
            
            this.angleTarget = Math.max(-10 * Math.PI / 180, Math.min(this.angleTarget, 10 * Math.PI / 180));
            this.angle += (this.angleTarget - this.angle) / 10;
            
            if (coinCurrent >= coinTotal) {
                level += 1;
                
                if (!collectMode && level >= unlockLevel && !unlocked) {
                    unlocked = true;
                    window.api.submitStat(window.STAT_COLLECT_UNLOCKED, 1);
                }
                
                if (!collectMode && level >= 10 && !avoidAllLevelsDone) {
                    avoidAllLevelsDone = true;
                    window.api.submitStat(window.STAT_AVOID_10, 1);
                }
                
                if (collectMode && level >= 10 && !collectAllLevelsDone) {
                    collectAllLevelsDone = true;
                    window.api.submitStat(window.STAT_COLLECT_10, 1);
                }
                
                if (!collectMode && level >= 20 && !avoidTopscore) {
                    avoidTopscore = true;
                    window.api.submitStat(window.STAT_AVOID_20, 1);
                }
                
                if (collectMode && level >= 30 && !collectTopscore) {
                    collectTopscore = true;
                    window.api.submitStat(window.STAT_COLLECT_30, 1);
                }
                
                sideNumber = 5;
                longSquare = false;
                upsideDown = false;
                oscillation = false;
                grayShift = false;
                backForth = false;
                hueNess = false;
                noDanger = false;
                
                coinCurrent = 0;
                gotoLevel(level);
                coinTotal = getCoinTotal(level);
                coinAngle = 0;
            }
            
            coinAngle += (2 * Math.PI * (coinCurrent / coinTotal) - coinAngle) / 20;
        }
        
        this.xx += this.vel;
        this.xx = Math.max(200 - WIDTH / 2, Math.min(this.xx, WIDTH / 2 - 200));
        this.vel *= 0.75;
        
        
        // OTHER
        
        yy = upsideDown ? HEIGHT * 1 / 4 : HEIGHT * 3 / 4;
        
        this.timer -= 1;
        
        if ((this.timer < 0 || this.timer === 32) && flashalpha > 0.95) {
            game.createInstance("obj_decor");
        }
        
        if (startState === 0) {
            if (solidTimer > 0) {
                solidTimer -= 1;
            } else {
                game.createInstance("obj_obstacle", 200 + Math.random() * (WIDTH - 400), yy - 16);
                solidTimer = 40 + Math.random() * 30;
            }
        }
        
        if (startState > 3) {
            
            if (solidTimer > 0) {
                solidTimer -= 1;
            } else {
                
                if (collectMode) {
                    
                    var obst = game.createInstance("obj_ring", 280 + Math.random() * (WIDTH - 560), yy - 16);
                    
                    switch ((level - 1) % 9 + 1) {
                        case 1:
                            obst.size = 20;
                            solidTimer = 60 + Math.random() * 20;
                            break;
                            
                        case 2:
                            obst.size = 20;
                            solidTimer = 30 + Math.random() * 20;
                            break;
                            
                        case 3:
                        case 7:
                            solidTimer = 20 + Math.random() * 20;
                            break;
                            
                        case 8:
                            obst.size = 20;
                            solidTimer = 25 + Math.random() * 15;
                            break;
                            
                        case 9:
                            obst.size = 20;
                            solidTimer = 15 + Math.random() * 10;
                            
                        default:
                            solidTimer = 35 + Math.random() * 20;
                    }
                    
                    if (obst.size === 0) {
                        obst.y -= upsideDown ? -40 : 40;
                    }
                    
                } else {
                
                    var obst = game.createInstance("obj_obstacle", 200 + Math.random() * (WIDTH - 400), yy - 16);
                    
                    if (coinTimer > 0) {
                        coinTimer -= 1;
                        
                        if (noDanger) {
                            game.destroyInstance(obst);
                        }
                    } else {
                        //console.log("special spawned!");
                        obst.special = true;
                        coinTimer = 5;// + Math.floor(Math.random() * 7);
                    }
                    
                    switch ((level - 1) % 9 + 1) {
                        case 1:
                        case 7:
                            solidTimer = 20 + Math.random() * 20;
                            break;
                            
                        case 3:
                        case 4:
                            solidTimer = 15 + Math.random() * 20;
                            break;
                            
                        case 8:
                            solidTimer = 18 + Math.random() * 15;
                            break;
                            
                        default:
                            solidTimer = 10 + Math.random() * 20;
                    }
                
                }
            }
        
            /*if ((this.timer < 0 || this.timer === 18 +100 || this.timer === 46 + 100 || this.timer === 60+100) && !false) {
                var obst = game.createInstance("obj_obstacle", 200 + Math.random() * (WIDTH - 400), yy - 16);
                
                if (Math.random() < 0.1) {
                    obst.special = true;
                }
            }*/
        
        }
        
        if (this.timer < 0) {
            this.timer = 64;
        }
    }
});

game.addScene("scn_play", {
    enter: function () {
        game.createInstance("obj_foreground");
        game.createInstance("obj_midground");
        game.createInstance("obj_background");
        controller = game.createInstance("obj_controller");
    }
});

window.addEventListener("load", function () {
    if (!checkCorrectSite()) {
        return;
    }
    
    window.setTimeout(startLoading, 2);
});
    
function startLoading() {
    APILoader(function (api) {
        window.api = api;
        
        window.STAT_AVOID_HIGHSCORE = "Avoid Mode Highscore";
        window.STAT_COLLECT_HIGHSCORE = "Collect Mode Highscore"; 
        window.STAT_COLLECT_UNLOCKED = "Collect Mode Unlocked";
        window.STAT_AVOID_10 = "Avoid Mode Level 10 Reached";
        window.STAT_COLLECT_10 = "Collect Mode Level 10 Reached";
        window.STAT_AVOID_20 = "Avoid Mode Level 20 Reached";  // "YOU. ARE. AWESOME."
        window.STAT_COLLECT_30 = "Collect Mode Level 30 Reached"; // "YOU. ARE. AMAZING."
        
        game.run();
        gotoLevel(1);
        game.enterScene("scn_play");
        
        if (hasLocalStorage) {
            if (localStorage.getItem("avoidlevel")) {
                avoidLevel = parseInt(localStorage.getItem("avoidlevel"));
                
                if (avoidLevel >= unlockLevel) {
                    unlocked = true;
                    window.api.submitStat(window.STAT_COLLECT_UNLOCKED, 1);
                } else {
                    window.api.submitStat(window.STAT_COLLECT_UNLOCKED, 0);
                }
                
                if (avoidLevel >= 10) {
                    avoidAllLevelsDone = true;
                    window.api.submitStat(window.STAT_AVOID_10, 1);
                } else {
                    window.api.submitStat(window.STAT_AVOID_10, 0);
                }
                
                if (avoidLevel >= 20) {
                    avoidTopscore = true;
                    window.api.submitStat(window.STAT_AVOID_20, 1);
                } else {
                    window.api.submitStat(window.STAT_AVOID_20, 0);
                }
            } else {
                window.api.submitStat(window.STAT_COLLECT_UNLOCKED, 0);
                window.api.submitStat(window.STAT_AVOID_10, 0);
                window.api.submitStat(window.STAT_AVOID_20, 0);
            }
            
            if (localStorage.getItem("collectlevel")) {
                collectLevel = parseInt(localStorage.getItem("collectlevel"));
                
                if (collectLevel >= 10) {
                    collectAllLevelsDone = true;
                    window.api.submitStat(window.STAT_COLLECT_10, 1);
                } else {
                    window.api.submitStat(window.STAT_COLLECT_10, 0);
                }
                
                if (collectLevel >= 30) {
                    collectTopscore = true;
                    window.api.submitStat(window.STAT_COLLECT_30, 1);
                } else {
                    window.api.submitStat(window.STAT_COLLECT_30, 0);
                }
            } else {
                window.api.submitStat(window.STAT_COLLECT_10, 0);
                window.api.submitStat(window.STAT_COLLECT_30, 0);
            }
            
            if (localStorage.getItem("avoidhighscore")) {
                firstTime = false;
                avoidHighScore = parseInt(localStorage.getItem("avoidhighscore"));
                window.api.submitStat(window.STAT_AVOID_HIGHSCORE, avoidHighScore);
            } else {
                window.api.submitStat(window.STAT_AVOID_HIGHSCORE, 0);
            }
            
            if (localStorage.getItem("collecthighscore")) {
                firstTimeCollect = false;
                collectHighScore = parseInt(localStorage.getItem("collecthighscore"));
                window.api.submitStat(window.STAT_COLLECT_HIGHSCORE, collectHighScore);
            } else {
                window.api.submitStat(window.STAT_COLLECT_HIGHSCORE, 0);
            }
            
            if (localStorage.getItem("music")) {
                MUSIC = localStorage.getItem("music") === "on" ? true : false;
            }
            
            if (localStorage.getItem("sounds")) {
                SOUNDS = localStorage.getItem("sounds") === "on" ? true : false;
            }
        } else {
            window.api.submitStat(window.STAT_COLLECT_UNLOCKED, 0);
            window.api.submitStat(window.STAT_AVOID_10, 0);
            window.api.submitStat(window.STAT_AVOID_20, 0);
            window.api.submitStat(window.STAT_COLLECT_10, 0);
            window.api.submitStat(window.STAT_COLLECT_30, 0);
            window.api.submitStat(window.STAT_AVOID_HIGHSCORE, 0);
            window.api.submitStat(window.STAT_COLLECT_HIGHSCORE, 0);
        }
        
        game.loadAssets({
            sounds: {
                "snd_explosion": "src/explosion.wav",
                "snd_triangle": "src/point.wav"
            },
            
            music: {
                "msc_play": "src/blipstream.mp3"
            },
            
            fonts: {
                timeout: 3000,
                "fnt_menufont": "src/font.ttf"
            }
        }, {
            progress: function (p) {
                gameLoadProgress = p;
            },
            
            finish: function () {
                gameLoaded = true;
                menu = true;
            }
        });
    });
}

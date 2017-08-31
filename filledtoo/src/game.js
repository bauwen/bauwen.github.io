var canvas = document.getElementById("display");

var game = new Game(canvas);
var ctx = game.getContext();

var COLBACK = "rgb(49, 54, 49)";
var COLGRID = "rgb(90, 95, 90)";
var COLPLAYER = "rgb(200, 200, 60)";
var COLTRAIL = "rgb(80, 160, 80)";
var COLWALL = COLGRID;
var COLTARGET = "rgb(80, 160, 80)"//"rgb(60, 160, 60)";
var COLBRIDGE = "rgb(160, 60, 160)";
var COLTUNNELS = [
    "rgb(60, 100, 180)",
    "rgb(160, 60, 60)",
    "rgb(190, 140, 40)",
    "rgb(120, 180, 40)",
    "rgb(80, 180, 180)",
    
    "rgb(255, 0, 0)",
    "rgb(255, 255, 0)",
    "rgb(255, 0, 255)",
    // + TODO: nog 6 kleuren
];
var WIDTH = 16;
var HEIGHT = 9;
var CELL = 32;

var MUSIC = true;
var SOUND = true;

var DEBUG = false;

canvas.style.backgroundColor = COLBACK;

game.addObject("obj_controller", {
    create() {
        this.levelTween = new Tween(0.79*0, 8);
        
        this.waitTime = 30;
        this.timer = this.waitTime;
        this.sliding = false;
        this.direction = 0;
        this.number = 0;
        
        if (localStorage.getItem("giflevel")) {
            this.number = parseInt(localStorage.getItem("giflevel"));
            this.number = Math.max(0, Math.min(this.number, LEVELS.length - 1));
        }
        
        if (window.kongregate) {
            window.kongregate.stats.submit("Level", this.number);

            if (this.number >= LEVELS.length - 1) {
                window.kongregate.stats.submit("Completion", 1);
            } else {
                window.kongregate.stats.submit("Completion", 0);
            }
        }
        
        this.prev = null;
        this.level = game.createInstance("obj_level", ctx.canvas.width / 2, ctx.canvas.height / 2);
        this.level.number = this.number;
        this.level.hasControl = true;
        
        this.unlockedLevels = [];
        this.restartAngle = 0;
        this.dirlist = [];
        
        var hor = Math.random() < 0.5;
        for (var i = 0; i < LEVELS.length; i++) {
            /*if (hor) {
                this.dirlist.push(Math.floor(Math.random() * 2) * 180);
            } else {
                this.dirlist.push(Math.floor(Math.random() * 2) * 180 + 90);
            }*/ this.dirlist.push(0);
            hor = !hor;
            this.unlockedLevels.push(false);
        }
        
        for (var i = 0; i <= this.number; i++) {
            this.unlockedLevels[i] = true;
        }
        
        this.goingBack = false;
        
        var self = this;
        this.restart = function () {
            self.restartAngle = 2 * Math.PI;
            self.number -= 1;
            self.level.done = true;
            self.timer = -1;
            self.goingBack = true;
            
            if (self.sliding) {
                game.destroyInstance(self.prev);
                self.level.x = Math.floor(ctx.canvas.width / 2);
                self.level.y = Math.floor(ctx.canvas.height / 2);
                self.sliding = false;
            }
        };
    },
    
    update() {
        if (this.sliding) {
            var t = this.levelTween.get();
            
            switch (this.direction) {
                case 0:
                    this.prev.x = t - ctx.canvas.width / 2;
                    this.level.x = t + ctx.canvas.width / 2;
                    break;
                    
                case 90:
                    this.prev.y = ctx.canvas.height / 2 + ctx.canvas.height - t;
                    this.level.y = ctx.canvas.height / 2 - t;
                    break;
                    
                case 180:
                    this.prev.x = ctx.canvas.width / 2 + ctx.canvas.width - t;
                    this.level.x = ctx.canvas.width / 2 - t;
                    break;
                    
                case 270:
                    this.prev.y = t - ctx.canvas.height / 2;
                    this.level.y = t + ctx.canvas.height / 2;
                    break;
            }
            
            if (this.timer > 0) {
                this.timer -= 1;
            } else {
                game.destroyInstance(this.prev);
                this.level.x = Math.floor(ctx.canvas.width / 2);
                this.level.y = Math.floor(ctx.canvas.height / 2);
                this.sliding = false;
                this.goingBack = false;
                this.timer = this.waitTime;
                this.level.hasControl = true;
                //console.log("next");
            }
        }
        
        if (this.level.done && !this.sliding) {
            if (this.timer > 0) {
                this.timer -= 1;
            } else {
                this.number += 1;
                this.prev = this.level;
                this.level = game.createInstance("obj_level", ctx.canvas.width / 2, ctx.canvas.height / 2);
                this.level.number = this.number;
                if (this.restartAngle > 0) { // TODO: klopt niet! (als je next/prev klikt net na restart)
                    this.direction = 90;
                } else {
                    this.direction = ((this.goingBack ? 180 : 0) + this.dirlist[this.number - (this.goingBack ? 0 : 1)]) % 360;
                }
                this.levelTween.set(this.direction === 0 || this.direction === 180 ? ctx.canvas.width : ctx.canvas.height);
                this.timer = 50;
                this.sliding = true;
                
                if (!this.unlockedLevels[this.number]) {
                    this.unlockedLevels[this.number] = true;
                    localStorage.setItem("giflevel", this.number);
                    
                    if (window.kongregate) {
                        window.kongregate.stats.submit("Level", this.number);
                        
                        if (this.number >= LEVELS.Length - 1) {
                            window.kongregate.stats.submit("Completion", 1);
                        }
                    }
                }
                
                /*
                for (var i = this.unlockedLevels.length - 1; i >= 0; i--) {
                    if (this.unlockedLevels[i]) {
                        localStorage.setItem("giflevel", i);
                        break;
                    }
                }
                */
                
                if (SOUND) game.playSound("snd_swipe");
            }
        }
        
        
        if (DEBUG) {
            // TODO: DEBUG ONLY
            if (keyboard.isPressed("w")) {
                this.number -= 2;
                this.level.done = true;
                //this.sliding = false;
                this.timer = -1;
                this.goingBack = true;
                
                if (this.sliding) {
                    game.destroyInstance(this.prev);
                    this.level.x = Math.floor(ctx.canvas.width / 2);
                    this.level.y = Math.floor(ctx.canvas.height / 2);
                    this.sliding = false;
                    this.goingBack = false;
                }
            }
            
            if (keyboard.isPressed("x")) {
                this.level.done = true;
                //this.sliding = false;
                this.timer = -1;
                this.goingBack = false;
                
                if (this.sliding) {
                    game.destroyInstance(this.prev);
                    this.level.x = Math.floor(ctx.canvas.width / 2);
                    this.level.y = Math.floor(ctx.canvas.height / 2);
                    this.sliding = false;
                    this.goingBack = false;
                }
            }
            //// END OF DEBUG
        }
        
        var z;
        
        ctx.globalAlpha = 0.6;
        
        //ctx.drawImage(game.images["spr_sound_on"], 60, 18, 24, 24);
        //ctx.drawImage(game.images["spr_restart"], ctx.canvas.width - 40, 18, 22, 22);
        
        var musicHover = isInBox(mouse.x, mouse.y, 20, 16, 26, 26);
        z = musicHover ? 4 : 0;
        ctx.globalAlpha = musicHover ? 1 : 0.6;
        ctx.drawImage(game.images[MUSIC ? "spr_music_on" : "spr_music_off"], 20 - z / 2, 16 - z / 2, 26 + z, 26 + z);
        
        var soundHover = isInBox(mouse.x, mouse.y, 60, 17, 26, 26);
        z = soundHover ? 4 : 0;
        ctx.globalAlpha = soundHover ? 1 : 0.6;
        ctx.drawImage(game.images[SOUND ? "spr_sound_on" : "spr_sound_off"], 60 - z / 2, 17 - z / 2, 24 + z, 24 + z);
        
        var restartHover = false;
        
        if (this.restartAngle > 0.05) {
            this.restartAngle /= 1.1;
        } else {
            this.restartAngle = 0;
        }
        
        if (this.number < LEVELS.length - 1) {
            restartHover = isInBox(mouse.x, mouse.y, ctx.canvas.width - 40, 18, 22, 22);
            z = restartHover ? 4 : 0;
            ctx.globalAlpha = restartHover ? 1 : 0.6;
            
            ctx.save();
            ctx.translate(ctx.canvas.width - 40 + 10, 18 + 10);
            //ctx.translate(30, ctx.canvas.height - 30);
            ctx.rotate(-this.restartAngle);
            ctx.drawImage(game.images["spr_restart"], -10 - z / 2, -10 - z / 2, 22 + z, 22 + z);
            ctx.restore();
        }
        
        ctx.globalAlpha = 0.6;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "32px fontgif, sans-serif";
        //ctx.fillText((this.number < 9 ? "0" : "") + (this.number + 1) + "/30", ctx.canvas.width - 64, ctx.canvas.height - 25);
        
        if (this.number < LEVELS.length - 1) {
            ctx.fillText((this.number < 9 ? "0" : "") + (this.number + 1)/* + "/30"*/, ctx.canvas.width / 2, ctx.canvas.height - 22);
        }
        
        //var prevHover = isInBox(mouse.x, mouse.y, ctx.canvas.width - 112, ctx.canvas.height - 40, 20, 20);
        var prevHover = false;
        
        if (this.number > 0 && this.unlockedLevels[this.number - 1]) {
            prevHover = isInBox(mouse.x, mouse.y, 15, ctx.canvas.height - 40, 20, 20);
            z = prevHover ? 4 : 0;
            ctx.globalAlpha = prevHover ? 1 : 0.6;
            //ctx.drawImage(game.images["spr_prev"], ctx.canvas.width - 112 - z / 2, ctx.canvas.height - 40 - z / 2, 20 + z, 20 + z);
            ctx.drawImage(game.images["spr_prev"], 15 - z / 2, ctx.canvas.height - 40 - z / 2, 20 + z, 20 + z);
        }
        
        var nextHover = false;
        
        if (this.number < LEVELS.length - 1 && this.unlockedLevels[this.number + 1]) {
            nextHover = isInBox(mouse.x, mouse.y, ctx.canvas.width - 35, ctx.canvas.height - 40, 20, 20);
            z = nextHover ? 4 : 0;
            ctx.globalAlpha = nextHover ? 1 : 0.6;
            ctx.drawImage(game.images["spr_next"], ctx.canvas.width - 35 - z / 2, ctx.canvas.height - 40 - z / 2, 20 + z, 20 + z);
        }
        
        ctx.globalAlpha = 1;
        
        if (mouse.isPressed("Left")) {
            if (musicHover) {
                MUSIC = !MUSIC;
                
                if (MUSIC) {
                    game.music["mus_back"].play();
                } else {
                    game.music["mus_back"].pause();
                }
            }
            
            if (soundHover) {
                SOUND = !SOUND;
            }
            
            if (restartHover) {
                this.restart();
            }
            
            if (prevHover && this.number > 0) {
                this.number -= 2;
                this.level.done = true;
                this.timer = -1;
                this.goingBack = true;
                
                if (this.sliding) {
                    game.destroyInstance(this.prev);
                    this.level.x = Math.floor(ctx.canvas.width / 2);
                    this.level.y = Math.floor(ctx.canvas.height / 2);
                    this.sliding = false;
                }
            }
            
            if (nextHover && this.number < LEVELS.length - 1) {
                this.level.done = true;
                this.timer = -1;
                this.goingBack = false;
                
                if (this.sliding) {
                    game.destroyInstance(this.prev);
                    this.level.x = Math.floor(ctx.canvas.width / 2);
                    this.level.y = Math.floor(ctx.canvas.height / 2);
                    this.sliding = false;
                }
            }
        }
        
        if (keyboard.isPressed("a") && this.number > 0 && this.unlockedLevels[this.number - 1]) {
            this.number -= 2;
            this.level.done = true;
            this.timer = -1;
            this.goingBack = true;
            
            if (this.sliding) {
                game.destroyInstance(this.prev);
                this.level.x = Math.floor(ctx.canvas.width / 2);
                this.level.y = Math.floor(ctx.canvas.height / 2);
                this.sliding = false;
            }
        }
        
        if (keyboard.isPressed("z") && this.number < LEVELS.length - 1 && this.unlockedLevels[this.number + 1]) {
            this.level.done = true;
            this.timer = -1;
            this.goingBack = false;
            
            if (this.sliding) {
                game.destroyInstance(this.prev);
                this.level.x = Math.floor(ctx.canvas.width / 2);
                this.level.y = Math.floor(ctx.canvas.height / 2);
                this.sliding = false;
            }
        }
        
        if (keyboard.isPressed("r")) {
            this.restart();
        }
        
        if (keyboard.isPressed("m")) {
            MUSIC = !MUSIC;
            
            if (MUSIC) {
                game.music["mus_back"].play();
            } else {
                game.music["mus_back"].pause();
            }
        }
        
        if (keyboard.isPressed("s")) {
            SOUND = !SOUND;
        }
        
        if (keyboard.isPressed("Backspace") && keyboard.isDown("Control")) {
            //console.log("removed progress!");
            localStorage.removeItem("giflevel");
        }
    }
});

function isInBox(vx, vy, x, y, w, h) {
    return x < vx && vx <= x + w && y < vy && vy <= y + h;
}

game.addObject("obj_level", {
    create() {
        this.number = -1;
        this.level = null;
        this.image = null;
        this.hasControl = !true;
        this.px = 0;
        this.py = 0;
        this.pdir = -1;
        this.ptween = new Tween(0, 10);
        this.trails = [];
        
        this.clicked = false;
        
        this.finished = false;
        this.done = false;
        this.doneFade = 0;
        
        this.glow = 0;
        this.glowingState = false;
        
        var self = this;
        
        this.canMove = function (dx, dy, ox, oy) {
            if (ox === undefined) {
                ox = self.px;
            }
            if (oy === undefined) {
                oy = self.py;
            }
            
            var x = ox + dx;
            var y = oy + dy;
            
            if (x < 0 || WIDTH <= x || y < 0 || HEIGHT <= y) {
                return false;
            }
            
            var obj = self.level.get(x, y);
            
            if (obj.type === "nothing" || obj.type === "wall") {
                return false;
            }
            
            if (obj.type !== "bridge") {
                for (var i = 0; i < self.trails.length; i++) {
                    var trail = self.trails[i];
                    if (trail.x === x && trail.y === y) {
                        return false;
                    }
                }
            } else {
                var counter = 0;
                
                for (var i = 0; i < self.trails.length; i++) {
                    var trail = self.trails[i];
                    if (trail.x === x && trail.y === y) {
                        counter += 1;
                        
                        if (counter >= 2) {
                            return false;
                        }
                    }
                }
            }
            
            if (obj.type === "tunnel") {
                return self.canMove(dx, dy, obj.other.x, obj.other.y);
            }
            
            return true;
        };
        
        this.goBack = function () {
            if (self.trails.length === 0) {
                return;
            }
            
            var t = self.trails.pop();
            while (t.tunnel) {
                t = self.trails.pop();
                self.clicked = false;
            }
            
            self.px = t.x;
            self.py = t.y;
            self.pdir = t.prevdir;
            
            if (SOUND) game.playSound("snd_undo");
        };
        
        this.Trail = function (x, y, prevdir, nextdir, tunnel, out) {
            this.x = x;
            this.y = y;
            this.prevdir = prevdir;
            this.nextdir = nextdir;
            this.tunnel = !!tunnel;
            this.out = !!out;
        };
        
        this.drawBridge = function (x, y) {
            var s = 6;
            ctx.fillStyle = COLBRIDGE;
            
            ctx.fillRect(x + s, y + s, CELL - 2 * s, CELL - 2 * s);
            //s *= 1.5;
            ctx.fillRect(x + 2, y + 2, s - 1, s - 1);
            ctx.fillRect(x + CELL - s - 1, y + 2, s - 1, s - 1);
            ctx.fillRect(x + 2, y + CELL - s - 1, s - 1, s - 1);
            ctx.fillRect(x + CELL - s - 1, y + CELL - s - 1, s - 1, s - 1);
            //*/
            
            /*
            s = 0;
            ctx.beginPath();
            ctx.moveTo(x + CELL / 2, y + s);
            ctx.lineTo(x + s, y + CELL / 2);
            ctx.lineTo(x + CELL - s, y + CELL / 2);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + CELL / 2, y + CELL - s);
            ctx.lineTo(x + s, y + CELL / 2);
            ctx.lineTo(x + CELL - s, y + CELL / 2);
            ctx.closePath();
            ctx.fill();
            */
            
            /*
            s = 2;
            var t = 6;
            var u = 6;
            ctx.beginPath();
            ctx.moveTo(x + s, y + CELL / 2);
            ctx.lineTo(x + s + t, y + CELL / 2 - u);
            ctx.lineTo(x + s + t, y + CELL / 2 + u);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + CELL - s, y + CELL / 2);
            ctx.lineTo(x + CELL - s - t, y + CELL / 2 - u);
            ctx.lineTo(x + CELL - s - t, y + CELL / 2 + u);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + CELL / 2, y + s);
            ctx.lineTo(x + CELL / 2 - u, y + s + t);
            ctx.lineTo(x + CELL / 2 + u, y + s + t);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + CELL / 2, y + CELL - s);
            ctx.lineTo(x + CELL / 2 - u, y + CELL - s - t);
            ctx.lineTo(x + CELL / 2 + u, y + CELL - s - t);
            ctx.closePath();
            ctx.fill();
            */
        };
    },
    
    update() {
        if (!this.level) {
            if (this.number < 0) {
                return;
            }
            this.level = getLevel(this.number);
            this.image = IMAGES[this.number];//getLevelImage(this.level);
            this.px = this.level.startX;
            this.py = this.level.startY;
        }
        
        var ox = this.x - WIDTH * CELL / 2;
        var oy = this.y - HEIGHT * CELL / 2;
        
        if (this.hasControl) {
            if (mouse.isPressed("Left")) {
                if (isInBox(mouse.x, mouse.y, ox + this.px * CELL, oy + this.py * CELL, CELL, CELL)) {
                    this.clicked = true;
                } else {
                    for (var i = 0; i < this.trails.length; i++) {
                        var t = this.trails[i];
                        
                        if (isInBox(mouse.x, mouse.y, ox + t.x * CELL, oy + t.y * CELL, CELL, CELL) && !t.tunnel) {
                            var u = this.trails.pop();
                            while (u !== t) {
                                u = this.trails.pop();
                            }
                            
                            this.px = t.x;
                            this.py = t.y;
                            this.pdir = t.prevdir;
                            
                            if (SOUND) game.playSound("snd_undo");
                            
                            this.clicked = true;
                        }
                    }
                }
            }
            
            if (!mouse.isDown("Left")) {
                this.clicked = false;
            }
            
            var xx, yy;
            if (this.clicked) {
                xx = ox + Math.floor((mouse.x - ox) / CELL) * CELL;
                yy = oy + Math.floor((mouse.y - oy) / CELL) * CELL;
            }
            
            if (keyboard.isPressed(" ") ||
                keyboard.isPressed("ArrowLeft") || keyboard.isPressed("ArrowRight") ||
                keyboard.isPressed("ArrowUp") || keyboard.isPressed("ArrowDown")) {
                    this.ptween.set(2);
            }
                
            if (keyboard.isPressed(" ")) {
                this.goBack();
            }
            
            if (keyboard.isPressed("ArrowLeft") || keyboard.isDown("Shift") && keyboard.isDown("ArrowLeft") ||
                this.clicked && xx < ox + this.px * CELL) {
                if (this.pdir === 0) {
                    this.goBack();
                }
                else if (this.canMove(-1, 0)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 180));
                    this.pdir = 180;
                    this.px -= 1;
                    if (SOUND) game.playSound("snd_step");
                }
            }
            
            if (keyboard.isPressed("ArrowRight") || keyboard.isDown("Shift") && keyboard.isDown("ArrowRight") ||
                this.clicked && xx > ox + this.px * CELL) {
                if (this.pdir === 180) {
                    this.goBack();
                }
                else if (this.canMove(1, 0)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 0));
                    this.pdir = 0;
                    this.px += 1;
                    if (SOUND) game.playSound("snd_step");
                }
            }
            
            if (keyboard.isPressed("ArrowUp") || keyboard.isDown("Shift") && keyboard.isDown("ArrowUp") ||
                this.clicked && yy < oy + this.py * CELL) {
                if (this.pdir === 270) {
                    this.goBack();
                }
                else if (this.canMove(0, -1)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 90));
                    this.pdir = 90;
                    this.py -= 1;
                    if (SOUND) game.playSound("snd_step");
                }
            }
            
            if (keyboard.isPressed("ArrowDown") || keyboard.isDown("Shift") && keyboard.isDown("ArrowDown") ||
                this.clicked && yy > oy + this.py * CELL) {
                if (this.pdir === 90) {
                    this.goBack();
                }
                else if (this.canMove(0, 1)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 270));
                    this.pdir = 270;
                    this.py += 1;
                    if (SOUND) game.playSound("snd_step");
                }
            }
        }
        
        var obj = this.level.get(this.px, this.py);
        switch (obj.type) {
            case "tunnel":
                /*var out = false;
                for (var i = 0; i < this.trails.length; i++) {
                    var t = this.trails[i];
                    if (t.x === obj.other.x && t.y === obj.other.y) {
                        out = true;
                        break;
                    }
                }
                
                if (out) {
                    while (obj.type === "tunnel") {
                        this.goBack();
                        obj = this.level.get(this.px, this.py);
                    }
                } else {*/
                    while (obj.type === "tunnel") {
                        this.trails.push(new this.Trail(this.px, this.py, this.pdir, this.pdir, true, false));
                        this.trails.push(new this.Trail(obj.other.x, obj.other.y, this.pdir, this.pdir, true, true));
                        this.px = obj.other.x + (this.pdir === 0 ? 1 : (this.pdir === 180 ? -1 : 0));
                        this.py = obj.other.y + (this.pdir === 270 ? 1 : (this.pdir === 90 ? -1 : 0));
                        obj = this.level.get(this.px, this.py);
                    }
                //}
                this.clicked = false;
                break;
        
            case "target":
                if (!this.finished && this.level.tiles === this.trails.length) {
                    //this.done = true;
                    this.finished = true;
                    this.doneFade = 1;
                    this.hasControl = false;
                    
                    if (SOUND) game.playSound("snd_finish");
                }
                break;
        }
        
        var s = 0;
        var color = COLPLAYER;
        
        var TEST = "rgb(54, 62, 58)";
        ctx.fillStyle = TEST;
        
        for (var i = 0; i < this.trails.length; i++) {
            var t = this.trails[i];
            var tx = ox + t.x * CELL;
            var ty = oy + t.y * CELL;
            
            ctx.fillRect(tx + 1, ty + 1, CELL - 2, CELL - 2);
        }
        
        ctx.fillRect(ox + this.px * CELL + 1, oy + this.py * CELL + 1, CELL - 2, CELL - 2);
        
        ctx.drawImage(this.image, ox - 5, oy - 5);
        
        s = 6;
        if (this.finished) {
            if (this.doneFade > 0) {
                this.doneFade -= 0.03;
            } else {
                this.done = true;
            }
            s = 2;
            var v = Math.floor(205 - (1 - this.doneFade) * 105);
            color = `rgb(${v - 5}, ${v}, ${v - 5})`;
        }
        
        for (var i = 0; i < this.level.bridges.length; i++) {
            this.level.bridges[i].state = 0;
        }
        
        for (var i = 0; i < this.trails.length; i++) {
            var t = this.trails[i];
            var tx = ox + t.x * CELL;
            var ty = oy + t.y * CELL;
            var back = TEST;//COLBACK;
            
            var ii = Math.floor(i / Math.max(this.level.tiles, 20) * 20);
            var col = this.finished ? color : `rgb(${60 + ii}, ${140 + ii}, ${60 + ii})`;//COLTRAIL;
            var b = null;
            
            for (var j = 0; j < this.level.bridges.length; j++) {
                var bridge = this.level.bridges[j];
                
                if (bridge.x === t.x && bridge.y === t.y) {
                    bridge.state += 1;
                    if (bridge.state === 1) {
                        b = bridge;
                    }
                }
            }
            
            if (!t.tunnel || t.out) {
                switch (t.nextdir) {
                    case 0:
                        ctx.fillStyle = back;
                        ctx.fillRect(tx + CELL - 2, ty + 1, 4, CELL - 2);
                        ctx.fillStyle = col;
                        ctx.fillRect(tx + CELL - s, ty + s, 2 * s, CELL - 2 * s);
                        break;
                        
                    case 90:
                        ctx.fillStyle = back;
                        ctx.fillRect(tx + 1, ty - 2, CELL - 2, 4);
                        ctx.fillStyle = col;
                        ctx.fillRect(tx + s, ty - s, CELL - 2 * s, 2 * s);
                        break;
                        
                    case 180:
                        ctx.fillStyle = back;
                        ctx.fillRect(tx - 2, ty + 1, 4, CELL - 2);
                        ctx.fillStyle = col;
                        ctx.fillRect(tx - s, ty + s, 2 * s, CELL - 2 * s);
                        break;
                        
                    case 270:
                        ctx.fillStyle = back;
                        ctx.fillRect(tx + 1, ty + CELL - 2, CELL - 2, 4);
                        ctx.fillStyle = col;
                        ctx.fillRect(tx + s, ty + CELL - s, CELL - 2 * s, 2 * s);
                        break;
                }
            }
            
            if (!this.finished && t.tunnel) {
                var dir;
                if (t.out) {
                    dir = t.nextdir;
                } else {
                    dir = (t.nextdir + 180) % 360;
                }
                
                ctx.fillStyle = col;
                
                switch (dir) {
                    case 0:
                        ctx.beginPath();
                        ctx.moveTo(tx + CELL / 2 - 5, ty + CELL / 2);
                        ctx.lineTo(tx + CELL - s, ty + s);
                        ctx.lineTo(tx + CELL - s, ty + CELL - s);
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 90:
                        ctx.beginPath();
                        ctx.moveTo(tx + CELL / 2, ty + CELL / 2 + 5);
                        ctx.lineTo(tx + s, ty + s);
                        ctx.lineTo(tx + CELL - s, ty + s);
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 180:
                        ctx.beginPath();
                        ctx.moveTo(tx + CELL / 2 + 5, ty + CELL / 2);
                        ctx.lineTo(tx + s, ty + s);
                        ctx.lineTo(tx + s, ty + CELL - s);
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 270:
                        ctx.beginPath();
                        ctx.moveTo(tx + CELL / 2, ty + CELL / 2 - 5);
                        ctx.lineTo(tx + s, ty + CELL - s);
                        ctx.lineTo(tx + CELL - s, ty + CELL - s);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }
            } else {
                ctx.fillStyle = col;
                ctx.fillRect(tx + s, ty + s, CELL - 2 * s, CELL - 2 * s);
            }
            
            if (b) {
                this.drawBridge(tx, ty);
            }
        }
        
        if (!this.finished) {
            s = 4 - this.ptween.get() + this.glow;
        } else {
            s = 2;
        }
        ctx.fillStyle = color;
        ctx.fillRect(ox + this.px * CELL + s, oy + this.py * CELL + s, CELL - 2 * s, CELL - 2 * s);
        
        for (var i = 0; i < this.level.bridges.length; i++) {
            var bridge = this.level.bridges[i]; 
            if (bridge.state === 0) {
                this.drawBridge(ox + bridge.x * CELL, oy + bridge.y * CELL);
            }
        }
        
        if (this.number === LEVELS.length - 1) {
            ctx.fillStyle = "white";
            ctx.globalAlpha = 0.6;
            ctx.font = "64px fontgif, sans-serif";
            ctx.fillText("Congratulations!", this.x, this.y - 80);
            ctx.font = "48px fontgif, sans-serif";
            ctx.fillText("Thank you for playing!", this.x, this.y + 105);
            //ctx.fillText("Thank you", this.x, this.y - 60);
            //ctx.fillText("for playing!", this.x, this.y + 105);
            ctx.globalAlpha = 1;
        }
        
        if (this.glowingState) {
            if (this.glow < 1.2) {
                this.glow += 0.01;
            } else {
                this.glowingState = false;
            }
        } else {
            if (this.glow > -0.1) {
                this.glow -= 0.01;
            } else {
                this.glowingState = true;
            }
        }
    },
    
    destroy() {
        //console.log("destroyed, level", this.number);
    }
});

game.addScene("scn_levels", {
    enter() {
        game.createInstance("obj_controller");
    }
});
    
function startGame() {
    var path = "src/";
    
    game.loadAssets({
        images: {
            "spr_sound_on": path + "images/img_sound_on.png",
            "spr_sound_off": path + "images/img_sound_off.png",
            "spr_restart": path + "images/img_restart.png",
            "spr_music_on": path + "images/img_music_on.png",
            "spr_music_off": path + "images/img_music_off.png",
            "spr_prev": path + "images/img_arrow_prev.png",
            "spr_next": path + "images/img_arrow_next.png"
        },
        
        sounds: {
            "snd_undo": path + "sounds/snd_undo.wav",
            "snd_swipe": path + "sounds/snd_swipe.wav",
            "snd_finish": path + "sounds/snd_finish.wav",
            "snd_step": path + "sounds/snd_step.wav"
        },
        
        music: {
            "mus_back": path + "music/mus_back.mp3"
        },
        
        fonts: {
            "fontgif": path + "fonts/font.ttf"
        }
    }, {
        progress: function (p) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.lineWidth = 2;
            
            ctx.strokeStyle = "rgb(100, 100, 100)";
            ctx.strokeRect(ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 - 15, 200, 30);
            
            ctx.fillStyle = "rgb(100, 100, 100)";
            ctx.fillRect(ctx.canvas.width / 2 - 100 + 4, ctx.canvas.height / 2 - 15 + 4, (200 - 8) * p, 30 - 8);
        },
        
        finish: function () {
            loadLevels();
            
            game.music["mus_back"].loop = true;
            game.music["mus_back"].play();
            game.run();
            game.gotoScene("scn_levels");
        }
    });
}

canvas.addEventListener("click", function () {
    canvas.focus();
});

window.kongregate = null;
window.addEventListener("load", function () {
    canvas.focus();
    
    if (!window.kongregateAPI) {
        //console.log("No kongregateAPI found.");
        window.kongregateAPI = {
            loadAPI(f) {
                f();
            },
            getAPI() {
                return null;
            }
        }
    }
    
    kongregateAPI.loadAPI(function () {
        window.kongregate = kongregateAPI.getAPI();
        startGame();
    });
});

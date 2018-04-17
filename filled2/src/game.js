var game = new Game(640, 640);
var ctx = game.ctx;

var LOADING = true;
var kongApi;

game.canvas.style.backgroundColor = COLBACK;

game.addObject("obj_controller", {
    create: function () {
        this.levelTween = new Tween(0, 7);
        
        this.waitTime = 30;
        this.timer = this.waitTime;
        this.sliding = false;
        this.direction = 0;
        this.number = 0;
        /*
        if (game.getLocalStorage("giflevel")) {
            this.number = parseInt(game.getLocalStorage("giflevel"));
            this.number = Math.max(0, Math.min(this.number, LEVELS.length - 1));
        }
        */
        kongApi.submitStat("Level", this.number);
        if (this.number >= LEVELS.length - 1) {
            kongApi.submitStat("Completion", 1);
        } else {
            kongApi.submitStat("Completion", 0);
        }
        
        this.prev = null;
        this.level = game.createInstance("obj_level", ctx.canvas.width / 2, ctx.canvas.height / 2);
        this.level.number = this.number;
        this.level.hasControl = true;
        
        this.unlockedLevels = [];
        this.restartAngle = 0;
        this.dirlist = [];
        
        for (var i = 0; i < LEVELS.length; i++) {
            this.dirlist.push(0);
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
    
    update: function () {
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
                
                if (this.restartAngle > 0) {
                    this.direction = 90;
                } else {
                    this.direction = ((this.goingBack ? 180 : 0) + this.dirlist[this.number - (this.goingBack ? 0 : 1)]) % 360;
                }
                
                this.levelTween.set(this.direction === 0 || this.direction === 180 ? ctx.canvas.width : ctx.canvas.height);
                this.timer = 50;
                this.sliding = true;
                
                if (!this.unlockedLevels[this.number]) {
                    this.unlockedLevels[this.number] = true;
                    game.setLocalStorage("giflevel", this.number);
                    
                    kongApi.submitStat("Level", this.number);
                    if (this.number >= LEVELS.length - 1) {
                        kongApi.submitStat("Completion", 1);
                    }
                }
                
                if (SOUND) game.playSound("snd_swipe");
            }
        }
        
        var z;
        
        ctx.globalAlpha = 0.6;
        
        var musicHover = IsMouseInBox(25, 20, 48, 48);
        z = musicHover ? 6 : 0;
        ctx.globalAlpha = musicHover ? 1 : 0.3;
        ctx.drawImage(DRAWINGS[MUSIC ? "spr_music_on" : "spr_music_off"], 25 - z / 2, 20 - z / 2, 48 + z, 48 + z);
        
        var soundHover = IsMouseInBox(25 + 48 + 20, 20, 48, 48);
        z = soundHover ? 6 : 0;
        ctx.globalAlpha = soundHover ? 1 : 0.3;
        ctx.drawImage(DRAWINGS[SOUND ? "spr_sound_on" : "spr_sound_off"], 25 + 48 + 20 - z / 2, 20 - z / 2, 48 + z, 48 + z);
        
        var restartHover = false;
        
        if (this.restartAngle > 0.05) {
            this.restartAngle /= 1.1;
        } else {
            this.restartAngle = 0;
        }
        
        if (this.number < LEVELS.length - 1) {
            restartHover = IsMouseInBox(ctx.canvas.width - 25 - 48, 20, 48, 48);
            z = restartHover ? 6 : 0;
            ctx.globalAlpha = restartHover ? 1 : 0.3;
            
            ctx.save();
            ctx.translate(ctx.canvas.width - 25 - 48 + 24, 20 + 24 + 2);
            ctx.rotate(-this.restartAngle);
            ctx.drawImage(DRAWINGS["spr_restart"], -24 - z / 2, -24 - z / 2, 48 + z, 48 + z);
            ctx.restore();
        }
        
        ctx.globalAlpha = 0.4;
        ctx.textAlign = "center";//"center";
        ctx.fillStyle = "white";
        ctx.font = "42px gamefont, sans-serif";
        
        if (this.number < LEVELS.length - 1) {
            ctx.fillText((this.number < 9 ? "0" : "") + (this.number + 1), ctx.canvas.width / 2, ctx.canvas.height - 32 + 5);
            //ctx.fillText((this.number < 9 ? "0" : "") + (this.number + 1), ctx.canvas.width - 30, 50 + 70);
            //ctx.fillText((this.number < 9 ? "0" : "") + (this.number + 1), ctx.canvas.width - 100, 58);
        }
        
        var prevHover = false;
        
        if (this.number > 0 && this.unlockedLevels[this.number - 1]) {
            prevHover = IsMouseInBox(20, ctx.canvas.height - 70, 48, 48);
            z = prevHover ? 6 : 0;
            ctx.globalAlpha = prevHover ? 1 : 0.2;
            ctx.drawImage(DRAWINGS["spr_prev"], 20 - z / 2, ctx.canvas.height - 70 - z / 2 + 5, z + 48, z + 48);
        }
        
        var nextHover = false;
        
        if (this.number < LEVELS.length - 1 && this.unlockedLevels[this.number + 1]) {
            nextHover = IsMouseInBox(ctx.canvas.width - 48 - 20, ctx.canvas.height - 70, 48, 48);
            z = nextHover ? 6 : 0;
            ctx.globalAlpha = nextHover ? 1 : 0.2;
            ctx.drawImage(DRAWINGS["spr_next"], ctx.canvas.width - 48 - 20 - z / 2, ctx.canvas.height - 70 - z / 2 + 5, z + 48, z + 48);
        }
        
        ctx.globalAlpha = 1;
        
        if (game.mousePressed("Left")) {
            if (musicHover) {
                MUSIC = !MUSIC;
                
                game.setLocalStorage("music", MUSIC ? "on" : "off");
                
                if (MUSIC) {
                    game.playMusic("mus_back", true);
                } else {
                    game.pauseMusic("mus_back");
                }
            }
            
            if (soundHover) {
                SOUND = !SOUND;
                
                game.setLocalStorage("sounds", SOUND ? "on" : "off");
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
        
        if (game.keyboardPressed("o") && this.number > 0 && this.unlockedLevels[this.number - 1]) {
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
        
        if (game.keyboardPressed("p") && this.number < LEVELS.length - 1 && this.unlockedLevels[this.number + 1]) {
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
        
        if (game.keyboardPressed("r")) {
            this.restart();
        }
        
        if (game.keyboardPressed("m")) {
            MUSIC = !MUSIC;
            
            game.setLocalStorage("music", MUSIC ? "on" : "off");
            
            if (MUSIC) {
                game.playMusic("mus_back", true);
            } else {
                game.pauseMusic("mus_back");
            }
        }
        
        if (game.keyboardPressed("k")) {
            SOUND = !SOUND;
            
            game.setLocalStorage("sounds", SOUND ? "on" : "off");
        }
    }
});

game.addObject("obj_dust", {
    create: function () {
        this.x = Math.floor(Math.random() * ctx.canvas.width);
        this.y = Math.floor(Math.random() * ctx.canvas.height);
        this.speed = 0.001 + Math.random() * 0.2;
        this.direction = Math.random() * 2 * Math.PI;
        this.lifetime = 60 * 10 + Math.floor(Math.random() * 60 * 10);
        this.life = this.lifetime;
    },
    
    update: function () {
        this.life -= 1;
        if (this.life < 0) {
            game.destroyInstance(this);
            return;
        }
        
        this.x += Math.cos(this.direction) * this.speed;
        this.y -= Math.sin(this.direction) * this.speed;
        
        var olt = this.lifetime / 2;
        var alpha = 1 - Math.abs(this.life - olt) / olt;
        ctx.globalAlpha = Math.max(0, Math.min(alpha / 4, 1));
        ctx.fillStyle = "rgb(70, 105, 70)";
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), 6, 6);
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_level", {
    create: function () {
        this.number = -1;
        this.level = null;
        this.image = null;
        this.hasControl = false;
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
            
            if (x < 0 || this.level.width <= x || y < 0 || this.level.height <= y) {
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
            
            var teleported = false;
            
            var t = self.trails.pop();
            while (t.tunnel) {
                t = self.trails.pop();
                teleported = true;
                self.clicked = false;//
            }
            
            self.px = t.x;
            self.py = t.y;
            self.pdir = t.prevdir;
            
            if (teleported && self.clicked) {
                var ox = Math.floor(ctx.canvas.width / 2) - this.level.width * CELL / 2;
                var oy = Math.floor(ctx.canvas.height / 2) - this.level.height * CELL / 2 + CELL / 2;
                self.clickX = game.mouseX - (ox + self.px * CELL + CELL / 2);
                self.clickY = game.mouseY - (oy + self.py * CELL + CELL / 2); 
            }
            
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
            ctx.fillRect(x + 2, y + 2, s - 1, s - 1);
            ctx.fillRect(x + CELL - s - 1, y + 2, s - 1, s - 1);
            ctx.fillRect(x + 2, y + CELL - s - 1, s - 1, s - 1);
            ctx.fillRect(x + CELL - s - 1, y + CELL - s - 1, s - 1, s - 1);
        };
        
        this.moved = false;
        this.clickX = 0;
        this.clickY = 0;
    },
    
    update: function () {
        if (!this.level) {
            if (this.number < 0) {
                return;
            }
            
            this.level = LEVELGRIDS[this.number];
            this.image = IMAGES[this.number];
            this.px = this.level.startX;
            this.py = this.level.startY;
        }
        
        if (Math.random() < 0.1 && game.getInstanceCount("obj_dust") < 20) {
            game.createInstance("obj_dust", 0, 0, 10000);
        }
        
        if (!CONTROLLER.sliding && !this.done) {
            this.x = Math.floor(ctx.canvas.width / 2);
            this.y = Math.floor(ctx.canvas.height / 2);
        }
        
        var ox = this.x - this.level.width * CELL / 2;
        var oy = this.y - this.level.height * CELL / 2 - CELL / 2 + CELL / 2;
        
        if (this.hasControl) {
            /*
            if (game.mousePressed("Left")) {
                if (IsMouseInBox(ox + this.px * CELL, oy + this.py * CELL, CELL, CELL)) {
                //if (IsMouseInBox(0, 80, ctx.canvas.width, ctx.canvas.height - 160)) {
                    this.clicked = true;
                    this.clickX = 0;//game.mouseX - (ox + this.px * CELL + CELL / 2);
                    this.clickY = 0;//game.mouseY - (oy + this.py * CELL + CELL / 2);
                }
            }
            
            if (game.mouseReleased("Left") && !this.moved && !IsMouseInBox(ox + this.px * CELL, oy + this.py * CELL, CELL, CELL)) {
                for (var i = 0; i < this.trails.length; i++) {
                    var t = this.trails[i];
                    
                    if (IsMouseInBox(ox + t.x * CELL, oy + t.y * CELL, CELL, CELL) && !t.tunnel) {
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
            */
            
            if (game.mousePressed("Left")) {
                if (IsMouseInBox(ox + this.px * CELL, oy + this.py * CELL, CELL, CELL)) {
                    this.clicked = true;
                    this.clickX = 0;//game.mouseX - (ox + this.px * CELL + CELL / 2);
                    this.clickY = 0;//game.mouseY - (oy + this.py * CELL + CELL / 2);
                } else {
                    for (var i = 0; i < this.trails.length; i++) {
                        var t = this.trails[i];
                        
                        if (IsMouseInBox(ox + t.x * CELL, oy + t.y * CELL, CELL, CELL) && !t.tunnel) {
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
            
            if (!game.mouseDown("Left")) {
                this.clicked = false;
                this.moved = false;
            }
            
            var xx, yy;
            if (this.clicked) { 
                xx = ox + Math.floor((game.mouseX - this.clickX - ox) / CELL) * CELL;
                yy = oy + Math.floor((game.mouseY - this.clickY - oy) / CELL) * CELL;
            }
            
            if (game.keyboardPressed(" ") ||
                game.keyboardPressed("ArrowLeft") || game.keyboardPressed("ArrowRight") ||
                game.keyboardPressed("ArrowUp") || game.keyboardPressed("ArrowDown")) {
                this.ptween.set(2);
            }
                
            if (game.keyboardPressed(" ")) {
                this.goBack();
            }
            
            if (game.keyboardPressed("ArrowLeft") || game.keyboardDown("Shift") && game.keyboardDown("ArrowLeft") ||
                this.clicked && xx < ox + this.px * CELL) {
                if (this.pdir === 0) {
                    this.goBack();
                    xx = ox + Math.floor((game.mouseX - this.clickX - ox) / CELL) * CELL;
                    yy = oy + Math.floor((game.mouseY - this.clickY - oy) / CELL) * CELL;
                }
                else if (this.canMove(-1, 0)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 180));
                    this.pdir = 180;
                    this.px -= 1;
                    if (SOUND) game.playSound("snd_step");
                } else {
                    //this.clickX = game.mouseX - (ox + this.px * CELL + CELL / 2);
                    //this.clickY = game.mouseY - (oy + this.py * CELL + CELL / 2);
                }
                this.moved = true;
            }
            
            if (game.keyboardPressed("ArrowRight") || game.keyboardDown("Shift") && game.keyboardDown("ArrowRight") ||
                this.clicked && xx > ox + this.px * CELL) {
                if (this.pdir === 180) {
                    this.goBack();
                    xx = ox + Math.floor((game.mouseX - this.clickX - ox) / CELL) * CELL;
                    yy = oy + Math.floor((game.mouseY - this.clickY - oy) / CELL) * CELL;
                }
                else if (this.canMove(1, 0)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 0));
                    this.pdir = 0;
                    this.px += 1;
                    if (SOUND) game.playSound("snd_step");
                } else {
                    //this.clickX = game.mouseX - (ox + this.px * CELL + CELL / 2);
                    //this.clickY = game.mouseY - (oy + this.py * CELL + CELL / 2);
                }
                this.moved = true;
            }
            
            if (game.keyboardPressed("ArrowUp") || game.keyboardDown("Shift") && game.keyboardDown("ArrowUp") ||
                this.clicked && yy < oy + this.py * CELL) {
                if (this.pdir === 270) {
                    this.goBack();
                    xx = ox + Math.floor((game.mouseX - this.clickX - ox) / CELL) * CELL;
                    yy = oy + Math.floor((game.mouseY - this.clickY - oy) / CELL) * CELL;
                }
                else if (this.canMove(0, -1)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 90));
                    this.pdir = 90;
                    this.py -= 1;
                    if (SOUND) game.playSound("snd_step");
                } else {
                    //this.clickX = game.mouseX - (ox + this.px * CELL + CELL / 2);
                    //this.clickY = game.mouseY - (oy + this.py * CELL + CELL / 2);
                }
                this.moved = true;
            }
            
            if (game.keyboardPressed("ArrowDown") || game.keyboardDown("Shift") && game.keyboardDown("ArrowDown") ||
                this.clicked && yy > oy + this.py * CELL) {
                if (this.pdir === 90) {
                    this.goBack();
                    xx = ox + Math.floor((game.mouseX - this.clickX - ox) / CELL) * CELL;
                    yy = oy + Math.floor((game.mouseY - this.clickY - oy) / CELL) * CELL;
                }
                else if (this.canMove(0, 1)) {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, 270));
                    this.pdir = 270;
                    this.py += 1;
                    if (SOUND) game.playSound("snd_step");
                } else {
                    //this.clickX = game.mouseX - (ox + this.px * CELL + CELL / 2);
                    //this.clickY = game.mouseY - (oy + this.py * CELL + CELL / 2);
                }
                this.moved = true;
            }
        }

        var obj = this.level.get(this.px, this.py);
        switch (obj.type) {
            case "tunnel":
                while (obj.type === "tunnel") {
                    this.trails.push(new this.Trail(this.px, this.py, this.pdir, this.pdir, true, false));
                    this.trails.push(new this.Trail(obj.other.x, obj.other.y, this.pdir, this.pdir, true, true));
                    this.px = obj.other.x + (this.pdir === 0 ? 1 : (this.pdir === 180 ? -1 : 0));
                    this.py = obj.other.y + (this.pdir === 270 ? 1 : (this.pdir === 90 ? -1 : 0));
                    obj = this.level.get(this.px, this.py);
                }
                
                this.clickX = game.mouseX - (ox + this.px * CELL + CELL / 2);
                this.clickY = game.mouseY - (oy + this.py * CELL + CELL / 2);
                this.clicked = false;//
                break;
        
            case "target":
                if (!this.finished && this.level.tiles === this.trails.length) {
                    this.finished = true;
                    this.doneFade = 1;
                    this.hasControl = false;
                    
                    if (SOUND) game.playSound("snd_finish");
                }
                break;
        }
        
        var s = 0;
        var color = COLPLAYER;
        
        var TEST = COLLAYER;//"rgb(60, 120, 160)";//"rgb(200, 200, 200)";//"rgb(54, 62, 58)";
        ctx.fillStyle = TEST;
        
        for (var i = 0; i < this.trails.length; i++) {
            var t = this.trails[i];
            var tx = ox + t.x * CELL;
            var ty = oy + t.y * CELL;
            
            ctx.fillRect(tx + 1, ty + 1, CELL - 2, CELL - 2);
        }
        
        ctx.fillRect(ox + this.px * CELL + 1, oy + this.py * CELL + 1, CELL - 2, CELL - 2);
        
        ctx.drawImage(this.image, ox - 5, oy - 5);
        
        s = 8;
        if (this.finished) {
            if (this.doneFade > 0) {
                this.doneFade -= 0.025;
            } else {
                this.done = true;
            }
            s = 2;
            var v = Math.floor(205 - (1 - this.doneFade) * 100);
            color = "rgb(" + (v - 5) + "," + v + "," + (v - 5) + ")";
        }
        
        for (var i = 0; i < this.level.bridges.length; i++) {
            this.level.bridges[i].state = 0;
        }
        
        for (var i = 0; i < this.trails.length; i++) {
            var t = this.trails[i];
            var tx = ox + t.x * CELL;
            var ty = oy + t.y * CELL;
            var back = TEST;//COLBACK;
            
            var ii = Math.floor(i / Math.max(this.level.tiles, 20) * 20);//"rgb(50, 200, 50)"
            var col = this.finished ? color : "rgb(" + (50 + ii) + "," + (150 + ii) + "," + (50 + ii) + ")";
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
                        ctx.fillRect(tx + CELL - 2, ty + 2, 4, CELL - 4);
                        ctx.fillStyle = col;
                        ctx.fillRect(tx + CELL - s, ty + s, 2 * s, CELL - 2 * s);
                        break;
                        
                    case 90:
                        ctx.fillStyle = back;
                        ctx.fillRect(tx + 2, ty - 2, CELL - 4, 4);
                        ctx.fillStyle = col;
                        ctx.fillRect(tx + s, ty - s, CELL - 2 * s, 2 * s);
                        break;
                        
                    case 180:
                        ctx.fillStyle = back;
                        ctx.fillRect(tx - 2, ty + 2, 4, CELL - 4);
                        ctx.fillStyle = col;
                        ctx.fillRect(tx - s, ty + s, 2 * s, CELL - 2 * s);
                        break;
                        
                    case 270:
                        ctx.fillStyle = back;
                        ctx.fillRect(tx + 2, ty + CELL - 2, CELL - 4, 4);
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
            s = 6 - this.ptween.get() + this.glow;
        } else {
            s = 2;
        }
        ctx.fillStyle = color;
        ctx.fillRect(ox + this.px * CELL + s, oy + this.py * CELL + s, CELL - 2 * s, CELL - 2 * s);
        //**
        //ctx.strokeStyle = "rgb(120, 120, 40)";
        //ctx.lineWidth = 2;
        //ctx.strokeRect(ox + this.px * CELL + s, oy + this.py * CELL + s, CELL - 2 * s, CELL - 2 * s);
        //**
        
        for (var i = 0; i < this.level.bridges.length; i++) {
            var bridge = this.level.bridges[i]; 
            if (bridge.state === 0) {
                this.drawBridge(ox + bridge.x * CELL, oy + bridge.y * CELL);
            }
        }
        
        if (this.number === LEVELS.length - 1) {
            ctx.fillStyle = "white";
            ctx.globalAlpha = 0.6;
            
            var limitWidth = 500;
            ctx.font = "64px gamefont, sans-serif";
            if (ctx.canvas.width < limitWidth) {
                ctx.font = "32px gamefont, sans-serif";
            }
            ctx.fillText("Congratulations!", this.x, this.y - 80);
            ctx.font = "48px gamefont, sans-serif";
            if (ctx.canvas.width < limitWidth) {
                ctx.font = "24px gamefont, sans-serif";
            }
            ctx.fillText("Thank you for playing!", this.x, this.y + 105);
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
    }
});

game.addScene("scn_levels", {
    enter: function () {
        CONTROLLER = game.createInstance("obj_controller");
    }
});

window.addEventListener("load", function () {
    if (!checkCorrectSite()) {
        return;
    }
    
    if (game.getLocalStorage("music")) {
        MUSIC = game.getLocalStorage("music") === "on" ? true : false;
    }
    
    if (game.getLocalStorage("sounds")) {
        SOUND = game.getLocalStorage("sounds") === "on" ? true : false;
    }
    
    loadKongregateApi(function (api) {
        kongApi = api;
        window.setTimeout(startLoading, 2);
    });
});
    
function startLoading() {
    game.loadAssets({
        sounds: {
            "snd_undo": "src/sounds/snd_undo.wav",
            "snd_swipe": "src/sounds/snd_swipe.wav",
            "snd_finish": "src/sounds/snd_finish.wav",
            "snd_step": "src/sounds/snd_step.wav"
        },
        
        music: {
            "mus_back": "src/music/mus_back.ogg"
        },
        
        fonts: {
            "gamefont": "src/font.ttf"
        }
    }, {
        progress: function (p) {
            var h = Math.max(330, window.innerHeight - 100);
            var w = game.canvasctx.canvas.width / 2;// * h / bh;
            
            var ctx = game.canvasctx;
            var lw = w;//400;
            var lh = 20;
            var s = 4;
            var hh = 30 + lh + 10 + 50;
            
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.lineWidth = 3;
            
            ctx.strokeStyle = "rgb(120, 120, 100)";//"rgb(180, 180, 50)";
            ctx.strokeRect(ctx.canvas.width / 2 - lw / 2, ctx.canvas.height - hh, lw, lh);
            
            ctx.fillStyle = "rgb(120, 100, 80)";//"rgb(180, 70, 20)";
            ctx.fillRect(ctx.canvas.width / 2 - lw / 2 + s, ctx.canvas.height - hh + s, (lw - 2 * s) * p, lh - 2 * s);
            
            //ctx.drawImage(banner, (ctx.canvas.width - w) / 2, (ctx.canvas.height - h) / 2 - 30, w, h);
        },
        
        finish: function () {
            loadDrawings();
            loadLevels();
            
            if (MUSIC) {
                game.playMusic("mus_back", true);
            }
            
            LOADING = false;
            game.run();
            game.enterScene("scn_levels");
        }
    });
}

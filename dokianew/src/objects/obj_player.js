game.addObject("obj_player_particle", {
    create: function () {
        this.depth = 2;
        this.alpha = 1;
        this.angle = 0;
        this.rate = (5 + Math.random() * 10) / 100;
        this.size = 6 + Math.random() * 4;
        this.speed = 3 + Math.random() * 2;
    },
    
    update: function () {
        ctx.fillStyle = PLAYERCOLOR;
        ctx.globalAlpha = Math.min(Math.max(0, this.alpha), 1);
        fillCircle(this.x, this.y, Math.max(0, this.alpha * this.size));
        ctx.globalAlpha = 1;
        
        if (this.alpha > 0) {
            this.alpha -= this.rate;
        } else {
            game.destroyInstance(this);
        }
        
        this.x += Math.cos(this.angle / 180 * Math.PI) * this.speed;
        this.y -= Math.sin(this.angle / 180 * Math.PI) * this.speed;
    }
});

game.addObject("obj_player_switcheffect", {
    create: function () {
        this.depth = 2;
        this.alpha = 1;
        this.rate = 0.05;
        this.size = CELL / 1.6;
        this.color = PLAYERCOLOR;
    },
    
    update: function () {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = (this.alpha + 0.1) * 10;
        ctx.globalAlpha = Math.min(Math.max(0, this.alpha * 2), 1);
        strokeCircle(this.x, this.y, Math.max(0, (1 - this.alpha) * this.size));
        ctx.globalAlpha = 1;
        
        if (this.alpha > 0) {
            this.alpha -= this.rate;
        } else {
            game.destroyInstance(this);
        }
    }
});

game.addObject("obj_player_background", {
    create: function () {
        this.depth = 0;
        this.player = null;
        this.angle = 0;
    },
    
    update: function () {
        this.x = this.player.x;
        this.y = this.player.y;
        this.angle = this.player.angle;
        
        var cx = 1;
        var cy = 1;
        var s = SHADOWOFFSET / 1.5;
        
        ctx.fillStyle = "rgb(0, 0, 0)";
        
        ctx.save();
        ctx.translate(this.x + s, this.y + s);
        ctx.rotate(this.angle / 180 * Math.PI);
        
        ctx.globalAlpha = SHADOWALPHA;
        fillCircle(cx, cy, this.radius + 8);
        //var radius = this.radius + 8;
        //ctx.fillRect(-radius + cx, -radius + cy, 2 * radius, 2 * radius);
        ctx.globalAlpha = 1;
        
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle / 180 * Math.PI);
        
        s = OUTLINE;
        fillCircle(cx, cy, this.radius + 8 + s);
        //radius += s;
        //ctx.fillRect(-radius + cx, -radius + cy, 2 * radius, 2 * radius);
        
        ctx.restore();
    }
});

game.addObject("obj_player", {
    create: function () {
        this.depth = -1;
        this.vspeed = 0;
        this.gravity = 1.2;
        this.radius = 5;
        this.angle = 0;
        this.jumpPower = 18;
        this.speed = 6;
        this.alpha = 1;
        
        this.restartTimer = 0;
        
        this.over = false;
        this.done = false;
        this.dead = false;
        
        this.startX = this.x;
        this.startY = this.y;
        
        this.shadow = game.createInstance("obj_player_background", this.x, this.y);
        this.shadow.radius = this.radius;
        this.shadow.player = this;
                
        this.x += CELL / 2;
        this.y += CELL / 2;
        
        this.trace = {
            x: this.x,
            y: this.y,
            angle: 0
        };
        
        this.prevshadow = game.createInstance("obj_player_background", this.x, this.y);
        this.prevshadow.radius = this.radius;
        this.prevshadow.player = this.trace;
        
        var self = this;
        
        this.collidesWithWall = function (x, y) {
            var collides = false;
            
            game.withInstances("obj_wall", function (other) {
                if (isInBox(x, y, other.x - self.radius, other.y - self.radius, other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                    collides = true;
                    return true;
                }
            });
            
            if (collides) {
                return true;
            }
            
            game.withInstances("obj_wall_fake", function (other) {
                if (isInBox(x, y, other.x - self.radius, other.y - self.radius, other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                    collides = true;
                    other.fade = true;
                    return true;
                }
            });
            
            return collides;
        };
        
        this.collidesWithSpike = function (x, y) {
            var collides = false;
            
            game.withInstances("obj_spike", function (other) {
                if (isInBox(x, y, other.x - other.width / 2 - self.radius, other.y - other.height / 2 - self.radius, 
                                    other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                    collides = true;
                    return true;
                }
            });
            
            if (collides) {
                return true;
            }
            
            if (spikeSwitch) {
                game.withInstances("obj_spike_type2", function (other) {
                    if (isInBox(x, y, other.x - other.width / 2 - self.radius, other.y - other.height / 2 - self.radius, 
                                        other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                        collides = true;
                        return true;
                    }
                });
            } else {
                game.withInstances("obj_spike_type1", function (other) {
                    if (isInBox(x, y, other.x - other.width / 2 - self.radius, other.y - other.height / 2 - self.radius, 
                                        other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                        collides = true;
                        return true;
                    }
                });
            }
            
            if (collides) {
                return true;
            }
            
            game.withInstances("obj_spike_wall", function (other) {
                if (isInBox(x, y, other.x - other.width / 2 - self.radius, other.y - other.height / 2 - self.radius, 
                                    other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                    collides = true;
                    return true;
                }
            });
            
            return collides;
        };
        
        this.collidesWithRocket = function (x, y) {
            var collides = false;
            
            game.withInstances("obj_rocket", function (other) {
                if (isInBox(x, y, other.x - other.width / 2 - self.radius, other.y - other.height / 2 - self.radius, 
                                    other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                    game.destroyInstance(other);
                    collides = true;
                    return true;
                }
            });
            
            return collides;
        }
        
        this.die = function () {
            if (this.dead) {
                return;
            }
            
            game.destroyInstance(this.shadow);
            game.destroyInstance(this.prevshadow);
            
            this.restartTimer = 50;
            this.dead = true;
            this.over = true;
            
            setQuake();
            
            for (var i = 0; i < 20; i++) {
                var p = game.createInstance("obj_player_particle", this.x, this.y);
                p.angle = Math.random() * 360;
                p.size += 2;
                p.alpha += Math.random() * 2;
                p.speed -= 2;
                p.depth = -100;
            }
            
            if (SOUNDS) game.playSound("snd_die");
            counterDie += 1;
        };
    },
    
    update: function () {
        game.attachView(VIEW, this);
        
        if (this.dead) {
            if (this.restartTimer > 0) {
                this.restartTimer -= 1;
            } else {
                game.enterScene("scn_world");
            }
            
            return;
        }
        
        var cx = 1;
        var cy = 1;
        
        if (this.done) {
            if (this.alpha > 0) {
                this.alpha -= 0.01;
            }
            if (this.radius > -8) {
                this.radius -= 0.3;
            }
            if (this.restartTimer < 1000 && this.radius < -3) {
                for (var i = 0; i < 0; i++) {
                    var p = game.createInstance("obj_player_particle", this.x, this.y);
                    p.angle = Math.random() * 360;
                    p.size -= 2;
                    p.alpha += Math.random();
                    p.speed -= 3;
                    p.depth = -100;
                }
                this.restartTimer = 1001;
            }
            this.radius = Math.max(-8, this.radius);
            this.alpha = Math.max(0, this.alpha);
            this.angle += 10;
            
            cx = 3;
            cy = 3;
        }
        
        ctx.globalAlpha = this.alpha;
        
        var sgn = Math.sign(this.gravity);
        var hitGround = false;
        
        ctx.save();
        ctx.translate(this.trace.x, this.trace.y);
        ctx.rotate(this.trace.angle / 180 * Math.PI);
 
        ctx.fillStyle = PLAYERCOLOR;
        fillCircle(cx, cy, this.radius + 8);
        
        ctx.restore();
        
        this.trace.x = this.x;
        this.trace.y = this.y;
        this.trace.angle = this.angle;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle / 180 * Math.PI);
 
        ctx.fillStyle = PLAYERCOLOR;
        fillCircle(cx, cy, this.radius + 8);
        //var radius = this.radius + 8;
        //ctx.fillRect(-radius + 1, -radius + 1, 2 * radius, 2 * radius);
        
        ctx.restore();
        
        ctx.globalAlpha = 1;
        
        if (this.over) {
            return;
        }
        
        this.vspeed = Math.max(-30, Math.min(this.vspeed + this.gravity, 30));
        
        if (this.collidesWithWall(this.x, this.y + this.vspeed)) {
            hitGround = this.vspeed * sgn > 0;
            this.vspeed = 0;
        }
       
        this.y += this.vspeed;
        
        if (!startedPlaying) {
            if (game.keyboardDown("ArrowRight") || game.keyboardDown("ArrowLeft") || game.keyboardDown("ArrowUp")) {
                startedPlaying = true;
                stopAllMusic();
                if (MUSIC) startCurrentMusic();
            }
        }
        
        var dx = ((game.keyboardDown("ArrowRight") ? 1 : 0) - (game.keyboardDown("ArrowLeft") ? 1 : 0)) * this.speed;
        if (!this.collidesWithWall(this.x + dx, this.y)) {
            this.x += dx;
            this.angle = (this.angle + dx * sgn * 2.5 + 360) % 360;
        }
        
        if (game.keyboardDown("ArrowUp")) {
            if (hitGround || this.collidesWithWall(this.x, this.y + sgn * 1)) {
                this.vspeed = -sgn * this.jumpPower;
                if (SOUNDS) game.playSound("snd_jump");
                counterJump += 1;
            }
            
            if (this.vspeed * sgn < 0) {
                this.vspeed -= sgn * 0.3;
            }
        }
        
        var self = this;
        
        if (game.keyboardPressed(" ")) {
            var antied = false;
            game.withInstances("obj_anti", function (other) {
                if (other.x <= self.x && self.x < other.x + other.width && other.y <= self.y && self.y < other.y + other.height) {
                    antied = true;
                }
            });
            
            if (!antied) {
                this.gravity = -this.gravity;
                game.createInstance("obj_player_switcheffect", this.x, this.y);
                if (SOUNDS) game.playSound("snd_gravity");
                counterGravity += 1;
            } else {
                var effect = game.createInstance("obj_player_switcheffect", this.x, this.y);
                effect.color = "rgb(180, 20, 20)";
                if (SOUNDS) game.playSound("snd_anti");
            }
        }
        
        if (this.collidesWithSpike(this.x, this.y) || this.collidesWithRocket(this.x, this.y)) {
            this.die();
        }
        
        game.withInstances("obj_hole", function (other) {
            if (isInBox(self.x, self.y, other.x - other.width / 2 - self.radius, other.y - other.height / 2 - self.radius, 
                                other.width + 2 * self.radius, other.height + 2 * self.radius)) {
                self.over = true;
                self.done = true;
                self.x = other.x;
                self.y = other.y;
                fixedX = other.x - VIEW.x;
                fixedY = other.y - VIEW.y;
                
                completed = true;
                if (SOUNDS) game.playSound("snd_finish");
                //setQuake();
                kongApi.submitStat("Progress", (levelnumber - 1) + (worldnumber - 1) * 10);
            }
        });
        
        if (this.x < -this.radius || game.ctx.canvas.width + this.radius <= this.x ||
            this.y < -this.radius || game.ctx.canvas.height + this.radius <= this.y) {
            this.die();
        }
        
        var m;
        m = Math.abs(this.x - this.trace.x) / 4;
        this.trace.x = Math.max(this.x - m, Math.min(this.trace.x, this.x + m));
        m = Math.abs(this.y - this.trace.y) / 4;
        this.trace.y = Math.max(this.y - m, Math.min(this.trace.y, this.y + m));
    }
});

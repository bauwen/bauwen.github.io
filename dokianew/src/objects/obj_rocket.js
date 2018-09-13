game.addObject("obj_rocket", {
    create: function () {
        this.depth = 1;
        this.width = CELL / 1.2;
        this.height = CELL / 1.2;
        this.angle = 0;
        this.speed = 8;
        this.timer = 300;
        
        var self = this;
        
        this.collidesWithWall = function (x, y) {
            var collides = false;
            
            var s = -3;
            
            game.withInstances("obj_wall", function (other) {
                if (isInBox(x, y, other.x - self.width / 2 - s, other.y - self.height / 2 - s, other.width + self.width + 2 * s, other.height + self.height + 2 * s)) {
                    collides = true;
                    return true;
                }
            });
            
            if (collides) {
                return true;
            }
            
            game.withInstances("obj_wall_fake", function (other) {
                if (isInBox(x, y, other.x - self.width / 2, other.y - self.height / 2, other.width + self.width, other.height + self.height)) {
                    collides = true;
                    return true;
                }
            });
            
            return collides;
        };
    },
    
    update: function () {
        var s = SHADOWOFFSET / 2;
        
        ctx.save();
        ctx.translate(this.x + s, this.y + s);
        ctx.rotate(-this.angle / 180 * Math.PI);
        ctx.globalAlpha = SHADOWALPHA;
        
        ctx.drawImage(IMAGES["img_rocket_shadow"], -CELL / 2, -CELL / 2);
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle / 180 * Math.PI);
        
        ctx.drawImage(IMAGES["img_rocket"], -CELL / 2, -CELL / 2);
        ctx.restore();
        
        var direction = 0;
        var self = this;
        
        game.withInstances("obj_player", function (other) {
            direction = -Math.atan2(other.y - self.y, other.x - self.x) / Math.PI * 180;
        });
        
        direction = (direction + 360) % 360;
        this.angle = (this.angle + 360) % 360;
        
        if (Math.abs(direction - this.angle) >= 5) {
            if ((direction - this.angle + 360) % 360 > 180) {
                this.angle -= 4;
            } else {
                this.angle += 4;
            }
        }
        
        if (this.x < -2 * this.width || game.ctx.canvas.width + 2 * this.width <= this.x ||
            this.y < -2 * this.height || game.ctx.canvas.height + 2 * this.height <= this.y) {
            game.destroyInstance(this);
            return;
        }
        
        this.x += Math.cos(this.angle / 180 * Math.PI) * this.speed;
        this.y -= Math.sin(this.angle / 180 * Math.PI) * this.speed;
        
        if (Math.random() < 0.8) {
            var trace = game.createInstance("obj_rocket_trace", this.x, this.y);
            trace.angle = (this.angle + 180) % 360;
        }
        
        if (this.collidesWithWall(this.x, this.y)) {
            game.destroyInstance(this);
            return;
        }
        
        if (this.timer > 0) {
            this.timer -= 1;
        } else {
            game.destroyInstance(this);
            return;
        }
    },
    
    destroy: function () {
        if (this.x < -2 * this.width || game.ctx.canvas.width + 2 * this.width <= this.x ||
            this.y < -2 * this.height || game.ctx.canvas.height + 2 * this.height <= this.y) {
            return;
        }
        
        if (SOUNDS) game.playSound("snd_explo");
        
        for (var i = 0; i < 20; i++) {
            var trace = game.createInstance("obj_rocket_trace", this.x, this.y);
            trace.angle = Math.random() * 360;
            trace.size += 2;
            trace.alpha += Math.random() * 2;
            trace.speed -= 2;
            trace.depth = -100;
        }
    }
});

game.addObject("obj_rocket_trace", {
    create: function () {
        this.depth = 2;
        this.alpha = 1;
        this.angle = 0;
        this.rate = (5 + Math.random() * 10) / 100;
        this.size = 6 + Math.random() * 4;
        this.speed = 3 + Math.random() * 2;
    },
    
    update: function () {
        ctx.fillStyle = "rgb(240, 200, 160)";
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

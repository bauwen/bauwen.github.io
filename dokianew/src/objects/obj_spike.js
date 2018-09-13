game.addObject("obj_spike", {
    create: function () {
        this.depth = 1;
        this.width = CELL / 1.2;
        this.height = CELL / 1.2;
        this.angle = 0;//Math.floor(Math.random() * 360 / 6) * 6;
        this.rotspeed = 7;
        this.rotsgn = 2 * Math.floor(Math.random() * 2) - 1;
        
        this.x += CELL / 2;
        this.y += CELL / 2;
    },
    
    update: function () {
        var s = SHADOWOFFSET / 2;
        
        ctx.save();
        ctx.translate(this.x + s, this.y + s);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        ctx.globalAlpha = SHADOWALPHA;
        
        ctx.drawImage(IMAGES["img_spike_shadow"], -CELL / 2, -CELL / 2);
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        
        ctx.drawImage(IMAGES["img_spike"], -CELL / 2, -CELL / 2);
        ctx.restore();
        
        this.angle = (this.angle + this.rotspeed + 360) % 360;
    }
});

game.addObject("obj_spike_type1", {
    create: function () {
        this.depth = 1;
        this.width = CELL / 1.2;
        this.height = CELL / 1.2;
        this.angle = 0;//Math.floor(Math.random() * 360 / 6) * 6;
        this.rotspeed = 7;
        this.rotsgn = 2 * Math.floor(Math.random() * 2) - 1;
        
        this.x += CELL / 2;
        this.y += CELL / 2;
    },
    
    update: function () {
        var s = SHADOWOFFSET / 2;
        
        ctx.save();
        ctx.translate(this.x + s, this.y + s);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        ctx.globalAlpha = SHADOWALPHA;
        
        ctx.drawImage(IMAGES["img_spike_shadow"], -CELL / 2, -CELL / 2);
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        
        ctx.drawImage(IMAGES["img_spike_type1" + (spikeSwitch ? "_outline" : "")], -CELL / 2, -CELL / 2);
        ctx.restore();
        
        this.angle = (this.angle + this.rotspeed + 360) % 360;
    }
});

game.addObject("obj_spike_type2", {
    create: function () {
        this.depth = 1;
        this.width = CELL / 1.2;
        this.height = CELL / 1.2;
        this.angle = 0;//Math.floor(Math.random() * 360 / 6) * 6;
        this.rotspeed = 7;
        this.rotsgn = 2 * Math.floor(Math.random() * 2) - 1;
        
        this.x += CELL / 2;
        this.y += CELL / 2;
    },
    
    update: function () {
        var s = SHADOWOFFSET / 2;
        
        ctx.save();
        ctx.translate(this.x + s, this.y + s);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        ctx.globalAlpha = SHADOWALPHA;
        
        ctx.drawImage(IMAGES["img_spike_shadow"], -CELL / 2, -CELL / 2);
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        
        ctx.drawImage(IMAGES["img_spike_type2" + (spikeSwitch ? "" : "_outline")], -CELL / 2, -CELL / 2);
        ctx.restore();
        
        this.angle = (this.angle + this.rotspeed + 360) % 360;
    }
});

game.addObject("obj_spike_wall", {
    create: function () {
        this.depth = 1;
        this.width = CELL / 1.2;
        this.height = CELL / 1.2;
        this.angle = 0;
        this.rotspeed = 10;
        
        this.clockwise = Math.random() < 0.5;
        this.direction = -1;
        this.speed = Math.floor(CELL / 10);
        
        this.rotsgn = this.clockwise ? -1 : 1;
        
        this.x += CELL / 2;
        this.y += CELL / 2;
    },
    
    update: function () {
        var s = SHADOWOFFSET / 2;
        
        ctx.save();
        ctx.translate(this.x + s, this.y + s);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        ctx.globalAlpha = SHADOWALPHA;
        
        ctx.drawImage(IMAGES["img_spike_shadow"], -CELL / 2, -CELL / 2);
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotsgn * this.angle / 180 * Math.PI);
        
        ctx.drawImage(IMAGES["img_spike"], -CELL / 2, -CELL / 2);
        ctx.restore();
        
        this.angle = (this.angle + this.rotspeed + 360) % 360;
        
        var x = this.x - CELL / 2;
        var y = this.y - CELL / 2;
        var tx = Math.floor(x / CELL) * CELL;
        var ty = Math.floor(y / CELL) * CELL;
        
        if (x === tx && y === ty) {
            var r = false;
            var l = false;
            var u = false;
            var d = false;
            
            game.withInstances("obj_wall", function (other) {
                if (tx + CELL === other.x && ty === other.y) r = true;
                if (tx - CELL === other.x && ty === other.y) l = true;
                if (tx === other.x && ty - CELL === other.y) u = true;
                if (tx === other.x && ty + CELL === other.y) d = true;
            });
            
            if (this.direction < 0) {
                if (this.clockwise) {
                    if (r) this.direction = 90;
                    if (l) this.direction = 270;
                    if (u) this.direction = 180;
                    if (d) this.direction = 0;
                } else {
                    if (r) this.direction = 270;
                    if (l) this.direction = 90;
                    if (u) this.direction = 0;
                    if (d) this.direction = 180;
                }
            }
            else if (this.clockwise) {
                switch (this.direction) {
                    case 0:
                        if (r) this.direction = 90;
                        if (!d) this.direction = 270;
                        break;
                    case 90:
                        if (u) this.direction = 180;
                        if (!r) this.direction = 0;
                        break;
                    case 180:
                        if (l) this.direction = 270;
                        if (!u) this.direction = 90;
                        break;
                    case 270:
                        if (d) this.direction = 0;
                        if (!l) this.direction = 180;
                        break;
                }
            } else {
                switch (this.direction) {
                    case 0:
                        if (r) this.direction = 270;
                        if (!u) this.direction = 90;
                        break;
                    case 90:
                        if (u) this.direction = 0;
                        if (!l) this.direction = 180;
                        break;
                    case 180:
                        if (l) this.direction = 90;
                        if (!d) this.direction = 270;
                        break;
                    case 270:
                        if (d) this.direction = 180;
                        if (!r) this.direction = 0;
                        break;
                }
            }
        }
        
        this.x += Math.cos(this.direction / 180 * Math.PI) * this.speed;
        this.y -= Math.sin(this.direction / 180 * Math.PI) * this.speed;
    }
});

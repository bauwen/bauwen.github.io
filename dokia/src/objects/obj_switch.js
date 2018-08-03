game.addObject("obj_switch", {
    create: function () {
        this.depth = 0;
        this.width = CELL / 1;
        this.height = CELL / 1;
        this.angle = 0;
        this.rotspeed = 4;
        this.colliding = false;
        
        var self = this;
        
        this.collidesWithPlayer = function (x, y) {
            var collides = false;
            
            game.withInstances("obj_player", function (other) {
                if (isInBox(other.x, other.y, x - other.radius, y - other.radius, self.width + 2 * other.radius, self.height + 2 * other.radius)) {
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
        ctx.translate(this.x + CELL / 2 + s, this.y + CELL / 2 + s);
        ctx.rotate((spikeSwitch ? -1 : 1) * this.angle / 180 * Math.PI);
        ctx.globalAlpha = SHADOWALPHA;
        
        ctx.drawImage(IMAGES["img_switch_shadow"], -CELL / 2, -CELL / 2);
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x + CELL / 2, this.y + CELL / 2);
        ctx.rotate((spikeSwitch ? -1 : 1) * this.angle / 180 * Math.PI);
        
        ctx.drawImage(IMAGES["img_switch_type" + (spikeSwitch ? "2" : "1")], -CELL / 2, -CELL / 2);
        
        ctx.restore();
        
        this.angle = (this.angle + this.rotspeed + 360) % 360;
        
        if (this.collidesWithPlayer(this.x, this.y)) {
            if (!this.colliding) {
                spikeSwitch = !spikeSwitch;
                this.colliding = true;
                if (SOUNDS) game.playSound("snd_switch");
            }
        } else {
            this.colliding = false;
        }
    }
});

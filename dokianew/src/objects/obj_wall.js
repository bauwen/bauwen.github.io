game.addObject("obj_wall_background", {
    create: function () {
        this.depth = 100;
    },
    
    update: function () {
        var s = OUTLINE;
        
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(this.x - s, this.y - s, this.width + 2 * s, this.height + 2 * s);
        
        s = SHADOWOFFSET;
        
        ctx.globalAlpha = SHADOWALPHA;
        ctx.fillRect(this.x + s, this.y + s, this.width, this.height);
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_wall_fake_background", {
    create: function () {
        this.depth = 100;
        this.alpha = 1;
    },
    
    update: function () {
        var s = OUTLINE;
        
        ctx.globalAlpha = Math.max(0, this.alpha);
        
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(this.x - s, this.y - s, this.width + 2 * s, this.height + 2 * s);
        
        s = SHADOWOFFSET;
        
        ctx.globalAlpha = Math.max(0, SHADOWALPHA - (1 - this.alpha) * SHADOWALPHA * 2);
        ctx.fillRect(this.x + s, this.y + s, this.width, this.height);
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_wall", {
    create: function () {
        this.depth = -2;
        this.width = CELL;
        this.height = CELL;
        
        this.b = game.createInstance("obj_wall_background", this.x, this.y);
        this.b.width = this.width;
        this.b.height = this.height;
    },
    
    update: function () {    
        if (blockImage) ctx.drawImage(blockImage, this.x, this.y);
    }
});

game.addObject("obj_wall_fake", {
    create: function () {
        this.depth = -2;
        this.width = CELL;
        this.height = CELL;
        
        this.b = game.createInstance("obj_wall_background", this.x, this.y);
        this.b.width = this.width;
        this.b.height = this.height;
        
        this.fade = false;
        this.alpha = 1;
    },
    
    update: function () {
        if (this.fade) {
            if (this.alpha > 0) {
                this.alpha -= 0.03;
            } else {
                game.destroyInstance(this.b);
                game.destroyInstance(this);
                
                for (var i = 0; i < 5; i++) {
                    game.createInstance("obj_wall_fake_particle", this.x, this.y);
                }
                
                //if (SOUNDS) game.playSound("snd_explo");
                return;
            }
        }
        
        ctx.globalAlpha = Math.max(0, this.alpha);
        if (blockImage) ctx.drawImage(blockImage, this.x, this.y);
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_wall_fake_particle", {
    create: function () {
        this.depth = -3;
        this.rate = (4 + Math.random() * 10) / 100;
        this.size = CELL - Math.random() * 5;
        this.alpha = 1;
        this.speed = 2 + Math.random() * 2;
        
        this.x += 4 - Math.random() * 8;
        this.rate /= 1.5;
        
        this.r = 0;
        this.g = 0;
        this.b = 0;
        
        var index = PLAYERCOLOR.indexOf("(");
        var parts = PLAYERCOLOR.slice(index + 1, PLAYERCOLOR.length - 1).split(",");
        
        this.rt = parseInt(parts[0]);
        this.gt = parseInt(parts[1]);
        this.bt = parseInt(parts[2]);
        
        /*
        this.rt = 160;
        this.gt = 40;
        this.bt = 160;
        */
    },
    
    update: function () {
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = "rgb(" + Math.floor(this.r) + ", " + Math.floor(this.g) + ", " + Math.floor(this.b) + ")";;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
        
        if (this.alpha > 0) {
            this.alpha -= this.rate;
        } else {
            game.destroyInstance(this);
        }
        
        var a = Math.min(1 - this.alpha * this.alpha, 1);
        
        this.r = a * this.rt;
        this.g = a * this.gt;
        this.b = a * this.bt;
        
        this.y += this.speed;
    }
});

game.addObject("obj_launcher", {
    create: function () {
        this.depth = 0;
        this.width = CELL * 2;
        this.height = CELL * 2;
        this.angle = 0;
        
        this.r = 0;
        this.rTarget = 0;
        this.firing = false;
        this.rTween = new Tween(0.9, 10);
        
        this.x += CELL;
        this.y += CELL;
        
        this.timeInterval = 200;
        this.timer = this.timeInterval / 2;
    },
    
    update: function () {
        var color1 = "rgb(100, 100, 100)";
        var color2 = "rgb(130, 130, 130)";
        var color3 = "rgb(105, 105, 105)";
        var CELL = 80;
        
        var direction = 0;
        var self = this;
        
        game.withInstances("obj_player", function (other) {
            direction = -Math.atan2(other.y - self.y, other.x - self.x);
        });
        
        var CIRCLE = 2 * Math.PI;
        
        direction = (direction + CIRCLE) % CIRCLE;
        this.angle = (this.angle + CIRCLE) % CIRCLE;
        
        if (Math.abs(direction - this.angle) >= 0.1) {
            if ((direction - this.angle + CIRCLE) % CIRCLE > CIRCLE / 2) {
                this.angle -= Math.abs(direction - this.angle) / 30;
            } else {
                this.angle += Math.abs(direction - this.angle) / 30;
            }
        }
        
        if (this.firing) {
            if (this.r < 6) {
                this.r += 0.1;
            } else {
                this.firing = false;
                var rocket = game.createInstance("obj_rocket", this.x, this.y);
                rocket.angle = this.angle * 180 / Math.PI;
                this.rTween.set(6);
            }
        } else {
            this.r = this.rTween.get();
        }
        
        var s = SHADOWOFFSET;
        
        ctx.save();
        ctx.translate(this.x + s, this.y + s);
        ctx.rotate(-this.angle); 
        ctx.globalAlpha = SHADOWALPHA;

        ctx.fillStyle = "black";
        ctxFillCircle(ctx, 0, 0, CELL / 2.7 + OUTLINE + this.r);
        
        var l = 18 + this.r;
        var o = OUTLINE;
        
        ctx.fillRect(0, -l - o, CELL / 2.3 + o, 2 * (l + o));
        ctx.fillRect(0, -l, CELL / 2.3, 2 * l);
        ctxFillCircle(ctx, 0, 0, CELL / 2.7 + this.r);
        ctxFillCircle(ctx, 0, 0, CELL / 3.7 + this.r * 1.8);
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.fillStyle = "black";
        ctxFillCircle(ctx, 0, 0, CELL / 2.7 + OUTLINE + this.r);
        
        var l = 18 + this.r;
        var o = OUTLINE;

        ctx.fillStyle = "black";
        ctx.fillRect(0, -l - o, CELL / 2.3 + o, 2 * (l + o));

        ctx.fillStyle = color3;
        ctx.fillRect(0, -l, CELL / 2.3, 2 * l);
        
        ctx.fillStyle = color1;
        ctxFillCircle(ctx, 0, 0, CELL / 2.7 + this.r);

        ctx.fillStyle = color2;
        ctxFillCircle(ctx, 0, 0, CELL / 3.7 + this.r * 1.8);
        
        ctx.restore();
        
        /*
        if (game.keyboardPressed("Backspace")) {
            this.firing = true;
        }
        */
        
        if (this.timer > 0) {
            this.timer -= 1;
        } else {
            this.timer = this.timeInterval;
            this.firing = true;
        }
    }
});

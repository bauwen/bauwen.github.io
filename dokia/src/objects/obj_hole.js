game.addObject("obj_hole", {
    create: function () {
        this.depth = 90;
        this.radius = CELL / 2;
        this.width = CELL / 1;
        this.height = CELL / 1;
        this.toggle = false;
        
        this.x += this.radius;
        this.y += this.radius;
    },
    
    update: function () {
        ctx.fillStyle = "rgb(20, 20, 20)";
        fillCircle(this.x, this.y, CELL / 2.2);
        
        /*
        ctx.strokeStyle = "rgb(40, 40, 40)";
        ctx.lineWidth = 2;
        strokeCircle(this.x, this.y, CELL / 2.1);
        */
        
        if (true || this.toggle) {
            game.createInstance("obj_hole_particle", this.x, this.y);
        }
        this.toggle = !this.toggle;
    }
});

game.addObject("obj_hole_particle", {
    create: function () {
        this.depth = 91;
        this.alpha = 1;
        this.size = CELL / 2.2 + Math.random() * 5;
        this.direction = Math.random() * 2 * Math.PI;
        this.speed = 0.2 + Math.random() * 0.5;
    },
    
    update: function () {
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = "rgb(20, 20, 20)";
        fillCircle(this.x, this.y, this.size);
        
        this.x += Math.cos(this.direction) * this.speed;
        this.y -= Math.sin(this.direction) * this.speed;
        
        if (this.alpha > 0) {
            this.alpha -= 0.05;
        } else {
            game.destroyInstance(this);
        }
        
        ctx.globalAlpha = 1;
    }
});
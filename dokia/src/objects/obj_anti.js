game.addObject("obj_anti", {
    create: function () {
        this.depth = 200;
        this.width = CELL * 6;
        this.height = CELL * 6;
        
        this.state = 0;
        this.alpha = 0;
    },
    
    update: function () {
        var s = 3;
        
        ctx.fillStyle = "white";
        ctx.globalAlpha = 0.3;
        ctx.fillRect(this.x + s, this.y + s, this.width - 2 * s, this.height - 2 * s);
        ctx.globalAlpha = 1;
        
        ctx.drawImage(IMAGES["img_anti"], this.x, this.y);
        
        ctx.globalAlpha = Math.max(0, Math.min(this.alpha, 1));
        ctx.drawImage(IMAGES["img_anti_dark"], this.x, this.y);
        ctx.globalAlpha = 1;
        
        if (this.state === 0) {
            if (this.alpha < 0.3) {
                this.alpha += 0.002;
            } else {
                this.state = 1;
            }
        } else {
            if (this.alpha > 0) {
                this.alpha -= 0.001;
            } else {
                this.state = 0;
            }
        }
    }
});
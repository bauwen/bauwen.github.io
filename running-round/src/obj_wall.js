createObject("obj_wall", {
    
    init: function () {
        this.width = 16;
        this.height = 16;
    },
    
    loop: function () {
        ctx.fillStyle = COLOR_WALL;
        drawTransformedRectangle(this.x, this.y, this.width, this.height);
    }
    
});

createObject("obj_spike", {
    
    init: function () {
        this.width = 16;
        this.height = 16;
        this.hard = false;
    },
    
    loop: function () {
        if (spikeState === 0) return;
        if (spikeState === 1 && this.hard) return;
        
        ctx.fillStyle = COLOR_SPIKE;
        drawTransformedSpike(this.x, this.y, this.width, this.height);
    }
    
});

createObject("obj_particle", {
    
    init: function () {
        this.radius = 60;//30;
        this.alpha = 1;
        this.speed = 5;//3 + Math.floor(Math.random() * 2);
        this.color = "rgb(230, 170, 170)";
    },
    
    loop: function () {
        this.y -= this.speed;
        this.alpha -= 0//0.01;
        if (this.alpha <= 0 || this.y < -60) {
            destroyInstance(this);
        }
        
        ctx.globalAlpha = 1//Math.max(0, this.alpha * backgroundFade / 5);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
});

createObject("obj_splash", {
    
    init: function () {
        this.radius = 8// + Math.floor(Math.random() * 52);
        this.alpha = 0.8;
        this.speed = 3 + Math.floor(Math.random() * 14);
        this.color = COLOR_PLAYER;
        this.direction = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.turn = Math.random() < 0.5 ? 1 : -1;
        this.timer = 60;
    },
    
    loop: function () {
        this.x += Math.cos(this.direction) * this.speed;
        this.y -= Math.sin(this.direction) * this.speed;
        this.radius += this.speed / 12;
        if (this.timer > 0) {
            this.timer -= 1;
        }
        if (this.timer <= 0) {
            this.alpha -= 0.04;
        }
        if (this.alpha <= 0) {
            destroyInstance(this);
        }
        this.speed -= 0.5;
        this.speed = Math.max(0, this.speed);
        
        this.rotation += this.turn * this.speed / 30 / 5;
        
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        /*ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();*/
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.radius, -this.radius, 2*this.radius, 2*this.radius);
        /*ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fill();*/
        ctx.restore();
        
        ctx.globalAlpha = 1;
    }
    
});

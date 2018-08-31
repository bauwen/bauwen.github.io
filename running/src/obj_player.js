var gravity = 0.5;

createObject("obj_player", {
    
    init: function () {
        this.width = 8;
        this.height = 24;
        this.vspeed = 0;
        this.flag = true;
        this.dr = 0;
    },
    
    loop: function () {
        ctx.fillStyle = COLOR_PLAYER;
        //ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        //ctx.fillRect(this.x - 8, this.y - 8, 16, 16);
        if (this.y < canvas.height-100) {
            var dd = -1 + this.dr * 2;
            dd = -dd/2;
            //dd /= 2;
            drawTransformedRectangle(this.x - this.width/2 + dd/2, this.y - this.height/2 + dd, this.width - dd/2*2, this.height - dd, true);
        }
        
        if (this.flag) {
            if (this.dr < 1) {
                this.dr += 0.04;
            } else {
                this.flag = false;
            }
        } else {
            if (this.dr > 0) {
                this.dr -= 0.04;
            } else {
                this.flag = true;
            }
        }
        this.dr = Math.max(0, Math.min(this.dr, 1));
        
        var side = 16//24;
        //var p = transformRectangle(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        //ctx.fillRect(this.x - side/2, p.y4 - side, side, side);
        
        if (keysDown[" "] || keysDown["ArrowUp"] || buttonsDown[0]) {
            if (this.vspeed < 0) {
                this.vspeed -= 0.25;
            }
            if (this.vspeed >= 0 && collidesWall(this, this.x, this.y + this.vspeed + 1)) {
                this.vspeed = -6;
                playSound("snd_jump");
                this.dr = 1;
                this.flag = false;
            }
        }
        
        var wall = collidesWall(this, this.x, this.y + this.vspeed);
        if (wall !== null) {
            if (this.vspeed >= 0) {
                this.y = wall.y - this.height/2;
            } else {
                this.y = wall.y + wall.height + this.height/2;
            }
            this.vspeed = 0;
        }
        
        this.y += this.vspeed;
        this.vspeed += gravity;
        
        if (this.y > canvas.height + 64 || collidesWall(this, this.x + 1, this.y - this.vspeed)) {
            gameOver(this);
            this.y = 0;
            this.vspeed = 0;
        }
        
        var spk = collidesSpike(this, this.x, this.y);
        if (spk !== null && (spikeState === 2 || spikeState === 1 && !spk.hard)) {
            gameOver(this);
            this.y = 0;
            this.vspeed = 0;
        }
    }
    
});

function gameOver(player) {
    playSound("snd_die");
    
    stopMusic();
    
    running = false;
    flashFade = 2;
    
    var p = transformRectangle(player.x - player.width/2, player.y - player.height/2, player.width, player.height, true);
    var xx = (p.x1 + p.x2) / 2;
    var yy = (p.y1 + p.y3) / 2;
    
    destroyInstance(player);
    
    for (var i = 0; i < 30; i++) {
        createInstance("obj_splash", xx, yy, -1000);
    }
    
    died = true;
    shaking = true;
    setTimeout(function () { shaking = false; }, 500);
    setTimeout(leaveGame, 2000);
}

function collidesWall(instance, x, y) {
    var collides = null;
    var w = instance.width;
    var h = instance.height;
    x -= w/2;
    y -= h/2;
    
    forInstances("obj_wall", function (wall) {
        if (wall.x <= x + w && x < wall.x + wall.width && wall.y <= y + h && y < wall.y + wall.height) {
            collides = wall;
        }
    }, instance);
    
    return collides;
}

function collidesSpike(instance, x, y) {
    var collides = null;
    var w = instance.width;
    var h = instance.height;
    x -= w/2;
    y -= h/2;
    
    var dx = 4;
    var dy = 2;
    
    forInstances("obj_spike", function (spike) {
        if (spike.x + dx <= x + w && x < spike.x + spike.width - dx && spike.y + dy <= y + h && y < spike.y + spike.height - dy) {
            collides = spike;
        }
    }, instance);
    
    return collides;
}

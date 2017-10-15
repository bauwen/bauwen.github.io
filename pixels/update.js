var game_event = null;

var movement = { 
    walkThrough: function (obj, speed, direction, through, callback) {
        
        if (speed == 0) {
            return;
        }
        
        var cell = 16;
        var cx = Math.floor(obj.x / cell) * cell;
        var cy = Math.floor(obj.y / cell) * cell;
        
        if (obj.x != cx || obj.y != cy) {
            return;
        }
        
        direction %= 360;
        obj.rotation = direction;
        
        var hspeed = -((direction - 90) % 180) / 90 * speed;
        var vspeed = ((direction - 180) % 180) / 90 * speed;
        var x = obj.x + Math.sign(hspeed) * cell;
        var y = obj.y + Math.sign(vspeed) * cell;
        
        var prevx = cx;
        var prevy = cy;
        
        /*
        if (!through && collision.check(x, y)) {
            if (callback) {
                callback();
            }
            return;
        }
        */
        
        game_event = function () {
            obj.index = (obj.index + Math.abs(speed) / (cell / 2) + 0.001) % 4;
            obj.x += hspeed;
            obj.y += vspeed;
            
            if (obj.x == x && obj.y == y) {
                obj.index = Math.floor(obj.index / 2) * 2;
                
                if (callback) {
                    callback();
                }
                
                //collision.free(prevx, prevy);
                return true;
            }
            
            return false;
        };
    },
    
    walk: function (obj, speed, direction, callback) {
        movement.walkThrough(obj, speed, direction, false, callback);
    }
};

var trail = [];
for (var i = 0; i < 64; i++) {
    trail.push(undefined, undefined);
}
var gameobjects = {};

gameobjects["obj_player"] = {
    oncreate: function () {
        this.x = 16 * 5;
        this.y = 16 * 5;
        this.depth = -1;
        this.sprite = [1, 2, 1, 3];
        this.speed = 0;
        this.startup = 0;
        this.walking = false;
        this.index = 0;
        this.rotation = 0;
    },
    
    onupdate: function () {
        //draw.object(this, 2);
        //console.log(this.rotation);
        drawSprite(this.sprite[Math.floor(this.index)], this.x, this.y, this.rotation / 90);
        
        var cell = 16;
        var cx = Math.floor(this.x / cell) * cell;
        var cy = Math.floor(this.y / cell) * cell;
        
        for (var i = 0; i < trail.length - 2; i += 2) {
            trail[i + 0] = trail[i + 2];
            trail[i + 1] = trail[i + 3];
        }
        
        trail[trail.length - 2] = this.x + 8;
        trail[trail.length - 1] = this.y + 8;
        
        if (this.x != cx || this.y != cy) {
            return;
        }
        
        var moved = false;
        var prevdir = this.rotation;
        
        if (keyboard[RIGHT]) {
            this.rotation = 0;
            moved = true;
        }
        else if (keyboard[LEFT]) {
            this.rotation = 180;
            moved = true;
        }
        else if (keyboard[UP]) {
            this.rotation = 90;
            moved = true;
        }
        else if (keyboard[DOWN]) {
            this.rotation = 270;
            moved = true;
        }
         
        if (moved) {
            this.speed = keyboard[SPACE] ? 2 : 1;
            
            if (this.rotation == prevdir && this.startup == 3) {
                this.startup = 0;
            }
        } else {
            this.startup = 4;
        }
        
        if (this.startup > 0) {
            this.startup -= 1;
        } else {
            movement.walk(this, this.speed, this.rotation);
        }
    }
};

gameobjects["obj_player"].oncreate();

function update() {
    
    if (game_event) {
        ended = game_event();
        if (ended) {
            game_event = null;
        }
    }
    
    /*
    x += (keyboard[RIGHT] - keyboard[LEFT]) * 3;
    y += (keyboard[DOWN] - keyboard[UP]) * 3;
    */
    
    //for (var i = 0; i < 1; i++) circleFill(x, y, (x + y) / 10);
    
    for (var k = 0; k < 2; k++) {
    
    for (var i = 0; i < 192/16; i++) {
        for (var j = 0; j < 160/16; j++) {
            drawSprite(5, i * 16, j * 16);
        }
    }
    
    }
    
    var s = Math.floor(x + y) / 10;
    
    if (keyboard[SPACE]) {
        setcolor(200, 200, 200);
        rectfill(0, 0, 192, 160);
    }
    
    if (!keyboard[ENTER]) {
        setcolor(0, 255, 55);
    } else {
        setcolor(255, 0, 0);
    }
    
    rectfill(10, 20, 20, 100);
    rectfill(180, 140, 30, 30);
    
    
    for (var i = 0; i < trail.length; i += 2) {
        var tx = trail[i + 0];
        var ty = trail[i + 1];
        
        if (tx !== undefined) {
            drawPixel(tx, ty, [Math.floor(255 - i * 1.5), Math.floor(i * 1.5), 255, 255]);
        }
    }
    
    
    // trees
    drawSprite(4, 16 * 2, 16 * 2);
    drawSprite(4, 16 * 2, 16 * 4);
    drawSprite(4, 16 * 8, 16 * 8);
    drawSprite(4, 16 * 9, 16 * 6);
    
    //for (var i = 0; i < 1; i++) circleFill(x, y, s); //rectfill(x, y, s, s);
    
    gameobjects["obj_player"].onupdate();
    
    drawSprite(7, 16 * 9, 16 * 1);
}

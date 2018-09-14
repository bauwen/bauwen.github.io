var canvas = document.getElementById("display");
var canvasCtx = canvas.getContext("2d");
var game = new Game(canvas, true);
var ctx = game.ctx;

canvas.addEventListener("click", function () {
    canvas.focus();
});
canvas.focus();

var MUSIC = true;
var SOUNDS = true;

var WORLDS = {};
var VIEW = game.createView(canvas.width, canvas.height);

var RATIO = canvas.width / canvas.height;
var OUTLINE = 2;
var SHADOWOFFSET = 8;
var SHADOWALPHA = 0.1;
var CELL = 40;
var PLAYERCOLOR = "rgb(220, 220, 20)";

var worldnumber = 1;
var levelnumber = 1;
var highworldnumber = 1;
var highlevelnumber = 1;
var spikeSwitch = false;

var counterGravity = 0;
var counterJump = 0;
var counterDie = 0;

var completed = false;
var quake = false;
var quakeTimer = 0;
var zoomX = 0;
var zoomY = 0;
var fixedX = 0;
var fixedY = 0;

var backgroundPatternSize = 96;
var backgroundImage = null;
var blockImage = null;

var PLAYER = null;

var backgradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgradient.addColorStop(0, "white");
backgradient.addColorStop(0.2, "white");
backgradient.addColorStop(1, "black");

game.addObject("obj_background", {
    create: function () {
        this.depth = 1001;
    },
    
    update: function () {
        ctx.fillStyle = "black";//"rgb(20, 200, 200)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        if (backgroundImage) {
            /*
            var fx = clamp(0, ctx.canvas.width, VIEW.x - 16);
            var fy = clamp(0, ctx.canvas.height, VIEW.y - 16);
            var fw = clamp(0, ctx.canvas.width - VIEW.x + 16, VIEW.width + 32);
            var fh = clamp(0, ctx.canvas.height - VIEW.y + 16, VIEW.height + 32);
            
            var deltaX = fx % backgroundPatternSize + backgroundPatternSize;
            var deltaY = fy % backgroundPatternSize + backgroundPatternSize;
            
            ctx.drawImage(backgroundImage, deltaX, deltaY, VIEW.width, VIEW.height, fx, fy, fw, fh);
            */
            
            var fx = VIEW.x - 16;
            var fy = VIEW.y - 16;
            var fw = VIEW.width + 32;
            var fh = VIEW.height + 32;
            
            var deltaX = VIEW.x % backgroundPatternSize + backgroundPatternSize;
            var deltaY = VIEW.y % backgroundPatternSize + backgroundPatternSize;
            
            ctx.drawImage(backgroundImage, deltaX, deltaY, fw, fh, fx, fy, fw, fh);
        }
        
        /*ctx.globalAlpha = 0.05;
        ctx.fillStyle = backgradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 1;*/
        
        if (worldnumber === 1) {
            ctx.font = "bold 48px gamefont, sans-serif";
            ctx.textAlign = "center";
            ctx.lineWidth = 1;
                
            if (levelnumber === 1) {
                ctx.fillStyle = "rgb(220, 220, 20)"; 
                ctx.fillText("Move with the", 650, 250);
                ctx.fillText("ARROW KEYS", 650, 310);
                
                ctx.fillText("UP to", 1200, 250 + 32);
                ctx.fillText("JUMP", 1200, 310 + 32);
                
                ctx.fillText("Reach", 1850, 250);
                ctx.fillText("the hole!", 1850, 310);
                
                ctx.strokeStyle = "black"; 
                ctx.strokeText("Move with the", 650, 250);
                ctx.strokeText("ARROW KEYS", 650, 310);
                
                ctx.strokeText("UP to", 1200, 250 + 32);
                ctx.strokeText("JUMP", 1200, 310 + 32);
                
                ctx.strokeText("Reach", 1850, 250);
                ctx.strokeText("the hole!", 1850, 310);
            }
            
            if (levelnumber === 2) {
                ctx.fillStyle = "rgb(220, 220, 20)"; 
                ctx.fillText("Avoid the", 650, 300);
                ctx.fillText("SPIKES", 650, 360);
                
                ctx.strokeStyle = "black"; 
                ctx.strokeText("Avoid the", 650, 300);
                ctx.strokeText("SPIKES", 650, 360);
            }
            
            if (levelnumber === 3) {
                ctx.fillStyle = "rgb(220, 220, 20)"; 
                ctx.fillText("Press the", 1100, 1100);
                ctx.fillText("spacebar!", 1100, 1160);
                
                ctx.strokeStyle = "black"; 
                ctx.strokeText("Press the", 1100, 1100);
                ctx.strokeText("spacebar!", 1100, 1160);
            }
            
            if (levelnumber === 5) {
                ctx.fillStyle = "rgb(220, 220, 20)"; 
                ctx.fillText("Good job!", 1940, 420);
                
                ctx.strokeStyle = "black"; 
                ctx.strokeText("Good job!", 1940, 420);
            }
            
            if (levelnumber === 8) {
                ctx.fillStyle = "rgb(220, 220, 20)"; 
                ctx.fillText("ON, OFF, ON, OFF...", 550, 50);
                ctx.fillText("YOU CAN FLY!", 550, 110);
                
                ctx.strokeStyle = "black"; 
                ctx.strokeText("ON, OFF, ON, OFF...", 550, 50);
                ctx.strokeText("YOU CAN FLY!", 550, 110);
            }
        }
        
        /*
        // DEBUG
        if (game.keyboardPressed("z")) {
            levelnumber += 1;
            game.enterScene("scn_world");
        }
        
        if (game.keyboardPressed("a")) {
            levelnumber -= 1;
            game.enterScene("scn_world");
        }
        //*/
        
        if (game.keyboardPressed("o")) {
            if (worldnumber > 1 || levelnumber > 1) {
                levelnumber -= 1;
                game.enterScene("scn_world");
            }
        }
        if (game.keyboardPressed("p")) {
            if (worldnumber < highworldnumber || levelnumber < highlevelnumber) {
                levelnumber += 1;
                game.enterScene("scn_world");
            }
        }
        
        if (game.keyboardPressed("m")) {
            toggleMusic();
        }
        if (game.keyboardPressed("s")) {
            toggleSound();
        }
    }
});

game.addObject("obj_foreground", {
    create: function () {
        this.depth = -10000;
        this.fade = 1;
    },
    
    update: function () {
        if (!completed) {
            var x = VIEW.x - 10;
            var y = VIEW.y - 10;
            var w = 160;
            var h = 70;
            var r = 20;
            
            ctx.fillStyle = "black";
            ctx.fillRect(x, y, w, h);
            ctx.beginPath();
            ctx.arc(x + w - r / 2, y + h - r / 2, r, 0, Math.PI * 2);
            ctx.fill();
            //fillTriangle(x + w + r / 2, y + h - r / 2, x + w - r / 2, y + h + r / 2, x + w - r / 2, y + h - r / 2);
            ctx.fillRect(x, y + h - 1, w - r / 2, r / 2 + 1);
            ctx.fillRect(x + w - 1, y, r / 2 + 1, h - r / 2);
            
            ctx.fillStyle = "white";
            ctx.font = "bold 42px gamefont, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(worldnumber + " - " + levelnumber, x + w / 2 + 10, y + 60);
            
            w = 100;
            x = VIEW.x + VIEW.width - w + 10;
            
            ctx.fillStyle = "black";
            ctx.fillRect(x, y, w, h);
            ctx.beginPath();
            ctx.arc(x + r / 2, y + h - r / 2, r, 0, Math.PI * 2);
            ctx.fill();
            //fillTriangle(x + w + r / 2, y + h - r / 2, x + w - r / 2, y + h + r / 2, x + w - r / 2, y + h - r / 2);
            ctx.fillRect(x + r / 2, y + h - 1, w - r / 2, r / 2 + 1);
            ctx.fillRect(x - r / 2, y, r / 2 + 1, h - r / 2);
            
            ctx.fillStyle = "white";
            x -= 14;
            
            if (mouseInBox(x - VIEW.x - r / 2, y - VIEW.y, w, h + r / 2)) {
                ctx.fillRect(x + 24, y + 24, 16, 16);
                ctx.fillRect(x + 24 + 24, y + 24, 16, 16);
                ctx.fillRect(x + 24, y + 24 + 24, 16, 16);
                ctx.fillRect(x + 24 + 24, y + 24 + 24, 16, 16);
                ctx.fillRect(x + 24 + 24 + 24, y + 24, 16, 16);
                ctx.fillRect(x + 24 + 24 + 24, y + 24 + 24, 16, 16);
                
                if (game.mousePressed("Left")) {
                    game.enterScene("scn_levelmenu");
                }
            } else {
                x += 8;
                y += 8;
                fillCircle(x + 24, y + 24, 8);
                fillCircle(x + 24 + 24, y + 24, 8);
                fillCircle(x + 24, y + 24 + 24, 8);
                fillCircle(x + 24 + 24, y + 24 + 24, 8);
                fillCircle(x + 24 + 24 + 24, y + 24, 8);
                fillCircle(x + 24 + 24 + 24, y + 24 + 24, 8);
            }
        }
        
        if (completed) {
            if (this.fade < 0.1) {
                this.fade += 0.0025;
            }
            else if (this.fade < 1) {
                this.fade += 0.04;
            }
            else {
                if (worldnumber === 4 && levelnumber === 10) {
                    game.enterScene("scn_end");
                } else {
                    levelnumber += 1;
                    game.enterScene("scn_world");
                }
                completed = false;
            }
        } else {
            if (this.fade > 0) {
                this.fade -= 0.05;
            }
        }
        
        ctx.globalAlpha = Math.max(0, this.fade);
        ctx.fillStyle = "rgb(230, 230, 230)";
        ctx.fillRect(VIEW.x, VIEW.y, VIEW.width, VIEW.height);
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_firework", {
    create: function () {
        this.depth = -101;
        
        var colors = [ "red", "lime", "cyan", "yellow", "purple", "orange", "blue" ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.slowdown = 0.8;
        this.alpha = 1;
        this.speed = 8 + Math.floor(Math.random() * 8);
        this.distance = 0;
        this.count = 8 + Math.floor(Math.random() * 8);
        this.size = 3 + Math.floor(Math.random() * 2);
    },
    
    update: function () {
        this.speed -= this.slowdown;
        this.speed = Math.max(0, this.speed);
        this.distance += this.speed;
        
        if (this.speed < 1) {
            this.alpha -= 0.01;
            this.y += 0.2;
        }
        
        if (this.alpha <= 0) {
            game.destroyInstance(this);
        }
        
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        
        for (var i = 0; i < this.count; i++) {
            var x = this.x + Math.cos(Math.PI * 2 / this.count * i) * this.distance;
            var y = this.y - Math.sin(Math.PI * 2 / this.count * i) * this.distance;
            
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
});

game.addObject("obj_end", {
    create: function () {
        this.depth = -100;
        this.fade = 1.3;
        this.alpha = -2.9;
        
        this.up = true;
        this.state = 0;
        this.texts = [
            "Thanks for playing!",
            "You died " + counterDie + " times",
            "You switched gravity " + counterGravity + " times",
            "You jumped " + counterJump + " times"
        ];
        this.sizes = [ 64, 64, 48, 54 ];
        this.text = this.texts[this.state];
        this.size = this.sizes[this.state];
    },
    
    update: function () {
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.font = "bold 228px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("DOKIA", ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
        
        if (this.up) {
            if (this.alpha < 2) {
                this.alpha += 0.01;
            } else {
                this.up = false;
            }
        } else {
            if (this.alpha > 0) {
                this.alpha -= 0.02;
            } else {
                this.state = (this.state + 1) % this.texts.length;
                this.text = this.texts[this.state];
                this.size = this.sizes[this.state];
                this.up = true;
            }
        }
        
        ctx.globalAlpha = Math.max(0, Math.min(this.alpha, 1));
        ctx.font = "bold " + this.size + "px gamefont, sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, ctx.canvas.width / 2, ctx.canvas.height / 2 + 150);
        ctx.textAlign = "left";
        ctx.globalAlpha = 1;
        
        if (this.fade > 0) {
            this.fade -= 0.005;
        }
        
        ctx.globalAlpha = Math.max(0, Math.min(this.fade, 1));
        ctx.fillStyle = "rgb(230, 230, 230)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 1;
        
        if (this.alpha > 0.9) {
            if (Math.random() < 0.05) {
                var fx = Math.floor(Math.random() * game.scene.width);
                var fy = Math.floor(Math.random() * game.scene.height);
                game.createInstance("obj_firework", fx, fy);
            }
        }
        
        if (game.keyboardPressed("o")) {
            stopAllMusic();
            startCurrentMusic();
            game.enterScene("scn_world");
        }
        
        if (game.keyboardPressed("m")) {
            toggleMusic();
        }
        if (game.keyboardPressed("s")) {
            toggleSound();
        }
    }
});

game.addScene("scn_end", {
    enter: function () {
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        //console.log(w, h);
        game.scene.width = w;
        game.scene.height = h;
        game.ctx.canvas.width = w;
        game.ctx.canvas.height = h;
        
        //game.createInstance("obj_foreground");
        game.createInstance("obj_end");
        stopAllMusic();
        if (MUSIC) game.playMusic("mus_end", false);
        
        completed = false;
        quake = false;
        quakeTimer = 0;
        zoomX = 0;
        zoomY = 0;
        spikeSwitch = false;
        VIEW.x = 0;
        VIEW.y = 0;
        
        saveCounters();
        
        kongApi.submitStat("Completion", 1);
        setLocalStorage("completed", 1);
    }
});

game.addScene("scn_world", {
    enter: function () {
        PLAYER = null;
        VIEW.x = 0;
        VIEW.y = 0;
        
        if (levelnumber < 1) {
            levelnumber = 10;
            worldnumber -= 1;
            stopAllMusic();
            if (MUSIC) startCurrentMusic();
        }
        
        if (levelnumber > 10) {
            levelnumber = 1;
            worldnumber += 1;
            stopAllMusic();
            if (MUSIC) startCurrentMusic();
        }
        
        if (worldnumber > highworldnumber) {
            highworldnumber = worldnumber;
            setLocalStorage("world", highworldnumber);
            highlevelnumber = 1;
            setLocalStorage("level", highlevelnumber);
        } else if (worldnumber === highworldnumber && levelnumber > highlevelnumber) {
            highlevelnumber = levelnumber;
            setLocalStorage("level", highlevelnumber);
        }
                
        var BACKGROUND = BACKGROUNDS[worldnumber - 1];
        backgroundImage = BACKGROUND.image;
        backgroundPatternSize = BACKGROUND.patternSize;
        blockImage = BLOCKS[worldnumber - 1];
        
        switch (worldnumber) {
            case 1:
                PLAYERCOLOR = blockPattern1.background;
                break;
            case 2:
                PLAYERCOLOR = blockPattern2.background;
                break;
            case 3:
                PLAYERCOLOR = blockPattern3.background;
                break;
            case 4:
                PLAYERCOLOR = blockPattern4.background;
                break;
        }
        
        game.createInstance("obj_background");
        game.createInstance("obj_foreground");
        loadWorld(WORLDS["world_" + worldnumber + "_" + levelnumber]);
        
        completed = false;
        quake = false;
        quakeTimer = 0;
        zoomX = 0;
        zoomY = 0;
        spikeSwitch = false;
        
        if (SOUNDS) game.playSound("snd_level");
        saveCounters();
        
        //game.createInstance("obj_spike", CELL * 5, CELL * 8);
    }
});

var kongApi;
var banner;

window.addEventListener("load", function () {
    if (!checkCorrectSite()) {
        console.log("invalid domain");
        return;
    }
    
    APILoader(function (api) {
        kongApi = api;
        
        banner = new Image();
        banner.src = "src/banner.png";
        banner.onload = function () {
            window.setTimeout(startLoading, 2);
        };
    });
});

function startLoading() {
    var wp = 600;
    var hp = 40;
    var xp = canvas.width/2 - wp/2;
    var yp = canvas.height/2 - hp/2;
    var mp = 4;
    
    game.loadAssets({
        fonts: {
            timeout: 1000,
            "gamefont": "src/teen_bd.ttf",
        },
        
        sounds: {
            "snd_level": "src/sounds/snd_level.wav",
            "snd_jump": "src/sounds/snd_jump.wav",
            "snd_gravity": "src/sounds/snd_gravity.wav",
            "snd_die": "src/sounds/snd_die.wav",
            "snd_explo": "src/sounds/snd_explo.wav",
            "snd_finish": "src/sounds/snd_finish.wav",
            "snd_switch": "src/sounds/snd_switch.wav",
            "snd_anti": "src/sounds/snd_anti.wav",
        },
        
        music: {
            "mus_world1": "src/music/mus_world1.mp3",
            "mus_world2": "src/music/mus_world2.mp3",
            "mus_world3": "src/music/mus_world3.mp3",
            "mus_world4": "src/music/mus_world4.mp3",
            "mus_end": "src/music/mus_end.mp3"
        }
    }, {
        progress: function (p) {
            //console.log(p);
            canvasCtx.fillStyle = "rgb(20, 20, 20)";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            canvasCtx.lineWidth = 4;
            canvasCtx.strokeStyle = "rgb(200, 200, 200)";
            canvasCtx.strokeRect(xp, yp, wp, hp);
            canvasCtx.fillStyle = "rgb(200, 200, 200)";
            canvasCtx.fillRect(xp + mp, yp + mp, (wp - mp*2) * p, hp - mp*2);
            
            var resource = "font";
            if (p > 0) resource = "sounds";
            if (p > 0.6) resource = "music";
            
            canvasCtx.font = "36px gamefont, sans-serif";
            canvasCtx.textAlign = "left";
            canvasCtx.fillText("Please wait...", xp, yp - hp + 15);
            canvasCtx.textAlign = "right";
            canvasCtx.fillText("...loading " + resource, xp + wp, yp + hp + 45);
            canvasCtx.textAlign = "left";
        },
        
        finish: function () {
            var bw = banner.naturalWidth;
            var bh = banner.naturalHeight;
            
            canvasCtx.fillStyle = "rgb(20, 20, 20)";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            canvasCtx.drawImage(banner, (canvas.width - bw) / 2, (canvas.height - bh) / 2);
            
            setTimeout(loadTheGame, 3000);
        }
    });
}

function loadTheGame() {
    var mus = getLocalStorage("music");
    if (mus === "off") {
        MUSIC = false;
    }
    var snd = getLocalStorage("sound");
    if (snd === "off") {
        SOUNDS = false;
    }
    
    var hw = getLocalStorage("world");
    if (hw) {
        highworldnumber = parseInt(hw);
        worldnumber = highworldnumber;
    }
    
    var hl = getLocalStorage("level");
    if (hl) {
        highlevelnumber = parseInt(hl);
        levelnumber = highlevelnumber;
    }
    
    var cgrav = getLocalStorage("cgrav");
    if (cgrav) {
        counterGravity = parseInt(cgrav);
    }
    var cjump = getLocalStorage("cjump");
    if (cjump) {
        counterJump = parseInt(cjump);
    }
    var cdie = getLocalStorage("cdie");
    if (cdie) {
        counterDie = parseInt(cdie);
    }
    
    var compl = getLocalStorage("completed");
    if (compl && highlevelnumber === 10 && highworldnumber === 4) {
        kongApi.submitStat("Completion", 1);
    } else {
        kongApi.submitStat("Completion", 0);
    }
    kongApi.submitStat("Progress", (levelnumber - 1) + (worldnumber - 1) * 10);
    
    createPatterns();
    createImages();
    if (MUSIC) startCurrentMusic();
    
    game.run();
    game.enterScene("scn_world");
}

function toggleMusic() {
    MUSIC = !MUSIC;
    setLocalStorage("music", MUSIC ? "on" : "off");
    
    stopAllMusic();
    if (MUSIC) {
        startCurrentMusic();
    }
}

function toggleSound() {
    SOUNDS = !SOUNDS;
    setLocalStorage("sound", SOUNDS ? "on" : "off");
}

function stopAllMusic() {
    game.pauseMusic("mus_world1");
    game.pauseMusic("mus_world2");
    game.pauseMusic("mus_world3");
    game.pauseMusic("mus_world4");
    game.pauseMusic("mus_end");
}

function startCurrentMusic() {
    if (!MUSIC || worldnumber <= 0) return;
    var name = "mus_world" + worldnumber;
    
    //try {
        game.playMusic(name, true);
        //startedPlaying = true;
    //} catch (err) {
        // nothing
    //}
}

function saveCounters() {
    setLocalStorage("cgrav", counterGravity);
    setLocalStorage("cjump", counterJump);
    setLocalStorage("cdie", counterDie);
}

var startedPlaying = false;



// addition

game.addScene("scn_levelmenu", {
    enter: function () {
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        //console.log(w, h);
        game.scene.width = w;
        game.scene.height = h;
        game.ctx.canvas.width = w;
        game.ctx.canvas.height = h;
        
        //game.createInstance("obj_foreground");
        game.createInstance("obj_levelmenu");
        stopAllMusic();
        //if (MUSIC) game.playMusic("mus_end", false);
        
        completed = false;
        quake = false;
        quakeTimer = 0;
        zoomX = 0;
        zoomY = 0;
        spikeSwitch = false;
        VIEW.x = 0;
        VIEW.y = 0;
    }
});

game.addObject("obj_levelmenu", {
    create: function () {
        this.depth = -100;
    },
    
    update: function () {
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = "white";
        ctx.font = "48px gamefont, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("LEVEL SELECTION", 50, 70);
        
        ctx.font = "30px gamefont, sans-serif";
        
        for (var i = 0; i < 4; i++) {
            var x = 50;
            var y = 160 + i * 107;
            ctx.fillStyle = "white";
            ctx.fillText("WORLD " + (i + 1), x, y);
            ctx.textAlign = "center";
            
            for (var j = 0; j < 10; j++) {
                drawLevelButton(x + 160 + j * 70, y - 39, i + 1, j + 1);
            }
            
            ctx.textAlign = "left";
        }
    }
});

function drawLevelButton(x, y, world, level) {
    var unlocked = false;
    if (highworldnumber > world) {
        unlocked = true;
    } else if (highworldnumber === world && highlevelnumber >= level) {
        unlocked = true;
    }
    
    var color1 = unlocked ? "white" : "rgb(60, 60, 60)";
    var color2 = "black";
    ctx.lineWidth = 2;
    
    var s = 55;
    
    if (unlocked && mouseInBox(x, y, s, s)) {
        color1 = "black";
        color2 = "white";
        
        if (game.mousePressed("Left")) {
            cmgStartLevel(level + (world - 1) * 10);
            worldnumber = world;
            levelnumber = level;
            if (MUSIC) startCurrentMusic();
            game.enterScene("scn_world");
        }
    }
    
    if (true || unlocked) {
        ctx.fillStyle = color1;
        ctx.fillRect(x + 3, y + 3, s, s);
    }

    ctx.strokeStyle = color1;
    ctx.strokeRect(x, y, s, s);
    
    ctx.fillStyle = unlocked ? color2 : "rgb(30, 30, 30)";
    ctx.fillRect(x, y, s, s);
    
    ctx.fillStyle = color1;
    ctx.fillText(level, x + s / 2, y + 38);
}



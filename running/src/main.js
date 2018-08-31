var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("click", function () {
    canvas.focus();
});
canvas.focus();

function init() {
    if (!checkCorrectSite()) {
        return;
    }
    
    banner = new Image();
    banner.src = "src/banner.png";
    banner.onload = function () {
        window.setTimeout(initLoading, 2);
    };
}

function initLoading() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    var wp = 200;
    var hp = 20;
    var xp = canvas.width/2 - wp/2;
    var yp = canvas.height/2 - hp/2;
    var mp = 3;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgb(200, 200, 200)";
    ctx.strokeRect(xp, yp + 220, wp, hp);
    ctx.fillStyle = "rgb(200, 200, 200)";
    
    loadAssets({
        music: {
            "mus_menu": "src/mus_menu.mp3",
            "mus_lvl1": "src/mus_level1.mp3",
            "mus_lvl2": "src/mus_level2.mp3",
            "mus_lvl3": "src/mus_level3.mp3",
        },
        
        sounds: {
            "snd_jump": "src/snd_jump.wav",
            "snd_die": "src/snd_die.wav",
            "snd_complete": "src/snd_complete.wav",
        },
        
        fonts: {
            "gamefont": "src/font.ttf",
        }
    }, {
        progress: function (p) {
            //console.log(p);
            ctx.fillRect(xp + mp, yp + mp + 220, (wp - mp*2) * p, hp - mp*2);
            
            var bw = banner.naturalWidth;
            var bh = banner.naturalHeight;
            
            var h = 420;//Math.max(330, window.innerHeight - 100);
            var w = bw * h / bh;
            
            ctx.drawImage(banner, (canvas.width - w) / 2, (canvas.height - h) / 2 - 30 - 0, w, h);
        },
        
        finish: function () {
            var mus = getLocalStorage("music");
            if (mus === "off") {
                MUSIC = false;
            }
            var snd = getLocalStorage("sound");
            if (snd === "off") {
                SOUND = false;
            }
            
            var h1 = getLocalStorage("highscore1");
            var h2 = getLocalStorage("highscore2");
            var h3 = getLocalStorage("highscore3");
            if (h1) {
                highscore1 = h1;
            }
            if (h2) {
                highscore2 = h2;
            }
            if (h3) {
                highscore3 = h3;
            }
            
            //gameMusic["mus_lvl1"].play();
            gameMusic["mus_menu"].volume = 0.6;
            gameMusic["mus_lvl1"].volume = 0.6;
            gameMusic["mus_lvl2"].volume = 0.6;
            gameMusic["mus_lvl3"].volume = 0.6;
            setTimeout(loop, 1);
            
            if (MUSIC) {
                gameMusic["mus_menu"].loop = true;
                gameMusic["mus_menu"].play();
            }
            
            startMenu();
        }
    });
}

var COLOR_PLAYER = "orange";
var COLOR_BACKGROUND = "black";//"rgb(40, 40, 40)";
var COLOR_WALL = "rgb(220, 220, 220)";
var COLOR_SPIKE = "red";

var COLORS = {
    "player": [
        255, 0, 0,
        255, 0, 0,
    ],
    "back": [
        220, 220, 220,
        220, 220, 220,
    ],
    "wall": [
        60, 60, 60,
        60, 60, 60,
    ],
    "spike": [
        255, 0, 0,
        255, 0, 0,
    ]
};

var flashFade = 0;

var spikeState = 0;
var scaleEffect = false;
var fadeEffect = false;
var fieldEffect = false;
var warpType = 1//0;
var backgroundEffect = 0;

var iteration = 0;
var position = 0;
var runningSpeed = 1.5;
var running = !false;

var fieldEffectFade = 0;
var fadeEffectFade = 0;
var backgroundFade = 0;

var levelProgress = 0;
var levelIterations = 4+1;

var xx = 0;//canvas.width / 2;

var effectRadius = 0;

var highscore = 0;
var highscore1 = 0;
var highscore2 = 0;
var highscore3 = 0;

var colorSpeed = 2;

var LEVEL = 0;
var MENU = true;
var DISTANCE = 0;

var MUSIC = true;
var SOUND = true;

var shaking = false;
var lvl3Size = 0;

var hueShift = false;
var hueWall = 0.8;
var hueBack = 0.5;
var huePlayer = 0;
var hueSpike = 0.2;
var hueBalls = 0.46;

var btexts = [
    "Play Level 1",
    "Play Level 2",
    "Play Level 3",
    "Music",
    "Sounds",
];
var binfo = [
    "Start level 1", "", "",
    "Start level 2", "", "",
    "Start level 3", "", "",
    "Music by Kevin MacLeod", "Anachronist, The Cannery", "Furious Freak, Hot Pursuit",
    "", "Sounds made with Sfxr", "",
];
var bselect = 0;

var boutline = 0;
var boutlineFlag = false;
var brotate = 0;
var brotateFlag = false;

var died = false;
var completed = false;

function isLevel3Unlocked() {
    return highscore1 >= 300 && highscore2 >= 300;
}

function setFont(prefix) {
    ctx.font = prefix + "px gamefont, sans-serif";
}

function loopMenu() {
    ctx.lineWidth = 2;
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    
    ctx.textAlign = "center";
    
    if (boutlineFlag) {
        if (boutline < 1) {
            boutline += 0.04;
        } else {
            boutlineFlag = false;
        }
    } else {
        if (boutline > 1) {
            boutline -= 0.2;
        } else if (boutline > 0) {
            boutline -= 0.04;
        } else {
            boutlineFlag = true;
        }
    }
    boutline = Math.max(0, boutline);
    
    if (brotateFlag) {
        if (brotate < 1) {
            brotate += 0.01;
        } else {
            brotateFlag = false;
        }
    } else {
        if (brotate > 0) {
            brotate -= 0.01;
        } else {
            brotateFlag = true;
        }
    }
    brotate = Math.max(0, brotate);
    
    var oy = 40;
    var bo = -1 + boutline * 3;
    var wb = 120;
    var sp = 42;
    
    for (var i = 0; i < 5; i++) {
        setFont(16);
        
        wb = 135 - i * 7;
        
        if (bselect === i) {
            ctx.fillStyle = "rgb(160, 200, 160)";
            if (i === 2 && !isLevel3Unlocked()) {
                ctx.fillStyle = "rgb(200, 160, 160)";
            }
            var bb = 2;
            ctx.fillRect(ctx.canvas.width / 2 - wb + bb, oy + i * sp + bb, 2 * wb + 1 + bo/2 + 1, 30 + 1 + bo/2 + 1);
        } else {
            ctx.fillStyle = "rgb(215, 215, 215)";
            var bb = 4;
            ctx.fillRect(ctx.canvas.width / 2 - wb + bb, oy + i * sp + bb, 2 * wb + 1, 30 + 1);
        }
        
        ctx.strokeStyle = "rgb(160, 160, 160)";
        ctx.fillStyle = "rgb(20, 20, 20)";
        if (bselect === i) {
            ctx.strokeStyle = "rgb(60, 60, 60)";
            ctx.fillStyle = "rgb(20, 20, 20)";
            ctx.strokeRect(ctx.canvas.width / 2 - wb - bo, oy + i * sp - bo, 2 * wb + 2*bo, 30 + 2*bo);
        } else {
            ctx.strokeRect(ctx.canvas.width / 2 - wb, oy + i * sp, 2 * wb, 30);
        }
        var text = btexts[i];
        if (i === 3) { text = (MUSIC ? "Mute" : "Unmute") + " " + text; }
        if (i === 4) { text = (SOUND ? "Mute" : "Unmute") + " " + text; }
        ctx.fillText(text, ctx.canvas.width / 2, oy + i * sp + 21);
        
        if (bselect === i) {
            var info1 = binfo[3*i + 0];
            var info2 = binfo[3*i + 1];
            var info3 = binfo[3*i + 2];
            
            if (i < 3) {
                info2 = "Highscore: " + (i === 0 ? highscore1 : (i === 1 ? highscore2 : highscore3));
            }
            
            var ii = i;
            
            if (i === 2) {
                if (!isLevel3Unlocked()) {
                    info1 = "Level 3 is locked!"
                    info2 = "Get a score of 300 or more"
                    info3 = "in level 1 and level 2 to unlock"
                    ii = 9;
                }
            } else if (i === 4) {
                info2 = "Sounds made";
                info3 = "with Sfxr";
            }
            
            ctx.save();
            ctx.translate(ctx.canvas.width / 2, 450);
            ctx.rotate(-Math.PI / 32 + brotate * Math.PI / 32 * 2);
            
            setFont(ii === 9 ? 18 + Math.floor(lvl3Size) : 16);
            ctx.fillStyle = ii === 9 ? "rgb(190, 140, 140)" : "rgb(20, 20, 20)";
            ctx.fillText(info1, 0, -40);
            setFont(ii < 3 ? 28 : 18);
            ctx.fillStyle = "rgb(20, 20, 20)";
            ctx.fillText(info2, 0, ii < 3 ? 10 : (i === 4 ? -20 : 0));
            ctx.fillText(info3, 0, i === 4 ? 10 : 30);
            
            ctx.restore();
        }
    }
    
    if (lvl3Size > 0) {
        lvl3Size -= 1;
    }
    lvl3Size = Math.max(0, lvl3Size);
    
    var pressed = false;

    for (var i = 0; i < 5; i++) {
        var wx = ctx.canvas.width/2 - wb;
        var wy = oy + i * 40;
        
        if (wx <= mouseX && mouseX < wx + 2*wb && wy <= mouseY && mouseY < wy + 30) {
            bselect = i;
            
            if (buttonsPressed[0]) {
                pressed = true;
            }
            
            break;
        }
    }
    
    ctx.textAlign = "left";
    
    if (bselect > 0 && keysPressed["ArrowUp"]) {
        bselect -= 1;
        boutline = 2;
        boutlineFlag = true;
    }
    if (bselect < 4 && keysPressed["ArrowDown"]) {
        bselect += 1;
        boutline = 2;
        boutlineFlag = true;
    }
    
    if (keysPressed["Enter"] || keysPressed[" "]) {
        pressed = true;
    }
    
    if (pressed) {
        switch (bselect) {
            case 0:
                startLevel(1);
                break;
                
            case 1:
                startLevel(2);
                break;
                
            case 2:
                if (isLevel3Unlocked()) {
                    startLevel(3);
                } else {
                    lvl3Size = 12;
                }
                break;
                
            case 3:
                MUSIC = !MUSIC;
                setLocalStorage("music", MUSIC ? "on" : "off");
                
                if (MUSIC) {
                    gameMusic["mus_menu"].loop = true;
                    gameMusic["mus_menu"].play();
                } else {
                    gameMusic["mus_menu"].pause();
                }
                break;
                
            case 4:
                SOUND = !SOUND;
                setLocalStorage("sound", SOUND ? "on" : "off");
                break;
        }
    }
}

function startMenu() {
    flashFade = 1;
    
    hueShift = false;
    warpType = 1;
    circY = circYStart;
    died = false;
    completed = false;
    
    MENU = true;
    LEVEL = 0;
    running = true;
    clearInstances();
    
    loadLevel("wld_menu");
    shiftObjects(canvas.width/2/runningSpeed);
    nextIteration();
    colorSpeed = 255;
}

function startLevel(n) {
    gameMusic["mus_menu"].pause();
    gameMusic["mus_menu"].currentTime = 0;
    flashFade = 2;
    
    MENU = false;
    LEVEL = n;
    
    switch (n) {
        case 1: highscore = highscore1; levelIterations = 4; warpType = 1; circY = circYStart; break;
        case 2: highscore = highscore2; levelIterations = 5; warpType = 1; circY = circYStart; break;
        case 3: highscore = highscore3; levelIterations = 4; warpType = 2; circY = canvas.height - circYStart + 50; break;
    }
    levelProgress = 0;
    //colorSpeed = 2;
    
    clearInstances();
    loadLevel("wld_level" + n);
    shiftObjects(canvas.width/2/runningSpeed);
    nextIteration();
    
    running = false;
    setTimeout(function () {
        running = true;
        if (MUSIC) gameMusic["mus_lvl" + n].play();
    }, 500);

    var player = createInstance("obj_player", canvas.width / 2, 50, -1);
}

function leaveGame() {
    switch (LEVEL) {
        case 1:
            if (highscore1 < DISTANCE) { highscore1 = DISTANCE; if (completed) { highscore1 += 1; } }
            break;
        case 2:
            if (highscore2 < DISTANCE) { highscore2 = DISTANCE; if (completed) { highscore2 += 1; } }
            break;
        case 3:
            if (highscore3 < DISTANCE) { highscore3 = DISTANCE; if (completed) { highscore3 += 1; } }
            break;
    }
    
    // send highscores here via APIs
    
    setLocalStorage("highscore1", highscore1);
    setLocalStorage("highscore2", highscore2);
    setLocalStorage("highscore3", highscore3);
    startMenu();
    
    setTimeout(function () {
        if (MUSIC && MENU) {
            gameMusic["mus_menu"].loop = true;
            gameMusic["mus_menu"].play();
        }
    }, 700);
}

function loopGame() {
    
    //if (keysDown["ArrowLeft"]) shiftObjects(1);
    //if (keysDown["ArrowRight"]) shiftObjects(-1);
    
    if (keysPressed["Escape"]) {
        stopMusic();
        leaveGame();
    }
    /*
    if (keysDown["ArrowLeft"]) angleLength += 1;
    if (keysDown["ArrowRight"]) angleLength -= 1;
    
    if (keysDown["a"]) radiusRatio -= 0.01;
    if (keysDown["q"]) radiusRatio += 0.01;
    
    if (keysDown["z"]) circY -= 1;
    if (keysDown["s"]) circY += 1;
    
    if (keysPressed["t"]) runningSpeed += 0.1;
    if (keysPressed["s"]) runningSpeed -= 0.1;
    
    if (keysPressed["p"]) {
        warpType = (warpType + 1) % 3;
        if (warpType === 0 || warpType === 2) {
            circY = canvas.height - circY;
        }
    }
    
    if (keysPressed["n"]) {
        iteration += 1;
        nextIteration();
    }
    */
    
    //if (keysPressed["y"]) running = !running;
    
    
    // progress bar
    drawProgressBar();
    
    /*
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(circX, circY, centerY - 200, 0, 2* Math.PI, true);
    ctx.stroke();
    //*/
}

function loop() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(-100, -100, canvas.width + 200, canvas.height + 200);
    
    
    var shake = 15;
    var shakeX = shaking ? -shake + Math.random() * shake: 0;
    var shakeY = shaking ? -shake + Math.random() * shake : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);
    
    if (hueShift) {
        var rgb;
        
        rgb = HSVToRGB({
            h: hueWall,
            s: 1,
            v: 1,
        });
        hueWall = (hueWall + 0.001) % 1;
        COLORS["wall"][0] = rgb.r;
        COLORS["wall"][1] = rgb.g;
        COLORS["wall"][2] = rgb.b;
        //COLORS["wall"][3] = rgb.r;
        //COLORS["wall"][4] = rgb.g;
        //COLORS["wall"][5] = rgb.b;
        
        rgb = HSVToRGB({
            h: hueBack,
            s: 1,
            v: 1,
        });
        hueBack = (hueBack + 0.002) % 1;
        COLORS["back"][0] = rgb.r;
        COLORS["back"][1] = rgb.g;
        COLORS["back"][2] = rgb.b;
        //COLORS["back"][3] = rgb.r;
        //COLORS["back"][4] = rgb.g;
        //COLORS["back"][5] = rgb.b;
        
        rgb = HSVToRGB({
            h: huePlayer,
            s: 1,
            v: 1,
        });
        huePlayer = (huePlayer + 0.002) % 1;
        COLORS["player"][0] = rgb.r;
        COLORS["player"][1] = rgb.g;
        COLORS["player"][2] = rgb.b;
        //COLORS["player"][3] = rgb.r;
        //COLORS["player"][4] = rgb.g;
        //COLORS["player"][5] = rgb.b;
        
        rgb = HSVToRGB({
            h: hueSpike,
            s: 1,
            v: 1,
        });
        hueSpike = (hueSpike + 0.008) % 1;
        COLORS["spike"][0] = rgb.r;
        COLORS["spike"][1] = rgb.g;
        COLORS["spike"][2] = rgb.b;
        //COLORS["spike"][3] = rgb.r;
        //COLORS["spike"][4] = rgb.g;
        //COLORS["spike"][5] = rgb.b;
        
        if (backgroundEffect === 2 || backgroundEffect === 3) {
            rgb = HSVToRGB({
                h: hueBalls,
                s: 1,
                v: 1,
            });
            hueBalls = (hueBalls + 0.002) % 1;
            forInstances("obj_particle", function (ball) {
                ball.color = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
            });
        }
    }
    
    updateColor("player");
    updateColor("back");
    updateColor("wall");
    updateColor("spike");
    
    if (backgroundEffect === 1 || backgroundEffect === 3) {
        
        var limit = 600;
        var fgc = "rgb(200, 50, 50)";
        var bgc = COLOR_BACKGROUND;
        var er = (effectRadius - limit/2 + limit) % limit;
        
        if (effectRadius >= er) {
            //ctx.strokeStyle = "rgb(200, 50, 50)";
            ctx.globalAlpha = Math.max(0, backgroundFade * 0.04);// - Math.max(0, 0.1 - effectRadius / 300 * 0.08);
            /*ctx.lineWidth = 1 + effectRadius / limit * 180;
            
            ctx.beginPath();
            ctx.arc(circX, circY, 0.1 + effectRadius, 0, 2 * Math.PI);
            ctx.stroke();
            */
            ctx.fillStyle = fgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(0.1 + effectRadius + (1 + effectRadius / limit * 180)/2), 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = bgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(Math.max(1, 0.1 + effectRadius - (1 + effectRadius / limit * 180)/2)), 0, 2 * Math.PI);
            ctx.fill();
            
            
            ctx.globalAlpha = Math.max(0, backgroundFade * 0.04);// - Math.max(0, 0.1 - er / 300 * 0.08);
            /*ctx.lineWidth = 1 + er / limit * 180;
            
            ctx.beginPath();
            ctx.arc(circX, circY, 0.1 + er, 0, 2 * Math.PI);
            ctx.stroke();
            */
            
            ctx.fillStyle = fgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(0.1 + er + (1 + er / limit * 180)/2), 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = bgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(Math.max(1, 0.1 + er - (1 + er / limit * 180)/2)), 0, 2 * Math.PI);
            ctx.fill();
        } else {
            ctx.globalAlpha = Math.max(0, backgroundFade * 0.04);// - Math.max(0, 0.1 - er / 300 * 0.08);
            /*ctx.lineWidth = 1 + er / limit * 180;
            
            ctx.beginPath();
            ctx.arc(circX, circY, 0.1 + er, 0, 2 * Math.PI);
            ctx.stroke();
            */
            
            ctx.fillStyle = fgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(0.1 + er + (1 + er / limit * 180)/2), 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = bgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(Math.max(1, 0.1 + er - (1 + er / limit * 180)/2)), 0, 2 * Math.PI);
            ctx.fill();
            
            //ctx.strokeStyle = "rgb(200, 50, 50)";
            ctx.globalAlpha = Math.max(0, backgroundFade * 0.04);// - Math.max(0, 0.1 - effectRadius / 300 * 0.08);
            /*ctx.lineWidth = 1 + effectRadius / limit * 180;
            
            ctx.beginPath();
            ctx.arc(circX, circY, 0.1 + effectRadius, 0, 2 * Math.PI);
            ctx.stroke();
            */
            ctx.fillStyle = fgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(0.1 + effectRadius + (1 + effectRadius / limit * 180)/2), 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = bgc;
            ctx.beginPath();
            ctx.arc(circX, circY, Math.floor(Math.max(1, 0.1 + effectRadius - (1 + effectRadius / limit * 180)/2)), 0, 2 * Math.PI);
            ctx.fill();
        }
        
        if (effectRadius < limit) {
            effectRadius += 4;
        } else {
            effectRadius = 0;
        }
        ctx.globalAlpha = 1;
    }
    
    if (MENU) {
        loopMenu();
    } else {
        loopGame();
    }
    
    if (running) {
        shiftObjects(-1);
        //angleLength -= 0.01;
        position += runningSpeed;
        levelProgress = iteration + position / currentLevel.width;
        if (position >= currentLevel.width) {
            position -= currentLevel.width;
            iteration += 1;
            
            if (iteration === levelIterations && !MENU) {
                /*forInstances("obj_player", function (player) {
                    gameOver(player);
                });*/
                flashFade = 2;
                playSound("snd_complete");
                completed = true;
                running = false;
                stopMusic();
                setTimeout(function () {
                    leaveGame();
                }, 2500);
            } else {
                nextIteration();
            }
        }
    }
    
    if (fieldEffect) {
        if (fieldEffectFade < 1) {
            fieldEffectFade += 0.01;
        }
    } else {
        if (fieldEffectFade > 0) {
            fieldEffectFade -= 0.01;
        }
    }
    fieldEffectFade = Math.max(0, Math.min(fieldEffectFade, 1));
    
    if (fadeEffect) {
        if (fadeEffectFade < 1) {
            fadeEffectFade += 0.01;
        }
    } else {
        if (fadeEffectFade > 0) {
            fadeEffectFade -= 0.01;
        }
    }
    fadeEffectFade = Math.max(0, Math.min(fadeEffectFade, 1));
    
    if (backgroundEffect > 0) {
        if (backgroundFade < 1) {
            backgroundFade += 0.005;
        }
    } else {
        if (backgroundFade > 0) {
            backgroundFade -= 0.01;
        }
    }
    backgroundFade = Math.max(0, Math.min(backgroundFade, 1));
    
    if (backgroundEffect === 2 || backgroundEffect === 3) {
        
        if (Math.random() < 0.1) {
            var dp = Math.random() < 0.5 ? 100 : -100;
            for (var i = 0; i < 1; i++) {
                createInstance("obj_particle", Math.floor(Math.random() * canvas.width), canvas.height + 50, dp);
            }
        }
    }
    
    var copy = instances.slice();
    for (var i = 0; i < copy.length; i++) {
        copy[i].loop();
    }
    
    if (died && DISTANCE > highscore) {
        setFont("bold 68");
        ctx.fillStyle = COLOR_SPIKE;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);
        ctx.rotate(-Math.PI / 12);
        ctx.fillText("NEW HIGHSCORE", 0, 0);
        ctx.strokeText("NEW HIGHSCORE", 0, 0);
        ctx.restore();
        
        ctx.textAlign = "left";
    }
    
    if (completed) {
        setFont("bold 81");
        ctx.fillStyle = COLOR_SPIKE;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.rotate(-Math.PI / 12);
        ctx.fillText("LEVEL", 0, -40);
        ctx.strokeText("LEVEL", 0, -40);
        ctx.fillText("COMPLETED", 0, 40);
        ctx.strokeText("COMPLETED", 0, 40);
        ctx.restore();
        
        ctx.textAlign = "left";
    }
    
    if (flashFade > 0) {
        flashFade -= 0.1;
    }
    flashFade = Math.max(0, Math.min(flashFade, 1));
    ctx.globalAlpha = flashFade;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalAlpha = 1;
    
    // test
    //setFont(18);
    //ctx.fillStyle = COLOR_SPIKE;
    //ctx.fillText("Hello, world", 50, 110);
    
    // keys pressed/released
    
    for (var k in keysPressed) {
        keysPressed[k] = false;
    }
    for (var k in keysReleased) {
        keysReleased[k] = false;
    }
    for (var i = 0; i < 3; i++) {
        buttonsPressed[i] = false;
        buttonsReleased[i] = false;
    }
    
    ctx.restore();
    requestAnimationFrame(loop);
}

function shiftObjects(sgn) {
    var spd = runningSpeed;
    
    forInstances("obj_wall", function (wall) {
        wall.x += sgn * spd;
        wall.x = (wall.x + currentLevel.width) % currentLevel.width;
    });
    
    forInstances("obj_spike", function (spike) {
        spike.x += sgn * spd;
        spike.x = (spike.x + currentLevel.width) % currentLevel.width;
    });
}

function drawTransformedRectangle(x, y, width, height, notwall) {
    if (x < -10 || canvas.width + 10 < x) return;
    
    x -= 0.5;
    width += 1;
    
    var dx = 100 + 60 + fieldEffectFade * 100;//fieldEffect ? 220 : 100;
    var delta = 150 - fieldEffectFade * 80;//fieldEffect ? 50 : 150;
    var alpha = (x < canvas.width/2) ? Math.min((x - dx) / delta, 1) : Math.min((canvas.width - x - dx) / delta, 1);
    
    if (!fadeEffect) {
        if (alpha < 0.9) {
            x += 0.4;
            width -= 0.8;
        }
        y -= (alpha < 0.9) ? 0.1 : 0.5;
        height += (alpha < 0.9) ? 0.2 : 1;
    }
    //*/
     
    if (scaleEffect && alpha < 1) {
        var s = Math.max(0, alpha);
        s = (1 - s) * 30;
        x -= s;
        y -= s;
        width += 2 * s;
        height += 2 * s;
    }
     
    if (fadeEffectFade > 0.5 && !notwall) {
        delta = 220;
        alpha = (x < canvas.width/2) ? Math.min((x - 100) / delta, 1) : Math.min((canvas.width - x - 100) / delta, 1);
        alpha = Math.min(alpha, 1 - alpha);//1 - alpha;
        if (alpha < 0.9) {
            x += 0.4;
            width -= 0.8;
        }
        y -= (alpha < 0.9) ? 0.1 : 0.5;
        height += (alpha < 0.9) ? 0.2 : 1;
    }
    
    var p = transformRectangle(x, y, width, height);
    
    var dir1 = pointDirection(circX, circY, p.x1, p.y1);
    var dir2 = pointDirection(circX, circY, p.x2, p.y2);
    var dir3 = pointDirection(circX, circY, p.x3, p.y3);
    var dir4 = pointDirection(circX, circY, p.x4, p.y4);
        
    ctx.globalAlpha = Math.max(0, alpha * Math.abs(fadeEffectFade * 2 - 1));
    ctx.beginPath();
    
    if (warpType < 2) {
        ctx.moveTo(p.x1, p.y1);
        if (warpType > 0) ctx.arc(circX, circY, (centerY - y) / radiusRatio, -dir2, -dir1, true);
        ctx.lineTo(p.x2, p.y2);
        ctx.lineTo(p.x3, p.y3);
        if (warpType > 0) ctx.arc(circX, circY, (centerY - y - height) / radiusRatio, -dir3, -dir4, true);
        ctx.lineTo(p.x4, p.y4);
    } else {
        ctx.moveTo(p.x1, p.y1);
        //if (warpType > 0) ctx.arc(circX, circY, (centerY - y) / radiusRatio, -dir1, -dir2, true);
        ctx.lineTo(p.x2, p.y2);
        ctx.lineTo(p.x3, p.y3);
        //if (warpType > 0) ctx.arc(circX, circY, (centerY - y - height) / radiusRatio, -dir1, -dir2, true);
        ctx.lineTo(p.x4, p.y4); 
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    /*
    if (notwall) {
        ctx.strokeStyle = "rgb(20, 20, 20)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        if (warpType < 2) {
            ctx.moveTo(p.x1, p.y1);
            if (warpType > 0) ctx.arc(circX, circY, (centerY - y) / radiusRatio, -dir2, -dir1, true);
            ctx.lineTo(p.x2, p.y2);
            ctx.lineTo(p.x3, p.y3);
            if (warpType > 0) ctx.arc(circX, circY, (centerY - y - height) / radiusRatio, -dir3, -dir4, true);
            ctx.lineTo(p.x4, p.y4);
        } else {
            ctx.moveTo(p.x1, p.y1);
            //if (warpType > 0) ctx.arc(circX, circY, (centerY - y) / radiusRatio, -dir1, -dir2, true);
            ctx.lineTo(p.x2, p.y2);
            ctx.lineTo(p.x3, p.y3);
            //if (warpType > 0) ctx.arc(circX, circY, (centerY - y - height) / radiusRatio, -dir1, -dir2, true);
            ctx.lineTo(p.x4, p.y4); 
        }
        
        ctx.closePath();
        ctx.stroke();
    }
    //*/
}

function drawTransformedSpike(x, y, width, height) {
    if (x < -10 || canvas.width + 10 < x) return;
    
    var dx = 100 + 60 + fieldEffectFade * 100;//fieldEffect ? 220 : 100;
    var delta = 150 - fieldEffectFade * 80;//fieldEffect ? 50 : 150;
    var alpha = (x < canvas.width/2) ? Math.min((x - dx) / delta, 1) : Math.min((canvas.width - x - dx) / delta, 1);
    
    x += 1;
    width -= 2;
    y += height;
    
    if (fadeEffectFade > 0.5) {
        delta = 220;
        alpha = (x < canvas.width/2) ? Math.min((x - 100) / delta, 1) : Math.min((canvas.width - x - 100) / delta, 1);
        alpha = Math.min(alpha, 1 - alpha);//1 - alpha;
    }
    
    var x1 = x;
    var y1 = y;
    var x2 = x + width;
    var y2 = y;
    var x3 = x + width/2;
    var y3 = y - height;
    
    var p1 = transformPoint(x1, y1);
    var p2 = transformPoint(x2, y2);
    var p3 = transformPoint(x3, y3);
    
    ctx.globalAlpha = Math.max(0, alpha * Math.abs(fadeEffectFade * 2 - 1));//Math.max(0, 1 - Math.abs(x + width / 2 - canvas.width / 2) / (canvas.width / 4));
    //ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
}

function nextIteration() {
    
    if (LEVEL === 0) {
        
        spikeState = 0;
        scaleEffect = false;
        fadeEffect = false;
        fieldEffect = false;
        backgroundEffect = 0;
        radiusEffect = false;
        warpType = 1;
        iteration = 0;
        position = 0;
        runningSpeed = 1.6;
        
        setNextColor("player", 255, 0, 0);
        setNextColor("back", 230, 230, 225);
        setNextColor("wall", 60, 60, 60);
        setNextColor("spike", 160, 160, 160);
        
    } else if (LEVEL === 1) {
        switch (iteration) {
            case 0:
                spikeState = 0;
                scaleEffect = false;
                fadeEffect = false;
                fieldEffect = false;
                backgroundEffect = 0;
                radiusEffect = false;
                warpType = 1;
                iteration = 0;
                position = 0;
                runningSpeed = 1.6;
                colorSpeed = 10;
                
                /*
                setNextColor("player", 255, 0, 0);
                setNextColor("back", 20, 20, 20);
                setNextColor("wall", 220, 220, 220);
                setNextColor("spike", 160, 160, 160);
                */
                setNextColor("player", 255, 0, 0);
                setNextColor("back", 230, 230, 225);
                setNextColor("wall", 60, 60, 60);
                setNextColor("spike", 160, 160, 160);
                break;
                
            case 1:
                colorSpeed = 2;
                spikeState = 1;
                backgroundEffect = 1;
                
                setNextColor("player", 255, 200, 255);
                setNextColor("back", 60, 60, 60);
                setNextColor("wall", 200, 0, 20);
                setNextColor("spike", 120, 120, 120);
                break;
                
            case 2:
                backgroundEffect = 0;
                fieldEffect = true;
                runningSpeed = 2;
                
                /*
                setNextColor("player", 20, 20, 20);
                setNextColor("back", 220, 220, 220);
                setNextColor("wall", 20, 20, 20);
                setNextColor("spike", 80, 80, 80);
                */
                setNextColor("player", 180, 180, 180);
                setNextColor("back", 0, 0, 0);
                setNextColor("wall", 220, 220, 220);
                setNextColor("spike", 180, 180, 180);
                break;
                
            case 3:
                backgroundEffect = 3;
                fieldEffect = false;
                spikeState = 2;
                
                setNextColor("player", 110, 80, 155);
                setNextColor("back", 220, 160, 160);
                setNextColor("wall", 120, 120, 120);
                setNextColor("spike", 80, 80, 80);
                break;
            /*
            case 4:
                console.log("Level completed!");
                iteration = 0;
                nextIteration();
            */
        }
    } else if (LEVEL === 2) {
        switch (iteration) {
            case 0:
                spikeState = 0;
                scaleEffect = false;
                fadeEffect = false;
                fieldEffect = false;
                backgroundEffect = 0;
                radiusEffect = false;
                warpType = 1;
                iteration = 0;
                position = 0;
                runningSpeed = 1.6;
                colorSpeed = 10;
                
                setNextColor("player", 255, 0, 0);
                setNextColor("back", 20, 20, 20);
                setNextColor("wall", 220, 220, 220);
                setNextColor("spike", 160, 160, 160);
                break;
                
            case 1:
                colorSpeed = 2;
                spikeState = 1;
                backgroundEffect = 1;
                
                setNextColor("player", 200, 200, 120);
                setNextColor("back", 0, 20, 180);
                setNextColor("wall", 200, 200, 20);
                setNextColor("spike", 160, 160, 60);
                break;
                
            case 2:
                runningSpeed = 2;
                backgroundEffect = 0;
                fadeEffect = true;
                
                setNextColor("player", 185, 185, 185);
                setNextColor("back", 100, 100, 100);
                setNextColor("wall", 50, 50, 50);
                setNextColor("spike", 200, 200, 200);
                break;
                
            case 3:
                //runningSpeed = 2;
                fadeEffect = false;
                
                setNextColor("player", 60, 60, 160);
                setNextColor("back", 200, 200, 20);
                setNextColor("wall", 0, 20, 180);
                setNextColor("spike", 80, 80, 220);
                break;
                
            case 4:
                hueShift = true;
                backgroundEffect = 1;
                spikeState = 2;
                /*
                setNextColor("player", 155, 155, 155);
                setNextColor("back", 100, 100, 100);
                setNextColor("wall", 50, 50, 50);
                setNextColor("spike", 200, 200, 200);
                */
                break;
        }
    } else if (LEVEL === 3) {
        switch (iteration) {
            case 0:
                spikeState = 0;
                scaleEffect = false;
                fadeEffect = false;
                fieldEffect = false;
                backgroundEffect = 0;
                radiusEffect = false;
                //warpType = 1;
                iteration = 0;
                position = 0;
                runningSpeed = 1.6;
                colorSpeed = 10;
                
                setNextColor("player", 170, 170, 170);
                setNextColor("back", 100, 100, 100);
                setNextColor("wall", 50, 50, 50);
                setNextColor("spike", 200, 200, 200);
                break;
                
            case 1:
                colorSpeed = 2;
                spikeState = 1;
                //backgroundEffect = 1;
                //hueShift = true;
                /*
                setNextColor("player", 255, 200, 255);
                setNextColor("back", 60, 60, 60);
                setNextColor("wall", 200, 0, 20);
                setNextColor("spike", 200, 20, 0);
                */
                
                setNextColor("player", 200, 160, 20);
                setNextColor("back", 20, 120, 200);
                setNextColor("wall", 60, 180, 60);
                setNextColor("spike", 20, 20, 20);
                break;
                
            case 2:
                backgroundEffect = 1;
                spikeState = 2;
                
                setNextColor("player", 155, 155, 155);
                setNextColor("back", 20, 20, 20);
                setNextColor("wall", 200, 200, 200);
                setNextColor("spike", 160, 160, 160);
                break;
                
            case 3:
                hueShift = true;
                backgroundEffect = 3;
                
                /*
                setNextColor("player", 110, 80, 155);
                setNextColor("back", 220, 160, 160);
                setNextColor("wall", 120, 120, 120);
                setNextColor("spike", 60, 60, 60);
                */
                break;
        }
    }
}

function setNextColor(name, red, green, blue) {
    COLORS[name][0] = red;
    COLORS[name][1] = green;
    COLORS[name][2] = blue;
}

function updateColor(name) {
    var l = COLORS[name];
    var spd = colorSpeed;
    l[3] += Math.sign(l[0] - l[3]) * spd;
    l[4] += Math.sign(l[1] - l[4]) * spd;
    l[5] += Math.sign(l[2] - l[5]) * spd;
    
    l[3] = Math.max(0, Math.min(l[3], 255));
    l[4] = Math.max(0, Math.min(l[4], 255));
    l[5] = Math.max(0, Math.min(l[5], 255));
    
    if (Math.abs(l[0] - l[3]) < spd) { l[3] = l[0]; }
    if (Math.abs(l[1] - l[4]) < spd) { l[4] = l[1]; }
    if (Math.abs(l[2] - l[5]) < spd) { l[5] = l[2]; }
    
    var c = "rgb(" + l[3] + ", " + l[4] + ", " + l[5] + ")";
    switch (name) {
        case "player":
            COLOR_PLAYER = c;
            break;
        case "back":
            COLOR_BACKGROUND = c;
            break;
        case "wall":
            COLOR_WALL = c;
            break;
        case "spike":
            COLOR_SPIKE = c;
            break;
    }
}

function drawProgressBar() {
    var c = levelIterations + 1;
    var x = 50;
    var y = warpType === 2 ? ctx.canvas.height - 40 : 40;
    var s = 80;
    var r = 8;
    var h = r / 0.8;
    var m = 2;
    
    var col1 = "rgb(40, 40, 40)";//"rgb(186, 225, 255)"; //"gray";
    var col2 = "rgb(230, 230, 200)";//"rgb(255, 255, 186)"; //"rgb(200, 200, 20)";
    
    col1 = COLOR_PLAYER;
    col2 = COLOR_BACKGROUND;//WALL;
    
    if (highscore > 0) {
        ctx.fillStyle = col1;
        ctx.lineWidth = 2;
        ctx.fillRect(x + highscore / 250 * s, y - 12, 2, 24);
    }
    
    ctx.lineWidth = 4;
    ctx.strokeStyle = col1;
    for (var i = 0; i < c; i++) {
        ctx.beginPath();
        ctx.arc(x + i * s, y, r, 0, 2 * Math.PI);
        ctx.stroke();
        if (i < c - 1) {
            ctx.strokeRect(x + i * s, y - h / 2, s, h);
        }
    }
    
    ctx.fillStyle = col2;
    for (var i = 0; i < c; i++) {
        ctx.beginPath();
        ctx.arc(x + i * s, y, r, 0, 2 * Math.PI);
        ctx.fill();
        if (i < c - 1) {
            ctx.fillRect(x + i * s, y - h / 2, s, h);
        }
    }
    
    ctx.fillStyle = col1;
    for (var i = 0; i < c; i++) {
        var rt = 0;
        if (iteration > i) {
            rt = r;
        } else if (iteration === i) {
            rt = r;//Math.min((levelProgress - iteration) * 40, 1) * r;
        } else if (iteration === i - 1) {
            rt = Math.min((levelProgress - iteration) * 1, 1) * r;
        }
        if (rt > 0) {
            ctx.beginPath();
            ctx.arc(x + i * s, y, Math.max(0, rt - m), 0, 2 * Math.PI);
            ctx.fill();
        }
        
        var l = 5;
        var wt = 0;
        if (iteration > i) {
            wt = (s - 2*r + 2*l);
        } else if (iteration === i) {
            wt = Math.min((levelProgress - iteration) * 1, 1) * (s - 2*r + 2*l);
        }
        if (i < c - 1 && wt > 0 && rt > r - 1) {
            ctx.fillRect(x + i * s + r - l - 2, y - h / 2 + m, wt, h - 2*m);
            ctx.beginPath();
            ctx.arc(x + i * s + r - l - 2 + wt, y - h/2 + m + (h - 2*m)/2, (h - 2*m)/2, 0, 2*Math.PI);
            ctx.fill();
        }
    }
    
    var distance = Math.max(0, Math.floor(levelProgress * 1000 / 4) - 1);
    ctx.fillStyle = col1;
    setFont(20);
    //ctx.font = "italic 24px verdana, sans-serif";
    //ctx.textAlign = "right";
    ctx.fillText("Distance:", /*x + s * c*/ctx.canvas.width - 60 - 150, y + 10 - 1);
    setFont(36);
    ctx.fillText(distance, /*x + s * c*/ctx.canvas.width - 60 - 50, y + 10);
    //ctx.textAlign = "left";
    DISTANCE = distance;
}

window.addEventListener("load", init);

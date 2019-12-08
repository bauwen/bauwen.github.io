var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");
var nol = nolify(canvas);
window.onresize = nol.resizeAspectRatio;
window.onload = function () {
    window.onresize();

    if (!Math.sign) {
        Math.sign = function (x) {
            if (x < 0) {
                return -1;
            } else if (x > 0) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    loadKongregateApi(function (api) {
        kongApi = api;

        if (nol.getLocalStorage("savepigman")) {
            menuItem = 0;
            noContinue = false;
        }

        assets.loadAll(function () {});
    });
};

function submitStats() {
    var state = 0;
    if (foundSheep) state += 1;
    if (returnedSheep) state += 1;
    if (leverRed && leverGreen) state += 1;
    if (ending1) state += 1;
    if (ending2) state += 2;
    if (ending3) state += 4;
    if (gameEnd) state += 8;
    kongApi.submitStat("Progression", state);
    kongApi.submitStat("Completion", state === 18 ? 1 : 0);
}

var DEBUG = !true;
var textSpeed = 1;
var textBarHeight = 3 * 32;
var shadowAlpha = 0.2;
var textShowing = !false;

var blackFade = 0;

var powerDrink = false;
var foundSheep = false;
var returnedSheep = false;
var caveOpen = false;
var talkedPig = false;

var correctCode = 0;
var campFire = null;

var cavePig = null;
var whitePig = null;
var startPig = null;
var playerInstance = null;

var leverRed = false;
var leverGreen = false;
var doneQuiz = false;
var doneSomething = false;
var storyTruth = false;
var gameEnd = false;

var roomStartX = -1;
var roomStartY = -1;

var gameStarted = false;
var menuDelta = 120;
var sceneStarted = false;
var menuItem = 1;
var noContinue = true;
var menuSlide = 0;
var menuAlpha = 0.01;
var sceneAlpha = 1;
var sceneDialog = false;
var showDialogBox = false;
var goingToSleep = false;
var sleepAlpha = 0;
var missingScene = false;

var nextMorningAlpha = 0;
var nextMorningFlag = false;

var openDoor1 = false;
var openDoor2 = false;

var ending1 = false;
var ending2 = false;
var ending3 = false;

var musicFadeIn = {};

var backCanvas = document.createElement("canvas");
var backCtx = backCanvas.getContext("2d");
backCanvas.width = canvas.width;
backCanvas.height = canvas.height - textBarHeight;

// horizontal: [ left -> right ]
// vertical: [ top -> bottom ]
var roomMatrix = {
    horizontal: [
        [ "map1", "test" ],
        [ "test", "desert" ],

        [ "rm_grass1", "rm_grass_village2" ],
        //[ "rm_grass_village1", "rm_grass_village2" ],
        [ "rm_grass2", "rm_grass1" ],
        //[ "rm_grass_village3", "rm_grass_village4" ],

        [ "rm_desert_village1", "rm_grass2" ],
        [ "rm_desert1", "rm_desert_village1" ],
        //[ "rm_desert2", "rm_desert1" ],
        [ "rm_desert3", "rm_desert2" ],

        [ "rm_cave3", "rm_cave2" ],

        [ "rm_snow4", "rm_snow3" ],
        [ "rm_snow3", "rm_snow5" ],
    ],
    vertical: [
        [ "snowland", "map1" ],
        [ "cave", "snowland" ],

        //[ "rm_grass_village3", "rm_grass_village1" ],
        [ "rm_grass_village4", "rm_grass_village2" ],

        [ "rm_cave1", "rm_grass_village4" ],
        [ "rm_cave2", "rm_cave1" ],
        [ "rm_cave4", "rm_cave3" ],
        [ "rm_cave3", "rm_cave5" ],
        [ "rm_snow1", "rm_cave4" ],

        [ "rm_snow2", "rm_snow1" ],
        [ "rm_snow3", "rm_snow2" ],
        [ "rm_snow6", "rm_snow3" ],

        [ "rm_hq1", "rm_snow6" ],
        [ "rm_hq2", "rm_hq1" ],

        [ "rm_white", "rm_hq2" ],

        [ "rm_desert2", "rm_desert1" ],
    ]
};

function startGame() {
    gameloop.gotoRoom("rm_start");
}

nol.loop = function () {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (assets.loading) {
        drawLoadScreen();
        return;
    }
    if (!gameStarted) {
        drawStartButton();
        return;
    }

    updateAudio();

    var md = Math.floor(menuDelta);
    ctx.save();
    ctx.translate(md, md);

    ctx.drawImage(backCanvas, 0, 0);

    tools.forEach(gameloop.instances, function (instance) {
        instance.onupdate();
    });

    if (blackFade > 0) {
        ctx.fillStyle = "black";
        ctx.globalAlpha = Math.max(0, Math.min(blackFade, 1));
        ctx.fillRect(0, 0, canvas.width, canvas.height - textBarHeight);
        ctx.globalAlpha = 1;
        blackFade -= 0.025;
    }

    if ((gameloop.room !== "rm_start" || showDialogBox) && gameloop.room != "rm_credits") {
        ctx.fillStyle = "rgb(30, 35, 35)";
        ctx.fillRect(0, canvas.height - textBarHeight, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(140, 140, 140)";
        ctx.lineWidth = 4;
        ctx.strokeRect(1, canvas.height - textBarHeight + 4, canvas.width - 2, textBarHeight - 5);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - textBarHeight + 2);
        ctx.lineTo(canvas.width, canvas.height - textBarHeight + 2);
        ctx.stroke();
    }

    tools.forEach(gameloop.events, function (event) {
        var ended = event();
        if (ended) {
            gameloop.popEvent(event);
        }
    });

    if (DEBUG) {
        collision.drawGrid("red");
    }

    ctx.restore();

    if (gameloop.room === "rm_start" && menuAlpha > 0) {
        drawMenu();
    }

    if (gameloop.room === "rm_start" && sceneStarted) {
        if (menuAlpha > 0) {
            menuAlpha -= 0.01;
        }
        if (menuAlpha < 0.2) {
            if (sceneAlpha > 0.8) {
                //sceneAlpha -= 0.005;
            }
            if (menuDelta > 0) {
                menuDelta -= 0.5;
            } else if (!sceneDialog) {
                sceneDialog = true;
                menuDelta = 0;

                act.start([
                    act.wait(1500),
                    act.execSync(function () { showDialogBox = true; }),
                    act.say("What a beautiful night, isn't it?"),
                    act.say("The fire is amazing too."),
                    act.wait(1000),
                    act.execSync(function () { playSound("snd_pig"); }),
                    act.say("..."),
                    act.say("You want to eat something? Come here."),
                    act.walkCount(startPig, 2, 270, 2),
                    act.face(playerInstance, 270),
                    act.walkCount(startPig, 2, 180, 4),
                    act.walkCount(startPig, 2, 90, 1),
                    act.wait(500),
                    act.say("Here you go!"),
                    act.wait(1500),
                    //act.walkCount(startPig, 2, 270, 1),
                    act.face(playerInstance, 0),
                    act.walkCount(startPig, 2, 0, 4),
                    act.walkCount(startPig, 2, 90, 1),
                    act.face(startPig, 180),
                    act.wait(1000),
                    act.execSync(function () { playSound("snd_pig"); }),
                    act.wait(700),
                    act.say("Haha! I see you like it!"),
                    act.wait(3000),
                    act.say("I'm tired..."),
                    act.say("I'm going to sleep."),
                    act.say("It's going to be a fun day tomorrow!"),
                    act.execSync(function () { goingToSleep = true; })
                ]);
            }
            menuDelta = Math.max(0, menuDelta);
        }
    }

    if (goingToSleep) {
        if (sleepAlpha < 1.4) {
            sleepAlpha += 0.005;
        } else {
            if (sleepAlpha < 2) {
                nextMorningFlag = true;
                sleepAlpha = 3;
            }
            //goingToSleep = false;
            //gameloop.gotoRoom("rm_grass1");
            if (nextMorningFlag) {
                if (nextMorningAlpha < 1.7) {
                    nextMorningAlpha += 0.015;
                } else {
                    nextMorningFlag = false;
                    nextMorningAlpha = 1;
                }
            }
            if (!nextMorningFlag) {
                if (nextMorningAlpha > -1) {
                    nextMorningAlpha -= 0.015;
                } else {
                    goingToSleep = false;
                    gameloop.gotoRoom("rm_grass1");
                }
            }
        }
        ctx.fillStyle = "black";
        ctx.globalAlpha = Math.max(0, Math.min(sleepAlpha, 1));
        ctx.fillRect(0, 0, canvas.width, canvas.height - textBarHeight);

        ctx.fillStyle = "white";
        ctx.globalAlpha = Math.max(0, Math.min(nextMorningAlpha, 1));
        ctx.font = "32px calibri, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("The next morning...", canvas.width/2, 250);
        ctx.textAlign = "left";
        ctx.globalAlpha = 1;
    }

    if (gameloop.roomNext !== "") {
        gameloop.prepareRoom();
    }
}

function drawMenu() {
    if (!sceneStarted) {
        if (menuItem === 1 /*&& !noContinue*/ && nol.keyboardPressed("up")) {
            menuItem = 0;
            menuSlide = 0;
        }
        if (menuItem === 0 && nol.keyboardPressed("down")) {
            menuItem = 1;
            menuSlide = 0;
        }
        if (nol.keyboardPressed("enter")) {
            if (menuItem === 0 && !noContinue) {
                //missingScene = true;
                loadGame();
                submitStats();
                return;
            }
            if (menuItem === 1) {
                // TODO: start scene
                sceneStarted = true;
            }
        }

        if (menuAlpha < 1) {
            menuAlpha += 0.05;
        }
    }

    ctx.globalAlpha = Math.max(0, Math.min(menuAlpha, 1));

    var dy = 50;
    var y = 240;
    ctx.fillStyle = "white";
    if (noContinue && menuItem === 0) ctx.fillStyle = "rgb(50, 50, 50)";
    ctx.fillRect(-1, y + menuItem * dy - 25, menuSlide, 35);

    ctx.font = "22px calibri, sans-serif";
    ctx.fillStyle = menuItem === 0 ? "black" : "rgb(200, 200, 200)";
    if (noContinue) ctx.fillStyle = menuItem === 0 ? "black" : "rgb(100, 100, 100)";
    ctx.fillText("Continue Game", 60, y);
    ctx.fillStyle = menuItem === 1 ? "black" : "rgb(200, 200, 200)";
    ctx.fillText("Start New Game", 60, y + dy);

    ctx.fillStyle = "white";
    ctx.font = "54px funnyfont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("A Man and his Pig", canvas.width/2, 120);
    ctx.textAlign = "left";

    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.font = "16px calibri, sans-serif";
    var tt = 50;
    ctx.fillText("Use Arrow Keys to move.", 60, 400 + tt);
    ctx.fillText("Use Enter to interact.", 60, 425 + tt);
    ctx.fillText("Game saves automatically.", 60, 450 + tt);

    menuSlide += (250 - menuSlide) / 5;

    ctx.globalAlpha = 1;
}

function drawLoadScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var w = 300;
    var h = 30;
    var yy = 50;
    ctx.fillStyle = "rgb(180, 180, 180)";
    ctx.fillRect(canvas.width/2-w/2, canvas.height/2-h/2 + yy, w, h);

    var p = assets.loadCount / assets.totalCount;
    var rr = Math.floor(p * 255);
    var gg = 0;
    var bb = 255 - Math.floor(p * 255);
    ctx.fillStyle = "rgb("+rr+", "+gg+" ,"+bb+")";//"blue";
    ctx.fillRect(canvas.width/2-w/2, canvas.height/2-h/2 + yy, w*p, h);

    ctx.fillStyle = "rgb(180, 180, 180)";
    ctx.font = "36px calibri, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Loading game...", canvas.width/2, 280);
    ctx.textAlign = "left";

    //ctx.fillStyle = "white";
    //ctx.fillText(assets.loadCount + "/" + assets.totalCount, 10, 10);
}

function drawStartButton() {
    var w = 200 + 100;
    var h = 30 + 50;
    var x = canvas.width/2-w/2;
    var y = canvas.height/2-h/2;

    var col1 = "rgb(160, 160, 160)";
    var col2 = "rgb(80, 80, 80)";
    /*
    var hover = mouseInBox(x, y, w, h);

    ctx.fillStyle = hover ? col2 : col1;
    ctx.fillRect(x, y, w, h);

    ctx.lineWidth = 4;
    ctx.strokeStyle = hover ? col1 : col2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = hover ? "white" : "black";
    ctx.textAlign = "center";
    ctx.font = "24px 'courier new', sans-serif";
    ctx.fillText("START GAME", x + w/2, y + h/2 + 8);
    */
    ctx.fillStyle = "rgb(180, 180, 180)";
    ctx.font = "36px calibri, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Click anywhere to start the game", canvas.width/2, 280);
    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.font = "18px calibri, sans-serif";
    ctx.fillText("This is for technical reasons", canvas.width/2, 310);
    ctx.fillText("The game is played with the keyboard only", canvas.width/2, 330);
    ctx.textAlign = "left";

    if (nol.mousePressed("left")) {
        userHasGestured();
        gameStarted = true;
        startGame();
    }
}

function userHasGestured() {
    for (var key in assets.sounds) {
        assets.sounds[key].loop = false;
        assets.sounds[key].volume = 0;
        assets.sounds[key].play();
        assets.sounds[key].pause();
        assets.sounds[key].volume = 1;
    }

    assets.sounds["snd_pig"].volume = 0.5;

    for (var key in assets.music) {
        musicFadeIn[key] = false;
        assets.music[key].volume = 0;
        assets.music[key].loop = true;
        assets.music[key].play();
        assets.music[key].pause();
        assets.music[key].volume = 1;
    }

    assets.music["mus_credits"].volume = 0.4;
}

function mouseInBox(x, y, w, h) {
    return x <= nol.mouseX && nol.mouseX < x + w && y <= nol.mouseY && nol.mouseY < y + h;
}

function doAtStartOfEachRoom() {
    if (gameloop.room === "rm_credits") {
        gameloop.addInstance("obj_credits", 0, 0);
    }

    /*
    if (gameloop.room === "rm_start") {
        playerInstance.sprite = playerInstance.spr_push;
    } else {
        playerInstance.sprite = playerInstance.spr_normal;
    }
    */

    if (gameloop.room.indexOf("grass") > 0 && missingScene) {
        playMusic("mus_grass");
    }
    if (gameloop.room.indexOf("snow") > 0) {
        playMusic("mus_snow");
    }
    if (gameloop.room.indexOf("cave") > 0) {
        if (gameloop.room === "rm_cave5") {
            stopMusic();
        } else {
            playMusic("mus_cave");
        }
    }
    if (gameloop.room.indexOf("desert") > 0) {
        playMusic("mus_desert");
    }
    if (gameloop.room.indexOf("hq") > 0) {
        openDoor1 = false;
        openDoor2 = false;
        stopMusic();
    }


    if (gameloop.room === "rm_grass_village1") {
        gameloop.addInstance("obj_butterfly", Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * 400));
        gameloop.addInstance("obj_butterfly", Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * 400));
    }

    if (gameloop.room === "rm_snow6") {
        gameloop.addInstance("obj_gate", 0, 0);
        gameloop.addInstance("obj_reflection", 0, 0);
    }

    if (gameloop.room.indexOf("hq") > 0) {
        gameloop.addInstance("obj_floorgradient", 0, 0);
        gameloop.addInstance("obj_reflection", 0, 0);
    }

    if (gameloop.room.indexOf("cave") > 0 || gameloop.room === "rm_start") {
        gameloop.addInstance("obj_darkness", 0, 0);
    }

    if (gameloop.room.indexOf("snow") > 0) {
        gameloop.addInstance("obj_snow", 0, 0);
    }

    if (gameloop.room === "rm_cave2") {
        var r;
        r = gameloop.addInstance("obj_rotator", 384, 288);
        r.arms["0"] = 1;
        r.arms["180"] = 1;
        r.arms["270"] = 1;
        r = gameloop.addInstance("obj_rotator", 512, 288);
        r.arms["0"] = 1;
        r.arms["90"] = 1;
        r.arms["270"] = 3;
        r = gameloop.addInstance("obj_rotator", 512, 96);
        r.arms["0"] = 1;
        r.arms["90"] = 1;
        r.arms["180"] = 1;
    }

    if (gameloop.room === "rm_cave3") {
        var r;
        r = gameloop.addInstance("obj_rotator", 416, 256);
        r.arms["90"] = 1;
        r.arms["180"] = 2;
        r = gameloop.addInstance("obj_rotator", 384, 160);
        r.arms["0"] = 1;
        r.arms["180"] = 1;
        r.arms["270"] = 1;

        r = gameloop.addInstance("obj_rotator", 192, 320);
        r.arms["0"] = 2;
        r.arms["90"] = 2;
        r = gameloop.addInstance("obj_rotator", 256, 256);
        r.arms["90"] = 2;
        r.arms["180"] = 2;
        r = gameloop.addInstance("obj_rotator", 128, 224);
        r.arms["0"] = 1;
        r.arms["180"] = 1;
        r.arms["270"] = 1;
    }

    if (gameloop.room === "rm_cave4") {
        var r;
        r = gameloop.addInstance("obj_rotator", 256, 320);
        r.arms["90"] = 2;
        r.arms["180"] = 2;
        r.arms["270"] = 2;
        r = gameloop.addInstance("obj_rotator", 448, 128);
        r.arms["180"] = 2;
        r.arms["270"] = 2;
        r = gameloop.addInstance("obj_rotator", 256, 128);
        r.arms["0"] = 2;
        r.arms["180"] = 2;
        r.arms["270"] = 2;
    }
}

function saveGame() {
    if (!nol.hasLocalStorage) {
        return;
    }
    if (!playerInstance) {
        return;
    }
    if (roomStartX < 0 || roomStartY < 0) {
        return;
    }

    var data = {
        x: roomStartX,
        y: roomStartY,
        rotation: playerInstance.rotation,
        lastRoom: gameloop.room,
        powerDrink: powerDrink,
        foundSheep: foundSheep,
        returnedSheep: returnedSheep,
        caveOpen: caveOpen,
        leverRed: leverRed,
        leverGreen: leverGreen,
        doneQuiz: doneQuiz,
        ending1: ending1,
        ending2: ending2,
        ending3: ending3,
        storyTruth: storyTruth,
        gameEnd: gameEnd
    };
    nol.setLocalStorage("savepigman", JSON.stringify(data));
    submitStats();
}

function loadGame() {
    if (!nol.hasLocalStorage) {
        return false;
    }
    var stuff = nol.getLocalStorage("savepigman");
    if (!stuff) {
        return false;
    }

    var data;
    try {
        data = JSON.parse(stuff);
    } catch (err) {
        return false;
    }

    if (!data.lastRoom) {
        return false;
    }

    textShowing = false;
    gameStarted = true;
    sceneStarted = true;
    sceneDialog = true;
    showDialogBox = true;
    goingToSleep = false;

    powerDrink = data.powerDrink;
    foundSheep = data.foundSheep;
    returnedSheep = data.returnedSheep;
    caveOpen = data.caveOpen;
    leverRed = data.leverRed;
    leverGreen = data.leverGreen;
    doneQuiz = data.doneQuiz;
    ending1 = data.ending1;
    ending2 = data.ending2;
    ending3 = data.ending3;
    storyTruth = data.storyTruth;
    gameEnd = data.gameEnd;

    var p = gameloop.addInstance("obj_player", data.x, data.y);
    p.rotation = data.rotation;

    if (foundSheep && !returnedSheep) {
        var shx = data.x;
        var shy = data.y;
        if (data.rotation === 0) shx -= 32;
        if (data.rotation === 180) shx += 32;
        if (data.rotation === 90) shy += 32;
        if (data.rotation === 270) shy -= 32;
        var s = gameloop.addInstance("obj_sheep", shx, shy);
        s.rotation = data.rotation;
        s.following = true;
        movement.follow(s, playerInstance);
    }

    missingScene = true;
    gameloop.gotoRoom(data.lastRoom);

    menuDelta = 0;
    return true;
}

function updateSaveWithEnding() {
    if (!nol.hasLocalStorage) {
        return false;
    }
    var stuff = nol.getLocalStorage("savepigman");
    if (!stuff) {
        return false;
    }

    var data;
    try {
        data = JSON.parse(stuff);
    } catch (err) {
        return false;
    }

    data.ending1 = ending1;
    data.ending2 = ending2;
    data.ending3 = ending3;
    data.gameEnd = gameEnd;

    nol.setLocalStorage("savepigman", JSON.stringify(data));
    submitStats();
}

function updateAudio() {
    /*
    for (var key in assets.music) {
        var mus = assets.music[key];
        if (musicFadeIn[key]) {
            if (mus.paused) {
                mus.play();
            }
            if (mus.volume < 1) {
                mus.volume = Math.min(mus.volume + 0.01, 1);
            }
        } else {
            if (mus.volume > 0) {
                mus.volume = Math.max(0, mus.volume - 0.01);
            } else if (!mus.paused) {
                mus.pause();
                mus.currentTime = 0;
            }
        }
    }
    */
}

function playMusic(name) {
    var mus = assets.music[name];
    var paused = mus.paused;

    for (var key in assets.music) {
        if (key !== name && !assets.music[key].paused) {
            assets.music[key].pause();
        }
    }

    if (paused) {
        mus.loop = true;
        mus.currentTime = 0;
        mus.play();
    }

    /*
    for (var key in assets.music) {
        musicFadeIn[key] = key === name;
    }
    */
}

function stopMusic() {
    /*
    for (var key in assets.music) {
        musicFadeIn[key] = false;
    }
    */
    stopMusicImmediate();
}

function stopMusicImmediate() {
    for (var key in assets.music) {
        assets.music[key].pause();
    }
}

function playSound(name) {
    assets.sounds[name].loop = false;
    assets.sounds[name].currentTime = 0;
    assets.sounds[name].play();
}

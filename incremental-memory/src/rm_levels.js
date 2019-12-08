
/*
var levels = {
//  lvl: [grid, tiles]
    "1": [3, 2],
    "2": [4, 3],
    "3": [4, 5],
    "4": [5, 5],
    "5": [5, 7],
    "6": [5, 9],
    "7": [5, 11],
    "8": [6, 7],
    "9": [6, 9],
    "10": [6, 11],
    "11": [7, 9],
    "12": [7, 11],
    "13": [7, 13],
    "14": [8, 9],
    "15": [8, 11],
    "16": [8, 13],
};*/
var levels = {
//  lvl: [grid, tiles]
    "1": [3, 2],
    "2": [4, 3],
    "3": [4, 5],
    "4": [5, 5],
    "5": [5, 6],
    "6": [5, 7],
    "7": [5, 8],
    "8": [6, 7],
    "9": [6, 8],
    "10": [6, 9],
    "11": [7, 8],
    "12": [7, 9],
    "13": [7, 10],
    "14": [8, 9],
    "15": [8, 10],
    "16": [8, 11],
};
var level = 1;
var stage = 1;

var tiles = [];
var tilePopIndex = 0;
var waitTimer = 0;
var tilesPicked = false;
var tilesPickedList = [];
var canGuess = false;
var doneGuess = false;
var loadGuess = false;

var showTimer = 0;
var showed = false;
var guessTimer = 0;

var LIVES_COUNT = 1;
var SHOW_TIME = 60 * 0.5;
var GUESS_TIME = 60 * 4.0;
var ERROR_COUNT = 2;

var GRIDSIZE = 3;
var BOARDWIDTH = 320;
var SPACING = 12 - GRIDSIZE;
var CELL = Math.floor((BOARDWIDTH - (GRIDSIZE - 1) * SPACING) / GRIDSIZE);
var TILES = 3;

function resetGame() {
    level = 1;
    stage = 1;
    LIVES_COUNT = 2;
    SHOW_TIME = 60 * 0.5;
    GUESS_TIME = 60 * 4.0;
    ERROR_COUNT = 1;
    textState = 0;
}
resetGame();

var transition = false;
var transRadius = 0;

var levelsEase = 0;

var hurtTimer = 0;
var hurt = false;

function Tile() {
    this.tween = new Tween(0.85, 20);
    this.fold = 0;
    this.foldVeloc = 0;
    this.foldAccel = 0.6 + 0.4 + 0.5;
    this.foldState = 0;
    this.active = false;
    this.white = false;
    this.black = false;
    this.wrong = false;
}

var fadeAlpha = 0;
var firstShow = false;

function gotoRoomLevels() {
    room = ROOM_LEVELS;

    GRIDSIZE = levels[level][0];
    TILES = levels[level][1] + (stage - 1);
    SPACING = 12 - GRIDSIZE;
    CELL = Math.ceil((BOARDWIDTH - (GRIDSIZE - 1) * SPACING) / GRIDSIZE);
    CELL = Math.floor(CELL / 2) * 2;
    //CELL = (BOARDWIDTH - (GRIDSIZE - 1) * SPACING) / GRIDSIZE;

    defcell = Math.floor(Math.floor((BOARDWIDTH - (6 - 1) * (12 - 6)) / 6) / 2) * 2;

    tiles = [];
    for (var i = 0; i < GRIDSIZE*GRIDSIZE; i++) {
        var tile = new Tile();
        tile.tween.set(CELL/2);
        tile.foldAccel = CELL / defcell * tile.foldAccel;
        tiles.push(tile);
    }

    tilePopIndex = 0;
    waitTimer = 0;
    tilesPicked = false;
    tilesPickedList = [];
    showTimer = 0;
    showed = false;
    canGuess = false;
    guessTimer = GUESS_TIME;
    loadGuess = false;
    doneGuess = false;
    transition = false;
    transRadius = 0;

    levelsEase = 0;
    fadeAlpha = 0;
    firstShow = false;
    hurtTimer = 0;
    hurt = false;

    COLOR = (level - 1) % backcols.length;
}



function loopRoomLevels() {

    ctx.save();
    ctx.translate(easeInBack(levelsEase) * canvas.width, 0);

    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        var ix = i % GRIDSIZE;
        var iy = Math.floor(i / GRIDSIZE);

        if (ix + iy > tilePopIndex) continue;

        var x = Math.floor(canvas.width/2 - BOARDWIDTH/2 + ix * (CELL + SPACING));
        var y = Math.floor(canvas.height/2 - BOARDWIDTH/2 + iy * (CELL + SPACING));

        var t = CELL/2 - tile.tween.get();
        if (Math.abs(t - CELL/2) < 0.1) {
            t = CELL/2;
        }

        if (tile.foldState === 0) {
            tile.fold = 0;
        } else if (tile.foldState === 1) {
            if (tile.fold < CELL/2) {
                tile.foldVeloc += tile.foldAccel;
                tile.fold += tile.foldVeloc;
            } else {
                //tile.fold = CELL/2;
                tile.foldState = 2;

                if (!tile.wrong) {
                    tile.white = !tile.white;
                } else {
                    tile.black = !tile.black;
                }
            }
        } else if (tile.foldState === 2) {
            if (tile.fold > 0.01) {
                tile.fold -= tile.foldVeloc;
                tile.foldVeloc -= tile.foldAccel;
            } else {
                tile.fold = 0;
                tile.foldState = 0;
                tile.foldVeloc = 0;
            }
        }
        //if (tile.active) console.log(tile.fold);

        var f = Math.min(Math.max(0, tile.fold), CELL/2);

        var cx = x + CELL/2 - t;
        var cy = y + CELL/2 - t + f;
        var cw = 2*t;
        var ch = 2*Math.max(0, t - f);
        /*
        ctx.fillStyle = "rgb(53, 53, 76)";
        ctx.fillRect(cx + 3, cy + 3, cw, ch);
        */
        ctx.fillStyle = backcols[COLOR][1];
        if (tile.white) ctx.fillStyle = "white";
        if (tile.black) ctx.fillStyle = "rgb(40, 40, 40)";
        ctx.fillRect(cx, cy, cw, ch);
        /*
        ctx.lineWidth = GRIDSIZE < 5 ? 3 : 2;
        ctx.strokeStyle = "rgb(53, 53, 76)";
        ctx.strokeRect(cx, cy, cw, ch);
        */
        if (!tile.white && !tile.black && canGuess && nol.mouseDown("left") && mouseInBox(cx, cy, cw, ch)) {
            tile.foldState = 1;
            if (tilesPickedList.indexOf(i) < 0) {
                tile.wrong = true;
            }
        }
    }

    var nbCorrect = 0;
    var nbWrong = 0;
    if (canGuess) {
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].white) nbCorrect += 1;
            if (tiles[i].black) nbWrong += 1;
        }
    }

    if (canGuess) {
        //if (guessTimer < GUESS_TIME) {
            guessTimer += 1;
        //}
    }

    if (hurt) {
        hurtTimer += 1;
    }

    if (canGuess && (nbWrong > ERROR_COUNT || guessTimer >= GUESS_TIME + 12)) {
        canGuess = false;
        doneGuess = true;
        hurt = true;
        for (var i = 0; i < tilesPickedList.length; i++) {
            var index = tilesPickedList[i];
            var tile = tiles[index];
            if (!tile.white) {
                tile.foldState = 1;
                tile.active = true;
            }
        }
        setTimeout(function () {
            doneGuess = false;
            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                if (tile.white || tile.black) {
                    tile.foldState = 1;
                    tile.active = false;
                }
            }
            hurt = false;
            hurtTimer = 0;
            LIVES_COUNT -= 1;
            setTimeout(function () {
                if (LIVES_COUNT > 0) {
                    waitTimer = 0;
                    showTimer = 0;
                    tilesPicked = false;
                    tilesPickedList = [];
                    showed = false;
                    guessTimer = GUESS_TIME;
                    for (var i = 0; i < tiles.length; i++) {
                        tiles[i].wrong = false;
                        tiles[i].active = false;
                        tiles[i].foldState = 0;
                    }
                } else {
                    textState = 1;
                    var temp = level;
                    level = 1;
                    saveGameState();
                    level = temp;
                    gotoRoomText();
                    transition = true;
                    canGuess = false;
                    loadGuess = false;
                    doneGuess = false;
                }
            }, 300);
        }, 400);
    }

    if (canGuess && nbCorrect === tilesPickedList.length) {
        canGuess = false;
        doneGuess = true;
        setTimeout(function () {

            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                if (tile.white || tile.black) {
                    tile.foldState = 1;
                    tile.active = false;
                }
            }
            setTimeout(function () {
                stage += 1;
                TILES += 1;
                doneGuess = false;
                if (stage <= 3) {
                    waitTimer = 0;
                    showTimer = 0;
                    tilesPicked = false;
                    tilesPickedList = [];
                    showed = false;
                    //guessTimer = GUESS_TIME;
                    for (var i = 0; i < tiles.length; i++) {
                        tiles[i].wrong = false;
                        tiles[i].active = false;
                        tiles[i].foldState = 0;
                    }
                } else {
                    if (level === 16) {
                        updateHighscore();
                        textState = 2;
                    }
                    //LIVES_COUNT = -20;
                    transition = true;
                    canGuess = false;
                    loadGuess = false;
                    doneGuess = false;
                }
            }, 300);
        }, 400);
    }


    // timers

    if (tilePopIndex < GRIDSIZE*2) {
        tilePopIndex += 0.2;
    } else if (waitTimer < (firstShow ? 50 : 80)) {
        waitTimer += 1;
        loadGuess = true;
    } else if (!tilesPicked) {
        tilesPicked = true;
        firstShow = true;
        hurtTimer = 0;
        hurt = false;
        updateHighscore();
        while (tilesPickedList.length < TILES) {
            var index = Math.floor(Math.random() * GRIDSIZE * GRIDSIZE);
            if (tilesPickedList.indexOf(index) < 0) {
                tilesPickedList.push(index);
            }
        }
        for (var i = 0; i < tilesPickedList.length; i++) {
            var index = tilesPickedList[i];
            var tile = tiles[index];
            tile.foldState = 1;
            tile.active = true;
        }
        //loadGuess = true;
    }

    if (doneGuess) {
        //guessTimer += (GUESS_TIME - guessTimer) / 5;
    }
    if (loadGuess) {
        guessTimer += (0 - guessTimer) / 5;
    }

    if (tilesPicked) {
        if (showTimer < 20 + SHOW_TIME) {
            showTimer += 1;
        } else if (!showed) {
            showed = true;
            guessTimer = 0;
            for (var i = 0; i < tilesPickedList.length; i++) {
                var index = tilesPickedList[i];
                var tile = tiles[index];
                tile.foldState = 1;
                tile.active = false;
            }
            setTimeout(function () {
                canGuess = true;
                loadGuess = false;
            }, 250);
        }
    }


    // text

    if (fadeAlpha < 1) {
        fadeAlpha += 0.02;
    }

    ctx.globalAlpha = Math.max(0, Math.min(fadeAlpha, 1));

    ctx.fillStyle = "white";
    ctx.font = "40px gamefont, sans-serif";
    //ctx.fillText("Lives: " + LIVES_COUNT, canvas.width/2-140, 60);
    for (var i = 0; i < LIVES_COUNT; i++) {
        if (hurt && i === LIVES_COUNT - 1) {
            if (!((hurtTimer > 1 && hurtTimer < 7) || (hurtTimer > 12 && hurtTimer < 17))) {
                continue;
            }
        }
        var xs = canvas.width/2+120 - (i < 5 ? i : i - 5)*28;
        var ys = i >= 5 ? 68 : 42;
        drawImage("live", xs, ys, 25);
    }

    ctx.font = "32px gamefont, sans-serif";
    ctx.fillText("Level " + level + " - " + Math.min(3, stage), canvas.width/2-145, 65);

    ctx.globalAlpha = 1;

    if (canGuess || doneGuess || loadGuess || transition) {
        //ctx.fillText(Math.floor(guessTimer / GUESS_TIME * 1000) / 1000, canvas.width/2, canvas.height-80);
        ctx.fillStyle = "black";//((hurtTimer > 1 && hurtTimer < 5) || (hurtTimer > 10 && hurtTimer < 15)) ? "white" : "black";
        ctx.globalAlpha = 0.05;
        var ll = 305;
        if (GRIDSIZE === 7) ll += 8;
        ctx.fillRect(canvas.width/2-155, canvas.height-50-10, Math.max(0, ll), 8);
        ctx.globalAlpha = 1;
        ctx.fillStyle = ((hurtTimer > 1 && hurtTimer < 7) || (hurtTimer > 12 && hurtTimer < 17)) ? "rgb(50, 50, 50)" : "white";
        ctx.fillRect(canvas.width/2-155, canvas.height-50-10, Math.max(0, ll * (1 - guessTimer / GUESS_TIME)), 8);
    }


    if (transition) {
        levelsEase += 0.04;
        if (levelsEase >= 1.2) {
            if (textState > 0) {
                gotoRoomText();
            } else {
                gotoRoomMenu();
            }
        }
        /*
        transRadius += 15;
        ctx.fillStyle = "rgb(60, 60, 90)";
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, transRadius, 0, 2*Math.PI);
        ctx.fill();
        if (transRadius > canvas.width+canvas.height-200) {
            gotoRoomMenu();
        }
        */
    }

    ctx.restore();
}

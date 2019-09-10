var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");
var nol = nolify(canvas);
window.onresize = nol.resizeAspectRatioFill;
window.onload = window.onresize();
nol.loop = gameloop;

var restartedGame = false;
var gameHasLoaded = false;

var highscore = 0;

function updateHighscore() {
    var score = level * 10 + stage;
    if (score > highscore) {
        //console.log("new record: ", score, highscore)
        highscore = score;
        submitStats();
        saveGameState();
    }
}

var ROOM_LEVELS = 0;
var ROOM_MENU = 1;
var ROOM_TEXT = 2;
var room = -1;
var firstTime = true;

var MUSIC = true;
var musicClicked = false;
var musicLoaded = false;
var music = new Audio();

window.addEventListener("load", function () {
    musicLoadEvent = "loadeddata";
    var musicLoad = function () {
        if (musicLoaded) return;
        music.removeEventListener(musicLoadEvent, musicLoad);
        musicLoaded = true;
        music.loop = true;
        //music.play();

        if (MUSIC) {
            music.volume = 1;
        } else {
            music.volume = 0;
        }
    };
    setTimeout(musicLoad, 1500);
    music.addEventListener(musicLoadEvent, musicLoad);
    music.preload = "auto";
    music.src = "src/music_out.mp3";
});

var testA = 0;
var audioClickEvent = function (event) {
    if (musicLoaded && !musicClicked) {
        musicClicked = true;
        music.volume = MUSIC ? 1 : 0;
        music.play();
        music.pause();
        setTimeout(function () {
            music.play();
        }, 400);
    }
};

canvas.addEventListener("mousedown", audioClickEvent, { passive: false });
canvas.addEventListener("touchstart", audioClickEvent, { passive: false });

var images = {};
function loadImage(name, src) {
    var image = new Image();
    image.onload = function () {
        images[name] = image;
    }
    image.src = src;
}
function drawImage(name, x, y, s) {
    if (!images[name]) return;
    var img = images[name];
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, s, s);
}

var kongApi;

window.addEventListener("load", function () {
    loadImage("eye", "src/eye.png");
    loadImage("select", "src/select.png");
    loadImage("error", "src/error.png");
    loadImage("live", "src/live.png");

    loadKongregateApi(function (api) {
        gameHasLoaded = true;

        kongApi = api;
        var loaded = loadGameState();
        submitStats();

        if (loaded) {
            gotoRoomMenu();
        } else {
            gotoRoomText();
        }
        //gotoRoomLevels();
        //gotoRoomMenu();
    });
});


var COLOR = 0;
var backcols = [
    [ "rgb(91, 91, 121)", "rgb(81, 81, 111)" ],
    [ "rgb(81, 111, 81)", "rgb(71, 101, 71)" ],
    [ "rgb(111, 111, 111)", "rgb(101, 101, 101)" ],
    [ "rgb(111, 81, 81)", "rgb(101, 71, 71)" ],
    [ "rgb(111, 111, 81)", "rgb(101, 101, 71)" ],
    [ "rgb(111, 81, 111)", "rgb(101, 71, 101)" ],
    [ "rgb(81, 111, 111)", "rgb(71, 101, 101)" ],
    [ "rgb(81, 81, 81)", "rgb(71, 71, 71)" ],

    [ "rgb(81, 81, 111)", "rgb(71, 71, 101)" ],
    [ "rgb(81, 111, 81)", "rgb(71, 101, 71)" ],
    [ "rgb(111, 81, 81)", "rgb(101, 71, 71)" ],
    [ "rgb(111, 111, 111)", "rgb(101, 101, 101)" ],
    [ "rgb(111, 81, 111)", "rgb(101, 71, 101)" ],
    [ "rgb(81, 111, 111)", "rgb(71, 101, 101)" ],
    [ "rgb(81, 81, 81)", "rgb(71, 71, 71)" ],
    [ "rgb(111, 111, 81)", "rgb(101, 101, 71)" ]
];

function gameloop() {
    ctx.fillStyle = backcols[COLOR][0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ctx.fillStyle = "black";
    //ctx.fillText(testA, 10, 20);

    if (room === ROOM_MENU) {
        ctx.fillStyle = ctx.strokeStyle;
        drawMusicIcon(canvas.width - 65 - 10, canvas.height - 46 - 8);
    }

    switch (room) {
        case ROOM_LEVELS:
            loopRoomLevels();
            break;

        case ROOM_MENU:
            loopRoomMenu();
            break;

        case ROOM_TEXT:
            loopRoomText();
            break;
    }

    if (mouseInBox(canvas.width - 65 - 10, canvas.height - 46 - 8, 32, 32)) {
        ctx.strokeStyle = "rgb(220, 220, 220)";
        if (nol.mousePressed("left")) {
            toggleMusic();
        }
    } else {
        ctx.strokeStyle = "rgb(160, 160, 160)";
    }

    if (!gameHasLoaded) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function fillCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fill();
}

function mouseInBox(x, y, width, height) {
    return x <= nol.mouseX && nol.mouseX < x + width && y <= nol.mouseY && nol.mouseY < y + height;
}

function formatMoney(value) {
    var val = "" + value;
    var str = "";
    var k = 0;

    if (val.indexOf("+") >= 0) {
        return val;
    }

    for (var i = val.length - 1; i >= 0; i--) {
        var c = val.charAt(i);
        str = c + str;
        k += 1;
        if (k === 3 && i > 0) {
            str = "," + str;
            k = 0;
        }
    }

    return str;
}

function drawMusicIcon(x, y) {
    var size = 32;
    var cx = x + size / 2 + 4;
    var cy = y + size / 2;

    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 10 + 2 + 2 + 1);
    ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 2 + 1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 10 + 1 + 2 + 1);
    ctx.lineTo(cx - 8, cy - 10 + 14 + 1 + 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 8 + 12 - 1, cy - 10 + 1 + 1);
    ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 14 + 1 + 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 11 + 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - 11 + 12 + 1 - 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx - 3, cy + 1 - 1, size / 2 - 4 + 2 + 2, 0, 2 * Math.PI);
    ctx.stroke();

    if (!MUSIC) {
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - 13, cy + 13);
        ctx.lineTo(cx + 10, cy - 10);
        ctx.stroke();
    }
}

function saveGameState() {
    //return; // TODO

    if (!nol.hasLocalStorage) {
        return;
    }

    var data = {
        level: room === ROOM_LEVELS ? level - 1 : level,
        lives_count: LIVES_COUNT,
        show_time: SHOW_TIME,
        guess_time: GUESS_TIME,
        error_count: ERROR_COUNT,
        highscore: highscore,
        music: MUSIC
    };

    var text = JSON.stringify(data);
    nol.setLocalStorage("incrmemory_save", text);
}

function loadGameState() {
    //return; // TODO

    if (!nol.hasLocalStorage) {
        return;
    }

    var text = nol.getLocalStorage("incrmemory_save");
    if (!text) {
        return false;
    }

    try {
        var data = JSON.parse(text);

        firstTime = false;

        level = data.level;
        stage = 1;
        COLOR = Math.max(0, level - 1);

        highscore = data.highscore;

        if (level === 0) {
            level = 1;
            return false;
        }

        LIVES_COUNT = data.lives_count;
        SHOW_TIME = data.show_time;
        GUESS_TIME = data.guess_time;
        ERROR_COUNT = data.error_count;

        MUSIC = data.music;
        if (musicLoaded) {
            if (MUSIC) {
                music.volume = 1;
            } else {
                music.volume = 0;
            }
        }

        return true;
    } catch (err) {
        // unable to load data
    }

    return false;
}

function submitStats() {
    kongApi.submitStat("Completion", (highscore === 164) ? 1 : 0);
    kongApi.submitStat("Highscore", highscore);
}

function toggleMusic() {
    if (!musicLoaded) {
        return;
    }

    MUSIC = !MUSIC;
    if (MUSIC) {
        music.volume = 1;
        music.play();
    } else {
        music.volume = 0;
        music.pause();
    }

    saveGameState();
}

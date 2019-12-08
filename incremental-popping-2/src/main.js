var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");
var nol = nolify(canvas);
window.onresize = nol.resizeAspectRatio;
window.onload = window.onresize();
nol.loop = gameloop;

var restartedGame = false;
var gameHasLoaded = false;

var moneyForNextLevel = {
    "0": "5",
    "1": "5000",
    "2": "2000000",
    "3": "999999999999"
};

var achNone = false;
var achAll = false;
var achMoney = false;
var moneyForAch = 99999999999;

var chainRecord = 0;
var moneyRecord = 0;
var statTotalGames = 0;
var statTotalMoney = 0;
var statTotalPops = 0;
var statTotalUpgrades = 0;

var ROOM_START = 0;
var ROOM_PLAY = 1;
var ROOM_MENU = 2;
var ROOM_ACH = 3;
var ROOM_STATS = 4;
var room = ROOM_MENU;
var firstTime = true;

var roomStartAlpha = 1;
var roomPlayAlpha = 1;
var roomAchAlpha = 1;
var roomStatsAlpha = 1;
var roomMenuAlpha = 1;

var padH = 60;
var padV = 20;

var areaX = padV;
var areaY = padH;
var areaWidth = canvas.width - 2*padV;
var areaHeight = canvas.height - 2*padH;

var level = 0;
var money = 0;

var roomFadeState = 0;
var roomFadeValue = 0;
var roomFadeColors = [
    "rgb(200, 200, 210)",
    "rgb(210, 200, 200)",
    "rgb(210, 210, 200)",
    "rgb(200, 210, 200)",
    "rgb(200, 210, 210)",
    "rgb(210, 210, 210)",
    "rgb(210, 200, 210)"
];
roomFadeColorNext = roomFadeColors[0];

var MUSIC = true;
var musicClicked = false;
var musicLoaded = false;
var music = new Audio();
music.src = "src/music.mp3";
music.preload = "auto";
music.oncanplaythrough = function () {
    if (music.paused || music.currentTime === 0) {
        musicLoaded = true;
        music.loop = true;
        //music.play();

        if (MUSIC) {
            music.volume = 1;
        } else {
            music.volume = 0;
        }
    }
};

window.addEventListener("mousedown", function (event) {
    if (musicLoaded && !musicClicked) {
        musicClicked = true;
        music.play();
    }
});
window.addEventListener("touchstart", function (event) {
    if (musicLoaded && !musicClicked) {
        musicClicked = true;
        music.play();
    }
});

var kongApi;

window.addEventListener("load", function () {
    loadKongregateApi(function (api) {
        gameHasLoaded = true;

        kongApi = api;
        loadGameState();
        submitStats();

        if (firstTime) {
            gotoRoomPlay();
        } else {
            gotoRoomMenu();
        }
    });
});

function initializeGame() {
    /*
    incr.multiplier.value = 1.8//1.1;
    incr.ballNumber.value = 10//20;
    incr.popSize.value = 32//28;
    incr.popTime.value = 200//100;
    incr.ballSpeed.value = 3;
    incr.roomSize.value = 0.6; // 0.6, 0.9, 1.1, 1.3
    incr.boostTime.value = 0.5;
    */

    incr.multiplier.value = 1.1;
    incr.popSize.value = 28;
    incr.popTime.value = 100;
    incr.ballSpeed.value = 3;
    incr.boostTime.value = 0.5;
    incr.roomSize.value = 0.9;

    switch (level) {
        case 0:
            incr.ballNumber.value = 10;
            incr.roomSize.value = 0.6;
            incr.popTime.value = 150;
            break;
        case 1:
            incr.ballNumber.value = 16;
            incr.roomSize.value = 0.7;
            incr.popTime.value = 200;
            break;
        case 2:
            incr.ballNumber.value = 24;
            incr.roomSize.value = 1.0;
            incr.popSize.value = 36;
            break;
        case 3:
        default:
            incr.popTime.value = 150;
            incr.popSize.value = 32;
            incr.ballNumber.value = 35;
            incr.roomSize.value = 1.3;
            break;
    }

    for (var key in incr) {
        incr[key].progress = 0;
        incr[key].increment = function () {
            this.progress += 1;
            this.value = this.getNextValue();
        };
    }

    money = 0;
}
initializeGame();

function gameloop() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (false && room != ROOM_PLAY) {
        ctx.fillStyle = "rgb(245, 245, 245)";
        //fillCircle(50, 90, 30);
        //fillCircle(190, 200, 170);
        fillCircle(420, 540, 150);
        //fillCircle(670, 170, 210);
        fillCircle(100, 500, 100);
        fillCircle(700, 500, 100);
        //fillCircle(450, 50, 120);
    }

    switch (room) {
        case ROOM_START:
            loopRoomStart();
            break;

        case ROOM_PLAY:
            loopRoomPlay();
            break;

        case ROOM_MENU:
            loopRoomMenu();
            break;

        case ROOM_ACH:
            loopRoomAch();
            break;

        case ROOM_STATS:
            loopRoomStats();
            break;
    }

    if (mouseInBox(canvas.width - 65, canvas.height - 46, 32, 32)) {
        ctx.strokeStyle = "rgb(220, 220, 220)";
        if (nol.mousePressed("left")) {
            toggleMusic();
        }
    } else {
        ctx.strokeStyle = "rgb(160, 160, 160)";
    }

    ctx.fillStyle = ctx.strokeStyle;
    drawMusicIcon(canvas.width - 65, canvas.height - 46);

    ctx.fillStyle = "white";
    ctx.font = "36px gamefont";
    ctx.fillText("$" + formatMoney(money), 30, 42);

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

function drawFrame() {
    ctx.fillStyle = "rgb(40, 40, 40)";
    ctx.fillRect(0, 0, canvas.width, padH);
    ctx.fillRect(0, canvas.height - padH, canvas.width, padH);
    ctx.fillRect(0, 0, padV, canvas.height);
    ctx.fillRect(canvas.width - padV, 0, padV, canvas.height);

    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = "rgb(40, 40, 40)";
    ctx.lineWidth = 6;
    ctx.strokeRect(padV, padH, canvas.width - padV*2, canvas.height-padH*2);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(padV, padH, canvas.width - padV*2, canvas.height-padH*2);
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

function drawTransition(callback) {
    if (roomFadeState === 0) {
        var roomFadeIndex = Math.floor(Math.random() * roomFadeColors.length);
        roomFadeColorNext = roomFadeColors[roomFadeIndex];
        return;
    }

    var sx = roomFadeState === 1 ? canvas.width + 1 - roomFadeValue : -roomFadeValue;
    var areaPadding = -1//8*0;
    var areaBorder = padV;

    ctx.fillStyle = roomFadeColorNext;// "rgb(210, 210, 210)";
    ctx.fillRect(sx, areaY - areaPadding, canvas.width, areaHeight + 2 * areaPadding);
    roomFadeValue += (canvas.width - roomFadeValue) / 6;

    if (roomFadeValue > canvas.width - 10) {
        var prev = roomFadeState;
        roomFadeState = 0;
        roomFadeValue = 0;
        if (prev === 1) {
            callback();
        }
    }

    ctx.fillStyle = "rgb(40, 40, 40)";
    ctx.fillRect(0, areaY - areaPadding, areaBorder - areaPadding, areaHeight + 2 * areaPadding);
    ctx.fillRect(areaX + areaWidth + areaPadding, areaY - areaPadding, areaBorder - areaPadding, areaHeight + 2 * areaPadding);
}

function saveGameState() {
    if (!nol.hasLocalStorage) {
        return;
    }

    var data = {
        money: money,
        level: level,

        multiplier_progress: incr.multiplier.progress,
        ballnumber_progress: incr.ballNumber.progress,
        poptime_progress: incr.popTime.progress,
        popsize_progress: incr.popSize.progress,
        ballspeed_progress: incr.ballSpeed.progress,
        boosttime_progress: incr.boostTime.progress,
        roomsize_progress: incr.roomSize.progress,

        multiplier_value: incr.multiplier.value,
        ballnumber_value: incr.ballNumber.value,
        poptime_value: incr.popTime.value,
        popsize_value: incr.popSize.value,
        ballspeed_value: incr.ballSpeed.value,
        boosttime_value: incr.boostTime.value,
        roomsize_value: incr.roomSize.value,

        achnone: achNone,
        achall: achAll,
        achmoney: achMoney,

        chainrecord: chainRecord,
        moneyrecord: moneyRecord,
        stattotalgames: statTotalGames,
        stattotalmoney: statTotalMoney,
        stattotalpops: statTotalPops,
        stattotalupgrades: statTotalUpgrades,

        restartedgame: restartedGame,

        music: MUSIC
    };

    var text = JSON.stringify(data);
    nol.setLocalStorage("incrpop2_save", text);
}

function loadGameState() {
    if (!nol.hasLocalStorage) {
        return;
    }

    var text = nol.getLocalStorage("incrpop2_save");
    if (!text) {
        return;
    }

    try {
        var data = JSON.parse(text);

        money = data.money;
        level = data.level;

        incr.multiplier.progress = data.multiplier_progress;
        incr.ballNumber.progress = data.ballnumber_progress;
        incr.popTime.progress = data.poptime_progress;
        incr.popSize.progress = data.popsize_progress;
        incr.ballSpeed.progress = data.ballspeed_progress;
        incr.boostTime.progress = data.boosttime_progress;
        incr.roomSize.progress = data.roomsize_progress;

        incr.multiplier.value = data.multiplier_value;
        incr.ballNumber.value = data.ballnumber_value;
        incr.popTime.value = data.poptime_value;
        incr.popSize.value = data.popsize_value;
        incr.ballSpeed.value = data.ballspeed_value;
        incr.boostTime.value = data.boosttime_value;
        incr.roomSize.value = data.roomsize_value;

        achNone = data.achnone;
        achAll = data.achall;
        achMoney = data.achmoney;

        chainRecord = data.chainrecord;
        moneyRecord = data.moneyrecord;
        statTotalGames = data.stattotalgames;
        statTotalMoney = data.stattotalmoney;
        statTotalPops = data.stattotalpops;
        statTotalUpgrades = data.stattotalupgrades;

        restartedGame = data.restartedgame;

        firstTime = false;

        MUSIC = data.music;
        if (musicLoaded) {
            if (MUSIC) {
                music.volume = 1;
            } else {
                music.volume = 0;
            }
        }
    } catch (err) {
        // unable to load data
    }
}

function submitStats() {
    var achCount = 0;
    for (var i = 0; i < achs.length; i++) {
        var ach = achs[i];
        if (ach.done()) {
            achCount += 1;
        }
    }

    kongApi.submitStat("Completion", (achCount === 6) ? 1 : 0);
    //kongApi.submitStat("Level", level);
    kongApi.submitStat("Chain", chainRecord);
    //kongApi.submitStat("Money", moneyRecord);
    kongApi.submitStat("Games", statTotalGames);
    //kongApi.submitStat("Pops", statTotalPops);
    kongApi.submitStat("Upgrades", statTotalUpgrades);
    kongApi.submitStat("Achievements", achCount);
}

function toggleMusic() {
    if (!musicLoaded) {
        return;
    }

    MUSIC = !MUSIC;
    if (MUSIC) {
        music.volume = 1;
    } else {
        music.volume = 0;
    }

    saveGameState();
}

var gameOver = false;
var poppedInit = false;
var popCount = 0;
var disks = [];
var extraMoney = 0;
var playTimer = 0;
var boostAmount = 0;

var quaking = false;
var quakeX = 0;
var quakeY = 0;
var quakeStrength = 3;
var quakeTimer = 0;

var boosting = false;
var poppedAllTimer = 0;

var poppedInitDone = false;

function doQuake(strength) {
    quaking = true;
    quakeTimer = 10;
    quakeStrength = strength;
}

function gotoRoomPlay() {
    room = ROOM_PLAY;
    roomFadeState = 2;
    roomPlayAlpha = 0;

    if (gotoNextLevel) {
        level = 0;
        gotoNextLevel = false;
        initializeGame();
    }

    poppedInitDone = false;
    boostAmount = 100;
    playTimer = 0;
    extraMoney = 0;
    gameOver = false;
    poppedInit = false;
    popCount = 0;
    disks = [];

    for (var i = 0; i < incr.ballNumber.value; i++) {
        var pad = 20;
        var x = areaX + pad + Math.floor(Math.random() * (areaWidth - 2*pad));
        var y = areaY + pad + Math.floor(Math.random() * (areaHeight - 2*pad));
        var disk = new Disk(x, y);
        disks.push(disk);
    }

    totalCount = disks.length;
}

function loopRoomPlay() {
    if (roomFadeState === 1) {
        roomPlayAlpha -= 0.05;
    }
    if (roomFadeState === 2) {
        roomPlayAlpha += 0.05;
    }
    roomPlayAlpha = Math.max(0, Math.min(roomPlayAlpha, 1));

    if (poppedAllTimer <= 0) {
        poppedAllTimer = 30;
    }
    poppedAllTimer -= 1;

    var cell = 48;
    cell = Math.floor(cell / incr.roomSize.value);
    var pad = 52;
    ctx.strokeStyle = "rgb(248, 248, 248)";
    ctx.lineWidth = 2;

    if (nol.keyboardPressed("space")) {
        doQuake(4);
    }
    if (quaking) {
        if (quakeTimer > 0) {
            quakeX = Math.random() * quakeStrength;
            quakeY = Math.random() * quakeStrength;
            quakeTimer -= 1;
        } else {
            quaking = false;
            quakeX = 0;
            quakeY = 0;
        }
    }

    ctx.save();
    ctx.translate(quakeX, quakeY);

    var allAchsDone = true;
    for (var ai = 0; ai < achs.length; ai++) {
        if (!achs[ai].done()) {
            allAchsDone = false;
            break;
        }
    }

    if (allAchsDone) {
        ctx.fillStyle = "rgb(235, 235, 235)";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc((areaX + areaWidth) / 2 - 90, areaY + 120 - 30, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((areaX + areaWidth) / 2 + 90, areaY + 120 - 30, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc((areaX + areaWidth) / 2, areaY + 100 - 70, 220, 0.3, Math.PI - 0.3);
        ctx.stroke();

        ctx.font = "48px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Congratulations!", (areaX + areaWidth) / 2, areaY + 340);

        ctx.strokeStyle = "rgb(248, 248, 248)";
        ctx.lineWidth = 2;
    }

    for (var i = 0; i <= Math.ceil(areaWidth / cell); i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell + pad, areaY);
        ctx.lineTo(i * cell + pad, areaY + areaHeight);
        ctx.stroke();
    }
    for (var i = 0; i <= Math.ceil(areaHeight / cell) + 2; i++) {
        ctx.beginPath();
        ctx.moveTo(areaX, i * cell + pad);
        ctx.lineTo(areaX + areaWidth, i * cell + pad);
        ctx.stroke();
    }

    // first mouse pop
    if (!poppedInit && nol.mousePressed("left") && mouseInBox(areaX, areaY, areaWidth, areaHeight)) {
        var x = nol.mouseX;
        var y = nol.mouseY;
        var disk = new Disk(x, y);
        disk.score = 1;
        disk.popped = true;
        disk.initialValue = 1;
        disk.tween.set(incr.popSize.value);
        disks.push(disk);
        //disks.sort(function (a, b) { a.id - b.id; });
        poppedInit = true;
        firstTime = false;
        statTotalGames += 1;
    }

    ctx.restore();
    drawFrame();
    ctx.save();
    ctx.translate(quakeX, quakeY);

    var previousCount = popCount;
    var done = true;

    for (var i = 0; i < disks.length; i++) {
        var disk = disks[i];
        disk.update();

        if (disk.popped && !disk.dead) {
            done = false;
        }
    }

    if (previousCount < popCount) {
        disks.sort(function (a, b) { return a.depth - b.depth; });
    }

    ctx.restore();

    var longestChain = 0;
    for (var i = 0; i < disks.length; i++) {
        var disk = disks[i];
        if (disk.chain > longestChain) {
            longestChain = disk.chain;
        }
    }
    if (longestChain > chainRecord) {
        chainRecord = longestChain;
    }

    if (!gameOver && poppedInit && done) {
        gameOver = true;

        if (popCount === 0) {
            achNone = true;
        }

        if (popCount === incr.ballNumber.value) {
            achAll = true;
        }
    }

    if (gameOver) {
        if (playTimer < 40) {
            playTimer += 1;
        } else {
            roomFadeState = 1;
        }
    }

    // GUI

    ctx.globalAlpha = roomPlayAlpha;

    ctx.fillStyle = "rgb(230, 230, 60)";
    var balanceText = "$" + formatMoney(money);
    var balanceTextWidth = ctx.measureText(balanceText).width;
    ctx.font = "28px gamefont";
    ctx.fillText("(+ $" + formatMoney(extraMoney) + ")", 30 + balanceTextWidth + 15, 40);

    if (firstTime) {
        ctx.font = "24px gamefont, sans-serif";
        ctx.fillStyle = "white";

        if (restartedGame) {
            ctx.fillText("Welcome back! There are no upgrade limits this time.", 30, canvas.height - 20);
        } else {
            ctx.fillText("Click somewhere to pop the first ball. Each chain collision makes you money!", 30, canvas.height - 20);
        }
    } else {
        ctx.font = "24px gamefont";
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.fillText("longest chain: " + longestChain, 440, canvas.height - 20);//canvas.width - 150, 40);

        ctx.textAlign = "left";
        if (popCount === totalCount && poppedAllTimer < 10) {
            ctx.fillStyle = "rgb(220, 220, 120)";
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fillText("popped " + popCount + " out of " + totalCount, 30, canvas.height - 20);
    }

    if (!firstTime) {
        var quithover = mouseInBox(canvas.width - 120, 16, 90, 30);
        ctx.lineWidth = 2;
        ctx.fillStyle = quithover ? "rgb(130, 130, 130)" : "rgb(90, 90, 90)";
        ctx.fillRect(canvas.width - 120, 16, 90, 30);
        ctx.strokeStyle = "rgb(130, 130, 130)";
        ctx.strokeRect(canvas.width - 120, 16, 90, 30);
        ctx.fillStyle = "white";
        ctx.fillText("quit", canvas.width - 94, 40);

        if (roomFadeState === 0 && quithover && nol.mousePressed("left")) {
            roomFadeState = 1;
        }
    }

    if (!poppedInitDone && poppedInit && nol.mouseReleased("left")) {
        poppedInitDone = true;
    }

    if (level > 1) {
        var boosthover = boostAmount > 0 && mouseInBox(canvas.width - 210, canvas.height - 45, 100, 30);
        var boosthoverfloat = poppedInitDone && boostAmount > 0 && nol.mouseDown("left");
        ctx.fillStyle = boosthover ? "rgb(210, 210, 210)" : "rgb(100, 100, 100)";
        ctx.fillRect(canvas.width - 210, canvas.height - 45, 100, 30);
        ctx.fillStyle = "rgb(80, 80, 80)";
        ctx.fillRect(canvas.width - 210 + 4, canvas.height - 45 + 4, 100 - 8, 30 - 8);
        ctx.fillStyle = boosthoverfloat ? "rgb(120, 200, 200)" : "rgb(40, 140, 140)";
        ctx.fillRect(canvas.width - 210 + 4, canvas.height - 45 + 4, (100 - 8) * boostAmount/100, 30 - 8);
        ctx.strokeStyle = "rgb(10, 10, 10)";
        ctx.strokeRect(canvas.width - 210 - 2, canvas.height - 45 - 2, 100 + 4, 30 + 4);
        ctx.strokeStyle = "rgb(180, 180, 180)";
        //ctx.strokeRect(canvas.width - 210 + 4, canvas.height - 45 + 4, 100 - 8, 30 - 8);

        ctx.fillStyle = "white";
        ctx.fillText("Boost:", canvas.width - 280, canvas.height - 20);

        ctx.textAlign = "center";
        ctx.font = "18px gamefont, sans-serif";
        ctx.fillText(Math.floor(boostAmount) + "%", canvas.width - 157, canvas.height - 23);
        ctx.textAlign = "left";

        if (boosthoverfloat) {
            boostAmount -= (1 / incr.boostTime.value) / 60 * 100;
            boostAmount = Math.max(boostAmount, 0);
            boosting = true;
        } else {
            boosting = false;
        }
    }

    ctx.globalAlpha = 1;

    drawFirstTimeInstructions();

    drawTransition(function () {
        gotoRoomMenu();
    });
}

function drawFirstTimeInstructions() {
    if (!firstTime) return;

    var t = (new Date()).getTime() / 1000;
    var scale = 2 / (3 - Math.cos(2*t)) * 200;
    msx = (areaX + areaWidth) / 2 + scale * Math.cos(t);
    msy = (areaY + areaHeight) / 2 + 40 + scale * Math.sin(2*t) / 2;

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "black";
    drawMouse(msx + 4, msy + 4);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    drawMouse(msx, msy);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    drawMouse(msx, msy);
    ctx.stroke();
}

function drawMouse(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y + 20);
    ctx.lineTo(x + 9, y + 16);

    ctx.lineTo(x + 18, y + 26);
    ctx.lineTo(x + 23, y + 21);

    ctx.lineTo(x + 15, y + 12);
    ctx.lineTo(x + 20, y + 8);
    ctx.closePath();
}

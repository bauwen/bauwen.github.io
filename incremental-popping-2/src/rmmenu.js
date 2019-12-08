var infoText = "";
var nextRoom = ROOM_PLAY;
var gotoNextLevel = false;

function gotoRoomMenu() {
    room = ROOM_MENU;
    roomFadeState = 2;
    roomMenuAlpha = 0;

    if (money >= moneyForAch) {
        achMoney = true;
    }

    if (gotoNextLevel) {
        level += 1;
        gotoNextLevel = false;
        initializeGame();
    }

    saveGameState();
    submitStats();
}

function loopRoomMenu() {
    if (roomFadeState === 1) {
        roomMenuAlpha -= 0.05;
    }
    if (roomFadeState === 2) {
        roomMenuAlpha += 0.05;
    }
    roomMenuAlpha = Math.max(0, Math.min(roomMenuAlpha, 1));

    drawFrame();

    infoText = "";

    // shop

    var x = areaX + 10;
    var y = areaY + 25;

    x += 30;
    //y += 30;

    var yyv = 40;
    var padv = 50;

    if (level === 1) {
        padv = 85;
        yyv += 90;
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*0, "multiplier", 1);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*1, "ballNumber", 1);
    }
    if (level === 2) {
        padv = 65;
        yyv += 30;
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*0, "multiplier", 1);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*1, "ballNumber", 2);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*2, "popTime", 3);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*3, "boostTime", 4);
    }
    if (level >= 3) {
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*0, "multiplier", 1);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*1, "ballNumber", 2);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*2, "popTime", 3);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*3, "boostTime", 4);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*4, "popSize", 5);
        drawUpgradeProgress(x + 180, y + yyv - 24 + padv*5, "ballSpeed", 6);
    }

    // buttons
    y += 45;

    if (level > 0) {
        var ddy = 5;
        if (drawButton(x + 10, y + 260 + 30 + ddy, "ACHIEVEMENTS", 150)) {
            infoText = "Check out your achievements!";

            if (nol.mousePressed("left")) {
                nextRoom = ROOM_ACH;
                roomFadeState = 1;
            }
        }

        if (drawButton(x + 10 + 170, y + 260 + 30 + ddy, "STATISTICS", 150)) {
            infoText = "Check out the game statistics!";

            if (nol.mousePressed("left")) {
                nextRoom = ROOM_STATS;
                roomFadeState = 1;
            }
        }

        if (drawButton(x + 485 + 40, y + 260 + 30 + ddy, "LET'S PLAY!", 150)) {
            infoText = "Let's play again!";

            if (nol.mousePressed("left")) {
                nextRoom = ROOM_PLAY;
                roomFadeState = 1;
            }
        }

        if (level < 3) {
            var enoughNext = money >= moneyForNextLevel[level];
            if (drawButton(x + 485 - 130, y + 260 + 30 + ddy, "NEXT LEVEL", 150, !enoughNext)) {
                if (enoughNext) {
                    infoText = "Clear upgrades and start the next level!";
                } else {
                    infoText = "Go to the next level, costs $" + formatMoney(moneyForNextLevel[level]);
                }

                if (enoughNext && nol.mousePressed("left")) {
                    roomFadeState = 1;
                    nextRoom = ROOM_MENU;
                    gotoNextLevel = true;
                }
            }
        } else {
            var allAchsDone = true;
            for (var ai = 0; ai < achs.length; ai++) {
                if (!achs[ai].done()) {
                    allAchsDone = false;
                    break;
                }
            }

            var titlet = restartedGame ? "THANK YOU!" : "NO LIMIT MODE"
            if (drawButton(x + 485 - 130, y + 260 + 30 + ddy, titlet, 150, !allAchsDone)) {
                if (allAchsDone) {
                    if (restartedGame) {
                        infoText = "Clear progress and restart the game (again, without upgrade limits)"
                    } else {
                        //infoText = "Clear progress and restart the game. No upgrade limits this time!";
                        infoText = "Restart the game without upgrade limits, just for fun!";
                    }
                } else {
                    if (restartedGame) {
                        infoText = "Thanks for playing!  You are awesome!";
                    } else {
                        infoText = "Restart the game without upgrade limits (get all achievements first)";
                    }
                }

                if (allAchsDone && nol.mousePressed("left")) {
                    restartedGame = true;

                    firstTime = true;
                    achNone = false;
                    achAll = false;
                    achMoney = false;

                    //chainRecord = 0;
                    //moneyRecord = 0;
                    //statTotalGames = 0;
                    //statTotalMoney = 0;
                    //statTotalPops = 0;
                    //statTotalUpgrades = 0;

                    roomFadeState = 1;
                    nextRoom = ROOM_PLAY;
                    gotoNextLevel = true;
                }
            }
        }
    }

    if (level === 0) {
        if (drawBigButton(430, 260, "LET'S PLAY!", 200)) {
            infoText = "Let's play again!";
            if (nol.mousePressed("left")) {
                nextRoom = ROOM_PLAY;
                roomFadeState = 1;
            }
        }

        var enoughNext = money >= moneyForNextLevel[level];
        if (drawBigButton(180, 260, "NEXT LEVEL", 200, !enoughNext)) {
            if (enoughNext) {
                infoText = "Let's start for real!";//go to the next level!";
            } else {
                infoText = "Go to the next level, costs $" + formatMoney(moneyForNextLevel[level]);
            }

            if (enoughNext && nol.mousePressed("left")) {
                roomFadeState = 1;
                nextRoom = ROOM_MENU;
                gotoNextLevel = true;
            }
        }
    }


    // GUI

    ctx.globalAlpha = roomMenuAlpha;

    ctx.font = "24px gamefont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(infoText, 35, canvas.height - 22);

    ctx.font = "36px gamefont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.fillText(level === 0 ? "PLAY AGAIN OR PROCEED" : "Buy Upgrades", canvas.width - 30, 44);
    ctx.textAlign = "left";

    ctx.globalAlpha = 1;

    loopParticles();

    drawTransition(function () {
        if (nextRoom === ROOM_PLAY) {
            gotoRoomPlay();
        }

        if (nextRoom === ROOM_ACH) {
            gotoRoomAch();
        }

        if (nextRoom === ROOM_MENU) {
            gotoRoomMenu();
        }

        if (nextRoom === ROOM_STATS) {
            gotoRoomStats();
        }
    });
}


var pcolors = {
    "Multiplier": "rgb(0, 160, 60)",
    "Ball Number": "rgb(160, 160, 0)",
    "Pop Size": "rgb(160, 0, 60)",
    "Pop Time": "rgb(200, 100, 60)",
    "Ball Speed": "rgb(160, 0, 160)",
    "Boost Time": "rgb(0, 160, 160)"
};

function drawUpgradeProgress(x, y, name, ith) {
    var name2 = incr[name].text;

    if (ith % 2 > 0) {
        ctx.fillStyle = "rgb(240, 240, 240)";
        ctx.fillRect(x - 210, y - 8, 750, 46);
    }
    ctx.fillStyle = "black";
    ctx.font = "24px gamefont, sans-serif";

    x -= 5;

    ctx.fillText(name2, x - 160, y + 24);
    if (mouseInBox(x - 180, y - 8, 390, 46)) {
        infoText = name2 + ":  " + incr[name].info;
    }

    var n = 10;
    var pad = 20;
    var stx = x;
    var sty = y;

    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;

    var price = incr[name].getPrice();
    var value = incr[name].value;
    var nextValue = incr[name].getNextValue();
    var progressNumber = incr[name].progress;

    if (progressNumber > 1) {
        var yy = progressNumber === 10 ? 1 : 0;
        ctx.fillStyle = pcolors[name2];
        ctx.globalAlpha = progressNumber === 10 ? 0.7 : 0.2;
        ctx.fillRect(x + 1, y - yy, (Math.min(10, progressNumber) - 1) * pad, 30 + 2 * yy);
        ctx.globalAlpha = 1;
    }

    for (var i = 0; i < n; i++) {
        if (i < progressNumber) {
            ctx.fillStyle = pcolors[name2];//"rgb(0, 120, 40)";//"rgb(20, 20, 20)";
            ctx.fillRect(x + i * pad, y, 9, 30);
        } else {
            ctx.fillStyle = "rgb(200, 200, 210)";
            ctx.fillRect(x + i * pad, y, 9, 30);
        }

        if (progressNumber > 10) {
            if (i < (progressNumber - 1) % 10 + 1) {
                ctx.globalAlpha = 1;//0.7;
                var ddf = Math.floor((progressNumber - 1) / 10);
                ctx.fillStyle = ddf % 2 === 0 ? "rgb(80, 80, 80)" : "aqua";
                ctx.fillRect(x + i * pad, y, 9, 30);
            }
        }
        if (i < progressNumber) {
            ctx.globalAlpha = 1;
        } else {
            ctx.globalAlpha = 0.5;
        }
        ctx.strokeRect(x + i * pad, y, 9, 30);
        ctx.globalAlpha = 1;
    }

    var canBuy = money >= price && (restartedGame || progressNumber < 10);
    x = x + n * pad;

    ctx.fillStyle = canBuy ? "rgb(100, 250, 150)" : "rgb(160, 160, 160)";
    ctx.fillRect(x + 30, y, 30, 30);

    ctx.strokeRect(x + 30, y, 30, 30);
    ctx.lineWidth = 4;
    ctx.strokeStyle = canBuy ? "rgb(20, 20, 20)" : "rgb(100, 100, 100)";
    drawLine(x + 30 + 15, y + 5, x + 30 + 15, y + 30 - 5);
    drawLine(x + 30 + 5, y + 15, x + 30 + 30 - 5, y + 15);

    if (mouseInBox(x + 30, y, 30, 30)) {
        if (restartedGame || progressNumber < 10) {
            infoText = "Upgrade " + name2.toLowerCase() + ", costs $" + formatMoney(price);
        } else {
            var cap = name[0];
            infoText = cap + name2.slice(1).toLowerCase() + " is maxed out";
        }

        if (canBuy) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "white";
            ctx.fillRect(x + 30, y, 30, 30);
            ctx.globalAlpha = 1;

            if (nol.mousePressed("left")) {
                incr[name].increment();
                money -= price;
                statTotalUpgrades += 1;

                for (var i = 0; i < 7; i++) {
                    var px = stx + progressNumber%10 * pad + 4;
                    var py = sty + i * 6;
                    new Particle(px, py, pcolors[name2]);
                }

                saveGameState();
                submitStats();
            }
        }
    }

    // sell
    var ot = 10;
    var canSell = progressNumber > 0;
    if (canSell) {
        if (mouseInBox(x + 290 + 4 - ot, y + 4, 22, 22)) {
            ctx.globalAlpha = 1;

            var prevvalue = incr[name].getPreviousValue();
            var income = Math.ceil(incr[name].getPreviousPrice() / 10);
            //infoText = "Sell a '" + name2.toLowerCase() + "' upgrade for $" + formatMoney(income) + " (" + prevvalue + ")";
            infoText = name2 + ": sell last upgrade for $"+ formatMoney(income);

            if (nol.mousePressed("left")) {
                money += income;
                incr[name].value = prevvalue;
                incr[name].progress -= 1;

                statTotalUpgrades -= 1;
                for (var i = 0; i < 7; i++) {
                    var px = stx + (progressNumber - 1)%10 * pad + 4;
                    var py = sty + i * 6;
                    new Particle(px, py, pcolors[name2]);
                }
            }
        } else {
            ctx.globalAlpha = 0.3;
        }

        ctx.lineWidth = 2;
        ctx.fillStyle = canSell ? "rgb(250, 100, 150)" : "rgb(160, 160, 160)";
        ctx.fillRect(x + 290 + 4 - ot, y + 4, 22, 22)

        ctx.strokeStyle = "rgb(60, 10, 20)";
        ctx.strokeRect(x + 290 + 4 - ot, y + 4, 22, 22);
        ctx.lineWidth = 2;
        ctx.strokeStyle = canSell ? "rgb(20, 20, 20)" : "rgb(100, 100, 100)";
        //drawLine(x + 300 + 15, y + 5, x + 300 + 15, y + 30 - 5);
        drawLine(x + 290 + 5 + 5 - ot, y + 15, x + 290 + 30 - 5 - 5 - ot, y + 15);
    }

    ctx.globalAlpha = 1;


    var diff = nextValue - value;
    diff = Math.round(diff * 100) / 100;

    var val = Math.round(value * 100) / 100;

    if (name2 === "Pop Time") {
        val = Math.round(val / 60 * 10) / 10;
        nval = Math.round(Math.round(nextValue * 100) / 100 / 60 * 10) / 10;
        diff = Math.round((nval - val) * 100) / 100;
    }

    //ctx.font = "24px gamefont, sans-serif";
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.fillText(val, x + 100, y + 24);
    if (restartedGame || progressNumber < 10) {
        ctx.fillText("(+ " + diff  + ")", x + 175, y + 24);
    } else {
        ctx.fillText("(max)", x + 175, y + 24);
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawButton(x, y, text, width, disabled) {
    var height = 30;
    var hovering = mouseInBox(x, y, width, height);
    var pp = 3;

    if (disabled) {
        ctx.globalAlpha = 0.2//0.1;
        ctx.fillStyle = "rgb(160, 160, 160)"//"rgb(200, 190, 100)";
        ctx.fillRect(x, y, width, height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(100, 100, 100)";
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = "rgb(60, 60, 60)";
        ctx.font = "20px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, x + width / 2, y + 22);
        ctx.globalAlpha = 1;

        return mouseInBox(x, y, width, height);
    }

    if (!hovering) {
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x + pp + 1, y + pp + 1, width, height);
        ctx.globalAlpha = 1;
        pp = 0;
    } else {
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x + 4, y + 4, width, height);
        ctx.globalAlpha = 1;
        pp = 1;
    }

    ctx.fillStyle = "rgb(200, 190, 100)";
    ctx.fillRect(x + pp, y + pp, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(20, 20, 20)";
    ctx.strokeRect(x + pp, y + pp, width, height);

    if (hovering) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "yellow";
        ctx.fillRect(x + pp + 1, y + pp + 1, width - 2, height - 2);
        ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.font = "20px gamefont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x + width / 2 + pp, y + 22 + pp);

    return hovering;
}


function drawBigButton(x, y, text, width, disabled) {
    var height = 40;
    var hovering = mouseInBox(x, y, width, height);
    var pp = 3;

    if (disabled) {
        ctx.globalAlpha = 0.2//0.1;
        ctx.fillStyle = "rgb(160, 160, 160)"//"rgb(200, 190, 100)";
        ctx.fillRect(x, y, width, height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(100, 100, 100)";
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = "rgb(60, 60, 60)";
        ctx.font = "28px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, x + width / 2, y + 22 + 8);
        ctx.globalAlpha = 1;

        return mouseInBox(x, y, width, height);
    }

    if (!hovering) {
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x + pp + 1, y + pp + 1, width, height);
        ctx.globalAlpha = 1;
        pp = 0;
    } else {
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x + 4, y + 4, width, height);
        ctx.globalAlpha = 1;
        pp = 1;
    }

    ctx.fillStyle = "rgb(200, 190, 100)";
    ctx.fillRect(x + pp, y + pp, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(20, 20, 20)";
    ctx.strokeRect(x + pp, y + pp, width, height);

    if (hovering) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "yellow";
        ctx.fillRect(x + pp + 1, y + pp + 1, width - 2, height - 2);
        ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.font = "28px gamefont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x + width / 2 + pp, y + 22 + pp + 8);

    return hovering;
}

var particles = [];

function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.hspeed = Math.random() < 0.5 ? 1 : -1;
    this.vspeed = -(3 + Math.floor(Math.random() * 3));
    this.gravity = 0.5;

    particles.push(this);
}

Particle.prototype.update = function () {
    this.x += this.hspeed;
    this.y += this.vspeed;
    this.vspeed += this.gravity;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - 3, this.y - 3, 6, 6);

    if (this.y > canvas.height + 20) {
        particles.splice(particles.indexOf(this), 1);
    }
};

function loopParticles() {
    var p = particles.slice();
    for (var i = 0; i < p.length; i++) {
        var particle = p[i];
        particle.update();
    }
}

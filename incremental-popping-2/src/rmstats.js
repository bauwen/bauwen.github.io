var stats = [
    {
        text: "Number of games played: ",
        value: function () { return statTotalGames; }
    },
    {
        text: "Number of balls popped: ",
        value: function () { return statTotalPops; }
    },
    {
        text: "Number of upgrades bought: ",
        value: function () { return statTotalUpgrades; }
    },
    {
        text: "Total amount of money earned: ",
        value: function () { return statTotalMoney; },
        money: true
    },
    {
        text: "Longest chain length: ",
        value: function () { return chainRecord; }
    },
    {
        text: "Most money earned in one game: ",
        value: function () { return moneyRecord; },
        money: true
    },
    {
        text: "Current level: ",
        value: function () { return level; }
    }
];

var nextRoomStats = ROOM_MENU;

function gotoRoomStats() {
    room = ROOM_STATS;
    roomFadeState = 2;
    roomStatsAlpha = 0;
}

function loopRoomStats() {
    if (roomFadeState === 1) {
        roomStatsAlpha -= 0.05;
    }
    if (roomFadeState === 2) {
        roomStatsAlpha += 0.05;
    }
    roomStatsAlpha = Math.max(0, Math.min(roomStatsAlpha, 1));

    infoText = "";
    drawFrame();

    ctx.fillStyle = "black";
    ctx.font = "22px gamefont, sans-serif";

    var xx = 60;
    var yy = 112;
    var ss = 47;

    for (var i = 0; i < stats.length; i++) {
        var stat = stats[i];

        if (i % 2 === 0) {
            ctx.fillStyle = "rgb(240, 240, 240)";
            ctx.fillRect(xx - 30, yy - 31 + i * ss, 750, 43);
        }

        ctx.fillStyle = "rgb(40, 40, 40)";
        ctx.fillText(stat.text, xx, yy + i * ss);
        ctx.fillStyle = "black";
        var value = formatMoney(stat.value());
        if (stat.money) {
            value = "$" + value;
        }
        ctx.fillText(value, xx + 370, yy + i * ss);
    }

    /*
    var chainRecord = 0;
    var statTotalGames = 0;
    var statTotalMoney = 0;
    var statTotalPops = 0;
    var statTotalUpgrades = 0;
    */

    var x = areaX + 10 + 30;
    var y = areaY + 25 + 45;

    if (drawButton(x + 10 + 236 + 250, y + 260 + 37, "GO BACK", 180)) {
        infoText = "Go back to the upgrade menu";

        if (nol.mousePressed("left")) {
            roomFadeState = 1;
            nextRoomStats = ROOM_MENU;
        }
    }

    if (drawButton(x + 10 + 236 - 230, y + 260 + 37, "CLEAR GAME DATA", 180)) {
        infoText = "Clear all progress and restart the whole game";

        if (nol.mousePressed("left")) {
            restartedGame = false;

            firstTime = true;
            achNone = false;
            achAll = false;
            achMoney = false;

            chainRecord = 0;
            moneyRecord = 0;
            statTotalGames = 0;
            statTotalMoney = 0;
            statTotalPops = 0;
            statTotalUpgrades = 0;

            roomFadeState = 1;
            nextRoomStats = ROOM_PLAY;
            gotoNextLevel = true;
        }
    }

    ctx.globalAlpha = roomStatsAlpha;
    ctx.font = "24px gamefont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(infoText, 35, canvas.height - 22);

    ctx.font = "36px gamefont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.fillText("Game Statistics", canvas.width - 30, 44);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;

    drawTransition(function () {
        if (nextRoomStats === ROOM_PLAY) {
            gotoRoomPlay();
        } else {
            gotoRoomMenu();
        }
    });
}

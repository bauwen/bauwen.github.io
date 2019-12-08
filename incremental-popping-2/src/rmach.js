var achs = [
    {
        text: function () { return "Get every ball popped in a game."; },
        done: function () { return achAll; },
    },
    {
        text: function () { return "Get no single ball popped in a game."; },
        done: function () { return achNone; },
    },
    {
        text: function () { return "Get a chain reaction length of at least 15 in a game."; },
        done: function () { return chainRecord >= 15; },
    },
    {
        text: function () { return "Reach level 3."; },
        done: function () { return level >= 3 },
    },
    {
        text: function () { return "Reach a total of $" + formatMoney(moneyForAch) + "."; },
        done: function () { return achMoney; },
    },
    {
        text: function () { return "Max out every upgrade in the last level."; },
        done: function () { return level >= 3 && isMaxedOutEverything() },
    },
];

function isMaxedOutEverything() {
    return incr.multiplier.progress >= 10 && incr.popTime.progress >= 10 &&
        incr.popSize.progress >= 10 && incr.ballNumber.progress >= 10 &&
        incr.boostTime.progress >= 10 && incr.ballSpeed.progress >= 10;
}

var achRot = 0;

function gotoRoomAch() {
    room = ROOM_ACH;
    roomFadeState = 2;
    roomAchAlpha = 0;
}

function loopRoomAch() {
    if (roomFadeState === 1) {
        roomAchAlpha -= 0.05;
    }
    if (roomFadeState === 2) {
        roomAchAlpha += 0.05;
    }
    roomAchAlpha = Math.max(0, Math.min(roomAchAlpha, 1));

    infoText = "";
    drawFrame();

    var x = areaX + 10 + 30;
    var y = areaY + 25 + 45;

    if (drawButton(x + 10 + 236 + 5, y + 260 + 37, "GO BACK", 180)) {
        infoText = "Go back to the upgrade menu";

        if (nol.mousePressed("left")) {
            roomFadeState = 1;
        }
    }

    // achievements

    x = areaX + 10 - 20 + 3;
    y = areaY + 25 + 30 + 10;
    var dy = 54 - 5;

    ctx.font = "18px gamefont, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(20, 20, 20)";

    achRot += 0.05;
    var s = 10;

    for (var i = 0; i < achs.length; i++) {
        var ach = achs[i];

        ctx.fillStyle = ach.done() ? "rgb(230, 220, 160)" : "rgb(200, 200, 200)";
        ctx.fillRect(x + 135, y + dy * i - 28, 500, dy - 10);

        ctx.strokeRect(x + 135, y + dy * i - 28, 500, dy - 10);

        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillText(ach.text(), canvas.width / 2, y + dy * i - 2 + 1);

        /*
        if (i === 1 && mouseInBox(x + 135, y + dy * i - 28, 500, dy - 10)) {
            infoText = "Your current chain reaction record is " + chainRecord;
        }
        */

        if (ach.done()) {
            var t = s * 1.2;

            ctx.fillStyle = "rgb(230, 220, 20)";
            ctx.save();
            ctx.translate(x + 100, y + dy * i - 6);
            ctx.rotate(Math.PI / 4 - achRot);
            ctx.fillRect(-t, -t, 2 * t, 2 * t);
            ctx.strokeRect(-t, -t, 2 * t, 2 * t);
            ctx.restore();

            ctx.save();
            ctx.translate(x + 670, y + dy * i - 6);
            ctx.rotate(Math.PI / 4 + achRot);
            ctx.fillRect(-t, -t, 2 * t, 2 * t);
            ctx.strokeRect(-t, -t, 2 * t, 2 * t);
            ctx.restore();
        } else {
            ctx.fillStyle = "rgb(200, 200, 200)";
            ctx.save();
            ctx.translate(x + 100, y + dy * i - 6);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-s, -s, 2 * s, 2 * s);
            ctx.strokeRect(-s, -s, 2 * s, 2 * s);
            ctx.restore();

            ctx.save();
            ctx.translate(x + 670, y + dy * i - 6);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-s, -s, 2 * s, 2 * s);
            ctx.strokeRect(-s, -s, 2 * s, 2 * s);
            ctx.restore();
        }
    }

    ctx.globalAlpha = roomAchAlpha;
    ctx.font = "24px gamefont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(infoText, 35, canvas.height - 22);

    ctx.font = "36px gamefont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.fillText("Achievements", canvas.width - 30, 44);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;

    drawTransition(function () {
        gotoRoomMenu();
    });
}

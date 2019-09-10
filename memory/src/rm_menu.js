
var upgrades = [
    {
        title: "Get Extra Life",
        extra: function () { return "(+ 1 life)"; },
        next: function () { return LIVES_COUNT + 1; },
        current: function () {
            return LIVES_COUNT + (LIVES_COUNT === 1 ? " life" : " lives") + " to " + (LIVES_COUNT + 1) + " lives";
            //return "Current: " + LIVES_COUNT + (LIVES_COUNT === 1 ? " live" : " lives");
            //return "You currently have " + LIVES_COUNT + (LIVES_COUNT === 1 ? " live" : " lives") + ".";
        },
        update: function () {
            LIVES_COUNT += 1;
        },
        image: "live"
    },
    {
        title: "Extend Observation Time",
        extra: function () { return "(+ 0.5 seconds)"; },
        next: function () { return SHOW_TIME + 15; },
        current: function () {
            var secs = SHOW_TIME / 60;
            return secs + (secs === 1 ? " second" : " seconds") + " to " + (secs + 0.25) + (secs + 0.25 === 1 ? " second" : " seconds");
            //return "Current: " + secs + (secs === 1 ? " second" : " seconds");
            //return "You can currently look at the tiles for " + secs + (secs === 1 ? " second" : " seconds") + ".";
        },
        update: function () {
            SHOW_TIME += 15;
        },
        image: "eye"
    },
    {
        title: "Extend Selection Time",
        extra: function () { return "(+ 2 seconds)"; },
        next: function () { return GUESS_TIME + 30*4; },
        current: function () {
            var secs = GUESS_TIME / 60;
            return secs + (secs === 1 ? " second" : " seconds") + " to " + (secs + 2) + " seconds";
            //return "Current: " + secs + (secs === 1 ? " second" : " seconds");
            //return "You can currently select the tiles for " + secs + (secs === 1 ? " second" : " seconds") + ".";
        },
        update: function () {
            GUESS_TIME += 30*4;
        },
        image: "select"
    },
    {
        title: "Tolerate Extra Error",
        extra: function () { return "(+ 1 error)"; },
        next: function () { return ERROR_COUNT + 1; },
        current: function () {
            return ERROR_COUNT + (ERROR_COUNT === 1 ? " error" : " errors") + " to " + (ERROR_COUNT + 1) + " errors";
            //return "Current: " + ERROR_COUNT + (ERROR_COUNT === 1 ? " error" : " errors");
            //return "You can currently make " + ERROR_COUNT + (ERROR_COUNT === 1 ? " error" : " errors") + ".";
        },
        update: function () {
            ERROR_COUNT += 1;
        },
        image: "error"
    }
];

var transition = false;
var transRadius = canvas.width + canvas.height;
var selectedIndex = -1;
var leaving = false;

var selectTimer = 0;

var menuEase = 0;

function gotoRoomMenu() {
    room = ROOM_MENU;
    transition = true;
    leaving = false;
    selectedIndex = -1;
    selectTimer = 0;

    menuEase = 0;
    testEase = -canvas.width;

    saveGameState();
}

var testEase = -canvas.width;

function loopRoomMenu() {

    ctx.save();
    ctx.translate(-canvas.width + easeOutBack(menuEase) * canvas.width, 0);
    //ctx.translate(testEase, 0);

    ctx.fillStyle = "white";
    ctx.font = "40px gamefont, sans-serif";
    ctx.fillText("Choose Upgrade", canvas.width/2-200, 70);

    ctx.font = "24px gamefont, sans-serif";
    ctx.fillText("Level " + level, canvas.width/2+130, 70);

    for (var i = 0; i < upgrades.length; i++) {
        var upgrade = upgrades[i];
        var w = 400;
        var h = 70;
        var x = canvas.width/2-w/2;
        var y = canvas.height/2-165+10;//100;
        var s = 20;

        var yy = y + i*(h+s);

        var c1 = "white";
        var c2 = "black";

        if (selectedIndex < 0 && mouseInBox(x, yy, w, h)) {
            c1 = "black";
            c2 = "white";
            if (nol.mousePressed("left")) {
                selectedIndex = i;
                upgrade.update();
                setTimeout(function () {
                    transition = true;
                    transRadius = 0;
                    leaving = true;
                    level += 1;
                    stage = 1;
                }, 600);
            }
        }

        if (selectedIndex === i) {
            selectTimer += 1;
            if (selectTimer < 1 || (selectTimer > 5 && selectTimer < 10) || selectTimer > 15) {
                c2 = "yellow";
            }
        }

        ctx.globalAlpha = 0.15;
        ctx.fillStyle = c2;
        ctx.fillRect(x, yy, w, h);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = c2;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, yy, w, h);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        //ctx.strokeRect(x + 5, yy + 5, h - 10, h - 10);

        drawImage(upgrade.image, x + 10 + 5 + 10, yy + 10 + 5, 40);

        ctx.fillStyle = "rgb(255, 255, 180)";
        ctx.font = "24px gamefont, sans-serif";
        ctx.fillText(upgrade.title, x + h + 15 + 10, yy + 30 + 2);

        ctx.font = "17px gamefont, sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(upgrade.current(), x + h + 15 + 10, yy + 55 + 2);
        /*
        ctx.fillStyle = "rgb(180, 180, 200)";
        var m = ctx.measureText(upgrade.current() + "   ").width;
        ctx.font = "16px gamefont, sans-serif";
        ctx.fillText(upgrade.extra(), x + h + 10 + m, yy + 55 + 2);
        */
    }

    //ctx.fillRect(200 + easeInBack(nol.mouseX / canvas.width*2) * 400, 10, 4, 4);


    if (transition) {
        if (leaving) {
            transRadius += 30;
            ctx.fillStyle = backcols[level - 1][0];
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, Math.max(0, transRadius), 0, 2*Math.PI);
            ctx.fill();
            if (transRadius > canvas.width + canvas.height - 1 + 100) {
                gotoRoomLevels();
            }
        } else {
            /*
            transRadius += (0 - transRadius) / 2;
            ctx.fillStyle = "rgb(60, 60, 90)";
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, Math.max(0, transRadius), 0, 2*Math.PI);
            ctx.fill();
            if (transRadius < 0.1) {
                transition = false;
                transRadius = 0;
            }
            */
            /*testEase += (0 - testEase) / 5;
            if (Math.abs(testEase) < 0.1) {
                transition = false;
                testEase = 0;
            }*/
            menuEase += 0.04;
            if (menuEase >= 1) {
                transition = false;
            }
        }
    }

    ctx.restore();
}

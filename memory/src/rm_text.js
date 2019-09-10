
var textState = 0;
var readyClick = false;

function gotoRoomText() {
    room = ROOM_TEXT;
    readyClick = false;
}

function loopRoomText() {
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.3;
    var x = canvas.width/2;
    var y = canvas.height/2;

    if (textState === 0) {
        ctx.font = "32px gamefont, sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText("This game is about memorizing tiles.", x, y - 40);
        //ctx.fillText("Can you reach level 16?", x, y);
        //ctx.fillText("98% of people can't reach level 16!", x, y);
        ctx.fillText("Choose an upgrade after each level.", x, y);

        ctx.font = "32px gamefont, sans-serif";
        ctx.fillStyle = "white";
        //ctx.fillText("Click to start the game.", x, y + 80);
        ctx.fillText("Can you reach level 16?", x, y + 80);
        ctx.fillText("Click to start the game.", x, y + 120);
    }
    else if (textState === 1) {
        ctx.font = "64px gamefont, sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER!", x, y - 50);
        ctx.font = "40px gamefont, sans-serif";
        ctx.fillText("You reached level " + level + " stage " + stage + "", x, y);

        ctx.font = "48px gamefont, sans-serif";
        var score = level * 10 + stage;
        if (score >= highscore) {
            //ctx.fillStyle = "white";
            ctx.fillText("That's a NEW RECORD!", x, y + 54);
        } else {
            ctx.font = "24px gamefont, sans-serif";
            var l = Math.floor(highscore / 10);
            var s = highscore % 10;
            //ctx.fillStyle = "white";
            ctx.fillText("Your record is level " + l + " stage " + s, x, y + 50 - 6);
        }

        ctx.font = "32px gamefont, sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Click to restart the game.", x, y + 140);
    }
    else if (textState === 2) {
        ctx.font = "64px gamefont, sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText("CONGRATULATIONS!", x, y - 100 - 10);
        ctx.font = "36px gamefont, sans-serif";
        ctx.fillText("You completed the game!", x, y - 50 - 10);

        ctx.font = "48px gamefont, sans-serif";
        ctx.fillText("You are amazing!", x, y);

        ctx.font = "32px gamefont, sans-serif";
        ctx.fillText("Thanks for playing!", x, y + 50 - 4);

        ctx.font = "32px gamefont, sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Click to restart the game.", x, y + 150);
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = "left";

    setTimeout(function () {
        readyClick = true;
    }, 300);

    if (readyClick && nol.mousePressed("left")) {
        resetGame();
        gotoRoomLevels();
    }
}

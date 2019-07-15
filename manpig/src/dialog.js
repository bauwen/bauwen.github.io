var dialog = {
    font: "20px calibri, sans-serif",

    drawText: function (text, line) {
        var y = canvas.height - textBarHeight + 41;

        ctx.font = this.font;
        ctx.fillStyle = "white";
        ctx.fillText(text, 25, y + 30 * line);
    },

    drawFlicker: function (show) {
        if (!show) {
            return;
        }

        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillRect(canvas.width - 20, canvas.height - 20, 8, 8);
    },

    drawButton: function (text, index, total, selected) {
        var space = canvas.width - 50;
        var separation = 20;
        var width = Math.floor((space - separation * 3) / 4);

        var offset, stride;

        switch (total) {
            case 2:
                offset = 25 + space / 4 - width / 2;
                stride = space / 2;
                break;
            case 3:
                offset = 25;
                stride = (space - width) / 2 - offset;
                break;
             case 4:
                offset = 25;
                stride = width + separation;
                break;
        }

        var ww = 100;
        var x = offset + stride * index + width/2 - ww/2;
        var y = canvas.height - textBarHeight + 35 + 30 - 4;
        width = ww;

        ctx.font = "16px calibri, sans-serif";
        ctx.lineWidth = selected ? 4 : 2;
        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, width, 20);
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(text, x + width / 2, y + 15);
        ctx.textAlign = "start";

        if (selected) {
            //ctx.strokeRect(x + 2, y + 2, width - 4, 30 - 4);
            ctx.globalAlpha = 0.3;
            ctx.fillRect(x, y, width, 20);
            ctx.globalAlpha = 1;
        }

        ctx.lineWidth = 2;
    },

    say: function (text, callback) {
        //textShowing = true;
        playSound("snd_tick");

        var words = text.split(" ");
        var lines = [];
        var line = "";
        ctx.font = this.font;

        words.forEach(function (word) {
            if (ctx.measureText(line + word + " ").width > canvas.width - 50) {
                lines.push(line);
                line = "";
            }
            line += word + " ";
        });

        lines.push(line);

        var charIndex = 0;
        var lineIndex = 0;
        var timer = 0;

        gameloop.pushEvent(function () {
            for (var i = 0; i < lineIndex; i++) {
                dialog.drawText(lines[i], i);
            }

            if (lineIndex === lines.length) {
                dialog.drawFlicker(timer < 60);
                timer = (timer + 1) % 90;

                if (nol.keyboardPressed("enter")) {
                    //textShowing = false;
                    if (callback) {
                        callback();
                    }
                    return true;
                }
            } else {
                var line = lines[lineIndex];
                var index = Math.floor(charIndex);

                dialog.drawText(lines[lineIndex].slice(0, index), lineIndex);
                charIndex += textSpeed;

                if (charIndex >= line.length) {
                    lineIndex += 1;
                    charIndex = 0;
                }

                if (nol.keyboardPressed("enter")) {
                    lineIndex = lines.length;
                }
            }

            return false;
        });
    },

    askYesNo: function (question, callback) {
        //textShowing = true;
        playSound("snd_tick");

        var charIndex = 0;
        var choice = 0;

        gameloop.pushEvent(function () {
            var index = Math.floor(charIndex);

            dialog.drawText(question.slice(0, index), 0);

            if (charIndex < question.length) {
                charIndex += textSpeed;

                if (nol.keyboardPressed("enter")) {
                    charIndex = question.length;
                }
            } else {
                if (nol.keyboardPressed("left") && choice == 1) {
                    choice = 0;
                }

                if (nol.keyboardPressed("right") && choice == 0) {
                    choice = 1;
                }

                dialog.drawButton("Yes", 0, 2, choice == 0);
                dialog.drawButton("No", 1, 2, choice == 1);

                if (nol.keyboardPressed("enter")) {
                    //textShowing = false;
                    if (callback) {
                        callback(choice == 0);
                    }
                    return true;
                }

                if (nol.keyboardPressed("backspace") || nol.keyboardPressed("escape")) {
                    textShowing = false;
                    if (callback) {
                        callback(false);
                    }
                    return true;
                }
            }

            return false;
        });
    }
};

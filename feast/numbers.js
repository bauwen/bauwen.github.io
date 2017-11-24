addModule("numbers", function () {
    
    function strokeSquare(x, y, width) {
        ctx.strokeRect(x - width / 2, y - width / 2, width, width);
    }
    
    function fillSquare(x, y, width) {
        ctx.fillRect(x - width / 2, y - width / 2, width, width);
    }
    
    function iterateDigits(number, callback) {
        if (number === 0) {
            callback(0);
            return;
        }
        
        while (number !== 0) {
            callback(number % 10);
            number = Math.floor(number / 10);
        }
    }
    
    function MapperDigitSumGreater(object) {
        this.message = "If the sum of the digits is > " + object + ", classify as ";
        this.check = function (number) {
            var sum = 0;
            iterateDigits(number, function (digit) {
                sum += digit;
            });
            return sum > object;
        };
    }
    
    function MapperDigitSumLess(object) {
        this.message = "If the sum of the digits is < " + object + ", classify as ";
        this.check = function (number) {
            var sum = 0;
            iterateDigits(number, function (digit) {
                sum += digit;
            });
            return sum < object;
        };
    }
    
    function MapperDigitProductGreater(object) {
        this.message = "If the product of the digits is > " + object + ", classify as ";
        this.check = function (number) {
            var product = 1;
            iterateDigits(number, function (digit) {
                product *= digit;
            });
            return product > object;
        };
    }
    
    function MapperDigitProductLess(object) {
        this.message = "If the product of the digits is < " + object + ", classify as ";
        this.check = function (number) {
            var product = 1;
            iterateDigits(number, function (digit) {
                product *= digit;
            });
            return product < object;
        };
    }
    
    function MapperOdd() {
        this.message = "Classify odd numbers as ";
        this.check = function (number) {
            return number % 2 === 1;
        };
    }
    
    function MapperEven() {
        this.message = "Classify even numbers as ";
        this.check = function (number) {
            return number % 2 === 0;
        };
    }
    
    function MapperSameDigit() {
        this.message = "If the number contains a digit twice, classify as ";
        this.check = function (number) {
            var digits = {};
            iterateDigits(number, function (digit) {
                if (digits[digit]) {
                    return true;
                }
                digits[digit] = true;
            });
            return false;
        };
    }
    
    function MapperSpecificDigit(object) {
        this.message = "If the number contains a " + object + ", classify as ";
        this.check = function (number) {
            iterateDigits(number, function (digit) {
                if (object === digit) {
                    return true;
                }
            });
            return false;
        };
    }
    
    function createRandomMapper() {
        var list = [
            { Mapper: MapperDigitSumGreater, range: [10, 18] },
            { Mapper: MapperDigitSumLess, range: [8, 16] },
            { Mapper: MapperDigitProductGreater, range: [50, 500] },
            { Mapper: MapperDigitProductLess, range: [10, 50] },
            { Mapper: MapperOdd, range: null },
            { Mapper: MapperEven, range: null },
            { Mapper: MapperSameDigit, range: null },
            { Mapper: MapperSpecificDigit, range: [0, 9] }
        ];
        
        var element = list[Math.floor(Math.random() * list.length)];
        var object = undefined;
        
        if (element.range) {
            var from = element.range[0];
            var to = element.range[1];
            object = from + Math.floor(Math.random() * (to - from + 1));
        }
        
        return new element.Mapper(object);
    }
    
    function drawRangeButton(xx, yy, shx, shy, range) {
        var from = ranges[range][0];
        var to = ranges[range][1];
        //var textRange = from + " - " + to;
        var tt = tween[range].get();
        var yyy = yy + 10;
        
        ctx.font = "bold " + (20 + tt) + "px verdana";
        
        ctx.fillStyle = shadowColor;
        //ctx.fillText(textRange, xx + shx, yy + shy);
        ctx.fillText(from, xx, yyy - 25);
        ctx.fillText("-", xx, yyy);
        ctx.fillText(to, xx, yyy + 25);
        
        ctx.fillStyle = neutralColor;
        //ctx.fillText(textRange, xx, yy);
        ctx.fillText(from, xx, yyy - 25);
        ctx.fillText("-", xx, yyy);
        ctx.fillText(to, xx, yyy + 25);
        
        ctx.globalAlpha = fadeAlpha[range];
        ctx.fillStyle = fadeColor[range];
        fillSquare(xx, yy, buttonWidth);
        ctx.globalAlpha = 1;
        
        if (mousePressed("Left") && mouseInBox(xx - buttonWidth / 2, yy - buttonWidth / 2, buttonWidth, buttonWidth)) {
            tween[range].set(-10);
            onRange(range);
        }
    }
    
    function onRange(type) {
        if (timerCount > totalCount) {
            return;
        }
        
        var from = ranges[type][0];
        var to = ranges[type][1];
        var correct = false;
        
        if (matchNumber !== currentNumber) {
            if (mappedNumber >= 0 && mapper.check(currentNumber)) {
                correct = from <= mappedNumber && mappedNumber <= to;
                
                if (!correct) {
                    console.log("WRONG: ", type, currentNumber, matchNumber, mapper.message, mappedNumber);
                }
            }
            else {
                correct = from <= currentNumber && currentNumber <= to;
            }
        }
        
        fadeAlpha[type] = 0.4;
        fadeColor[type] = correct ? "lime" : "red";
        
        if (correct) {
            POINTS_CORRECT += 1;
        } else {
            POINTS_WRONG += 1;
        }
        
        onTimer();
    }
    
    function onMatch() {
        if (timerCount > totalCount) {
            return;
        }
        
        var correct = matchNumber === currentNumber;
        
        matchFadeAlpha = 0.4;
        matchFadeColor = correct ? "lime" : "red";
        
        if (correct) {
            POINTS_CORRECT += 1;
        } else {
            POINTS_WRONG += 1;
        }
        
        onTimer();
    }
    
    function onTimer() {
        timer = timerInterval;
        timerCount += 1;
        
        var number;
        
        do {
            number = Math.floor(Math.random() * 1000);
        } while (number === currentNumber);
        
        currentNumber = number;
        
        if (timerCount === 3 || (timerCount > 3 && Math.random() < 0.5)) {
            if (Math.random() < 0.2) {
                matchNumber = currentNumber;
            }
            else if (Math.random() < 0.2) {
                matchNumber = -1;
            }
            else {
                matchNumber = Math.floor(Math.random() * 1000);
            }
        }
        
        if (timerCount === 7 || (timerCount > 7 && Math.random() < 0.3)) {
            if (Math.random() < 0.2) {
                mappedNumber = -1;
                mapper = null;
            }
            else {
                mappedNumber = Math.floor(Math.random() * 1000);
                mapper = createRandomMapper();
            }
        }
    }
    
    var POINTS_CORRECT = 0;
    var POINTS_WRONG = 0;
    var POINTS_TOOLATE = 0;
    
    var ROOM_STATE = 1;
    
    var currentNumber = -1;
    var matchNumber = -1;
    var mappedNumber = -1;
    var mapper = null;
    
    var timer = 0;
    var timerCount = 0;
    var timerInterval = 60 * 3;
    var totalCount = 40;
    
    var ranges = [
        [0, 249],
        [250, 499],
        [500, 749],
        [750, 999]
    ];
    
    var tween = [
        new Tween(0.83, 10),
        new Tween(0.83, 10),
        new Tween(0.83, 10),
        new Tween(0.83, 10)
    ];
    
    var fadeAlpha = [
        0,
        0,
        0,
        0
    ];
    
    var fadeColor = [
        "red",
        "red",
        "red",
        "red"
    ];
    
    var matchTween = new Tween(0.83, 10);
    var matchFadeAlpha = 0;
    var matchFadeColor = "red";
    
    var backgroundColor = "rgb(50, 50, 50)";
    var neutralColor = "rgb(180, 180, 180)";
    var shadowColor = "rgb(40, 40, 40)";
    
    var buttonWidth = 100;
    
    var restartButton = new Button();
    var menuButton = new Button();
    
    restartButton.width = 250;
    restartButton.height = 60;
    menuButton.width = restartButton.width;
    menuButton.height = restartButton.height;
    
    onTimer();
    
    function updatePlay() {
        var xx;
        var yy;
        
        var buttonMargin = canvas.width / 8;
        var totalWidth = canvas.width - 2 * buttonMargin;
        var buttonCount = 5;
        var dx = buttonWidth + (totalWidth - buttonCount * buttonWidth) / (buttonCount - 1);
        var shx = 4;
        var shy = 4;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        timer -= 1;
        if (timer <= 0) {
            POINTS_TOOLATE += 1;
            onTimer();
        }
        
        if (timerCount > totalCount & timer < timerInterval - 20) {
            ROOM_STATE = 2;
            return;
        }
        
        for (var i = 0; i < fadeAlpha.length; i++) {
            fadeAlpha[i] = Math.max(0, fadeAlpha[i] - 0.05);
        }
        
        matchFadeAlpha = Math.max(0, matchFadeAlpha - 0.05);
        
        
        // current
        
        xx = buttonWidth / 2 + buttonMargin + buttonWidth / 4;
        yy = buttonWidth / 2 + canvas.height / 6;
        
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = "rgb(120, 120, 120)";
        
        fillSquare(xx, yy, buttonWidth * 1.5);
        strokeSquare(xx, yy, buttonWidth * 1.5);
        
        ctx.font = "bold 42px verdana";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        
        if (timerCount <= totalCount) {
            ctx.fillStyle = shadowColor;
            ctx.fillText(currentNumber, xx + shx * 1.5, yy + shy * 1.5);
            ctx.fillStyle = neutralColor;
            ctx.fillText(currentNumber, xx, yy);
        }
        
        
        // match
        
        xx = buttonWidth / 2 + buttonMargin + 4 * dx - buttonWidth / 4;
        yy = buttonWidth / 2 + canvas.height / 6;
        
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = "black";
        
        fillSquare(xx, yy, buttonWidth * 1.5);
        strokeSquare(xx, yy, buttonWidth * 1.5);
        
        ctx.font = "bold 42px verdana";
        
        if (matchNumber >= 0 && timerCount <= totalCount) {
            ctx.fillStyle = shadowColor;
            ctx.fillText(matchNumber, xx + shx * 1.5, yy + shy * 1.5);
            ctx.fillStyle = neutralColor;
            ctx.fillText(matchNumber, xx, yy);
        }
        
        ctx.textBaseline = "alphabetic";
        
        
        // text
        
        var text = "";
        
        if (mappedNumber >= 0 && timerCount <= totalCount) {
            text = mapper.message + mappedNumber;
        }
        
        xx = buttonMargin;
        yy = canvas.height / 2 + 20;
        
        ctx.font = "bold 20px verdana";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgb(50, 50, 50)";
        ctx.fillText(text, xx + shx / 2, yy + shy / 2);
        ctx.fillStyle = "rgb(220, 220, 220)";
        ctx.fillText(text, xx, yy);
        
        
        // buttons
        
        xx = buttonWidth / 2 + buttonMargin;
        yy = buttonWidth / 2 + canvas.height / 3 * 2;
        
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        
        for (var i = 0; i < buttonCount; i++) {
            fillSquare(xx + dx * i, yy, buttonWidth);
            strokeSquare(xx + dx * i, yy, buttonWidth);
        }
        
        ctx.textAlign = "center";
        
        drawRangeButton(xx, yy, shx, shy, 0);
        xx += dx;
        drawRangeButton(xx, yy, shx, shy, 1);
        xx += dx;
        drawRangeButton(xx, yy, shx, shy, 2);
        xx += dx;
        drawRangeButton(xx, yy, shx, shy, 3);
        xx += dx;
        
        var tt = matchTween.get();
        ctx.font = "bold " + (20 + tt) + "px verdana";
        ctx.fillStyle = shadowColor;
        ctx.fillText("MATCH", xx + shx, yy + 10 + shy);
        ctx.fillStyle = neutralColor;
        ctx.fillText("MATCH", xx, yy + 10);
        
        ctx.globalAlpha = matchFadeAlpha;
        ctx.fillStyle = matchFadeColor;
        fillSquare(xx, yy, buttonWidth);
        ctx.globalAlpha = 1;
        
        if (mousePressed("Left") && mouseInBox(xx - buttonWidth / 2, yy - buttonWidth / 2, buttonWidth, buttonWidth)) {
            matchTween.set(-10);
            onMatch();
        }
        
        if (keyboardPressed("Escape")) {
            ROOM_STATE = 2;
            return;
        }
    }
    
    function updateStats() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var xx;
        var yy;
        
        var cc = timerCount - 1;
        var p = cc === 0 ? "\\(°^°)/" : Math.round(POINTS_CORRECT / cc * 100) + "%";
        
        xx = canvas.width / 7;
        yy = canvas.height / 4;
        
        ctx.textAlign = "left";
        ctx.font = "bold 72px verdana";
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillText(p === "100%" ? "YAY! 100%!" : "GAME OVER!", xx, yy - 10);
        
        //xx = canvas.width / 2 + 40 + 125;
        xx = canvas.width / 7 + 125;
        yy = canvas.height / 1.5 - 120 + 210;
        
        ctx.textAlign = "center";
        ctx.font = "bold 64px verdana";
        ctx.fillStyle = "yellow";
        ctx.fillText(p, xx, yy);
        
        /*
        ctx.fillStyle = "rgb(120, 120, 120)";
        ctx.font = "22px verdana";
        ctx.fillText("Best: " + "73%", xx + 5, yy + 40);
        */
        
        //xx = canvas.width / 2 + 40;
        xx = canvas.width / 7;
        yy = canvas.height / 1.5 - 120 - 130;
        
        restartButton.x = xx;
        restartButton.y = yy + 180;
        restartButton.text = "PLAY AGAIN";
        restartButton.draw();
        
        menuButton.x = xx;
        menuButton.y = yy + 100;
        menuButton.text = "GO TO MENU";
        menuButton.draw();
        
        //xx = canvas.width / 7;
        xx = canvas.width / 2 + 40;
        yy = canvas.height / 1.5 - 120 + 20;
        
        ctx.textAlign = "left";
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.font = "bold 32px verdana";
        ctx.fillStyle = "rgb(160, 230, 160)";
        ctx.fillText("Correct: ", xx, yy - 20);
        ctx.fillText(POINTS_CORRECT + "/" + cc, xx + 160, yy - 20);
        ctx.fillStyle = "rgb(230, 160, 160)";
        ctx.fillText("Wrong: ", xx, yy + 85);
        ctx.fillText(POINTS_WRONG + "/" + cc, xx + 160, yy + 85);
        ctx.fillStyle = "rgb(230, 160, 230)";
        ctx.fillText("Missed: ", xx, yy + 190);
        ctx.fillText(POINTS_TOOLATE + "/" + cc, xx + 160, yy + 190);
        
        if (mousePressed("Left")) {
            if (restartButton.isHovering()) {
                ROOM_STATE = 1;
                timerCount = 0;
                POINTS_CORRECT = 0;
                POINTS_WRONG = 0;
                POINTS_TOOLATE = 0;
                currentNumber = 0;
                matchNumber = -1;
                mappedNumber = -1;
                mapper = null;
                onTimer();
            }
            else if (menuButton.isHovering()) {
                setModule("menu");
            }
        }
        
        if (keyboardPressed("Escape")) {
            setModule("menu");
        }
    }
    
    return function () {
        switch (ROOM_STATE) {
            case 1:
                updatePlay();
                break;
                
            case 2:
                updateStats();
                break;
        }
    };
    
});
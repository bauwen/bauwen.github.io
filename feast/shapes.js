addModule("shapes", function () {
    
    function strokeTriangle(x, y, radius) {
        var s = radius * Math.sqrt(2) / 2;
        
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y + s);
        ctx.lineTo(x - s, y + s);
        ctx.closePath();
        ctx.stroke();
    }
    
    function fillTriangle(x, y, radius) {
        var s = radius * Math.sqrt(2) / 2;
        
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y + s);
        ctx.lineTo(x - s, y + s);
        ctx.closePath();
        ctx.fill();
    }
    
    function strokeCircle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    function fillCircle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    function strokeSquare(x, y, width) {
        ctx.strokeRect(x - width / 2, y - width / 2, width, width);
    }
    
    function fillSquare(x, y, width) {
        ctx.fillRect(x - width / 2, y - width / 2, width, width);
    }
    
    function strokeDiamond(x, y, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x + radius, y);
        ctx.lineTo(x, y + radius);
        ctx.lineTo(x - radius, y);
        ctx.closePath();
        ctx.stroke();
    }
    
    function fillDiamond(x, y, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x + radius, y);
        ctx.lineTo(x, y + radius);
        ctx.lineTo(x - radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawShapeButton(xx, yy, shx, shy, shape) {
        var tt = tween[shape].get();
        ctx.fillStyle = shadowColor;
        fillShape[shape](xx + shx, yy + shy, buttonWidth / denominator[shape] + tt);
        ctx.fillStyle = neutralColor;
        fillShape[shape](xx, yy, buttonWidth / denominator[shape] + tt);
        
        ctx.globalAlpha = fadeAlpha[shape];
        ctx.fillStyle = fadeColor[shape];
        fillSquare(xx, yy, buttonWidth);
        ctx.globalAlpha = 1;
        
        if (mousePressed("Left") && mouseInBox(xx - buttonWidth / 2, yy - buttonWidth / 2, buttonWidth, buttonWidth)) {
            tween[shape].set(-20);
            onShape(shape);
        }
    }
    
    function onShape(type) {
        if (timerCount > totalCount) {
            return;
        }
        
        var correct = false;
        
        if (currentMatchType !== currentShapeType || currentMatchColor !== currentShapeColor) {
            if (currentNewShape) {
                if (currentOldShape) {
                    correct = currentOldShape !== type && 
                             (currentNewShape !== type || currentOldShape === currentShapeType || currentShapeType === type) &&
                             (currentNewShape === type || currentShapeType === type);
                }
                else if (currentObjectColor) {
                    correct = currentShapeType === type || currentNewShape === type && currentShapeColor === currentObjectColor;
                }
            } else {
                correct = currentShapeType === type;
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
        
        var correct = currentMatchType === currentShapeType && currentMatchColor === currentShapeColor;
        
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
        
        var type;
        
        do {
            type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        } while (type === currentShapeType);
        
        currentShapeType = type;
        currentShapeColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];
        
        if (timerCount === 3 || (timerCount > 3 && Math.random() < 0.5)) {
        //if (Math.random() < 0.5) {
            if (Math.random() < 0.3) {
                currentMatchType = currentShapeType;
                currentMatchColor = currentShapeColor;
            }
            else if (Math.random() < 0.2) {
                currentMatchType = "";
                currentMatchColor = "";
            } else {
                currentMatchType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                currentMatchColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];
            }
        }
        
        if (timerCount === 6 || (timerCount > 7 && Math.random() < 0.3)) {
        //if (Math.random() < 0.3) {
            if (Math.random() < 0.2) {
                currentObjectColor = "";
                currentOldShape = "";
                currentNewShape = "";
            } else {
                currentNewShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                
                if (Math.random() < 0.5) {
                    currentObjectColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];
                    currentOldShape = "";
                } else {
                    do {
                        type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                    } while (type === currentNewShape);
                    
                    currentOldShape = type;
                    currentObjectColor = "";
                }
            }
        }
    }
    
    var POINTS_CORRECT = 0;
    var POINTS_WRONG = 0;
    var POINTS_TOOLATE = 0;
    
    var ROOM_STATE = 1;
    
    var shapeTypes = [
        "triangle",
        "circle",
        "square",
        "diamond"
    ];
    
    var shapeColors = [
        "red",
        "lime",
        "cyan",
        "yellow",
        //"orange",
        //"fuchsia"
    ];
    
    var currentShapeType = shapeTypes[0];
    var currentShapeColor = shapeColors[0];
    var currentMatchType = "";
    var currentMatchColor = "";
    var currentObjectColor = "";
    var currentOldShape = "";
    var currentNewShape = "";
    
    var timer = 0;
    var timerCount = 0;
    var timerInterval = 60 * 3;
    var totalCount = 40;
    
    var colorName = {
        "red": "red",
        "lime": "green",
        "cyan": "blue",
        "yellow": "yellow",
        "orange": "orange",
        "fuchsia": "purple"
    };
    
    var fillShape = {
        "triangle": fillTriangle,
        "circle": fillCircle,
        "square": fillSquare,
        "diamond": fillDiamond
    };
    
    var strokeShape = {
        "triangle": strokeTriangle,
        "circle": strokeCircle,
        "square": strokeSquare,
        "diamond": strokeDiamond
    };
    
    var denominator = {
        "triangle": 3,
        "circle": 4,
        "square": 2.3,
        "diamond": 3.5
    };
    
    var tween = {
        "triangle": new Tween(0.8, 10),
        "circle": new Tween(0.8, 10),
        "square": new Tween(0.8, 10),
        "diamond": new Tween(0.8, 10)
    };
    
    var fadeAlpha = {
        "triangle": 0,
        "circle": 0,
        "square": 0,
        "diamond": 0
    };
    
    var fadeColor = {
        "triangle": "red",
        "circle": "red",
        "square": "red",
        "diamond": "red"
    };
    
    var matchTween = new Tween(0.83, 10);
    var matchFadeAlpha = 0;
    var matchFadeColor = "red";
    
    var backgroundColor = "rgb(50, 50, 50)";
    var neutralColor = "rgb(180, 180, 180)";
    var shadowColor = "rgb(40, 40, 40)";
    
    var buttonWidth = 100;
    
    var restartButton = new Button();
    var menuButton = new Button();
    
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
        
        for (var i = 0; i < shapeTypes.length; i++) {
            var shapeType = shapeTypes[i];
            fadeAlpha[shapeType] = Math.max(0, fadeAlpha[shapeType] - 0.05);
        }
        
        matchFadeAlpha = Math.max(0, matchFadeAlpha - 0.05);
        
        
        // current
        
        xx = buttonWidth / 2 + buttonMargin + buttonWidth / 4;
        yy = buttonWidth / 2 + canvas.height / 6;
        
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = "rgb(120, 120, 120)";
        
        fillSquare(xx, yy, buttonWidth * 1.5);
        strokeSquare(xx, yy, buttonWidth * 1.5);
        
        if (timerCount <= totalCount) {
            ctx.fillStyle = shadowColor;
            fillShape[currentShapeType](xx + shx * 1.5, yy + shy * 1.5, buttonWidth / denominator[currentShapeType] / 0.75);
            ctx.fillStyle = currentShapeColor;
            fillShape[currentShapeType](xx, yy, buttonWidth / denominator[currentShapeType] / 0.75);
        }
        
        
        // match
        
        xx = buttonWidth / 2 + buttonMargin + 4 * dx - buttonWidth / 4;
        yy = buttonWidth / 2 + canvas.height / 6;
        
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = "black";
        
        fillSquare(xx, yy, buttonWidth * 1.5);
        strokeSquare(xx, yy, buttonWidth * 1.5);
        
        if (currentMatchType && currentMatchColor && timerCount <= totalCount) {
            ctx.fillStyle = shadowColor;
            fillShape[currentMatchType](xx + shx * 1.5, yy + shy * 1.5, buttonWidth / denominator[currentMatchType] / 0.8);
            ctx.fillStyle = currentMatchColor;
            fillShape[currentMatchType](xx, yy, buttonWidth / denominator[currentMatchType] / 0.8);
        }
        
        // text
        
        var text = "";
        
        if (currentNewShape && timerCount <= totalCount) {
            if (currentOldShape) {
                text = "Classify " + currentOldShape + "s as " + currentNewShape + "s";
            }
            else if (currentObjectColor) {
                text = "Classify " + colorName[currentObjectColor] + " objects as " + currentNewShape + "s";
            }
        }
        
        xx = buttonMargin;
        yy = canvas.height / 2 + 20;
        
        ctx.font = "bold 30px verdana";
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
        
        drawShapeButton(xx, yy, shx, shy, "triangle");
        xx += dx;
        drawShapeButton(xx, yy, shx, shy, "circle");
        xx += dx;
        drawShapeButton(xx, yy, shx, shy, "square");
        xx += dx;
        drawShapeButton(xx, yy, shx, shy, "diamond");
        xx += dx;
        
        var tt = matchTween.get();
        ctx.font = "bold " + (20 + tt) + "px verdana";
        ctx.textAlign = "center";
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
        
        xx = canvas.width / 7;
        yy = canvas.height / 4;
        
        ctx.textAlign = "left";
        ctx.font = "bold 72px verdana";
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillText("GAME OVER", xx, yy - 10);
        
        //xx = canvas.width / 2 + 40 + 125;
        xx = canvas.width / 7 + 125;
        yy = canvas.height / 1.5 - 120 + 210;
        
        var cc = timerCount - 1;
        
        var p = cc === 0 ? "\\(°^°)/" : Math.round(POINTS_CORRECT / cc * 100) + "%";
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
                currentMatchType = "";
                currentMatchColor = "";
                currentObjectColor = "";
                currentOldShape = "";
                currentNewShape = "";
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
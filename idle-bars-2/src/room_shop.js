var SPACE_MUSIC = 0;
var SPACE_DARK  = 1;
var SPACE_VIS   = 2;
var space = SPACE_VIS;

var visPrice   = 200000;
var musicPrice = 2000000;
var darkPrice  = 6000000;

function loopRoomShop() {
    
    var x = 25;
    var y = 90;
    
    drawSpaceButton(100 - 40, 120, 200, "Bar Skins");
    drawSpaceButton(300 +  0, 120, 200, "Music Track");
    drawSpaceButton(500 + 40, 120, 200, "Dark Mode");
    
    switch (space) {
        case SPACE_MUSIC:
            drawMusicSpace();
            break;
            
        case SPACE_DARK:
            drawDarkSpace();
            break;
            
        case SPACE_VIS:
            drawVisualisationSpace();
            break;
    }
    
    // menu buttons
    drawMenuButton(canvas.width - 180, y + 360, 150, "GO BACK", function () {
        if (mousePressed) {
            gotoRoom(ROOM_BARS);
        }
        infoText = "Return to the bars";
    });
}

function drawSpaceButton(x, y, width, text) {
    setFont(22);
    
    var height = 50;
    var state = text === "Music Track" ? SPACE_MUSIC : (text === "Dark Mode" ? SPACE_DARK : SPACE_VIS);
    
    //ctx.fillStyle = "yellow";
    //ctx.fillRect(x, y, width, height);
    
    var hover = false;
    
    if (mouseInBox(x, y, width, height)) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, width, height);
        ctx.globalAlpha = 1;
        
        if (mousePressed) {
            space = state;
        }
        
        hover = true;
        
        switch (state) {
            case SPACE_MUSIC:
                infoText = "Change the music of the game";
                break;
            case SPACE_DARK:
                infoText = "Change the visualisation mode of the game";
                break;
            case SPACE_VIS:
                infoText = "Change the visual skins of the bars";
                break;
        }
    }
    
    if (!hover && space !== state) {
        ctx.fillStyle = "rgb(240, 255, 255)";
        ctx.fillRect(x, y, width, height);
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(120, 180, 180)";
        ctx.strokeRect(x, y, width, height);
        
        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(100, 160, 160)";
        ctx.fillText(text, x + width/2, y + 21 + 12);
        
        ctx.strokeStyle = darkMode ? "rgb(80, 80, 80)" : "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
    } else {
        ctx.fillStyle = "rgb(150, 210, 210)";
        ctx.fillRect(x, y, width, height);
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(90, 140, 140)";
        ctx.strokeRect(x, y, width, height);
        
        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(10, 40, 40)";
        ctx.fillText(text, x + width/2, y + 21 + 12);
        
        ctx.strokeStyle = darkMode ? "rgb(80, 80, 80)" : "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
    }
}

function drawMusicSpace() {
    setFont(20);
    ctx.textAlign = "left";
    
    ctx.fillStyle = darkMode ? "white" : "black";
    ctx.fillText("Change the music of the game:", 100 + 50, 250);
    
    ctx.strokeStyle = "rgb(160, 160, 160)";
    
    var df = 80;
    drawRadioButton(150 + df, 320, defaultTrack, function () { setMusicTrack(true); });
    drawRadioButton(150 + df, 380, !defaultTrack, function () { if (shoppedItem1) { setMusicTrack(false); } });
    
    ctx.fillText("The default music track", 185 + df, 320 + 6);
    
    if (!shoppedItem1) {
        drawMenuButton(190 + df, 365, 200, "BUY NEW TRACK", function () {
            if (mousePressed && money >= musicPrice) {
                shoppedItem1 = true;
                setMusicTrack(false);
                money -= musicPrice;
            }
            
            infoText = "Buy the new music track: costs $" + formatMoney(musicPrice);
        });
    } else {
        ctx.fillText("The new music track", 185 + df, 380 + 6);
    }
}

function drawDarkSpace() {
    setFont(20);
    ctx.textAlign = "left";
    
    ctx.fillStyle = darkMode ? "white" : "black";
    ctx.fillText("Change the visualisation mode of the game:", 100 + 50, 250);
    
    ctx.strokeStyle = "rgb(160, 160, 160)";
    
    var df = 80;
    drawRadioButton(150 + df, 320, !darkMode, function () { darkMode = false; });
    drawRadioButton(150 + df, 380, darkMode, function () { if (shoppedItem2) { darkMode = true; } });
    
    ctx.fillText("Light Mode", 185 + df, 320 + 6);
    
    if (!shoppedItem2) {
        drawMenuButton(190 + df, 365, 200, "BUY DARK MODE", function () {
            if (mousePressed && money >= darkPrice) {
                shoppedItem2 = true;
                darkMode = true;
                money -= darkPrice;
            }
            
            infoText = "Buy the dark mode: costs $" + formatMoney(darkPrice);
        });
    } else {
        ctx.fillText("Dark Mode", 185 + df, 380 + 6);
    }
}

function drawVisualisationSpace() {
    setFont(20);
    ctx.textAlign = "left";
    
    ctx.fillStyle = darkMode ? "white" : "black";
    ctx.fillText("Change the visual skins of the bars:", 100 + 50, 250);
    
    ctx.strokeStyle = "rgb(160, 160, 160)";
    
    var df = 80;
    drawRadioButton(150 + df, 320, defaultSkin, function () { defaultSkin = true; });
    drawRadioButton(150 + df, 380, !defaultSkin, function () { if (shoppedItem3) { defaultSkin = false; } });
    
    ctx.fillText("The default skins", 185 + df, 320 + 6);
    
    if (!shoppedItem3) {
        drawMenuButton(190 + df, 365, 200, "BUY NEW SKINS", function () {
            if (mousePressed && money >= visPrice) {
                shoppedItem3 = true;
                defaultSkin = false;
                money -= visPrice;
            }
            
            infoText = "Buy the new skins: costs $" + formatMoney(visPrice);
        });
    } else {
        ctx.fillText("The new skins", 185 + df, 380 + 6);
    }
}

function drawRadioButton(x, y, on, callback) {
    var radius = 8;
    
    ctx.strokeStyle = "rgb(160, 160, 160)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, 0, 2*Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = darkMode ? "white" : "black";
    
    if (on) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.fill();
    } else {
        if (mouseInBox(x - radius - 8, y - radius - 8, 2*radius + 16 + 20, 2*radius + 16)) {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2*Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            if (mousePressed) {
                callback();
            }
        }
    }
}

function setMusicTrack(track) {
    if (!music1Loaded || !music2Loaded) {
        return;
    }
    
    if (track) {
        music2.pause();
        if (MUSIC) { music1.volume = 1; }
        music1.currentTime = 1;
        music1.play();
    } else {
        music1.pause();
        if (MUSIC) { music2.volume = 1; }
        music2.currentTime = 1;
        music2.play();
    }
    
    defaultTrack = track;
}

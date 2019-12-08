var darkMode = false;
var infoText = "";
var previousTime = 0;

var ROOM_BARS  = 0;
var ROOM_STATS = 1;
var ROOM_ACHS  = 2;
var ROOM_SHOP  = 3;
var room = ROOM_BARS;
var nextRoom = ROOM_BARS;

var transitionState = 0;
var transitionValue = 0;

var imageOverlayLoaded = 0;
var imageOverlay = new Image();
imageOverlay.src = "src/img_overlay.png";
imageOverlay.addEventListener("load", function () { imageOverlayLoaded += 1; });
var imageOverlayInverted = new Image();
imageOverlayInverted.src = "src/img_overlay_inverted.png";
imageOverlayInverted.addEventListener("load", function () { imageOverlayLoaded += 1; });

var MUSIC = true;
var musicClicked = false;
var music1Loaded = false;
var music1 = new Audio();
music1.src = "src/music1.mp3";
music1.oncanplaythrough = function () {
    if (!music1Loaded && (music1.paused || music1.currentTime === 0)) {
        music1Loaded = true;
        music1.loop = true;
        music1.volume = 0;
    }
};
var music2Loaded = false;
var music2 = new Audio();
music2.src = "src/music2.mp3";
music2.oncanplaythrough = function () {
    if (!music2Loaded && (music2.paused || music2.currentTime === 0)) {
        music2Loaded = true;
        music2.loop = true;
        music2.volume = 0;
    }
};

window.addEventListener("mousedown", function (event) {
    if (musicClicked) return;
    
    if (defaultTrack) {
        if (music1Loaded) {
            musicClicked = true;
            if (MUSIC) { music1.volume = 1; }
            music1.play();
        }
    } else {
        if (music2Loaded) {
            musicClicked = true;
            if (MUSIC) { music2.volume = 1; }
            music2.play();
        }
    }
});

function toggleMusic() {
    if (!music1Loaded || !music2Loaded) {
        return;
    }
    
    music1.volume = 0;
    music2.volume = 0;
    
    MUSIC = !MUSIC;
    if (MUSIC) {
        if (defaultTrack) {
            music1.volume = 1;
        } else {
            music2.volume = 1;
        }
    }
}

function mainloop() {
    infoText = "";
    
    updateBars();
    
    ctx.fillStyle = darkMode ? "black" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (imageOverlayLoaded >= 2) {
        ctx.globalAlpha = darkMode ? 0.25 : 0.05;
        ctx.drawImage(darkMode ? imageOverlayInverted : imageOverlay, 0, 0, imageOverlay.naturalWidth, imageOverlay.naturalHeight, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
    }
    
    switch (room) {
        case ROOM_BARS:
            loopRoomBars();
            break;
            
        case ROOM_STATS:
            loopRoomStats();
            break;
            
        case ROOM_ACHS:
            loopRoomAchs();
            break;
            
        case ROOM_SHOP:
            loopRoomShop();
            break;
    }
    
    if (money >= 10000000000) {
        reachedMoney = true;
    }
    if (money >= 1000000) {
        reachedMoney2 = true;
    }
    
    var count = 0;
    for (var i = 0; i < achs.length; i++) {
        if (achs[i].done()) {
            count += 1;
        }
    }
    numberOfAchievements = count;
    
    ctx.fillStyle = darkMode ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)";
    ctx.fillRect(0, 0, canvas.width, 70);
    
    if (infoText !== "") {
        ctx.fillStyle = darkMode ? "rgb(50, 50, 50)" : "rgb(230, 230, 230)";
    }
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40 + 1);
    
    ctx.textAlign = "left";
    ctx.fillStyle = darkMode ? "rgb(200, 200, 200)" : "rgb(60, 60, 60)";
    
    // money
    setFont(36);
    ctx.fillText("$" + formatMoney(money), 30, 50);
    
    // money per time unit
    fillsPerSecond = 0;
    for (var i = 0; i < bars.length; i++) {
        var bar = bars[i];
        if (!bar.unlocked) {
            continue;
        }
        fillsPerSecond += bar.fillSpeed * bar.fillValue * prestige;
    }
    
    setFont(16);
    ctx.textAlign = "right";
    ctx.fillText("(+ $" + formatMoney(Math.ceil(fillsPerSecond)) + "/sec)", canvas.width - 160, 41);
    
    // prestige button
    
    var prestigePrice = prestigeFormula();
    if (prestigePrice <= money) {
        ctx.fillStyle = darkMode ? "rgb(50, 40, 30)" : "rgb(240, 230, 220)";
    } else {
        ctx.fillStyle = darkMode ? "rgb(50, 50, 50)" : "rgb(230, 230, 230)";
    }
    ctx.fillRect(canvas.width - 130, 20, 100, 30);
    
    ctx.strokeStyle = "rgb(160, 160, 160)";
    ctx.fillStyle = "rgb(160, 160, 160)";
    ctx.lineWidth = 2;
    
    var prestigePrice = prestigeFormula();
    if (prestigePrice <= money) {
        ctx.strokeStyle = "rgb(180, 140, 120)";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = 4;
    }
    
    ctx.strokeRect(canvas.width - 130, 20, 100, 30);
    
    setFont(16);
    ctx.textAlign = "center";
    ctx.fillText("PRESTIGE", canvas.width - 80, 41);
    
    if (mouseInBox(canvas.width - 130, 20, 100, 30)) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "white";
        ctx.fillRect(canvas.width - 130, 20, 100, 30);
        ctx.globalAlpha = 1;
        
        if (mouseReleased && prestigePrice <= money) {
            prestige *= 2;
            initialize();
        }
        
        infoText = "Restart the game and double the fill speed: costs $" + formatMoney(prestigePrice);
    }
    
    ctx.lineWidth = 2;
    
    // transition
    drawTransition(function () {
        room = nextRoom;
    });
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = darkMode ? "rgb(100, 100, 100)" : "rgb(190, 190, 190)";
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.lineTo(canvas.width, 70);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 40 - 1);
    ctx.lineTo(canvas.width, canvas.height - 40 - 1);
    ctx.stroke();
    
    // music icon
    drawMusicIcon(canvas.width - 40, canvas.height - 33);
    if (mouseInBox(canvas.width - 40, canvas.height - 33, 30, 30)) {
        if (mousePressed) {
            toggleMusic();
        }
        infoText = (MUSIC ? "Mute" : "Unmute") + " the game music";
    }
    
    // info text
    setFont(16);
    ctx.textAlign = "left";
    ctx.fillStyle = darkMode ? "rgb(200, 200, 200)" : "rgb(60, 60, 60)";
    ctx.fillText(infoText, 30, canvas.height - 14);
    
    // update time
    previousTime = performance.now();
}

function setFont(size, bold) {
    ctx.font = (bold ? "bold " : "") + size + "px gamefont, sans-serif";
}

function drawMenuButton(x, y, width, text, callback) {
    var height = 30;
    
    ctx.globalAlpha = darkMode ? 0.5 : 0.2;
    ctx.fillStyle = darkMode ? "white" : "black";
    ctx.fillRect(x + 3, y + 3, width, height);
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = "rgb(200, 190, 80)";
    ctx.fillRect(x, y, width, height);
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = darkMode ? "rgb(240, 240, 240)" : "black";
    ctx.strokeRect(x, y, width, height);
    
    setFont(20);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(text, x + width/2, y + 22);
    
    if (mouseInBox(x, y, width, height)) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, width, height);
        ctx.globalAlpha = 1;
        callback();
    }
}

function drawAmountButton(x, y, width, text) {
    var height = 30;
    var state = text === "ONE" ? BUY_ONE : (text === "TEN" ? BUY_TEN : BUY_MAX);
    
    //ctx.fillStyle = "yellow";
    //ctx.fillRect(x, y, width, height);
    
    var hover = false;
    
    if (mouseInBox(x, y, width, height)) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, width, height);
        ctx.globalAlpha = 1;
        
        if (mousePressed) {
            buyState = state;
        }
        
        hover = true;
        
        switch (state) {
            case BUY_ONE:
                infoText = "Buy always one";
                break;
            case BUY_TEN:
                infoText = "Buy always at most 10";
                break;
            case BUY_MAX:
                infoText = "Buy always the maximum amount";
                break;
        }
    }
    
    if (!hover && buyState !== state) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(160, 160, 160)";
        ctx.strokeRect(x, y, width, height);
        
        setFont(16);
        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(160, 160, 160)";
        ctx.fillText(text, x + width/2, y + 21);
    } else {
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillRect(x, y, width, height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(120, 120, 120)";
        ctx.strokeRect(x, y, width, height);
        
        setFont(16);
        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(120, 120, 120)";
        ctx.fillText(text, x + width/2, y + 21);
    }
}

function drawMusicIcon(x, y) {
    var size = 28;
    var cx = x + size / 2 + 4;
    var cy = y + size / 2;
    
    ctx.fillStyle = "rgb(190, 190, 190)";
    ctx.strokeStyle = ctx.fillStyle;
    
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 10 + 2 + 2 + 1);
    ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 2 + 1);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 10 + 1 + 2 + 1);
    ctx.lineTo(cx - 8, cy - 10 + 14 + 1 + 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cx - 8 + 12 - 1, cy - 10 + 1 + 1);
    ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 14 + 1 + 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx - 11 + 1, cy + 6 - 1, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cx - 11 + 12 + 1 - 1, cy + 6 - 1, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - 3, cy + 1 - 1, size / 2 - 4 + 2 + 2, 0, 2 * Math.PI);
    ctx.stroke();
    
    if (!MUSIC) {
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx - 11, cy + 11);
        ctx.lineTo(cx + 8, cy - 8);
        ctx.stroke();
    }
}

function updateBars() {
    var deltaTime = performance.now() - previousTime;
    //console.log(deltaTime);
    //if (deltaTime > 20) console.log("many seconds passed:", deltaTime / 1000);
    var wentAway = deltaTime > 30;
    var height = 200;
        
    for (var i = 0; i < 7; i++) {
        var bar = bars[i];
        
        if (bar.unlocked) {
            //if (wentAway) {
                bar.value += height * bar.fillSpeed * prestige * deltaTime / 1000;
            /*} else {
                bar.value += height * bar.fillSpeed * prestige / 60;
            }*/
        }
        
        if (bar.value > height) {
            var fills = Math.floor(bar.value / height);
            var revenue = fills * bar.fillValue;
            money += revenue;
            totalRevenue[i] += revenue;
            
            bar.value %= height;
            bar.alpha = 1;
        }
        
        if (bar.alpha > 0) {
            bar.alpha -= 0.06;
        }
        
        
    }
}

function formatMoney(value) {
    var val = "" + value;
    var str = "";
    var k = 0;
    
    for (var i = val.length - 1; i >= 0; i--) {
        var c = val.charAt(i);
        str = c + str;
        k += 1;
        if (k === 3 && i > 0) {
            str = "," + str;
            k = 0;
        }
    }
    
    return str;
}

function drawTransition(callback) {
    if (transitionState === 0) return;
    
    var sx = transitionState === 1 ? canvas.width + 1 - transitionValue : -transitionValue;
    
    ctx.fillStyle = darkMode ? "rgb(30, 30, 30)" : "rgb(230, 230, 230)";
    ctx.fillRect(sx, 70, canvas.width, canvas.height - 40 - 70);
    transitionValue += (canvas.width + 30 - transitionValue) / 6;
    
    if (transitionValue > canvas.width) {
        var prev = transitionState;
        transitionState = (transitionState + 1) % 3;
        transitionValue = 0;
        if (prev === 1) {
            callback();
        }
    }
}

function gotoRoom(r) {
    nextRoom = r;
    transitionValue = 0;
    transitionState = 1;
}

function saveGameState() {
    if (!hasLocalStorage) {
        return;
    }
    
    var data = {
        money: money,
        prestige: prestige,
        bars: bars,
        
        reachedMoney: reachedMoney,
        reachedMoney2: reachedMoney2,
        levelUpOnce: levelUpOnce,
        levelUpThrice: levelUpThrice,
        buyFourth: buyFourth,
        buyLast: buyLast,
        totalRevenue: totalRevenue,
        totalUpgrades: totalUpgrades,
        shoppedItem1: shoppedItem1,
        shoppedItem2: shoppedItem2,
        shoppedItem3: shoppedItem3,
        defaultTrack: defaultTrack,
        defaultSkin: defaultSkin,
        darkMode: darkMode,
        
        music: MUSIC,
    };
    
    var text = JSON.stringify(data);
    localStorage.setItem("idlebars2_save", text);
}

function loadGameState() {
    if (!hasLocalStorage) {
        return;
    }
    
    var text = localStorage.getItem("idlebars2_save");
    if (!text) {
        return;
    }
    
    try {
        var data = JSON.parse(text);
        money = data.money;
        prestige = data.prestige;
        dbars = data.bars;
        
        for (var i = 0; i < bars.length; i++) {
            dbars[i].fillSpeedInit = bars[i].fillSpeedInit;
            dbars[i].fillValueInit = bars[i].fillValueInit;
            dbars[i].fillSpeedFormula = bars[i].fillSpeedFormula;
            dbars[i].fillSpeedPriceFormula = bars[i].fillSpeedPriceFormula;
            dbars[i].fillValueFormula = bars[i].fillValueFormula;
            dbars[i].fillValuePriceFormula = bars[i].fillValuePriceFormula;
        }
        
        bars = dbars;
        
        reachedMoney = data.reachedMoney;
        reachedMoney2 = data.reachedMoney2;
        levelUpOnce = data.levelUpOnce;
        levelUpThrice = data.levelUpThrice;
        buyFourth = data.buyFourth;
        buyLast = data.buyLast;
        totalRevenue = data.totalRevenue;
        totalUpgrades = data.totalUpgrades;
        shoppedItem1 = data.shoppedItem1;
        shoppedItem2 = data.shoppedItem2;
        shoppedItem3 = data.shoppedItem3;
        defaultTrack = data.defaultTrack;
        defaultSkin = data.defaultSkin;
        darkMode = data.darkMode;
        
        MUSIC = data.music;
    } catch (err) {
        // unable to load data
    }
}
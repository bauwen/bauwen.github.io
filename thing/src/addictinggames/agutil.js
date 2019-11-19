var addictingGames = {};
addictingGames.images = {};
addictingGames.pload = -20;
addictingGames.afterSplash = false;

window.addEventListener("load", function () {
    addictingGames.loadImage("mark_black", "src/addictinggames/ag_mark_black.png");
    addictingGames.loadImage("mark_red", "src/addictinggames/ag_mark_red.png");
    addictingGames.loadImage("mark_white", "src/addictinggames/ag_mark_white.png");

    addictingGames.loadImage("tab_hor", "src/addictinggames/ag_tab.png");
    addictingGames.loadImage("tab_ver", "src/addictinggames/ag_tab_side.png");

    addictingGames.loadImage("logo", "src/addictinggames/ag_logo.png");
});

addictingGames.imagesLoaded = function () {
    return addictingGames.images["mark_black"] && addictingGames.images["mark_red"] &&
        addictingGames.images["mark_white"] && addictingGames.images["tab_hor"] &&
        addictingGames.images["tab_ver"] && addictingGames.images["logo"];
};

addictingGames.loadImage = function (name, src) {
    var image = new Image();
    image.onload = function () {
        addictingGames.images[name] = image;
    }
    image.src = src;
};

addictingGames.drawImage = function (name, x, y, s) {
    if (!addictingGames.images[name]) return;
    var img = addictingGames.images[name];
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    ctx.drawImage(img, 0, 0, w, h, x, y, w * s, h * s);
};

addictingGames.drawImageClickable = function (name, x, y, s, mouseX, mouseY, mousePressed, noeffect) {
    if (!addictingGames.images[name]) return;
    var img = addictingGames.images[name];
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var ws = w * s;
    var hs = h * s;
    var hover = x <= mouseX && mouseX < x + ws && y <= mouseY && mouseY < y + hs;

    if (name === "tab_hor") {
        hover = x <= mouseX && mouseX < x + ws && y + 30 <= mouseY && mouseY < y + hs;
    }
    if (name === "logo") {
        hover = x <= mouseX && mouseX < x + ws && y <= mouseY && mouseY < y + hs;
    }

    if (hover && !noeffect) {
        es = 0.05;
        s += es;
        x -= w * es / 2;
        y -= h * es / 2;
    }

    ctx.drawImage(img, 0, 0, w, h, x, y, w * s, h * s);

    /*if (hover && mousePressed) {
        window.open(deviceMobile ? "https://m.addictinggames.com/" : "https://www.addictinggames.com/", "_blank");
    }*/
    CLICKABLE_PRESENT = hover;
};

addictingGames.drawSplash = function (s, mousePressed, callback) {
    var image = "logo";
    if (!addictingGames.images[image]) return;

    var img = addictingGames.images[image];
    var w = img.naturalWidth;
    var h = img.naturalHeight;

    var ww = w * s;
    var hh = h * s;
    var xx = canvas.width / 2 - ww / 2;
    var yy = canvas.height / 2 - hh / 2;

    addictingGames.pload += 0.5;

    if (addictingGames.pload > 130 && !addictingGames.afterSplash) {
        addictingGames.afterSplash = true;
        callback();
    }

    ctx.drawImage(img, 0, 0, w, h, xx, yy - 50, ww, hh);

    yy += 80;
    var lw = 3;
    var lp = 5;
    var p = Math.min(Math.max(0, addictingGames.pload), 100) / 100;

    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.fillRect(xx, yy + 80, ww, 20);
    ctx.fillStyle = "black";
    ctx.fillRect(xx + lw, yy + 80 + lw, ww - lw * 2, 20 - lw * 2);
    ctx.fillStyle = "red";
    ctx.fillRect(xx + lp, yy + 80 + lp, (ww - lp * 2) * p, 20 - lp * 2);
};

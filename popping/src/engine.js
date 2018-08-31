var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

var disks = [];

var WIDTH_RATIO = 1;
var HEIGHT_RATIO = 1;
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var mousePressed = false;
var mouseReleased = false;

var hasLocalStorage = false;

try {
    hasLocalStorage = !!localStorage.getItem;
} catch (err) {
    hasLocalStorage = false;
}

var banner;
var deviceOS = "";
var browserSafari = false;
var deviceMobile = false;

function detectEnv() {
    var ua = navigator.userAgent;
    
    if (/Android/.test(ua)) {
        deviceOS = "android";
    }
    else if (/iP[ao]d|iPhone/i.test(ua)) {
        deviceOS = "ios";
    }
    else if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
        deviceOS = "windowsphone";
    }
    else if (/Linux/.test(ua)) {
        deviceOS = "linux";
    }
    else if (/Mac OS/.test(ua)) {
        deviceOS = "macos";
    }
    else if (/Windows/.test(ua)) {
        deviceOS = "windows";
    }
    
    if (/Safari/.test(ua) && !(/Chrome\/(\d+)/.test(ua)) && (deviceOS === "ios" || deviceOS === "macos")) {
        console.log("safari detected");
        browserSafari = true;
    }
    
    deviceMobile = deviceOS === "ios" || deviceOS === "android" || deviceOS === "windowsphone";
    if (deviceOS) console.log(deviceOS + " detected");
}

detectEnv();

function getLocalStorage(name) {
    if (!hasLocalStorage) {
        return undefined;
    }
    
    return localStorage.getItem(name);
}
    
function setLocalStorage(name, value) {
    if (!hasLocalStorage) {
        return;
    }
    
    localStorage.setItem(name, value);
}

 function removeLocalStorage(name) {
    if (!hasLocalStorage) {
        return;
    }
    
    localStorage.removeItem(name);
}

var touchDetected = false;

var mouseDownHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = event.button;
    
    event.preventDefault();
    
    mouseX = Math.floor((event.pageX - window.scrollX - rect.left) * WIDTH_RATIO);
    mouseY = Math.floor((event.pageY - window.scrollY - rect.top) * HEIGHT_RATIO);
    
    if (button === 0 && !mouseDown) {
        mouseDown = true;
        mousePressed = true;
    }
}

var mouseUpHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = event.button;
    
    event.preventDefault();
    
    if (button === 0 && mouseDown) {
        mouseDown = false;
        mouseReleased = true;
    }
}

var mouseMoveHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    
    mouseX = Math.floor((event.pageX - window.scrollX - rect.left) * WIDTH_RATIO);
    mouseY = Math.floor((event.pageY - window.scrollY - rect.top) * HEIGHT_RATIO);
}

var touchStartHandler = function (event) {
    if (!touchDetected) {
        window.removeEventListener("mousedown", mouseDownHandler, false);
        window.removeEventListener("mouseup", mouseUpHandler, false);
        window.removeEventListener("mousemove", mouseMoveHandler, false);
        touchDetected = true;
    }
    
    var rect = canvas.getBoundingClientRect();
    var button = 0;
    var touch = event.touches[0];
    
    event.stopPropagation();
    event.preventDefault();
    
    mouseX = Math.floor((touch.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO);
    mouseY = Math.floor((touch.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO);
    
    if (button === 0 && !mouseDown) {
        mouseDown = true;
        mousePressed = true;
    }
};

var touchEndHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = 0;
    
    if (button === 0 && mouseDown) {
        mouseDown = false;
        mouseReleased = true;
    }
};

var touchCancelHandler = touchEndHandler;

var touchMoveHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var touch = event.touches[0];
    
    event.stopPropagation();
    event.preventDefault();
    
    mouseX = Math.floor((touch.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO);
    mouseY = Math.floor((touch.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO);
};

window.addEventListener("mousedown", mouseDownHandler, false);
window.addEventListener("mouseup", mouseUpHandler, false);
window.addEventListener("mousemove", mouseMoveHandler, false);
window.addEventListener("touchstart", touchStartHandler, false);
window.addEventListener("touchend", touchEndHandler, false);
window.addEventListener("touchcancel", touchCancelHandler, false);
window.addEventListener("touchmove", touchMoveHandler, false);

function updateInput() {
    mousePressed = false;
    mouseReleased = false;
}

function resizeHandler() {//return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var c = canvas;
    var sw = c.width;
    var sh = c.height;
    
    var r = w / h;
    var sr = sw / sh;
    
    if (r > sr) {
        sw *= h / sh;
        sh = h;
    } else {
        sh *= w / sw;
        sw = w;
    }
    
    WIDTH_RATIO = c.width / sw;
    HEIGHT_RATIO = c.height / sh;
    
    c.style.width = Math.floor(sw) + "px";
    c.style.height = Math.floor(sh) + "px";
    document.getElementById("top-div").style.marginTop = Math.floor((h - sh) / 2) + "px";
};

function drawMusicIcon(x, y) {
    var size = 32;
    var cx = x + size / 2 + 4;
    var cy = y + size / 2;
    
    ctx.lineWidth = 3;
    
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
    ctx.arc(cx - 11 + 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cx - 11 + 12 + 1 - 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx - 3, cy + 1 - 1, size / 2 - 4 + 2 + 2, 0, 2 * Math.PI);
    ctx.stroke();
    
    if (!MUSIC) {
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - 13, cy + 13);
        ctx.lineTo(cx + 10, cy - 10);
        ctx.stroke();
    }
}

function toggleMusic() {
    if (!musicLoaded) {
        return;
    }
    
    MUSIC = !MUSIC;
    if (MUSIC) {
        music.volume = 1;
    } else {
        music.volume = 0;
    }
    
    saveGameState();
}

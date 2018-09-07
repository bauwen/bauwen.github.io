var keysDown = {};
var keysPressed = {};
var keysReleased = {};

var translateKeyCode = function (code) {
    var s = code + "";
    
    switch (s) {
        case "8": return "Backspace";
        case "9": return "Tab";
        case "13": return "Enter";
        case "16": return "Shift";
        case "17": return "Control";
        case "18": return "Alt";
        case "27": return "Escape";
        case "32": return " ";
        case "37": return "ArrowLeft";
        case "38": return "ArrowUp";
        case "39": return "ArrowRight";
        case "40": return "ArrowDown";
        // ... digits ...
        case "65": return "a";
        case "66": return "b";
        case "67": return "c";
        case "68": return "d";
        case "69": return "e";
        case "70": return "f";
        case "71": return "g";
        case "72": return "h";
        case "73": return "i";
        case "74": return "j";
        case "75": return "k";
        case "76": return "l";
        case "77": return "m";
        case "78": return "n";
        case "79": return "o";
        case "80": return "p";
        case "81": return "q";
        case "82": return "r";
        case "83": return "s";
        case "84": return "t";
        case "85": return "u";
        case "86": return "v";
        case "87": return "w";
        case "88": return "x";
        case "89": return "y";
        case "90": return "z";
    }
    
    return s;
};

var keyDownHandler = function (event) {
    var key = translateKeyCode(event.which || event.keyCode || event.key);
    
    event.preventDefault();
    
    if (!keysDown[key]) {
        keysDown[key] = true;
        keysPressed[key] = true;
    }
};

var keyUpHandler = function (event) {
    var key = translateKeyCode(event.which || event.keyCode || event.key);
    
    event.preventDefault();
    
    if (keysDown[key]) {
        keysDown[key] = false;
        keysReleased[key] = true;
    }
}

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);

var buttonNames = ["Left", "Middle", "Right"];
var buttonIndices = {"Left": 0, "Middle": 1, "Right": 2};
var buttonsDown = [false, false, false];
var buttonsPressed = [false, false, false];
var buttonsReleased = [false, false, false];
var mouseX = 0;
var mouseY = 0;

var touchDetected = false;

var mouseDownHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = event.button;
    
    event.preventDefault();
    
    mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
    mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    
    mouseX = Math.floor(mouseX);
    mouseY = Math.floor(mouseY);
    
    if (!buttonsDown[button]) {
        buttonsDown[button] = true;
        buttonsPressed[button] = true;
    }
};

var mouseUpHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = event.button;
    
    event.preventDefault();
    
    if (buttonsDown[button]) {
        buttonsDown[button] = false;
        buttonsReleased[button] = true;
    }
};

var mouseMoveHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    
    event.preventDefault();
    
    mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
    mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    
    mouseX = Math.floor(mouseX);
    mouseY = Math.floor(mouseY);
};

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
    
    mouseX = (touch.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
    mouseY = (touch.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    
    mouseX = Math.floor(mouseX);
    mouseY = Math.floor(mouseY);
    
    if (!buttonsDown[button]) {
        buttonsDown[button] = true;
        buttonsPressed[button] = true;
    }
};

var touchEndHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = 0;
    
    event.stopPropagation();
    event.preventDefault();
    
    if (buttonsDown[button]) {
        buttonsDown[button] = false;
        buttonsReleased[button] = true;
    }
};

var touchCancelHandler = touchEndHandler;

var touchMoveHandler = function (event) {
    var rect = canvas.getBoundingClientRect();
    var touch = event.touches[0];
    
    event.stopPropagation();
    event.preventDefault();
    
    mouseX = (touch.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
    mouseY = (touch.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    
    mouseX = Math.floor(mouseX);
    mouseY = Math.floor(mouseY);
};

window.addEventListener("mousedown", mouseDownHandler, { passive: false });
window.addEventListener("mouseup", mouseUpHandler, { passive: false });
window.addEventListener("mousemove", mouseMoveHandler, { passive: false });
window.addEventListener("touchstart", touchStartHandler, { passive: false });
window.addEventListener("touchend", touchEndHandler, { passive: false });
window.addEventListener("touchcancel", touchCancelHandler, { passive: false });
window.addEventListener("touchmove", touchMoveHandler, { passive: false });

var preventHandler = function (event) { event.preventDefault(); };

canvas.addEventListener("mousedown", preventHandler, { passive: false });
canvas.addEventListener("mouseup", preventHandler, { passive: false });
canvas.addEventListener("mousemove", preventHandler, { passive: false });
canvas.addEventListener("touchstart", preventHandler, { passive: false });
canvas.addEventListener("touchend", preventHandler, { passive: false });
canvas.addEventListener("touchcancel", preventHandler, { passive: false });
canvas.addEventListener("touchmove", preventHandler, { passive: false });

var resizeHandler = function () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var c = ctx.canvas; 
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

var banner;
var deviceOS = "";
var browserSafari = false;
var deviceMobile = false;
var WIDTH_RATIO = 1;
var HEIGHT_RATIO = 1;
var internetExplorer = false;
var msEdge = false;

function detectEnv() {
    var ua = navigator.userAgent;
    
    if (!!document.documentMode) {
        internetExplorer = true;
        console.log("internet explorer detected");
    }
    
    if (!internetExplorer && !!window.StyleMedia) {
        msEdge = true;
        console.log("microsoft edge detected");
    }
    
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

var gameImages = {};
var gameSounds = {};
var gameMusic = {};

function loadAssets(assets, body) {
    var imageAssets = [];
    var soundAssets = [];
    var musicAssets = [];
    var fontAssets = [];
    var progress = body.progress || function (p) {};
    var finish = body.finish || function () {};
    var channelCount = 4;
    var fontTimeout = 200;
    
    if (assets.images) {
        for (var name in assets.images) {
            if (assets.images.hasOwnProperty(name)) {
                imageAssets.push(name, assets.images[name]);
            }
        }
    }
    
    if (assets.sounds) {
        for (var name in assets.sounds) {
            if (name !== "channels" && assets.sounds.hasOwnProperty(name)) {
                soundAssets.push(name, assets.sounds[name]);
            }
        }
        
        if (assets.sounds.channels) {
            channelCount = assets.sounds.channels;
        }
    }
    
    if (assets.music) {
        for (var name in assets.music) {
            if (assets.music.hasOwnProperty(name)) {
                musicAssets.push(name, assets.music[name]);
            }
        }
    }
    
    if (assets.fonts) {
        for (var name in assets.fonts) {
            if (name !== "timeout" && assets.fonts.hasOwnProperty(name)) {
                fontAssets.push(name, assets.fonts[name]);
            }
        }
        
        if (assets.fonts.timeout) {
            fontTimeout = assets.fonts.timeout;
        }
    }
    
    var total = (imageAssets.length + soundAssets.length + musicAssets.length) / 2 + (fontAssets.length > 0 ? 1 : 0);
    var count = 0;
    
    function loadImage(index) {
        if (index >= imageAssets.length) {
            loadSound(0);
            return;
        }
        
        var image = new Image();
        image.src = imageAssets[index + 1];
        image.onload = function () {
            gameImages[imageAssets[index]] = image;  
            count += 1;
            progress(count / total);    
            window.setTimeout(loadImage, 1, index + 2);
        };
    }
    
    function loadSound(index) {
        if (deviceMobile) {
            count += soundAssets.length / 2;
            progress(count / total);
            window.setTimeout(function () { loadMusic(0); }, 1000);
            return;
        }
        
        if (index >= soundAssets.length) {
            loadMusic(0);
            return;
        }
        
        var channels = [];
        
        function loadChannel(i) {
            if (i >= channelCount) {
                gameSounds[soundAssets[index]] = {
                    channels: channels,
                    currentChannel: 0
                };
                count += 1;
                progress(count / total);
                window.setTimeout(loadSound, 100, index + 2);
                return;
            }
            
            var channel = new Audio();
            channel.src = soundAssets[index + 1];
            channel.onloadeddata = function () {
                channels.push(channel);
                //loadChannel(i + 1);
            };
            channel.preload = "auto";
            
            setTimeout(function () {
                loadChannel(i + 1);
            }, 3);
        }
        
        loadChannel(0);
    }
    
    function loadMusic(index) {
        if (deviceMobile) {
            count += musicAssets.length / 2;
            progress(count / total);
            window.setTimeout(finish, 1000);
            return;
        }
        
        if (index >= musicAssets.length) {
            window.setTimeout(finish, 1000);
            return;
        }
        
        var audio = new Audio();
        audio.src = musicAssets[index + 1];
        if (internetExplorer || msEdge) {
            setTimeout(function () {
                gameMusic[musicAssets[index]] = audio;
                count += 1;
                progress(count / total);    
                window.setTimeout(loadMusic, 1, index + 2);
            }, 1000);
        } else {
            audio.onloadeddata = function () {
                gameMusic[musicAssets[index]] = audio;
                count += 1;
                progress(count / total);    
                window.setTimeout(loadMusic, 1, index + 2);
            };
        }
        audio.preload = "auto";
    }
    
    function loadFonts() {
        if (fontAssets.length === 0) {
            loadImage(0);
            return;
        }
        
        var css = document.createElement("style");
        
        for (var index = 0; index < fontAssets.length; index += 2) {
            css.innerHTML += "@font-face { font-family: " + fontAssets[index] + "; src: url(" + fontAssets[index + 1] + "); }";
        }
        
        document.head.appendChild(css);
        window.setTimeout(function () {
            count += 1;
            progress(count / total);
            loadImage(0);
        }, fontTimeout);
    }
    
    progress(0);
    loadFonts();
};

function playSound(name) {
    if (!SOUND) return;
    
    var sound = gameSounds[name];
    
    if (!sound || sound.channels.length === 0) {
        return;
    }
    
    var channel = sound.channels[sound.currentChannel];
    
    sound.currentChannel = (sound.currentChannel + 1) % sound.channels.length;
    channel.loop = false;
    channel.play();
}

function stopMusic() {
    if (deviceMobile) {
        return;
    }
    
    var music;
    music = gameMusic["mus_lvl1"];
    music.pause();
    music.currentTime = 0;
    music = gameMusic["mus_lvl2"];
    music.pause();
    music.currentTime = 0;
    music = gameMusic["mus_lvl3"];
    music.pause();
    music.currentTime = 0;
}

window.addEventListener("resize", resizeHandler);
window.addEventListener("load", resizeHandler);

var hasLocalStorage = false;
try {
    hasLocalStorage = !!localStorage.getItem;
} catch (err) {
    hasLocalStorage = false;
}

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

function HSVToRGB(hsv) {
    var h = hsv.h;
    var s = hsv.s;
    var v = hsv.v;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    var r, g, b;

    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }

    return {
        r: Math.floor(255 * r),
        g: Math.floor(255 * g),
        b: Math.floor(255 * b)
    };
}

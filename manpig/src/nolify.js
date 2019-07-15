/*
API:
    [overridable] loop : function ()

    hasLocalStorage : boolean
    getLocalStorage(string) : string
    setLocalStorage(string, string)
    removeLocalStorage(string)

    mouseX : number
    mouseY : number
    mouseDown(string) : boolean
    mousePressed(string) : boolean
    mouseReleased(string) : boolean

    keyboardDown(string) : boolean
    keyboardPressed(string) : boolean
    keyboardReleased(string) : boolean

    resizeNone()
    resizeFill()
    resizeStretch()
    resizeAspectRatio()
*/
var nolify = function (canvas) {
    var api = {};

    var widthRatio = 1;
    var heightRatio = 1;

    if (!canvas.hasAttribute("tabindex")) {
        canvas.setAttribute("tabindex", "1");
    }
    canvas.addEventListener("click", function () {
        canvas.focus();
    });
    canvas.focus();

    var loop = function () {
        if (api.loop) {
            api.loop();
        }
        keyboardUpdate();
        mouseUpdate();
        requestAnimationFrame(loop);
    };
    window.addEventListener("load", loop);


    // local storage

    api.hasLocalStorage = false;

    try {
        api.hasLocalStorage = !!localStorage.getItem;
    } catch (err) {
        api.hasLocalStorage = false;
    }

    api.getLocalStorage = function (name) {
        if (api.hasLocalStorage) {
            return localStorage.getItem(name);
        } else {
            return undefined;
        }
    };

    api.setLocalStorage = function (name, value) {
        if (api.hasLocalStorage) {
            localStorage.setItem(name, value);
        }
    };

     api.removeLocalStorage = function (name) {
        if (api.hasLocalStorage) {
            localStorage.removeItem(name);
        }
    };


    // mouse

    api.mouseX = 0;
    api.mouseY = 0;

    api.mouseDown = function (button) {
        return !!buttonsDown[button];
    };

    api.mousePressed = function (button) {
        return !!buttonsPressed[button];
    };

    api.mouseReleased = function (button) {
        return !!buttonsReleased[button];
    };

    var mouseUpdate = function () {
        buttonsPressed["left"] = false;
        buttonsPressed["middle"] = false;
        buttonsPressed["right"] = false;
        buttonsReleased["left"] = false;
        buttonsReleased["middle"] = false;
        buttonsReleased["right"] = false;
    };

    var buttonsDown = { left: false, middle: false, right: false };
    var buttonsPressed = { left: false, middle: false, right: false };
    var buttonsReleased = { left: false, middle: false, right: false };
    var touchDetected = false;

    var transcodeButton = function (code) {
        return code == 0 ? "left" : code == 1 ? "middle" : "right";
    };

    var mouseDownHandler = function (event) {
        event.preventDefault();

        var rect = canvas.getBoundingClientRect();
        api.mouseX = Math.floor((event.pageX - window.pageXOffset - rect.left) * widthRatio);
        api.mouseY = Math.floor((event.pageY - window.pageYOffset - rect.top) * heightRatio);

        var button = transcodeButton(event.button);
        if (!buttonsDown[button]) {
            buttonsDown[button] = true;
            buttonsPressed[button] = true;
        }
    };

    var mouseUpHandler = function (event) {
        event.preventDefault();

        var button = transcodeButton(event.button);
        if (buttonsDown[button]) {
            buttonsDown[button] = false;
            buttonsReleased[button] = true;
        }
    };

    var mouseMoveHandler = function (event) {
        event.preventDefault();

        var rect = canvas.getBoundingClientRect();
        api.mouseX = Math.floor((event.pageX - window.pageXOffset - rect.left) * widthRatio);
        api.mouseY = Math.floor((event.pageY - window.pageYOffset - rect.top) * heightRatio);
    };

    var touchStartHandler = function (event) {
        if (!touchDetected) {
            canvas.removeEventListener("mousedown", mouseDownHandler, false);
            window.removeEventListener("mouseup", mouseUpHandler, false);
            window.removeEventListener("mousemove", mouseMoveHandler, false);
            touchDetected = true;
        }

        event.stopPropagation();
        event.preventDefault();

        var touch = event.touches[0];
        var rect = canvas.getBoundingClientRect();
        api.mouseX = Math.floor((touch.pageX - window.pageXOffset - rect.left) * widthRatio);
        api.mouseY = Math.floor((touch.pageY - window.pageYOffset - rect.top) * heightRatio);

        var button = "left";
        if (!buttonsDown[button]) {
            buttonsDown[button] = true;
            buttonsPressed[button] = true;
        }
    };

    var touchEndHandler = function (event) {
        event.stopPropagation();
        event.preventDefault();

        var button = "left";
        if (buttonsDown[button]) {
            buttonsDown[button] = false;
            buttonsReleased[button] = true;
        }
    };

    var touchCancelHandler = touchEndHandler;

    var touchMoveHandler = function (event) {
        event.stopPropagation();
        event.preventDefault();

        var touch = event.touches[0];
        var rect = canvas.getBoundingClientRect();
        api.mouseX = Math.floor((touch.pageX - window.pageXOffset - rect.left) * widthRatio);
        api.mouseY = Math.floor((touch.pageY - window.pageYOffset - rect.top) * heightRatio);
    };

    canvas.addEventListener("mousedown", mouseDownHandler, { passive: false });
    window.addEventListener("mouseup", mouseUpHandler, { passive: false });
    window.addEventListener("mousemove", mouseMoveHandler, { passive: false });
    canvas.addEventListener("touchstart", touchStartHandler, { passive: false });
    window.addEventListener("touchend", touchEndHandler, { passive: false });
    window.addEventListener("touchcancel", touchCancelHandler, { passive: false });
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });

    var preventHandler = function (event) {
        event.preventDefault();
    };

    canvas.addEventListener("mouseup", preventHandler, { passive: false });
    canvas.addEventListener("mousemove", preventHandler, { passive: false });
    canvas.addEventListener("touchend", preventHandler, { passive: false });
    canvas.addEventListener("touchcancel", preventHandler, { passive: false });
    canvas.addEventListener("touchmove", preventHandler, { passive: false });
    canvas.addEventListener("contextmenu", preventHandler, { passive: false });


    // keyboard

    api.keyboardDown = function (key) {
        return !!keysDown[key];
    };

    api.keyboardPressed = function (key) {
        return !!keysPressed[key];
    };

    api.keyboardReleased = function (key) {
        return !!keysReleased[key];
    };

    var keyboardUpdate = function () {
        for (var key in keysPressed) {
            keysPressed[key] = false;
        }
        for (var key in keysReleased) {
            keysReleased[key] = false;
        }
    };

    var keysDown = {};
    var keysPressed = {};
    var keysReleased = {};

    var transcodeKey = function (code) {
        var s = "" + code;

        switch (s) {
            case "Backspace":
            case "8": return "backspace";

            case "Tab":
            case "9": return "tab";

            case "Enter":
            case "13": return "enter";

            case "Shift":
            case "16": return "shift";

            case "Control":
            case "17": return "control";

            case "Alt":
            case "18": return "alt";

            case "CapsLock":
            case "20": return "caps lock";

            case "Escape":
            case "27": return "escape";

            case " ":
            case "32": return "space";

            case "PageUp":
            case "33": return "page up";

            case "PageDown":
            case "34": return "page down";

            case "End":
            case "35": return "end";

            case "Home":
            case "36": return "home";

            case "ArrowLeft":
            case "37": return "left";

            case "ArrowUp":
            case "38": return "up";

            case "ArrowRight":
            case "39": return "right";

            case "ArrowDown":
            case "40": return "down";

            case "Insert":
            case "45": return "insert";

            case "Delete":
            case "46": return "delete";

            case "48": return "0";
            case "49": return "1";
            case "50": return "2";
            case "51": return "3";
            case "52": return "4";
            case "53": return "5";
            case "54": return "6";
            case "55": return "7";
            case "56": return "8";
            case "57": return "9";

            case "96": return "0";
            case "97": return "1";
            case "98": return "2";
            case "99": return "3";
            case "100": return "4";
            case "101": return "5";
            case "102": return "6";
            case "103": return "7";
            case "104": return "8";
            case "105": return "9";

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

            case "112": return "f1";
            case "113": return "f2";
            case "114": return "f3";
            case "115": return "f4";
            case "116": return "f5";
            case "117": return "f6";
            case "118": return "f7";
            case "119": return "f8";
            case "120": return "f9";
            case "121": return "f10";
            case "122": return "f11";
            case "123": return "f12";
            case "124": return "f13";
            case "125": return "f14";
            case "126": return "f15";
            case "127": return "f16";
            case "128": return "f17";
            case "129": return "f18";
            case "130": return "f19";
            case "131": return "f20";
        }

        return s;
    };

    var keyDownHandler = function (event) {
        event.preventDefault();

        var key = transcodeKey(event.which || event.keyCode || event.key);
        if (!keysDown[key]) {
            keysDown[key] = true;
            keysPressed[key] = true;
        }
    };

    var keyUpHandler = function (event) {
        event.preventDefault();

        var key = transcodeKey(event.which || event.keyCode || event.key);
        if (keysDown[key]) {
            keysDown[key] = false;
            keysReleased[key] = true;
        }
    };

    canvas.addEventListener("keydown", keyDownHandler);
    canvas.addEventListener("keyup", keyUpHandler);


    // screen resize

    var minWidth = canvas.width;
    var minHeight = canvas.height;

    api.resizeNone = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        widthRatio = 1;
        heightRatio = 1;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
        canvas.style.left = Math.floor((w - canvas.width) / 2) + "px";
        canvas.style.top = Math.floor((h - canvas.height) / 2) + "px";
    };

    api.resizeFill = function () {
        var w = Math.floor(window.innerWidth);
        var h = Math.floor(window.innerHeight);
        canvas.width = Math.max(minWidth, w);
        canvas.height = Math.max(minHeight, h);

        if (w / h > canvas.width / canvas.height) {
            canvas.width = canvas.height * w / h;
        } else {
            canvas.height = canvas.width * h / w;
        }

        widthRatio = canvas.width / w;
        heightRatio = canvas.height / h;
        canvas.style.width = Math.floor(w) + "px";
        canvas.style.height = Math.floor(h) + "px";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
    };

    api.resizeStretch = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        widthRatio = canvas.width / w;
        heightRatio = canvas.height / h;
        canvas.style.width = Math.floor(w) + "px";
        canvas.style.height = Math.floor(h) + "px";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
    };

    api.resizeAspectRatio = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var sw = canvas.width;
        var sh = canvas.height;

        if (w / h > sw / sh) {
            sw *= h / sh;
            sh = h;
        } else {
            sh *= w / sw;
            sw = w;
        }

        widthRatio = canvas.width / sw;
        heightRatio = canvas.height / sh;
        canvas.style.width = Math.floor(sw) + "px";
        canvas.style.height = Math.floor(sh) + "px";
        canvas.style.left = Math.floor((w - sw) / 2) + "px";
        canvas.style.top = Math.floor((h - sh) / 2) + "px";
    };

    return api;
};

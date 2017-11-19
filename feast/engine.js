var canvas, ctx;
var addModule, setModule;
var keyboardDown, keyboardPressed, keyboardReleased;
var mouseDown, mousePressed, mouseReleased, mouseX, mouseY;
var getLocalStorage, setLocalStorage, removeLocalStorage;
var Tween;

(function () {
    canvas = document.getElementById("display");
    ctx = canvas.getContext("2d");

    var modules = {};
    var currentModule = null;
    
    var keysDown = {};
    var keysPressed = {};
    var keysReleased = {};
    
    var buttonNames = ["Left", "Middle", "Right"];
    var buttonIndices = {"Left": 0, "Middle": 1, "Right": 2};
    var buttonsDown = [false, false, false];
    var buttonsPressed = [false, false, false];
    var buttonsReleased = [false, false, false];
    mouseX = 0;
    mouseY = 0;
    
    var WIDTH_RATIO = 1;
    var HEIGHT_RATIO = 1;
    
    var hasLocalStorage = false;
    try {
        hasLocalStorage = !!localStorage.getItem;
    } catch (err) {
        hasLocalStorage = false;
    }
    
    var touchDetected = false;
    
    addModule = function (name, module) {
        modules[name] = module;
    };

    setModule = function (name) {
        currentModule = modules[name]();
    };
    
    keyboardDown = function (key) {
        return keysDown[key];
    };
    
    keyboardPressed = function (key) {
        return keysPressed[key];
    };
    
    keyboardReleased = function (key) {
        return keysReleased[key];
    };
    
    mouseDown = function (button) {
        return buttonsDown[buttonIndices[button]];
    };
    
    mousePressed = function (button) {
        return buttonsPressed[buttonIndices[button]];
    };
    
    mouseReleased = function (button) {
        return buttonsReleased[buttonIndices[button]];
    };
    
    getLocalStorage = function (name) {
        if (!hasLocalStorage) {
            return undefined;
        }
        
        return localStorage.getItem(name);
    };
    
    setLocalStorage = function (name, value) {
        if (!hasLocalStorage) {
            return;
        }
        
        localStorage.setItem(name, value);
    };
    
    removeLocalStorage = function (name) {
        if (!hasLocalStorage) {
            return;
        }
        
        localStorage.removeItem(name);
    };
    
    Tween = function (damping, stiffness) {
        var delta = 0;
        var speed = 0;
        var damping = damping;
        var stiffness = stiffness;
        
        this.get = function () {
            speed = damping * speed - delta / stiffness;
            delta += speed;
            
            return delta;
        };
        
        this.set = function (value) {
            delta = value;
            speed = 0;
        };
    };
    
    function translateKeyCode(code) {
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
    }

    function loadHandler() {
        function loop() {
            if (currentModule) {
                currentModule();
            }
            
            for (var key in keysPressed) {
                keysPressed[key] = false;
            }
            
            for (var key in keysReleased) {
                keysReleased[key] = false;
            }
            
            for (var i = 0; i < 3; i++) {
                buttonsPressed[i] = false;
                buttonsReleased[i] = false;
            }
            
            ctx.fillStyle = "rgb(70, 70, 70)";
            ctx.textAlign = "left";
            ctx.font = "18px verdana";
            ctx.fillText("v0.2", 15, 30);
            
            requestAnimationFrame(loop);
        };
        
        canvas.style.backgroundColor = "rgb(60, 60, 60)";
        setModule("menu");
        resizeHandler();
        loop();
    }
    
    function keyDownHandler(event) {
        var key = translateKeyCode(event.which || event.keyCode || event.key);
        
        event.preventDefault();
        
        if (!keysDown[key]) {
            keysDown[key] = true;
            keysPressed[key] = true;
        }
    }

    function keyUpHandler(event) {
        var key = translateKeyCode(event.which || event.keyCode || event.key);
        
        event.preventDefault();
        
        if (keysDown[key]) {
            keysDown[key] = false;
            keysReleased[key] = true;
        }
    }
    
    function mouseDownHandler(event) {
        var rect = canvas.getBoundingClientRect();
        var button = event.button;
        
        event.preventDefault();
        
        mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
        
        if (!buttonsDown[button]) {
            buttonsDown[button] = true;
            buttonsPressed[button] = true;
        }
    }
    
    function mouseUpHandler(event) {
        var rect = canvas.getBoundingClientRect();
        var button = event.button;
        
        event.preventDefault();
        
        if (buttonsDown[button]) {
            buttonsDown[button] = false;
            buttonsReleased[button] = true;
        }
    }
    
    function mouseMoveHandler(event) {
        var rect = canvas.getBoundingClientRect();
        
        mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    }
    
    function touchStartHandler(event) {        
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
        
        if (!buttonsDown[button]) {
            buttonsDown[button] = true;
            buttonsPressed[button] = true;
        }
    }
    
    function touchEndHandler(event) {
        var rect = canvas.getBoundingClientRect();
        var button = 0;
        
        if (buttonsDown[button]) {
            buttonsDown[button] = false;
            buttonsReleased[button] = true;
        }
    }
    
    function touchMoveHandler(event) {
        var rect = canvas.getBoundingClientRect();
        var touch = event.touches[0];
        
        event.stopPropagation();
        event.preventDefault();
        
        mouseX = (touch.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        mouseY = (touch.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    }
    
    function resizeHandler() {
        /*
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
        document.getElementById("top").style.marginTop = Math.floor((h - sh) / 2) + "px";
        */
        var w = Math.floor(window.innerWidth);
        var h = Math.floor(window.innerHeight);
        var c = self.canvas;
        
        c.width = Math.max(810, w);
        c.height = Math.max(540, h);
        
        var r = w / h;
        var sr = c.width / c.height;
        
        if (r > sr) {
            c.width = c.height * w / h;
        } else {
            c.height = c.width * h / w;
        }
        
        WIDTH_RATIO = c.width / w;
        HEIGHT_RATIO = c.height / h;
        
        c.style.width = w + "px";
        c.style.height = h + "px";
        
        self.ctx.canvas.width = c.width;
        self.ctx.canvas.height = c.height;
    }
    
    window.addEventListener("load", loadHandler);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    window.addEventListener("mousedown", mouseDownHandler, false);
    window.addEventListener("mouseup", mouseUpHandler, false);
    window.addEventListener("mousemove", mouseMoveHandler, false);
    window.addEventListener("touchstart", touchStartHandler, false);
    window.addEventListener("touchend", touchEndHandler, false);
    window.addEventListener("touchcancel", touchEndHandler, false);
    window.addEventListener("touchmove", touchMoveHandler, false);
    window.addEventListener("resize", resizeHandler);
})();

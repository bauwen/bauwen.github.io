var COLBACK = "rgb(49, 54, 49)";
var COLGRID = "rgb(90, 95, 90)";
var COLPLAYER = "rgb(200, 200, 60)";
var COLTRAIL = "rgb(80, 160, 80)";
var COLWALL = COLGRID;
var COLTARGET = "rgb(80, 160, 80)";
var COLBRIDGE = "rgb(160, 60, 160)";
var COLTUNNELS = [
    "rgb(60, 100, 180)",
    "rgb(160, 60, 60)",
    "rgb(190, 140, 40)",
    "rgb(120, 180, 40)",
    "rgb(80, 180, 180)"
];

var WIDTH = 16;
var HEIGHT = 9;
var CELL = 32;
var CONTROLLER = null;

var MUSIC = true;
var SOUND = true;

var banner;

function Game(width, height, resizeMode, minWidth, minHeight) {
    var self = this;
    
    if (!resizeMode) {
        resizeMode = "aspectratio";
    }
    else if (resizeMode === "fullscreen") {
        if (minWidth) {
            if (!minHeight) {
                minHeight = minWidth * height / width;
            }
        } else {
            if (!minHeight) {
                minWidth = width;
                minHeight = height;
            } else {
                minWidth = minHeight * width / height;
            }
        }
    }
    
    this.canvas = document.createElement("canvas");
    this.canvas.width = width || 640;
    this.canvas.height = height || 480; 
    this.canvasctx = this.canvas.getContext("2d");
    
    this.canvas.setAttribute("tabindex", 1);
    this.canvas.style.outline = "none";
    this.canvas.addEventListener("click", function () {
        self.canvas.focus();
    });
    this.canvas.focus();
    
    this.ctx = document.createElement("canvas").getContext("2d");
    this.ctx.canvas.width = this.canvas.width;
    this.ctx.canvas.height = this.canvas.height;
    
    var container = document.createElement("div");
    container.setAttribute("align", "center");
    container.style.marginTop = "0px";
    container.appendChild(this.canvas);
    
    document.body.appendChild(container);
    
    var WIDTH_RATIO = 1;
    var HEIGHT_RATIO = 1;
    
    this.hasLocalStorage = false;
    
    try {
        this.hasLocalStorage = !!localStorage.getItem;
    } catch (err) {
        this.hasLocalStorage = false;
    }
    
    this.deviceOS = "";
    this.deviceBrowser = "";
    this.deviceDesktop = false;

    var ua = navigator.userAgent;

    if (/Android/.test(ua)) {
        this.deviceOS = "android";
    }
    else if (/CrOS/.test(ua)) {
        this.deviceOS = "chromeos";
    }
    else if (/iP[ao]d|iPhone/i.test(ua)) {
        this.deviceOS = "ios";
    }
    else if (/Linux/.test(ua)) {
        this.deviceOS = "linux";
    }
    else if (/Mac OS/.test(ua)) {
        this.deviceOS = "macos";
    }
    else if (/Windows/.test(ua)) {
        this.deviceOS = "windows";

        if (/Windows Phone/i.test(ua)) {
            this.deviceOS = "windowsphone";
        }
    }
    
    if ((this.deviceOS === "windows" || this.deviceOS === "macos" || this.deviceOS === "chromeos" ||
        (this.deviceOS === "linux" && !(/Silk/.test(ua)))) && this.deviceOS !== "windowsphone") {
        this.deviceDesktop = true;
    }
    
    if (/Arora/.test(ua)) {
        this.deviceBrowser = "arora";
    }
    else if (/Chrome/.test(ua)) {
        this.deviceBrowser = "chrome";
    }
    else if (/Epiphany/.test(ua)) {
        this.deviceBrowser = "epiphany";
    }
    else if (/Firefox/.test(ua)) {
        this.deviceBrowser = "firefox";
    }
    else if (/AppleWebKit/.test(ua) && device.iOS) {
        this.deviceBrowser = "mobilesafari";
    }
    else if (/MSIE (\d+\.\d+);/.test(ua)) {
        this.deviceBrowser = "ie";
    }
    else if (/Midori/.test(ua)) {
        this.deviceBrowser = "midori";
    }
    else if (/Opera/.test(ua)) {
        this.deviceBrowser = "opera";
    }
    else if (/Safari/.test(ua)) {
        this.deviceBrowser = "safari";
    }
    else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua)) {
        this.deviceBrowser = "ie";
    }
    
    console.log("Browser: " + this.deviceBrowser + " | OS: " + this.deviceOS + " | " + (this.deviceDesktop ? "desktop" : "mobile"));
    
    this.keysDown = {};
    this.keysPressed = {};
    this.keysReleased = {};
    
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
    };
    
    window.addEventListener("keydown", function (event) {
        var key = translateKeyCode(event.which || event.keyCode || event.key);
        
        event.preventDefault();
        
        if (!self.keysDown[key]) {
            self.keysDown[key] = true;
            self.keysPressed[key] = true;
        }
    });
    
    window.addEventListener("keyup", function (event) {
        var key = translateKeyCode(event.which || event.keyCode || event.key);
        
        event.preventDefault();
        
        if (self.keysDown[key]) {
            self.keysDown[key] = false;
            self.keysReleased[key] = true;
        }
    });
    
    this.buttonNames = ["Left", "Middle", "Right"];
    this.buttonIndices = {"Left": 0, "Middle": 1, "Right": 2};
    this.buttonsDown = [false, false, false];
    this.buttonsPressed = [false, false, false];
    this.buttonsReleased = [false, false, false];
    this.mouseX = 0;
    this.mouseY = 0;
    
    var touchDetected = false;
    
    var mouseDownHandler = function (event) {
        var rect = self.canvas.getBoundingClientRect();
        var button = event.button;
        
        event.preventDefault();
        
        self.mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        self.mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
        
        if (!self.buttonsDown[button]) {
            self.buttonsDown[button] = true;
            self.buttonsPressed[button] = true;
        }
    };
    
    var mouseUpHandler = function (event) {
        var rect = self.canvas.getBoundingClientRect();
        var button = event.button;
        
        event.preventDefault();
        
        if (self.buttonsDown[button]) {
            self.buttonsDown[button] = false;
            self.buttonsReleased[button] = true;
        }
    };
    
    var mouseMoveHandler = function (event) {
        var rect = self.canvas.getBoundingClientRect();
        
        self.mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        self.mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    };
    
    var touchStartHandler = function (event) {
        if (!touchDetected) {
            window.removeEventListener("mousedown", mouseDownHandler, false);
            window.removeEventListener("mouseup", mouseUpHandler, false);
            window.removeEventListener("mousemove", mouseMoveHandler, false);
            touchDetected = true;
        }
        
        var rect = self.canvas.getBoundingClientRect();
        var button = 0;
        var touch = event.touches[0];
        
        event.stopPropagation();
        event.preventDefault();
        
        self.mouseX = (touch.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        self.mouseY = (touch.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
        
        if (!self.buttonsDown[button]) {
            self.buttonsDown[button] = true;
            self.buttonsPressed[button] = true;
        }
    };
    
    var touchEndHandler = function (event) {
        var rect = self.canvas.getBoundingClientRect();
        var button = 0;
        
        if (self.buttonsDown[button]) {
            self.buttonsDown[button] = false;
            self.buttonsReleased[button] = true;
        }
    };
    
    var touchCancelHandler = touchEndHandler;
    
    var touchMoveHandler = function (event) {
        var rect = self.canvas.getBoundingClientRect();
        var touch = event.touches[0];
        
        event.stopPropagation();
        event.preventDefault();
        
        self.mouseX = (touch.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        self.mouseY = (touch.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
    };
    
    window.addEventListener("mousedown", mouseDownHandler, false);
    window.addEventListener("mouseup", mouseUpHandler, false);
    window.addEventListener("mousemove", mouseMoveHandler, false);
    window.addEventListener("touchstart", touchStartHandler, false);
    window.addEventListener("touchend", touchEndHandler, false);
    window.addEventListener("touchcancel", touchCancelHandler, false);
    window.addEventListener("touchmove", touchMoveHandler, false);
    
    this.assetsLoaded = false;
    this.gestureAudioLoaded = false;
    
    if (this.deviceOS === "android" || this.deviceOS === "ios") {
        var clickHandler = function (event) {
            if (!self.gestureAudioLoaded && self.assetsLoaded) {
                window.removeEventListener("click", clickHandler, false);
                
                for (var name in self.sounds) {
                    var sound = self.sounds[name];
                    
                    for (var i = 0; i < sound.channels.length; i++) {
                        var channel = sound.channels[i];
                        channel.play();
                        channel.pause();
                    }
                }
                
                for (var name in self.music) {
                    var music = self.music[name]; 
                    music.play();
                    music.pause();
                }
                
                self.gestureAudioLoaded = true;
            }
        };
        
        window.addEventListener("click", clickHandler, false);
    } else {
        this.gestureAudioLoaded = true;
    }
    
    var resizeHandlerAspectRatio = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var c = self.canvas;
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
        container.style.marginTop = Math.floor((h - sh) / 2) + "px";
    };
    
    var resizeHandlerFullscreen = function () {
        var w = Math.floor(window.innerWidth);
        var h = Math.floor(window.innerHeight);
        var c = self.canvas;
        
        c.width = Math.max(minWidth, w);
        c.height = Math.max(minHeight, h);
        
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
    };
    
    this.resizeHandler = function () {};
    
    switch (resizeMode) {
        case "aspectratio":
            this.resizeHandler = resizeHandlerAspectRatio;
            window.addEventListener("resize", this.resizeHandler);
            this.resizeHandler();
            break;
            
        case "fullscreen":
            this.resizeHandler = resizeHandlerFullscreen;
            window.addEventListener("resize", this.resizeHandler);
            this.resizeHandler();
            break;
            
        case "fixed":
            break;
    }
    
    this.globalMusic = true;
    this.globalSounds = true;
    
    this.objects = {};
    this.instances = [];
    this.instanceGroups = {};
    this.destroyedInstances = [];
    this.changedOrder = false;
    
    this.scenes = {};
    this.nextScene = null;
    this.scene = {
        name: "",
        width: this.ctx.canvas.width,
        height: this.ctx.canvas.height,
        enter: function () {},
        leave: function () {}
    };
    
    this.viewX = 0;
    this.viewY = 0;

    this.images = {};
    this.sounds = {};
    this.music = {};
}

Game.prototype = {
    run: function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.canvasctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.nextScene) {
            this.scene.leave();
            
            this.viewX = 0;
            this.viewY = 0;
            this.instances = [];
            this.instanceGroups = {};
            this.changedOrder = false;
            this.scene = this.nextScene;
            this.nextScene = null;
            
            this.ctx.canvas.width = this.scene.width;
            this.ctx.canvas.height = this.scene.height;
            
            this.resizeHandler();
            
            this.scene.enter();
        }
        
        if (this.changedOrder) {
            this.instances.sort(function (a, b) {
                return b.depth - a.depth;
            });
            this.changedOrder = false;
        }
        
        for (var i = 0, len = this.instances.length; i < len; i++) {
            var instance = this.instances[i];
            var depth = instance.depth;
            
            instance.update();
            
            if (instance.depth !== depth) {
                this.changedOrder = true;
            }
        }
        
        while (this.destroyedInstances.length > 0) {
            var instance = this.destroyedInstances.pop();
            
            if (this.instanceGroups.hasOwnProperty(instance.object)) {
                this.instanceGroups[instance.object].splice(this.instanceGroups[instance.object].indexOf(instance), 1);
            }
            
            this.instances.splice(this.instances.indexOf(instance), 1);
            instance.destroy();
        }
        
        for (var key in this.keysPressed) {
            this.keysPressed[key] = false;
        }
        
        for (var key in this.keysReleased) {
            this.keysReleased[key] = false;
        }
        
        for (var i = 0; i < 3; i++) {
            this.buttonsPressed[i] = false;
            this.buttonsReleased[i] = false;
        }
        
        this.canvasctx.drawImage(this.ctx.canvas, this.viewX, this.viewY, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height);
        
        var self = this;
        window.requestAnimationFrame(function () {
            self.run();
        });
    },
    
    keyboardDown: function (key) {
        return !!this.keysDown[key];
    },
    
    keyboardPressed: function (key) {
        return !!this.keysPressed[key];
    },
    
    keyboardReleased: function (key) {
        return !!this.keysReleased[key];
    },
    
    mouseDown: function (button) {
        return this.buttonsDown[this.buttonIndices[button]];
    },
    
    mousePressed: function (button) {
        return this.buttonsPressed[this.buttonIndices[button]];
    },
    
    mouseReleased: function (button) {
        return this.buttonsReleased[this.buttonIndices[button]];
    },
    
    addObject: function (name, body) {
        function O(x, y, depth) {
            this.x = x || 0;
            this.y = y || 0;
            this.depth = depth || 0;
            this.object = name;
        }
        
        O.prototype = {
            create: body.create || function () {},
            update: body.update || function () {},
            destroy: body.destroy || function () {}
        };
        
        this.objects[name] = O;
    },

    createInstance: function (object, x, y, depth) {
        var instance = new this.objects[object](x, y, depth);
        
        if (!this.instanceGroups.hasOwnProperty(object)) {
            this.instanceGroups[object] = [];
        }
        this.instanceGroups[object].push(instance);
        
        this.instances.push(instance);
        instance.create();
        this.changedOrder = true;
        
        return instance;
    },

    destroyInstance: function (instance) {
        if (this.instances.indexOf(instance) < 0 || this.destroyedInstances.indexOf(instance) >= 0) {
            throw new Error("Engine Error: trying to destroy an invalid instance");
        }
        
        this.destroyedInstances.push(instance);
    },
    
    withInstances: function (object, func, self) {
        var instances = this.instanceGroups[object];
        if (instances) {
            for (var i = 0, len = instances.length; i < len; i++) {
                if (func.call(self || window, instances[i])) {
                    break;
                }
            }
        }
    },
    
    getInstanceCount: function (object) {
        if (object) {
            return this.instanceGroups.hasOwnProperty(object) ? this.instanceGroups[object].length : 0;
        } else {
            return this.instances.length;
        }
    },

    addScene: function (name, body) {
        var scene = {
            name: name,
            width: body.width || this.canvas.width,
            height: body.height || this.canvas.height,
            enter: body.enter || function () {},
            leave: body.leave || function () {}
        };
        
        if (scene.width < this.canvas.width || scene.height < this.canvas.height) {
            throw new Error("Engine Error: the dimensions of scene '" + name + "' are smaller than the dimensions of the canvas");
        }
        
        this.scenes[name] = scene;
    },

    enterScene: function (scene) {
        this.nextScene = this.scenes[scene];
    },
    
    trackInstance: function (instance) {
        this.viewX = Math.max(0, Math.min(instance.x - this.canvas.width / 2, this.scene.width - this.canvas.width));
        this.viewY = Math.max(0, Math.min(instance.y - this.canvas.height / 2, this.scene.height - this.canvas.height));
    },

    loadAssets: function (assets, body) {
        var imageAssets = [];
        var soundAssets = [];
        var musicAssets = [];
        var fontAssets = [];
        var progress = body.progress || function (p) {};
        var finish = body.finish || function () {};
        var channelCount = 3;
        var fontTimeout = 1;
        
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
        var self = this;
        
        function loadFonts(index) {
            if (fontAssets.length === 0) {
                window.setTimeout(loadImage, 10, 0);
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
        
        function loadImage(index) {
            if (index >= imageAssets.length) {
                window.setTimeout(loadSound, 10, 0);
                return;
            }
            
            var image = new Image();
            image.src = imageAssets[index + 1];
            image.onload = function () {
                self.images[imageAssets[index]] = image;  
                count += 1;
                progress(count / total);    
                window.setTimeout(loadImage, 20, index + 2);
            };
        }
        
        function loadSound(index) {
            if (self.deviceOS === "ios" || self.deviceBrowser === "mobilesafari" || self.deviceBrowser === "safari") {
                count += soundAssets.length / 2;
                progress(count / total);
                window.setTimeout(loadMusic, 10, 0);
                return;
            }
            
            if (index >= soundAssets.length) {
                window.setTimeout(loadMusic, 10, 0);
                return;
            }
            
            var channels = [];
            
            function loadChannel(i) {
                if (i >= channelCount) {
                    self.sounds[soundAssets[index]] = {
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
                channel.preload = "auto";
                channel.onloadeddata = function () {
                    channels.push(channel);
                    window.setTimeout(loadChannel, 20, i + 1);
                };
            }
            
            loadChannel(0);
        }
        
        function loadMusic(index) {
            if (index >= musicAssets.length) {
                self.assetsLoaded = true;
                window.setTimeout(finish, 500);
                return;
            }
            
            var audio = new Audio();
            audio.src = musicAssets[index + 1];
            audio.preload = "auto";
            
            if (self.deviceOS === "ios" || self.deviceBrowser === "mobilesafari" || self.deviceBrowser === "safari") {
                self.music[musicAssets[index]] = audio;  
                count += 1;
                progress(count / total);
                window.setTimeout(loadMusic, 2000, index + 2);
            } else {
                audio.onloadeddata = function () {
                    self.music[musicAssets[index]] = audio;  
                    count += 1;
                    progress(count / total);    
                    window.setTimeout(loadMusic, 20, index + 2);
                };
            }
        }
        
        progress(0);
        loadFonts();
    },
    
    getImage: function (name) {
        return this.images[name];
    },
    
    drawImage: function (name, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        var image = this.images[name];
        
        if (!image || image.readyState !== 4) {
            return;
        }
        
        this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    },
    
    playSound: function (name) {
        var sound = this.sounds[name];
        
        if (!sound || sound.channels.length === 0 || !this.globalSounds) {
            return;
        }
        
        var channel = sound.channels[sound.currentChannel];
        
        if (channel.readyState < 2) {
            return;
        }
        
        sound.currentChannel = (sound.currentChannel + 1) % sound.channels.length;
        channel.loop = false;
        channel.play();
    },
    
    setSoundVolume: function (name, volume) {
        var sound = this.sounds[name];
        
        if (!sound) {
            return;
        }
        
        for (var i = 0; i < sound.channels.length; i++) {
            sound.channels[i].volume = volume;
        }
    },
    
    playMusic: function (name, loop) {
        var music = this.music[name];
        
        if (!music || music.readyState < 2 || !this.globalMusic) {
            return;
        }
        
        music.loop = loop || false;
        music.play();
    },
    
    pauseMusic: function (name) {
        var music = this.music[name];
        
        if (!music) {
            return;
        }
        
        music.pause();
    },
    
    setMusicTime: function (name, time) {
        var music = this.music[name];
        
        if (!music) {
            return;
        }
        
        music.currentTime = time;
    },
    
    setMusicVolume: function (name, volume) {
        var music = this.music[name];
        
        if (!music) {
            return;
        }
        
        music.volume = volume;
    },
    
    getGlobalMusic: function () {
        return this.globalMusic;
    },
    
    setGlobalMusic: function (on) {
        if (this.globalMusic === on) {
            return;
        }
        
        for (var name in this.music) {
            var music = this.music[name];
            music.volume = on ? 1 : 0;
            music.mute = !on;
        }
        
        this.globalMusic = on;
    },
    
    getGlobalSounds: function () {
        return this.globalSounds;
    },
    
    setGlobalSounds: function (on) {
        if (this.globalSounds === on) {
            return;
        }
        
        for (var name in this.sounds) {
            var sound = this.sounds[name];
            
            for (var i = 0; i < sound.channels.length; i++) {
                var channel = sound.channels[i];
                channel.volume = on ? 1 : 0;
                channel.mute = !on;
            }
        }
        
        this.globalMusic = on;
    },
    
    getLocalStorage: function (name) {
        if (!this.hasLocalStorage) {
            return undefined;
        }
        
        return localStorage.getItem(name);
    },
    
    setLocalStorage: function (name, value) {
        if (!this.hasLocalStorage) {
            return;
        }
        
        localStorage.setItem(name, value);
    },
    
    removeLocalStorage: function (name) {
        if (!this.hasLocalStorage) {
            return;
        }
        
        localStorage.removeItem(name);
    }
};

var keyboard = new Keyboard();
var mouse;

function Game(canvas) {
    mouse = new Mouse(canvas);
    
    this.ctx = canvas.getContext("2d");
    
    this.objects = {};
    this.instances = [];
    this.destroyedInstances = [];
    this.changedOrder = false;
    this.scenes = {};
    this.nextScene = null;
    this.currentScene = {
        name: "",
        width: this.ctx.canvas.width,
        height: this.ctx.canvas.height,
        enter: function () {},
        leave: function () {}
    };

    this.images = {};
    this.sounds = {};
    this.music = {};
}

Game.prototype = {
    run() {
        this.ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        if (this.nextScene) {
            this.currentScene.leave();
            
            this.instances = [];
            this.changedOrder = false;
            this.currentScene = this.nextScene;
            this.nextScene = null;
            
            this.currentScene.enter();
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
            this.instances.splice(this.instances.indexOf(instance), 1);
            instance.destroy();
        }
        
        keyboard.update();
        mouse.update();
        
        var self = this;
        window.requestAnimationFrame(function () { self.run(); });
    },
    
    getContext() {
        return this.ctx;
    },
    
    addObject(name, body) {
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

    createInstance(object, x, y, depth) {
        if (this.objects.hasOwnProperty(object)) {
            var instance = new this.objects[object](x, y, depth);
            
            this.instances.push(instance);
            instance.create();
            this.changedOrder = true;
            
            return instance;
        } else {
            throw new Error(`Engine Error: trying to create an instance of non-existent object "${object}"`);
        }
    },

    destroyInstance(instance) {
        if (this.instances.indexOf(instance) >= 0 && this.destroyedInstances.indexOf(instance) < 0) {
            this.destroyedInstances.push(instance);
        } else {
            throw new Error(`Engine Error: trying to destroy an invalid instance`);
        }
    },

    withInstances(object, func) {
        for (var i = 0, len = this.instances.length; i < len; i++) {
            var instance = instances[i];
            if (instance.object === object) {
                func(instance);
            }
        }
    },

    addScene(name, body) {
        this.scenes[name] = {
            name: name,
            width: body.width || this.ctx.canvas.width,
            height: body.height || this.ctx.canvas.height,
            enter: body.enter || function () {},
            leave: body.leave || function () {}
        };
    },

    gotoScene(scene) {
        if (this.scenes.hasOwnProperty(scene)) {
            this.nextScene = this.scenes[scene];
        } else {
            throw new Error(`Engine Error: trying to go to non-existent scene "${scene}"`);
        }
    },

    getCurrentScene() {
        return this.currentScene.name;
    },

    getSceneWidth() {
        return this.currentScene.width;
    },

    getSceneHeight() {
        return this.currentScene.height;
    },

    loadAssets(assets, body) {
        var imageAssets = [];
        var soundAssets = [];
        var musicAssets = [];
        var fontAssets = [];
        var progress = body.progress || function (p) {};
        var finish = body.finish || function () {};
        
        if (assets.images) {
            for (var name in assets.images) {
                if (assets.images.hasOwnProperty(name)) {
                    imageAssets.push(name, assets.images[name]);
                }
            }
        }
        
        if (assets.sounds) {
            for (var name in assets.sounds) {
                if (assets.sounds.hasOwnProperty(name)) {
                    soundAssets.push(name, assets.sounds[name]);
                }
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
                if (assets.fonts.hasOwnProperty(name)) {
                    fontAssets.push(name, assets.fonts[name]);
                }
            }
        }
        
        var total = (imageAssets.length + soundAssets.length + musicAssets.length) / 2 + (fontAssets.length > 0 ? 1 : 0);
        var count = 0;
        var self = this;
        
        function loadImage(index) {
            if (index >= imageAssets.length) {
                loadSound(0);
                return;
            }
            
            var image = new Image();
            image.src = imageAssets[index + 1];
            image.onload = function () {
                self.images[imageAssets[index]] = image;  
                count += 1;
                progress(count / total);    
                window.setTimeout(loadImage, 1, index + 2);
            };
        }
        
        function loadSound(index) {
            if (index >= soundAssets.length) {
                loadMusic(0);
                return;
            }
            
            var channels = [];
            
            function loadChannel(i) {
                if (i >= 4) {
                    self.sounds[soundAssets[index]] = {
                        channels: channels,
                        currentChannel: 0
                    };
                    count += 1;
                    progress(count / total);
                    window.setTimeout(loadSound, 1, index + 2);
                    return;
                }
                
                var channel = new Audio();
                channel.src = soundAssets[index + 1];
                channel.onloadeddata = function () {
                    channels.push(channel);
                    loadChannel(i + 1);
                };
            }
            
            loadChannel(0);
        }
        
        function loadMusic(index) {
            if (index >= musicAssets.length) {
                finish();
                return;
            }
            
            var audio = new Audio();
            audio.src = musicAssets[index + 1];
            audio.onloadeddata = function () {
                self.music[musicAssets[index]] = audio;  
                count += 1;
                progress(count / total);    
                window.setTimeout(loadMusic, 1, index + 2);
            };
        }
        
        function loadFonts() {
            if (fontAssets.length === 0) {
                loadImage(0);
                return;
            }
            
            var css = document.createElement("style");
            
            for (var index = 0; index < fontAssets.length; index += 2) {
                css.innerHTML += `@font-face { font-family: ${fontAssets[index]}; src: url(${fontAssets[index + 1]}); }`; 
            }
            
            document.head.appendChild(css);
            window.setTimeout(function () {
                count += 1;
                progress(count / total);
                loadImage(0);
            }, 2000 * 0+1);
        }
        
        progress(0);
        loadFonts();
    },
    
    playSound(name) {
        var sound = this.sounds[name];
        var channel = sound.channels[sound.currentChannel];
        
        sound.currentChannel = (sound.currentChannel + 1) % sound.channels.length;
        channel.loop = false;
        channel.play();
    }
};

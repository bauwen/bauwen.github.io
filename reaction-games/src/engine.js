// HTML5 Game Engine

function Game(canvas, ctx) {
    var self = this;
    
    this.canvas = canvas;
    this.ctx = ctx;
    
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
    
    this.views = [];

    this.images = {};
    this.sounds = {};
    this.music = {};
}

Game.prototype = {
    createView: function (width, height, portX, portY, x, y) {
        var view = {
            x: x || 0,
            y: y || 0,
            portX: portX || 0,
            portY: portY || 0,
            width: width,
            height: height
        };
        
        this.views.push(view);
        
        return view;
    },
    
    destroyView: function (view) {
        var index = this.views.indexOf(view);
        
        if (index < 0) {
            throw new Error("Engine Error: trying to destroy an invalid instance");
        }
        
        this.view.splice(index, 1);
    },
    
    attachView: function (view, instance, originX, originY) {
        view.x = Math.max(0, Math.min(instance.x - (originX || (view.width / 2)), this.scene.width - view.width));
        view.y = Math.max(0, Math.min(instance.y - (originY || (view.height / 2)), this.scene.height - view.height));
    },
    
    run: function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        /*
        if (this.useViews) {
            if (this.views.length > 0) {
                for (var i = 0; i < this.views.length; i++) {
                    var view = this.views[i];
                    this.canvasctx.drawImage(ctx.canvas, view.x, view.y, view.width, view.height, view.portX, view.portY, view.width, view.height);
                }
            } else {
                this.canvasctx.drawImage(ctx.canvas, 0, 0);
            }
        }
        */
        if (this.nextScene) {
            this.scene.leave();
            
            this.views = [];
            this.instances = [];
            this.instanceGroups = {};
            this.changedOrder = false;
            this.scene = this.nextScene;
            this.nextScene = null;
            
            if (this.useViews) {
                this.ctx.canvas.width = this.scene.width;
                this.ctx.canvas.height = this.scene.height;
            }
            
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
        /*
        var self = this;
        window.requestAnimationFrame(function () {
            self.run();
        });
        */
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

    loadAssets: function (assets, body) {
        var imageAssets = [];
        var soundAssets = [];
        var musicAssets = [];
        var fontAssets = [];
        var progress = body.progress || function (p) {};
        var finish = body.finish || function () {};
        var channelCount = 4;
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
                if (i >= channelCount) {
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
                /*channel.onloadeddata = function () {
                    channels.push(channel);
                    loadChannel(i + 1);
                };*/
                setTimeout(function () {
                    channels.push(channel);
                    loadChannel(i + 1);
                }, 200);
            }
            
            loadChannel(0);
        }
        
        function loadMusic(index) {
            if (index >= musicAssets.length) {
                window.setTimeout(finish, 500);
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
    },
    
    getImage: function (name) {
        return this.images[name];
    },
    
    playSound: function (name) {
        var sound = this.sounds[name];
        var channel = sound.channels[sound.currentChannel];
        
        sound.currentChannel = (sound.currentChannel + 1) % sound.channels.length;
        channel.loop = false;
        channel.play();
    },
    
    setSoundVolume: function (name, volume) {
        var sound = this.sounds[name]; 
        
        for (var i = 0; i < sound.channels.length; i++) {
            sound.channels[i].volume = volume;
        }
    },
    
    playMusic: function (name, loop) {
        var music = this.music[name];
        
        music.loop = loop || false;
        music.play();
    },
    
    pauseMusic: function (name) {
        this.music[name].pause();
    },
    
    setMusicTime: function (name, time) {
        this.music[name].currentTime = time;
    },
    
    setMusicVolume: function (name, volume) { 
        this.music[name].volume = volume;
    },
    
    setMusicMuted: function (name, muted) {
        this.music[name].muted = muted;
    }
};

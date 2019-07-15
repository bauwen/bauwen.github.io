var assets = {
    images: {},
    shadows: {},
    music: {},
    sounds: {},
    objects: {},
    rooms: {},

    paths: {
        images: [],
        music: [],
        sounds: []
    },

    loading: true,
    loadCount: 0,
    totalCount: 0,
    channelCount: 2,

    createImage: function (path, callback) {
        var name = tools.getBasename(path);
        var image = new Image();
        var onload = function () {
            image.removeEventListener("load", onload);
            assets.images[name] = scaleImage(image);    // TODO (temporary scaling!)
            callback();
        };
        image.src = path;
        image.addEventListener("load", onload);
    },

    createSound: function (path, callback) {
        var name = tools.getBasename(path);
        var sound = new Audio();
        var loaded = false;
        var onload = function () {
            if (!loaded) {
                loaded = true;
                sound.removeEventListener("canplay", onload);
                assets.sounds[name] = sound;
                callback();
            }
        };
        sound.src = path;
        sound.addEventListener("canplay", onload);
        setTimeout(function () {
            if (!loaded) {
                loaded = true;
                sound.removeEventListener("canplay", onload);
                assets.sounds[name] = sound;
                callback();
            }
        }, 2000);
        /*
        var channels = [];
        var createChannel = function (callback) {
            var channel = new Audio();
            var onload = function () {
                channel.removeEventListener("canplay", onload);
                channels.push(channel);
                callback();
            };
            channel.src = path;
            channel.addEventListener("canplay", onload);
        };

        var name = tools.getBasename(path);
        var onload = function () {
            if (channels.length === assets.channelCount) {
                assets.sounds[name] = {
                    channels: channels,
                    currentChannel: 0
                };
                callback();
            }
        };

        for (var i = 0; i < assets.channelCount; i++) {
            createChannel(onload);
        }
        */
    },

    createMusic: function (path, callback) {
        var name = tools.getBasename(path);
        var music = new Audio();
        var loaded = false;
        var onload = function () {
            if (!loaded) {
                loaded = true;
                music.removeEventListener("canplay", onload);
                assets.music[name] = music;
                callback();
            }
        };
        music.src = path;
        music.addEventListener("canplay", onload);
        setTimeout(function () {
            if (!loaded) {
                loaded = true;
                music.removeEventListener("canplay", onload);
                assets.music[name] = music;
                callback();
            }
        }, 2000);
    },

    createShadow: function (name, dataURL, callback) {
        var image = new Image();
        var onload = function () {
            image.removeEventListener("load", onload);
            assets.shadows[name] = image;
            callback();
        };
        image.src = dataURL;
        image.addEventListener("load", onload);
    },

    createObject: function (name, body, passable, width, height) {
        assets.objects[name] = function () {
            var instance = {
                x: 0,
                y: 0,
                rotation: 0,
                depth: 0,
                sprite: [],
                index: 0,
                solid: !passable,
                width: (width || 1) * 32,
                height: (height || 1) * 32,
                follower: null,
                asset: name,
                oncreate: function () {},
                onupdate: function () {},
                ondestroy: function () {}
            };
            for (var key in body) {
                instance[key] = body[key];
            }
            return instance;
        };
    },

    createRoom: function (name, body) {
        assets.rooms[name] = body;
    },

    loadImages: function (callback) {
        var load = function (index) {
            if (index >= assets.paths.images.length) {
                callback();
                return;
            }

            var path = assets.paths.images[index];
            assets.createImage(path, function () {
                assets.loadCount += 1;
                setTimeout(load, 1, index + 1);
            });
        };

        load(0);
    },

    loadSounds: function (callback) {
        var load = function (index) {
            if (index >= assets.paths.sounds.length) {
                callback();
                return;
            }

            var path = assets.paths.sounds[index];
            assets.createSound(path, function () {
                assets.loadCount += 1;
                //console.log("sound loaded");
                setTimeout(load, 1, index + 1);
            });
        };

        load(0);
    },

    loadMusic: function (callback) {
        var load = function (index) {
            if (index >= assets.paths.music.length) {
                callback();
                return;
            }

            var path = assets.paths.music[index];
            assets.createMusic(path, function () {
                assets.loadCount += 1;
                //console.log("music loaded");
                setTimeout(load, 1, index + 1);
            });
        };

        load(0);
    },

    loadShadows: function (callback) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var names = Object.keys(assets.images);

        var load = function (index) {
            if (index >= names.length) {
                callback();
                return;
            }

            var name = names[index];
            var image = assets.images[name];

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "destination-in";
            ctx.drawImage(image, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            assets.createShadow(name, dataURL, function () {
                setTimeout(load, 1, index + 1);
            });
        };

        load(0);
    },

    loadAll: function (callback) {
        assets.totalCount += assets.paths.images.length;
        assets.totalCount += assets.paths.sounds.length;// * assets.channelCount;
        assets.totalCount += assets.paths.music.length;

        var onload = function () {
            if (assets.loadCount === assets.totalCount) {
                assets.loadShadows(function () {
                    assets.loading = false;
                    callback();
                });
            }
        };

        assets.loadImages(onload);
        assets.loadSounds(onload);
        assets.loadMusic(onload);
    }
};

function mapsDataFromEditor(data) {
    for (var k = 0; k < data.length; k++) {
        var name = data[k][0];
        var room = data[k][1];
        (function (name, room) {
            assets.createRoom(name, function () {
                backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
                for (var i = 0; i < room.tiles.length; i++) {
                    var tile = room.tiles[i];
                    var image = assets.images[tile.name];
                    var w = image.naturalWidth;
                    var h = image.naturalHeight;
                    backCtx.save();
                    backCtx.translate(tile.x + w/2, tile.y + h/2);
                    backCtx.rotate(-tile.rotation / 180 * Math.PI);
                    backCtx.drawImage(image, -w/2, -h/2);
                    backCtx.restore();
                }

                for (var i = 0; i < room.objects.length; i++) {
                    var object = room.objects[i];
                    gameloop.addInstance(object.name, object.x, object.y, 0, object.rotation);
                }
            });
        })(name, room);
    }
}

function resourcePaths(paths) {
    assets.paths.images = paths.images || [];
    assets.paths.sounds = paths.sounds || [];
    assets.paths.music  = paths.music  || [];
}







// TODO: temporary!
var scaleCanvas = document.createElement("canvas");
var scaleCtx = scaleCanvas.getContext("2d");

var scaleImage = function (image) {
    scaleCanvas.width = image.naturalWidth;
    scaleCanvas.height = image.naturalHeight;

    scaleCtx.clearRect(0, 0, scaleCanvas.width, scaleCanvas.height);
    scaleCtx.drawImage(image, 0, 0);

    var pixels = scaleCtx.getImageData(0, 0, scaleCanvas.width, scaleCanvas.height).data;
    //var array = scaleCtx.createImageData(2 * scaleCanvas.width, 2 * scaleCanvas.height);
    var scaledPixels = new Uint8ClampedArray(4 * scaleCanvas.width * scaleCanvas.height * 4);

    for (var i = 0; i < pixels.length; i += 4) {
        var red   = pixels[i];
        var green = pixels[i + 1];
        var blue  = pixels[i + 2];
        var alpha = pixels[i + 3];

        var j = i / 4;
        var x = j % scaleCanvas.width * 2;
        var y = Math.floor(j / scaleCanvas.width) * 2;

        putPixel(scaledPixels, scaleCanvas.width * 2, x + 0, y + 0, red, green, blue, alpha);
        putPixel(scaledPixels, scaleCanvas.width * 2, x + 1, y + 0, red, green, blue, alpha);
        putPixel(scaledPixels, scaleCanvas.width * 2, x + 0, y + 1, red, green, blue, alpha);
        putPixel(scaledPixels, scaleCanvas.width * 2, x + 1, y + 1, red, green, blue, alpha);
    }

    scaleCanvas.width = scaleCanvas.width * 2;
    scaleCanvas.height = scaleCanvas.height * 2;

    scaleCtx.clearRect(0, 0, scaleCanvas.width, scaleCanvas.height);
    var imgData = scaleCtx.createImageData(scaleCanvas.width, scaleCanvas.height);
    for (var i = 0; i < scaledPixels.length; i++) {
            imgData.data[i] = scaledPixels[i];
    }
    //imgData.data = scaledPixels;
    scaleCtx.putImageData(imgData, 0, 0);
    //scaleCtx.putImageData(new ImageData(scaledPixels, scaleCanvas.width, scaleCanvas.height), 0, 0);

    var scaledImage = new Image();
    scaledImage.src = scaleCanvas.toDataURL("image/png");
    return scaledImage;
};

var putPixel = function (pixels, width, x, y, red, green, blue, alpha) {
    var i = (x + y * width) * 4;
    pixels[i + 0] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
    pixels[i + 3] = alpha;
}

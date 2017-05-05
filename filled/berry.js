/*
 * berry.js 0.6.0
 * Copyright (c) 2015 Bauwen Demol
 * May be freely distributed under the MIT license.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


var world, view, object, draw, blendMode, color, transform, gradient,
    text, style, halign, valign, mouse, key, sound, image, sprite, math;

(function () {

    // Setup private variables and context properties

    var canvas = document.getElementById("game");

    if (!canvas) {
        canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
    }

    var context = canvas.getContext("2d");
    var worldWidth = canvas.width;
    var worldHeight = canvas.height;
    var worldBackground = "rgb(0, 0, 0)";
    var worldCurrent = null;
    var worldNext = null;
    var worldFps = 0;
    var previousFrameTime = 0;
    var viewX = 0;
    var viewY = 0;
    var objects = {};
    var instances = [];
    var instanceStates = {};
    var drawColor = "rgb(0, 0, 0)";
    var drawAlpha = 1;
    var drawGradient = null;
    var drawBlendMode = "source-over";
    var textFont = "Arial";
    var textSize = "16";
    var textStyle = "";
    var textHalign = "left";
    var textValign = "top";
    var keyHold = {};
    var keyPressed = {};
    var keyReleased = {};
    var mouseHold = {};
    var mousePressed = {};
    var mouseReleased = {};
    var mouseX = 0;
    var mouseY = 0;
    var destroyedObjects = [];
    var depthChanged = false;

    context.fillStyle = drawColor;
    context.strokeStyle = drawColor;
    context.globalAlpha = drawAlpha;
    context.globalCompositeOperation = drawBlendMode;
    context.font = textStyle + " " + textSize + "px " + textFont;
    context.textAlign = textHalign;
    context.textBaseline = textValign;

    for (var i = 0, keychar = "0"; i < 300; keychar = (++i).toString()) {
        keyHold[keychar] = false;
        keyPressed[keychar] = false;
        keyReleased[keychar] = false;
    }

    for (var button = 1; button <= 3; button++) {
        mouseHold[button] = false;
        mousePressed[button] = false;
        mouseReleased[button] = false;
    }


    // Prototype for a game object

    var gameObject = function (x, y, obj) {
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.object = obj;
        this.sprite = null;
        this.spriteImage = 0;
        this.spriteSpeed = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;
        this.persistent = false;

        this.__hitBox__ = [0, 0, 0, 0, 0, 0, 0, 0];
        this.__depth__ = 0;
        this.__widthPrevious__ = 0;
        this.__heightPrevious__ = 0;
        this.__anglePrevious__ = 0;

        this.main = function () {};
        this.dead = function () {};

        this.viewFollow = function () {
            view.follow(this);
        };

        this.collides = function (x, y, obj) {
            return object.collision(this, x, y, obj);
        };

        this.draw = function (outline) {
            draw.instance(this, outline);
        };

        this.drawHitBox = function (outline) {
            draw.hitBox(this, outline);
        };

        this.destroy = function () {
            object.destroy(this);
        };
    };

    gameObject.prototype = {
        get depth() {
            return this.__depth__;
        },

        set depth(value) {
            this.__depth__ = value;
            depthChanged = true;
        }
    };


    // The main game loop: updates I/O, background and game objects

    var mainloop = function (time) {
        worldFps = Math.min(Math.ceil(1000 / (time - previousFrameTime)), 60);
        previousFrameTime = time;

        if (worldNext) {
            if (worldCurrent)
                worldCurrent.leave();

            for (var i = 0; i < instances.length; i++) {
                instance = instances[i];

                if (!instance.persistent)
                    instances.splice(i--, 1);
            }

            objects = {};

            worldCurrent = worldNext;
            worldNext = null;
            worldWidth = worldCurrent.width;
            worldHeight = worldCurrent.height;

            if (worldCurrent.background)
                worldBackground = canvas.style.background = worldCurrent.background;

            worldCurrent.enter();
        }

        context.save();
        context.translate(-viewX, -viewY);
        context.clearRect(viewX, viewY, canvas.width, canvas.height);

        if (depthChanged) {
            instances.sort(
                function (a, b) {
                    return b.__depth__ - a.__depth__;
                }
            );

            depthChanged = false;
        }

        var copy = instances.slice();
        var instance;

        for (var i = 0, len = instances.length; i < len; i++) {
            instance = copy[i];
            
            /* DEACTIVATION OUTSIDE VIEW (example)
            if (instance.x < viewX - 12 || viewX + canvas.width + 12 < instance.x || instance.y < viewY - 12 || viewY + canvas.height + 12 < instance.y) {
                continue;
            }
            */

            if (instance.sprite)
                instance.spriteImage = (instance.spriteImage + instance.spriteSpeed) % instance.sprite.images.length;

            update(instance);
            instance.main();
        }

        while (destroyedObjects.length > 0) {
            instance = destroyedObjects.shift();
            instance.dead();
            instances.splice(instances.indexOf(instance), 1);

            var list = objects[instance.object];

            list.splice(list.indexOf(instance), 1);
        }

        for (var i = 0, keychar = "0"; i < 300; keychar = (++i).toString()) {
            keyPressed[keychar] = false;
            keyReleased[keychar] = false;
        }

        for (var button = 1; button <= 3; button++) {
            mousePressed[button] = false;
            mouseReleased[button] = false;
        }

        context.restore();
        window.requestAnimationFrame(mainloop);
    };


    // Update the I/O features by listening to window events

    window.addEventListener("keydown", function (evt) {
        if (!keyHold["17"])
            evt.preventDefault();

        if (!keyHold[evt.keyCode || evt.which])
            keyPressed[evt.keyCode || evt.which] = true;

        keyHold[evt.keyCode || evt.which] = true;
    });

    window.addEventListener("keyup", function (evt) {
        evt.preventDefault();

        keyHold[evt.keyCode || evt.which] = false;
        keyReleased[evt.keyCode || evt.which] = true;
    });

    window.addEventListener("mousedown", function (evt) {
        evt.preventDefault();

        if (!mouseHold[evt.which || evt.button])
            mousePressed[evt.which || evt.button] = true;

        mouseHold[evt.which || evt.button] = true;
    });

    window.addEventListener("mouseup", function (evt) {
        evt.preventDefault();

        mouseHold[evt.which || evt.button] = false;
        mouseReleased[evt.which || evt.button] = true;
    });

    window.addEventListener("mousemove", function (evt) {
        mouseX = evt.pageX - window.scrollX;
        mouseY = evt.pageY - window.scrollY;
    });

    window.addEventListener("load", mainloop);


    // All the different modules with their specific attributes and methods

    world = {
        create: function (body, width, height, background) {
            if (!body.hasOwnProperty("enter"))
                body.enter = function () {};
            if (!body.hasOwnProperty("leave"))
                body.leave = function () {};

            body.isWorld = true;
            body.width = Math.max(canvas.width, width || canvas.width);
            body.height =  Math.max(canvas.height, height || canvas.height);
            body.background = background;

            return body;
        },

        goto: function (world) {
            if (world.isWorld)
                worldNext = world;
        },

        restart: function () {
            if (worldCurrent)
                worldNext = worldCurrent;
        },

        get current() {
            return worldCurrent;
        },

        get background() {
            return worldBackground;
        },

        set background(background) {
            worldBackground = canvas.style.background = background;
        },

        get width() {
            return worldWidth;
        },

        set width(width) {
            worldWidth = Math.max(canvas.width, width);
        },

        get height() {
            return worldHeight;
        },

        set height(height) {
            worldHeight = Math.max(canvas.height, height);
        },

        get fps() {
            return worldFps;
        }
    };

    view = {
        get x() {
            return viewX;
        },

        set x(x) {
            viewX = Math.max(0, Math.min(x, worldWidth - canvas.width));
        },

        get y() {
            return viewY;
        },

        set y(y) {
            viewY = Math.max(0, Math.min(y, worldHeight - canvas.height));
        },

        get width() {
            return canvas.width;
        },

        set width(width) {
            canvas.width = width;
            worldWidth = Math.max(canvas.width, worldWidth);
        },

        get height() {
            return canvas.height;
        },

        set height(height) {
            canvas.height = height;
            worldHeight = Math.min(canvas.height, worldHeight);
        },

        follow: function(inst) {
            viewX = Math.max(0, Math.min(inst.x - canvas.width / 2, worldWidth - canvas.width));
            viewY = Math.max(0, Math.min(inst.y - canvas.height / 2, worldHeight - canvas.height));
        }
    };

    object = {
        create: function (x, y, obj) {
            obj.prototype = new gameObject(x, y, obj);

            var inst = new obj();

            instances.push(inst);
            instances.sort(
                function (a, b) {
                    return b.__depth__ - a.__depth__;
                }
            );

            if (!(obj in objects))
                objects[obj] = [];

            objects[obj].push(inst);
            
            update(inst);

            return inst;
        },

        destroy: function (inst) {
            destroyedObjects.push(inst);
        },

        getNumber: function (obj) {
            if (obj)
                if (objects[obj])
                    return objects[obj].length;
                else
                    return [];
            else
                return instances.length;
        },

        getInstances: function (obj) {
            if (obj)
                if (objects[obj])
                    return objects[obj].slice();
                else
                    return [];
            else
                return instances.slice();
        },

        collision: function (inst, x, y, obj) {
            var ax1 = x + inst.__hitBox__[0];
            var ay1 = y + inst.__hitBox__[1];
            var ax2 = x + inst.__hitBox__[2];
            var ay2 = y + inst.__hitBox__[3];
            var ax3 = x + inst.__hitBox__[4];
            var ay3 = y + inst.__hitBox__[5];
            var ax4 = x + inst.__hitBox__[6];
            var ay4 = y + inst.__hitBox__[7];

            var list;

            if (obj)
                if (toString.call(obj) === "[object Function]")
                    list = objects[obj] ? objects[obj] : [];
                else
                    list = [obj];
            else
                list = instances;

            var xMin = Math.min(ax1, ax2, ax3, ax4);
            var xMax = Math.max(ax1, ax2, ax3, ax4);
            var yMin = Math.min(ay1, ay2, ay3, ay4);
            var yMax = Math.max(ay1, ay2, ay3, ay4);

            for (var i = 0, len = list.length; i < len; i++) {
                var other = list[i];

                if (inst === other)
                    continue;

                var bx1 = other.x + other.__hitBox__[0];
                var by1 = other.y + other.__hitBox__[1];
                var bx2 = other.x + other.__hitBox__[2];
                var by2 = other.y + other.__hitBox__[3];
                var bx3 = other.x + other.__hitBox__[4];
                var by3 = other.y + other.__hitBox__[5];
                var bx4 = other.x + other.__hitBox__[6];
                var by4 = other.y + other.__hitBox__[7];

                if (xMax <= Math.min(bx1, bx2, bx3, bx4) || xMin >= Math.max(bx1, bx2, bx3, bx4)
                    || yMax <= Math.min(by1, by2, by3, by4) || yMin >= Math.max(by1, by2, by3, by4))
                    continue;

                if (inst.angle === 0
                    || rectangleOverlap(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4, bx1, by1, bx2, by2, bx3, by3, bx4, by4))
                    return other;
            }

            return null;
        }
    };

    draw = {
        shadowOn: function (color, alpha, blur, offsetX, offsetY) {
            context.shadowColor = "rgba" + color.substring(3, color.length - 1) + ", " + alpha + ")";
            context.shadowBlur = blur;
            context.shadowOffsetX = offsetX || 0;
            context.shadowOffsetY = offsetY || 0;
        },

        shadowOff: function () {
            context.shadowColor = "rgba(0, 0, 0, 0)";
        },

        get color() {
            return drawColor;
        },

        set color(color) {
            drawColor = context.fillStyle = context.strokeStyle = color;
        },

        get alpha() {
            return drawAlpha;
        },

        set alpha(alpha) {
            drawAlpha = context.globalAlpha = Math.max(0, Math.min(alpha, 1));
        },

        get gradient() {
            return drawGradient;
        },

        set gradient(gradient) {
            drawGradient = context.fillStyle = context.strokeStyle = gradient;
        },

        get blendMode() {
            return drawBlendMode;
        },

        set blendMode(blendMode) {
            drawBlendMode = context.globalCompositeOperation = blendMode;
        },

        resetBlendMode: function () {
            context.globalCompositeOperation = "source-over";
        },

        text: function (x, y, text, outline) {
            if (outline) {
                context.lineWidth = outline;
                context.strokeText(text, x, y);
            } else {
                context.fillText(text, x, y);
            }
        },

        rectangle: function (x1, y1, x2, y2, outline) {
            if (outline) {
                context.lineWidth = outline;
                context.strokeRect(Math.min(x1, x2) - 0.5, Math.min(y1, y2) - 0.5, Math.abs(x2 - x1) + 1, Math.abs(y2 - y1) + 1);
            } else {
                context.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
            }
        },

        line: function (x1, y1, x2, y2, width) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineWidth = width || 1;
            context.stroke();
        },

        triangle: function (x1, y1, x2, y2, x3, y3, outline) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x3, y3);
            context.closePath();

            if (outline) {
                context.lineWidth = outline;
                context.stroke();
            } else {
                context.fill();
            }
        },

        polygon: function (x1, y1) {
            context.beginPath();
            context.moveTo(x1, y1);

            var i;

            for (i = 2, len = arguments.length - 1; i < len; i += 2) {
                context.lineTo(arguments[i], arguments[i + 1]);
            }

            context.closePath();

            if (arguments[i]) {
                context.lineWidth = arguments[i];
                context.stroke();
            } else {
                context.fill();
            }
        },

        circle: function (x, y, radius, outline) {
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);

            if (outline) {
                context.lineWidth = outline;
                context.stroke();
            } else {
                context.fill();
            }
        },

        arc: function (x, y, radius, angle1, angle2, outline) {
            context.beginPath();
            context.arc(x, y, radius, angle1 / 180 * Math.PI, angle2 / 180 * Math.PI, true)

            if (outline) {
                context.lineWidth = outline;
                context.stroke();
            } else {
                context.fill();
            }
        },

        ring: function (x, y, radius1, radius2, outline) {
            context.beginPath();
            context.arc(x, y, Math.abs(radius2), 0, 2 * Math.PI, true);

            if (outline) {
                context.lineWidth = outline;
                context.stroke();
                context.beginPath();
                context.arc(x, y, Math.abs(radius), 0, 2 * Math.PI, true);
                context.stroke();
            } else {
                context.arc(x, y, Math.abs(radius), 0, 2 * Math.PI, false);
                context.fill();
            }
        },

        bezierCurve: function (px1, py1, cx1, cy1, px2, py2, outline) {
            context.beginPath();
            context.moveTo(px1, py1);
            context.quadraticCurveTo(cx1, cy1, px2, py2);

            if (outline) {
                context.lineWidth = outline;
                context.stroke();
            } else {
                context.fill();
            }
        },

        sprite: function (spr, index, x, y, xscale, yscale, angle) {
            xscale = xscale || 1;
            yscale = yscale || 1;
            angle = angle || 0;

            var img = spr.images[index % spr.images.length];

            if (!img.complete)
                return;

            context.save();
            context.translate(x, y);
            context.rotate(-angle / 180 * Math.PI);
            context.scale(xscale, yscale);
            context.drawImage(img, -spr.originX, -spr.originY);
            context.restore();
        },

        spritePart: function (spr, index, x, y, dx, dy, w, h, xscale, yscale, angle) {
            xscale = xscale || 1;
            yscale = yscale || 1;
            angle = angle || 0;

            var img = spr.images[index % spr.images.length];

            if (!img.complete)
                return;

            context.save();
            context.translate(x, y);
            context.rotate(-angle / 180 * Math.PI);
            context.scale(xscale, yscale);
            context.drawImage(img, dx, dy, w, h, -spr.originX, -spr.originY);
            context.restore();
        },

        instance: function (inst, outline) {
            if (inst.sprite) {
                draw.sprite(inst.sprite, Math.floor(inst.spriteImage), inst.x, inst.y, inst.scaleX,
                                                                    inst.scaleY, inst.angle);
            } else {
                draw.rectangleTransformed(inst.x, inst.y, inst.x + inst.width, inst.y + inst.height,
                                        inst.scaleX, inst.scaleY, 0, 0, inst.angle, outline);
            }
        },

        hitBox: function (inst, outline) {
            var x1 = inst.x + inst.__hitBox__[0];
            var y1 = inst.y + inst.__hitBox__[1];
            var x2 = inst.x + inst.__hitBox__[2];
            var y2 = inst.y + inst.__hitBox__[3];
            var x3 = inst.x + inst.__hitBox__[4];
            var y3 = inst.y + inst.__hitBox__[5];
            var x4 = inst.x + inst.__hitBox__[6];
            var y4 = inst.y + inst.__hitBox__[7];

            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x3, y3);
            context.lineTo(x4, y4);
            context.closePath();

            if (outline) {
                context.lineWidth = outline;
                context.stroke();
            } else {
                context.fill();
            }
        }
    };

    blendMode = {
        SRC_OVER: "source-over",
        SRC_ATOP: "source-atop",
        SRC_IN: "source-in",
        SRC_OUT: "source-out",
        DEST_OVER: "destination-over",
        DEST_ATOP: "destination-atop",
        DEST_IN: "destination-in",
        DEST_OUT: "destination-out",
        LIGHTER: "lighter",
        COPY: "copy",
        XOR: "xor",
        MULTIPLY: "multiply",
        SCREEN: "screen",
        OVERLAY: "overlay",
        DARKEN: "darken",
        LIGHTEN: "lighten",
        DODGE: "color-dodge",
        BURN: "color-burn",
        HARD: "hard-light",
        SOFT: "soft-light",
        DIFFERENCE: "difference",
        EXCLUSION: "exclusion",
        HUE: "hue",
        SATURATION: "saturation",
        COLOR: "color",
        LUMINOSITY: "luminosity"
    };

    color = {
        make: function (red, green, blue) {
            return "rgb(" + red + ", " + green + ", " + blue + ")";
        },

        getRed: function (color) {
            return parseInt(color.substring(4, color.indexOf(",")));
        },

        getGreen: function (color) {
            return parseInt(color.substring(color.indexOf(",") + 1, color.lastIndexOf(",")));
        },

        getBlue: function (color) {
            return parseInt(color.substring(color.lastIndexOf(",") + 1, color.length - 1));
        },

        WHITE: "rgb(255, 255, 255)",
        BLACK: "rgb(0, 0, 0)",
        LIGHTGRAY: "rgb(200, 200, 200)",
        GRAY: "rgb(128, 128, 128)",
        DARKGRAY: "rgb(40, 40, 40)",

        LIGHTRED: "rgb(255, 128, 128)",
        RED: "rgb(255, 0, 0)",
        DARKRED: "rgb(128, 0, 0)",

        LIGHTGREEN: "rgb(128, 255, 128)",
        GREEN: "rgb(0, 220, 0)",
        DARKGREEN: "rgb(0, 128, 0)",
        KHAKI: "rgb(160, 200, 70)",

        CYAN: "rgb(0, 255, 255)",
        LIGHTBLUE: "rgb(180, 255, 255)",
        BLUE: "rgb(0, 128, 255)",
        DARKBLUE: "rgb(0, 0, 200)",

        LIGHTYELLOW: "rgb(255, 255, 180)",
        YELLOW: "rgb(255, 255, 0)",
        DARKYELLOW: "rgb(210, 210, 0)",
        OLIVE: "rgb(128, 128, 0)",

        FUCHSIA: "rgb(255, 0, 255)",
        LIGHTPURPLE: "rgb(220, 128, 255)",
        PURPLE: "rgb(180, 0, 255)",
        DARKPURPLE: "rgb(100, 0, 180)",

        LIGHTORANGE: "rgb(255, 210, 128)",
        ORANGE: "rgb(255, 180, 0)",
        DARKORANGE: "rgb(200, 128, 0)",

        LIGHTBROWN: "rgb(200, 160, 60)",
        BROWN: "rgb(160, 110, 0)",
        DARKBROWN: "rgb(140, 60, 0)"
    };

    text = {
        loadFont: function (name, filename) {
            var css = document.createElement("style");

            css.innerHTML = "@font-face {font-family: " + name + "; src: url(" + filename + ");}";
            document.head.appendChild(css);
        },

        get font() {
            return textFont;
        },

        set font(font) {
            textFont = font;
            context.font = textStyle + " " + textSize + "px " + font;
        },

        get size() {
            return textSize;
        },

        set size(size) {
            textSize = size;
            context.font = textStyle + " " + size + "px " + textFont;
        },

        get style() {
            return textStyle;
        },

        set style(style) {
            textStyle = style;
            context.font = style + " " + textSize + "px " + textFont;
        },

        get halign() {
            return textHalign;
        },

        set halign(halign) {
            textHalign = context.textAlign = halign;
        },

        get valign() {
            return textValign;
        },

        set valign(valign) {
            textValign = context.textBaseline = valign;
        },

        getWidth: function (string) {
            return context.measureText(string).width;
        }
    };

    style = {
        NONE: "",
        BOLD: "bold",
        ITALIC: "italic",
        BOLD_ITALIC: "bold italic"
    };

    halign = {
        LEFT: "left",
        CENTER: "center",
        RIGHT: "right"
    };

    valign = {
        BOTTOM: "bottom",
        MIDDLE: "middle",
        TOP: "top"
    };

    gradient = {
        createLinear: function (x, y, len, dir) {
            dir = dir / 180 * Math.PI;

            return context.createLinearGradient(x, y, x + Math.cos(dir) * len, y - Math.sin(dir) * len);
        },

        createRadial: function (x, y, radius1, len, dir, radius2) {
            dir = dir / 180 * Math.PI;

            if (radius2 > radius1)
                radius2 = radius1;

            if (len > radius1 - radius2) {
                len = radius1 - radius2;
                radius1 += 0.01;
            }

            return context.createRadialGradient(x + Math.cos(dir) * len, y - Math.sin(dir) * len, radius2, x, y, radius1);
        },

        addColor: function (gradient, stop, color) {
            gradient.addColorStop(stop, color);
        }
    };

    transform = {
        begin: function () {
            context.save();
        },

        translate: function (x, y) {
            context.translate(x, y);
        },

        rotate: function (angle) {
            context.rotate(-angle / 180 * Math.PI);
        },

        scale: function (xscale, yscale) {
            context.scale(xscale, yscale);
        },

        end: function () {
            context.restore();
        }
    };

    mouse = {
        hold: function (button) {
            return mouseHold[button];
        },

        pressed: function (button) {
            return mousePressed[button];
        },

        released: function (button) {
            return mouseReleased[button];
        },

        get x() {
            return mouseX - canvas.getBoundingClientRect().left;
        },

        get y() {
            return mouseY - canvas.getBoundingClientRect().top;
        },

        LEFT: 1,
        MIDDLE: 2,
        RIGHT: 3
    };

    key = {
        hold: function (keychar) {
            return keyHold[keychar];
        },

        pressed: function (keychar) {
            return keyPressed[keychar];
        },

        released: function (keychar) {
            return keyReleased[keychar];
        },

        BACKSPACE: "8",
        TAB: "9",
        ENTER: "13",
        SHIFT: "16",
        CONTROL: "17",
        ALT: "18",
        CAPSLOCK: "20",
        ESCAPE: "27",
        SPACE: "32",
        PAGEUP: "33",
        PAGEDOWN: "34",
        END: "35",
        HOME: "36",
        LEFT: "37",
        UP: "38",
        RIGHT: "39",
        DOWN: "40",
        INSERT: "45",
        DELETE: "46",
        $0: "48",
        $1: "49",
        $2: "50",
        $3: "51",
        $4: "52",
        $5: "53",
        $6: "54",
        $7: "55",
        $8: "56",
        $9: "57",
        A: "65",
        B: "66",
        C: "67",
        D: "68",
        E: "69",
        F: "70",
        G: "71",
        H: "72",
        I: "73",
        J: "74",
        K: "75",
        L: "76",
        M: "77",
        N: "78",
        O: "79",
        P: "80",
        Q: "81",
        R: "82",
        S: "83",
        T: "84",
        U: "85",
        V: "86",
        W: "87",
        X: "88",
        Y: "89",
        Z: "90",
        SELECT: "93",
        NUMPAD0: "96",
        NUMPAD1: "97",
        NUMPAD2: "98",
        NUMPAD3: "99",
        NUMPAD4: "100",
        NUMPAD5: "101",
        NUMPAD6: "102",
        NUMPAD7: "103",
        NUMPAD8: "104",
        NUMPAD9: "105",
        MULTIPLY: "106",
        ADD: "107",
        SUBTRACT: "109",
        POINT: "110",
        DIVIDE: "111",
        F1: "112",
        F2: "113",
        F3: "114",
        F4: "115",
        F5: "116",
        F6: "117",
        F7: "118",
        F8: "119",
        F9: "120",
        F10: "121",
        F11: "122",
        F12: "123",
        NUMLOCK: "144",
        SCROLLLOCK: "145",
        SEMICOLON: "186",
        EQUAL: "187",
        COMMA: "188",
        DASH: "189",
        PERIOD: "190",
        SLASH: "191",
        BRACKETOPEN: "219",
        BACKSLASH: "220",
        BRACKETCLOSE: "221",
        QUOTESINGLE: "222"
    };

    sound = {
        load: function (filename) {
            var snd = new Audio();

            snd.src = filename;

            return snd;
        },

        play: function (snd, loop) {
            snd.loop = loop ? true : false;

            if (snd.readyState == 4)
                snd.currentTime = 0;

            snd.play();
        },

        pause: function (snd) {
            snd.pause();
        },

        resume: function (snd, loop) {
            snd.loop = loop ? true : false;
            snd.play();
        },

        stop: function (snd) {
            if (snd.readyState == 4)
                snd.currentTime = 0;

            snd.pause();
        },

        mute: function (snd) {
            snd.muted = true;
        },

        unmute: function (snd) {
            snd.muted = false;
        },

        setVolume: function (snd, volume) {
            snd.volume = volume;
        },

        getVolume: function (snd) {
            return snd.volume;
        },

        setSpeed: function (snd, speed) {
            if (snd.readyState == 4)
                snd.playbackRate = speed;
        },

        getSpeed: function (snd) {
            return snd.playbackRate;
        },

        setTime: function (snd, time) {
            if (snd.readyState == 4)
                snd.currentTime = time;
        },

        getTime: function (snd) {
            return snd.currentTime;
        },

        getLength: function (snd) {
            return snd.duration;
        }
    };

    image = {
        load: function (filename) {
            var img = new Image();

            img.src = filename;

            return img;
        },

        getWidth: function (img) {
            return img.naturalWidth;
        },

        getHeight: function (img) {
            return img.naturalHeight;
        }
    };

    sprite = {
        create: function (ox, oy) {
            return {
                images: [],
                originX: ox || 0,
                originY: oy || 0
            }
        },

        add: function (spr, img) {
            spr.images.push(img);
        },

        remove: function (spr, index, count) {
            spr.images.splice(index, count || 1);
        },

        setOrigin: function (spr, x, y) {
            spr.originX = x;
            spr.originY = y;
        },

        getOriginX: function (spr) {
            return spr.originX;
        },

        getOriginY: function (spr) {
            return spr.originY;
        },

        getImages: function (spr) {
            return spr.images.slice();
        },

        getNumber: function (spr) {
            return spr.images.length;
        }
    };

    math = {
        direction: function (x1, y1, x2, y2) {
            return -Math.atan2(y2 - y1, x2 - x1) / Math.PI * 180;
        },

        distance: function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        },

        vectorX: function (length, direction) {
            return Math.cos(direction / 180 * Math.PI) * length;
        },

        vectorY: function (length, direction) {
            return -Math.sin(direction / 180 * Math.PI) * length;
        },

        degrees: function (radians) {
            return radians / Math.PI * 180;
        },

        radians: function (degrees) {
            return degrees / 180 * Math.PI;
        },

        abs: function (x) {
            return Math.abs(x);
        },

        sign: function (x) {
            return x > 0 ? 1 : x < 0 ? -1 : 0;
        },

        sqr: function (x) {
            return x * x;
        },

        power: function (x, n) {
            return n ? Math.pow(x, n) : Math.exp(x);
        },

        sqrt: function (x) {
            return Math.sqrt(x);
        },

        root: function(x, n) {
            return Math.pow(x, 1 / n);
        },

        log: function (b, x) {
            return x ? Math.log(x) / Math.log(b) : Math.log(b);
        },

        floor: function (x) {
            return Math.floor(x);
        },

        ceil: function (x) {
            return Math.ceil(x);
        },

        round: function (x) {
            return Math.round(x);
        },

        sin: function (x) {
            return Math.sin(x);
        },

        cos: function (x) {
            return Math.cos(x);
        },

        tan: function (x) {
            return Math.tan(x);
        },

        asin: function (x) {
            return Math.asin(x);
        },

        acos: function (x) {
            return Math.acos(x);
        },

        atan: function (x) {
            return Math.atan(x);
        },

        atan2: function (y, x) {
            return Math.atan2(y, x);
        },

        clamp: function (x, a, b) {
            return Math.max(a, Math.min(x, b));
        },

        min: function () {
            return Math.min.apply(Math.min, arguments);
        },

        max: function () {
            return Math.max.apply(Math.max, arguments);
        },

        mean: function () {
            var sum = 0;
            var len = arguments.length;

            for (var i = 0; i < len; i++)
                sum += arguments[i];

            return sum / len;
        },

        median: function () {
            arguments.sort();

            var length = arguments.length;
            var middle = Math.floor(length / 2);

            return length % 2 == 0 ? (arguments[middle - 1] + arguments[middle]) / 2
                                    : arguments[middle];
        },

        random: function (x) {
            return x ? Math.random() * x : Math.random();
        },

        random_range: function (x, y) {
            return x + Math.random() * (y - x);
        },

        irandom: function (x) {
            return Math.floor(Math.random() * (x + 1));
        },

        irandom_range: function (x, y) {
            return Math.floor(x + Math.random() * (y - x + 1));
        },

        rotatePolygon: function (ox, oy, angle) {
            var length = arguments.length;

            if (length < 5 || length % 2 == 0)
                return [];

            if (angle == 0)
                return [arguments[3], arguments[4], arguments[5], arguments[6],
                        arguments[7], arguments[8], arguments[9], arguments[10]];

            var points = [];

            for (var i = 3; i < length; i += 2) {
                var dx = ox - arguments[i];
                var dy = oy - arguments[i + 1];
                var len = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
                var dir = angle / 180 * Math.PI - Math.atan2(dy, dx);

                points.push(ox - Math.cos(dir) * len);
                points.push(oy + Math.sin(dir) * len);
            }

            return points;
        },

        PI: 3.14159265359,
        E: 2.71828182846
    };

    function rectangleOverlap() {
        var length = arguments.length;

        if (length < 16)
            return false;

        for (var i = 0; i < 4; i++) {
            var ax = arguments[2 + 4 * i] - arguments[0 + Math.floor(i / 2) * 8];
            var ay = arguments[3 + 4 * i] - arguments[1 + Math.floor(i / 2) * 8];
            var min1 = min2 = Infinity;
            var max1 = max2 = -Infinity;

            for (var dot, j = 0; j < length / 2; j += 2) {
                dot = ax * arguments[j] + ay * arguments[j + 1];
                min1 = Math.min(dot, min1);
                max1 = Math.max(dot, max1);

                dot = ax * arguments[j + length / 2] + ay * arguments[j + length / 2 + 1];
                min2 = Math.min(dot, min2);
                max2 = Math.max(dot, max2);
            }

            if (max1 <= min2 || max2 <= min1)
                return false;
        }

        return true;
    }

    function update(instance) {
        var width, height, ox, oy;

        if (instance.sprite) {
            width = instance.width = instance.sprite.images[Math.floor(instance.spriteImage)]
                                                    .naturalWidth * Math.abs(instance.scaleX);
            height = instance.height = instance.sprite.images[Math.floor(instance.spriteImage)]
                                                    .naturalHeight * Math.abs(instance.scaleY);
            ox = -instance.sprite.originX * Math.abs(instance.scaleX);
            oy = -instance.sprite.originY * Math.abs(instance.scaleY);
        } else {
            width = instance.width * Math.abs(instance.scaleX);
            height = instance.height * Math.abs(instance.scaleY);
            ox = 0;
            oy = 0;
        }

        instance.angle %= 360;

        if (instance.angle !== instance.__anglePrevious__
            || width !== instance.__widthPrevious__
            || height !== instance.__heightPrevious__) {
            instance.__hitBox__ = math.rotatePolygon(0, 0, instance.angle, ox, oy,
                                    ox + width, oy, ox + width, oy + height, ox, oy + height);
        }

        instance.__anglePrevious__ = instance.angle;
        instance.__widthPrevious__ = width;
        instance.__heightPrevious__ = height;
    }
})()

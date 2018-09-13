var IMAGES = {};

var imagePatterns = {
    "img_spike": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSpike(ctx, "black", "rgb(160, 160, 160)", "rgb(120, 120, 120)");
        }
    },
    
    "img_spike_type1": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSpike(ctx, "black", "rgb(170, 70, 70)", "rgb(130, 30, 30)");
        }
    },
    
    "img_spike_type1_outline": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSpikeOutline(ctx, "rgb(80, 80, 80)", "rgb(170, 70, 70)", "rgb(130, 30, 30)");
        }
    },
    
    "img_spike_type2": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSpike(ctx, "black", "rgb(70, 170, 170)", "rgb(30, 130, 130)");
        }
    },
    
    "img_spike_type2_outline": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSpikeOutline(ctx, "rgb(80, 80, 80)", "rgb(70, 170, 170)", "rgb(30, 130, 130)");
        }
    },
    
    "img_spike_shadow": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSpike(ctx, "black", "black", "black");
        }
    },
    
    "img_spike_outline_shadow": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSpikeOutline(ctx, "black", "black", "black");
        }
    },
    
    "img_switch_type1": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSwitch(ctx, "rgb(170, 70, 70)", "rgb(130, 30, 30)");
        }
    },
    
    "img_switch_type2": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSwitch(ctx, "rgb(70, 170, 170)", "rgb(30, 130, 130)");
        }
    },
    
    "img_switch_shadow": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            drawSwitch(ctx, "black", "black");
        }
    },
    
    "img_rocket": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            var s = 10;
            var t = 6;
            var o = OUTLINE;

            ctx.fillStyle = "black";
            ctx.fillRect(s - o, CELL / 2 - t - o, CELL / 1.6 - s + 2 * o, 2 * t + 2 * o);

            ctx.beginPath();
            ctx.arc(CELL / 1.6, CELL / 2, t + o, -Math.PI / 2, Math.PI / 2);
            ctx.fill();

            ctx.fillStyle = "rgb(160, 120, 80)";
            ctx.fillRect(s, CELL / 2 - t, CELL / 1.6 - s, 2 * t);

            ctx.beginPath();
            ctx.arc(CELL / 1.6, CELL / 2, t, -Math.PI / 2, Math.PI / 2);
            ctx.fill();
        }
    },
    
    "img_rocket_shadow": {
        width: CELL,
        height: CELL,
        draw: function (ctx) {
            var s = 10;
            var t = 6;
            var o = OUTLINE;

            ctx.fillStyle = "black";
            ctx.fillRect(s - o, CELL / 2 - t - o, CELL / 1.6 - s + 2 * o, 2 * t + 2 * o);

            ctx.beginPath();
            ctx.arc(CELL / 1.6, CELL / 2, t + o, -Math.PI / 2, Math.PI / 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.fillRect(s, CELL / 2 - t, CELL / 1.6 - s, 2 * t);

            ctx.beginPath();
            ctx.arc(CELL / 1.6, CELL / 2, t, -Math.PI / 2, Math.PI / 2);
            ctx.fill();
        }
    },
    
    "img_anti": {
        width: CELL * 6,
        height: CELL * 6,
        draw: function (ctx) {
            var s = 6;
            var color = "rgb(220, 20, 20)";
            
            ctx.save();
            ctx.translate(s, s);
            ctx.rotate(0);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.save();
            ctx.translate(CELL * 6 - s, s);
            ctx.rotate(Math.PI / 2);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.save();
            ctx.translate(s, CELL * 6 - s);
            ctx.rotate(Math.PI / 2 * 3);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.save();
            ctx.translate(CELL * 6 - s, CELL * 6 - s);
            ctx.rotate(Math.PI);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.restore();
        }
    },
    
    "img_anti_dark": {
        width: CELL * 6,
        height: CELL * 6,
        draw: function (ctx) {
            var s = 6;
            var color = "black";
            
            ctx.save();
            ctx.translate(s, s);
            ctx.rotate(0);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.save();
            ctx.translate(CELL * 6 - s, s);
            ctx.rotate(Math.PI / 2);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.save();
            ctx.translate(s, CELL * 6 - s);
            ctx.rotate(Math.PI / 2 * 3);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.save();
            ctx.translate(CELL * 6 - s, CELL * 6 - s);
            ctx.rotate(Math.PI);
            drawAntiCurve(ctx, color);
            ctx.restore();
            
            ctx.restore();
        }
    }
};

function drawSpike(ctx, color1, color2, color3) {
    var d = CELL / 6;
    var g = 5;
    var o = OUTLINE + 1;
    
    ctx.save();
    ctx.translate(CELL / 2, CELL / 2);
    
    ctx.lineWidth = 7;
    ctx.strokeStyle = color1;
    ctxStrokeCircle(ctx, 0, 0, CELL / 8);
    
    ctxFillTriangle(ctx, d - o, -g - o, d - o, g + o, 2 * d + o, 0);
    ctxFillTriangle(ctx, -d + o, -g - o, -d + o, g + o, -2 * d - o, 0);
    ctxFillTriangle(ctx, -g - o, d - o, g + o, d - o, 0, 2 * d + o);
    ctxFillTriangle(ctx, -g - o, -d + o, g + o, -d + o, 0, -2 * d - o);
    
    ctx.lineWidth = 5;
    ctx.strokeStyle = color2;
    ctxStrokeCircle(ctx, 0, 0, CELL / 8);
    
    ctx.fillStyle = color3;
    ctxFillTriangle(ctx, d, -g, d, g, 2 * d, 0);
    ctxFillTriangle(ctx, -d, -g, -d, g, -2 * d, 0);
    ctxFillTriangle(ctx, -g, d, g, d, 0, 2 * d);
    ctxFillTriangle(ctx, -g, -d, g, -d, 0, -2 * d);
    
    ctx.restore();
}

function drawAntiCurve(ctx, color) {
    var s = 2;
    var r = 6;
    var l = 10;
    var o = OUTLINE;

    ctx.fillStyle = "rgb(60, 60, 60)";

    ctx.beginPath();
    ctx.arc(s, s, r + o, Math.PI-0.2, Math.PI / 2 * 3+0.1);
    ctx.fill();

    ctx.fillRect(s - r - o, s, r + 2 * o, l + o);
    ctx.fillRect(s, s - r - o, l + o, r + 2 * o);

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(s, s, r, Math.PI, Math.PI / 2 * 3);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(s - r - 1, s);
    ctx.lineTo(s, s - r - 1);
    ctx.lineTo(s, s);
    ctx.fill();

    ctx.fillRect(s - r, s, r, l);
    ctx.fillRect(s, s - r, l, r);
}

function drawSpikeOutline(ctx, color1, color2, color3) {
    var d = CELL / 6;
    var g = 5;
    var o = OUTLINE + 1;
    
    ctx.save();
    ctx.translate(CELL / 2, CELL / 2);
    
    ctx.globalAlpha = 0.7;
    
    ctx.lineWidth = 4;
    ctx.strokeStyle = color1;
    ctxStrokeCircle(ctx, 0, 0, CELL / 8);
    
    ctx.lineWidth = 2;
    ctxStrokeTriangle(ctx, d - o, -g - o, d - o, g + o, 2 * d + o, 0);
    ctxStrokeTriangle(ctx, -d + o, -g - o, -d + o, g + o, -2 * d - o, 0);
    ctxStrokeTriangle(ctx, -g - o, d - o, g + o, d - o, 0, 2 * d + o);
    ctxStrokeTriangle(ctx, -g - o, -d + o, g + o, -d + o, 0, -2 * d - o);
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = color2;
    ctxStrokeCircle(ctx, 0, 0, CELL / 8);
    
    ctx.lineWidth = 3;
    ctx.fillStyle = color3;
    ctxStrokeTriangle(ctx, d, -g, d, g, 2 * d, 0);
    ctxStrokeTriangle(ctx, -d, -g, -d, g, -2 * d, 0);
    ctxStrokeTriangle(ctx, -g, d, g, d, 0, 2 * d);
    ctxStrokeTriangle(ctx, -g, -d, g, -d, 0, -2 * d);
    
    ctx.globalAlpha = 1;
    
    ctx.restore();
}

function drawSwitch(ctx, color1, color2) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 7;

    ctxDrawLine(ctx, CELL / 2, CELL / 2, CELL / 2, CELL - 6);
    ctxDrawLine(ctx, CELL / 2, CELL / 2 + 2, 10, 12);
    ctxDrawLine(ctx, CELL / 2, CELL / 2 + 2, CELL - 10, 12);
    ctxStrokeCircle(ctx, CELL / 2, CELL / 2, CELL / 2.7);

    ctx.lineWidth = 5;

    ctx.strokeStyle = color1;
    ctxDrawLine(ctx, CELL / 2, CELL / 2, CELL / 2, CELL - 6);
    ctxDrawLine(ctx, CELL / 2, CELL / 2 + 2, 10, 12);
    ctxDrawLine(ctx, CELL / 2, CELL / 2 + 2, CELL - 10, 12);

    ctx.strokeStyle = color2;
    ctxStrokeCircle(ctx, CELL / 2, CELL / 2, CELL / 2.7);
}

function createImages() {
    var imageCanvas = document.createElement("canvas");
    var imageCtx = imageCanvas.getContext("2d");
    
    var getImage = function (pattern) {
        imageCanvas.width = pattern.width;
        imageCanvas.height = pattern.height;
        
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        pattern.draw(imageCtx);
        
        var image = new Image();
        image.src = imageCanvas.toDataURL();
        
        return image;
    };
    
    for (var name in imagePatterns) {
        var pattern = imagePatterns[name];
        IMAGES[name] = getImage(pattern);
    }
}

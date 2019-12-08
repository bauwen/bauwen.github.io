var BACKGROUNDS = [];
var BLOCKS = [];


// PATTERN 1

var backgroundPattern1 = {
    size: 96,
    background: "rgb(20, 210, 210)",
    draw: function (pctx) {
        /*
        var s = 10;
        pctx.fillStyle = "rgb(20, 200, 200)";
        pctx.fillRect(s, s, 96 - 2 * s, 96 - 2 * s);
        
        */
        pctx.fillStyle = "rgb(15, 215, 215)";
        pctx.beginPath();
        pctx.arc(48, 48, 32, 0, 2 * Math.PI);
        pctx.fill();
        //*/
    }
};

var blockPattern1 = {
    size: CELL,
    background: "rgb(220, 220, 20)",
    draw: function (pctx) {
        
        /*
        // "DOTS"
        pctx.fillStyle = "rgb(215, 215, 15)";
        pctx.beginPath();
        pctx.arc(CELL / 2, CELL / 2, CELL / 3, 0, 2 * Math.PI);
        pctx.fill();
        */
        
        
        var s = 10;
        
        pctx.fillStyle = "rgb(215, 215, 15)";
        //pctx.fillRect(0, CELL / 2 - s, CELL, 2 * s);
        
        pctx.fillRect(0, CELL / 2, CELL, CELL / 2);
        
        //var t = 10;
        //pctx.fillRect(CELL / 2 - t, CELL / 2 - t, 2 * t, 2 * t);
        
        /*
        // CAN BE USED: "RINGS"
        pctx.strokeStyle = "rgb(210, 210, 10)";
        pctx.lineWidth = 10;
        pctx.beginPath();
        pctx.arc(CELL / 2, CELL / 2, CELL / 3.5, 0, 2 * Math.PI);
        pctx.stroke();
        */
    }
};


// PATTERN 2

var backgroundPattern2 = {
    size: 96,
    background: "rgb(100, 180, 60)",
    draw: function (pctx) {
        pctx.fillStyle = "rgb(103, 183, 63)";
        
        var CELL = 96;
        
        pctx.beginPath();
        pctx.moveTo(CELL / 2, 0);
        pctx.lineTo(CELL, CELL / 2);
        pctx.lineTo(CELL / 2, CELL);
        pctx.lineTo(0, CELL / 2);
        pctx.closePath();
        pctx.fill();
    }
};

/* BROWNS DIAMONDS
{
    size: 96,
    background: "rgb(140, 80, 40)",
    draw: function (pctx) {
        pctx.fillStyle = "rgb(143, 83, 43)";
        
        var CELL = 96;
        
        pctx.beginPath();
        pctx.moveTo(CELL / 2, 0);
        pctx.lineTo(CELL, CELL / 2);
        pctx.lineTo(CELL / 2, CELL);
        pctx.lineTo(0, CELL / 2);
        pctx.closePath();
        pctx.fill();
    }
};
*/

var blockPattern2 = {
    size: CELL,
    background: "rgb(170, 110, 50)",//"rgb(40, 180, 60)",
    draw: function (pctx) {
        
        var s = 2;
        
        pctx.fillStyle = "rgb(165, 105, 45)"; // "rgb(155, 95, 55)";
        //pctx.fillRect(CELL / 2, 0, CELL / 2, CELL);
        //pctx.fillRect(CELL / 2 - s, CELL / 2 - s, 2 * s, 2 * s);
        
        //pctx.globalAlpha = 0.05;
        
        
        pctx.beginPath();
        pctx.moveTo(CELL / 2, s);
        pctx.lineTo(CELL - s, CELL / 2);
        pctx.lineTo(CELL / 2, CELL - s);
        pctx.lineTo(s, CELL / 2);
        pctx.closePath();
        pctx.fill();
        
        /*
        // RINGS
        pctx.strokeStyle = "rgb(30, 170, 50)";
        pctx.lineWidth = 10;
        pctx.beginPath();
        pctx.arc(CELL / 2, CELL / 2, CELL / 4, 0, 2 * Math.PI);
        pctx.stroke();
        */
        
        /*
        CAN BE USED: WIGGLE
        pctx.strokeStyle = "rgb(30, 170, 50)";
        pctx.lineWidth = 8;
        
        var y = 8;
        
        pctx.beginPath();
        pctx.moveTo(0, y);
        pctx.lineTo(CELL / 2, CELL - y);
        pctx.stroke();
        
        ctx.beginPath();
        pctx.moveTo(CELL, y);
        pctx.lineTo(CELL / 2, CELL - y);
        pctx.stroke();
        */
    }
};


// PATTERN 3

var backgroundPattern3 = {
    size: 96,
    background: "rgb(130, 20, 20)",
    draw: function (pctx) {
        pctx.strokeStyle = "rgb(120, 20, 20)";
        pctx.lineWidth = 10;
        
        var x = 6;
        var y = x;
        var r = 12;
        
        pctx.beginPath();
        pctx.moveTo(x, y);
        pctx.lineTo(CELL - x, CELL - y);
        pctx.stroke();
        
        ctx.beginPath();
        pctx.moveTo(x, CELL - y);
        pctx.lineTo(CELL - x, y);
        pctx.stroke();
    }
};

var blockPattern3 = {
    size: CELL,
    background: "rgb(130, 140, 140)",
    draw: function (pctx) {
        pctx.strokeStyle = "rgb(125, 135, 135)";
        pctx.lineWidth = 8;
        
        var y = 10;
        var d = -2;
        
        pctx.beginPath();
        pctx.moveTo(d, y + d);
        pctx.lineTo(CELL / 2 - d, CELL - y - d);
        pctx.stroke();
        
        ctx.beginPath();
        pctx.moveTo(CELL - d, y + d);
        pctx.lineTo(CELL / 2 + d, CELL - y - d);
        pctx.stroke();
    }
};


// PATTERN 4

var backgroundPattern4 = {
    size: 96,
    background: "rgb(200, 200, 200)",
    draw: function (pctx) {
        pctx.strokeStyle = "rgb(205, 205, 205)";
        pctx.lineWidth = 10;
        pctx.beginPath();
        pctx.arc(CELL / 2, CELL / 2, CELL / 4, 0, 2 * Math.PI);
        pctx.stroke();
    }
};

var blockPattern4 = {
    size: CELL,
    background: "rgb(220, 220, 220)",
    draw: function (pctx) {
        pctx.strokeStyle = "rgb(210, 210, 210)";
        pctx.lineWidth = 8;
        
        var x = 6;
        var y = x;
        var r = 8;
        
        pctx.beginPath();
        pctx.moveTo(x, CELL / 2);
        pctx.lineTo(CELL - x, CELL / 2);
        pctx.stroke();
        
        ctx.beginPath();
        pctx.moveTo(CELL / 2, y);
        pctx.lineTo(CELL / 2, CELL - y);
        pctx.stroke();
        
        pctx.fillStyle = "rgb(210, 210, 210)";
        pctx.beginPath();
        pctx.arc(CELL / 2, CELL / 2, r, 0, 2 * Math.PI);
        pctx.fill();
    }
};



function createPatterns(callback) {
    var patternCanvas = document.createElement("canvas");
    var patternCtx = patternCanvas.getContext("2d");
    
    var getBackgroundImage = function (pattern) {
        var imageCanvas = document.createElement("canvas");
        var imageCtx = imageCanvas.getContext("2d");
        
        patternCanvas.width = pattern.size;
        patternCanvas.height = pattern.size;
        
        patternCtx.fillStyle = pattern.background;
        patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
        pattern.draw(patternCtx);
        
        imageCanvas.width = canvas.width + 3 * pattern.size;
        imageCanvas.height = canvas.height + 3 * pattern.size;
        
        //imageCanvas.width = 4000;//canvas.width + 2 * pattern.size;
        //imageCanvas.height = 4000;//canvas.height + 2 * pattern.size;
        
        var w = Math.floor(imageCanvas.width / patternCanvas.width);
        var h = Math.floor(imageCanvas.height / patternCanvas.height);
        
        for (var i = 0; i < w; i++) {
            for (var j = 0; j < h; j++) {
                imageCtx.drawImage(patternCanvas, i * patternCanvas.width, j * patternCanvas.height);
            }
        }
        
        /*var image = new Image();
        image.src = imageCanvas.toDataURL();*/
        return imageCanvas;
    };
    
    var getBlockImage = function (pattern) {
        var imageCanvas = document.createElement("canvas");
        var imageCtx = imageCanvas.getContext("2d");
        
        imageCanvas.width = pattern.size;
        imageCanvas.height = pattern.size;
        
        imageCtx.fillStyle = pattern.background;
        imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
        pattern.draw(imageCtx);
        
        return imageCanvas;
    };
    
    var getBackgroundImageFrom = function (pattern) {
        return {
            image: getBackgroundImage(pattern),
            patternSize: pattern.size
        };
    }
    
    BACKGROUNDS = [
        getBackgroundImageFrom(backgroundPattern1),
        getBackgroundImageFrom(backgroundPattern2),
        getBackgroundImageFrom(backgroundPattern3),
        getBackgroundImageFrom(backgroundPattern4)
    ];
    
    BLOCKS = [
        getBlockImage(blockPattern1),
        getBlockImage(blockPattern2),
        getBlockImage(blockPattern3),
        getBlockImage(blockPattern4)
    ];
}


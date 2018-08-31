var centerX = canvas.width / 2;
var centerY = canvas.height;// / 4 * 3;
var angleLength = 340;//300;
var radiusRatio = 1.4 - 0.2//1.2;

var circX = canvas.width / 2;
var circY = 375 + 50 + 50;//canvas.height / 6 * 5;
var circYStart = circY;

if (warpType === 2) {
    circY = canvas.height - circY;
}

function pointDirection(x1, y1, x2, y2) {
    return Math.atan2(y1 - y2, x2 - x1);
}

function pointDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function transformPoint(x, y) {
    if (warpType === 0) {
        return {
            x: x,
            y: y,
        };
    } else if (warpType === 1) {
        var angle = (centerX - x) / angleLength * Math.PI + Math.PI / 2;
        var radius = (centerY - y) / radiusRatio;
        
        //var angle = pointDirection(centerX, centerY, x, y);
        //var radius = pointDistance(centerX, centerY, x, y);
        
        return {
            x: circX + Math.cos(angle) * radius,
            y: circY - Math.sin(angle) * radius,
        };
    } else if (warpType === 2) {
        var cy = canvas.height - centerY;
        
        var angle = (x - centerX) / angleLength * Math.PI - Math.PI / 2 * 3;
        var radius = (cy - y) / radiusRatio;
        
        return {
            x: circX + Math.cos(angle) * radius,
            y: circY - Math.sin(angle) * radius,
        };
    }
}

function transformRectangle(x1, y1, width, height) {
    var x2 = x1 + width;
    var y2 = y1 + height;
    
    var point1 = transformPoint(x1, y1);
    var point2 = transformPoint(x2, y1);
    var point3 = transformPoint(x2, y2);
    var point4 = transformPoint(x1, y2);
    
    return {
        x1: point1.x,
        y1: point1.y,
        x2: point2.x,
        y2: point2.y,
        x3: point3.x,
        y3: point3.y,
        x4: point4.x,
        y4: point4.y,
    };
}

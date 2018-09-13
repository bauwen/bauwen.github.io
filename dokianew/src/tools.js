function loadLevelEditorWorlds(name, data) {
    WORLDS = data;
}

function loadWorld(world) {
    var f = CELL / 32;
    
    game.scene.width = world.width * f;
    game.scene.height = world.height * f;
    game.ctx.canvas.width = world.width * f;
    game.ctx.canvas.height = world.height * f;
    //game.ctx.canvas.backgroundColor = world.background;
    
    var layer = world.layers[0];
    
    for (var i = 0; i < layer.length; i++) {
        var thing = layer[i];
        
        switch (thing.name) {
            case "obj_spike_wall_clockwise":
                game.createInstance("obj_spike_wall", thing.x * f, thing.y * f).clockwise = true;
                break;
                
            case "obj_spike_wall_counterclockwise":
                game.createInstance("obj_spike_wall", thing.x * f, thing.y * f).clockwise = false;
                break;
            
            default:
                game.createInstance(thing.name, thing.x * f, thing.y * f);
                break;
        }
    }
}

function setQuake() {
    quake = true;
    quakeTimer = 25;
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function strokeCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function fillCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function fillTriangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
}

function strokeTriangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();
}

function ctxDrawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function ctxStrokeCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function ctxFillCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function ctxFillTriangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
}

function ctxStrokeTriangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();
}

function isInBox(mx, my, x, y, w, h) {
    return x < mx && mx <= x + w && y < my && my <= y + h;
}

function mouseInBox(x, y, w, h) {
    return isInBox(game.mouseX, game.mouseY, x, y, w, h);
}

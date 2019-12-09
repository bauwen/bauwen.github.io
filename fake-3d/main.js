// options

var CANVAS_SIZE = 240;  // pixel width and pixel height of each canvas
var PARTS = 240;        // number of horizontal lines draw in first person
var RANGE = 16;         // number of blocks that get rendered in distance
var GRID_SIZE = 32;     // size of the map grid
var FOV = Math.PI / 3;  // field of view (radians)
var GHOST = false;      // whether the player can move through walls
var OUTLINE = true;     // whether to draw an outline (celshading)
var THICKNESS = 2;      // thickness of the outline if present
var LIGHTING = true;    // whether to enable lighting in top down
var FISHEYE = false;    // whether to enable fisheye lens effect
var C_FLOOR = "beige";  // color of the floor
var C_SKY = "cyan";     // color of the sky


// input (keyboard)

var SHIFT = 16;
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

var keyboard = {
    SHIFT: false,
    LEFT: false,
    UP: false,
    RIGHT: false,
    DOWN: false,
};
window.onkeydown = function (event) {
    var key = event.which || event.keyCode;
    keyboard[key] = true;
};
window.onkeyup = function (event) {
    var key = event.which || event.keyCode;
    keyboard[key] = false;
};


// input (gamepad)

var controller;

function getGamepadIfAvailable() {
    var gamepads;
    if (navigator.getGamepads) {
        gamepads = navigator.getGamepads();
    } else if (navigator.webkitGetGamepads) {
        gamepads = navigator.webkitGetGamepads();
    } else {
        return null;
    }
    if (!gamepads) return null;
    return gamepads.length ? gamepads[0] : null;
}

var checkForGamepad = setInterval(function () {
    controller = getGamepadIfAvailable();
    if (controller) {
        clearInterval(checkForGamepad);
        setInterval(function () {
            controller = getGamepadIfAvailable();
        }, navigator.userAgent.indexOf("Firefox") < 0 ? 60 : 2000);
    }
}, 1000);

function isControllerButtonPressed(buttonIndex) {
    if (!controller) return false;
    var b = controller.buttons[buttonIndex];
    if (typeof b === "object") {
        return b.pressed;
    }
    return b > 0;
}

var controllerButtons = {
    "0": false,
    "1": false,
};


// grid functions

var newGridListeners = [];

function addNewGridListener(callback) {
    newGridListeners.push(callback);
}

function generateNewGrid() {
    grid = [];
    for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        var xx = i % GRID_SIZE;
        var yy = Math.floor(i / GRID_SIZE);
        if (Math.random() < 0.3 && Math.floor(player.x) != xx && Math.floor(player.y) != yy) {
            var r = Math.floor(Math.random() * 200) + 50;
            var g = Math.floor(Math.random() * 200) + 50;
            var b = Math.floor(Math.random() * 200) + 50;
            grid.push(r + g * 256 + b * 256 * 256);
        } else {
            grid.push(0);
        }
    }
    grid[Math.floor(player.y) * GRID_SIZE + Math.floor(player.x) + 0] = 0;
    grid[Math.floor(player.y) * GRID_SIZE + Math.floor(player.x) + 1] = 0;
    grid[Math.floor(player.y) * GRID_SIZE + Math.floor(player.x) + 2] = 0;
    
    for (var i = 0; i < newGridListeners.length; i++) {
        newGridListeners[i]();
    }
}

function getCell(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || GRID_SIZE <= x || y < 0 || GRID_SIZE <= y) {
        return -1;
    }
    return grid[y * GRID_SIZE + x];
}


// math functions

function getDirection(x, y) {
    return Math.atan2(y, x) + Math.PI / 2;
}

function getDistanceFromOrigin(x, y) {
    return Math.sqrt(x * x + y * y);
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}


// main

function resetPlayer() {
    player = {
        x: GRID_SIZE / 2 + 0.5,
        y: GRID_SIZE / 2 + 0.5,
        direction: 0,
    };
}

function createNewWorld() {
    resetPlayer();
    generateNewGrid();
}

var player;
var grid;

function mainLoop() {
    var dx = 0;
    var dy = 0;

    if (keyboard[UP]) {
        dx = Math.cos(player.direction) * 0.05;
        dy = -Math.sin(player.direction) * 0.05;
    }
    if (keyboard[DOWN]) {
        dx = -Math.cos(player.direction) * 0.05;
        dy = Math.sin(player.direction) * 0.05;
    }
    if (keyboard[LEFT]) {
        if (keyboard[SHIFT]) {
            dx = Math.cos(player.direction + Math.PI/2) * 0.05;
            dy = -Math.sin(player.direction + Math.PI/2) * 0.05;
        } else {
            player.direction = player.direction + 0.04;
        }
    }
    if (keyboard[RIGHT]) {
        if (keyboard[SHIFT]) {
            dx = Math.cos(player.direction - Math.PI/2) * 0.05;
            dy = -Math.sin(player.direction - Math.PI/2) * 0.05;
        } else {
            player.direction = player.direction - 0.04 + Math.PI * 2;
        }
    }

    if (controller) {
        var a0 = Math.abs(controller.axes[0]) < 0.1 ? 0 : controller.axes[0];
        var a1 = Math.abs(controller.axes[1]) < 0.1 ? 0 : controller.axes[1];
        if (a0 != 0 || a1 != 0) {
            dx = Math.cos(player.direction + getDirection(-a0, a1)) * 0.05 * getDistanceFromOrigin(-a0, a1);
            dy = -Math.sin(player.direction + getDirection(-a0, a1)) * 0.05 * getDistanceFromOrigin(-a0, a1);
        }
        var a2 = Math.abs(controller.axes[2]) < 0.1 ? 0 : controller.axes[2];
        player.direction = player.direction - a2 / 20 + Math.PI * 2;
        
        if (isControllerButtonPressed(0)) {
            if (!controllerButtons[0]) {
                OUTLINE = !OUTLINE;
                controllerButtons[0] = true;
            }
        } else {
            controllerButtons[0] = false;
        }
        
        if (isControllerButtonPressed(1)) {
            if (!controllerButtons[1]) {
                createNewWorld();
                controllerButtons[1] = true;
            }
        } else {
            controllerButtons[1] = false;
        }
    }

    if (GHOST || getCell(player.x + dx, player.y) === 0) {
        player.x += dx;
    }
    if (GHOST || getCell(player.x, player.y + dy) === 0) {
        player.y += dy;
    }
    player.direction %= Math.PI * 2;
    
    renderRaycaster();
    renderFirstPerson();
    renderTopDown();

    requestAnimationFrame(mainLoop);
}

window.addEventListener("load", function () {
    createNewWorld();
    mainLoop();
});



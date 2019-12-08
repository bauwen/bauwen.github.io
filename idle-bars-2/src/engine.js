var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var mousePressed = false;
var mouseReleased = false;

var getLocalStorage, setLocalStorage, removeLocalStorage;
var mouseInBox, kongApi;

var hasLocalStorage = false;

try {
    hasLocalStorage = !!localStorage.getItem;
} catch (err) {
    hasLocalStorage = false;
}

(function () {
    
    canvas.focus();
    
    var loop = function () {
        mainloop();
        
        mousePressed = false;
        mouseReleased = false;
        window.requestAnimationFrame(loop);
    };

    var hasLocalStorage = false;

    try {
        hasLocalStorage = !!localStorage.getItem;
    } catch (err) {
        hasLocalStorage = false;
    }
    
    getLocalStorage = function (name) {
        if (!hasLocalStorage) {
            return undefined;
        }
        return localStorage.getItem(name);
    };
        
    setLocalStorage = function (name, value) {
        if (!hasLocalStorage) {
            return;
        }
        localStorage.setItem(name, value);
    };

    removeLocalStorage = function (name) {
        if (!hasLocalStorage) {
            return;
        }
        localStorage.removeItem(name);
    };
    
    mouseInBox = function (x, y, w, h) {
        return x <= mouseX && mouseX < x + w && y <= mouseY && mouseY < y + h;
    };

    var WIDTH_RATIO = 1;
    var HEIGHT_RATIO = 1;

    var mouseDownHandler = function (event) {
        var rect = canvas.getBoundingClientRect();
        var button = event.button;
        
        event.preventDefault();
        
        mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
        mouseX = Math.floor(mouseX);
        mouseY = Math.floor(mouseY);
        
        if (!mouseDown) {
            mouseDown = true;
            mousePressed = true;
        }
    };

    var mouseUpHandler = function (event) {
        var rect = canvas.getBoundingClientRect();
        var button = event.button;
        
        event.preventDefault();
        
        if (mouseDown) {
            mouseDown = false;
            mouseReleased = true;
        }
    };

    var mouseMoveHandler = function (event) {
        var rect = canvas.getBoundingClientRect();
        
        mouseX = (event.pageX - window.pageXOffset - rect.left) * WIDTH_RATIO;
        mouseY = (event.pageY - window.pageYOffset - rect.top) * HEIGHT_RATIO;
        mouseX = Math.floor(mouseX);
        mouseY = Math.floor(mouseY);
    };

    var resizeHandler = function () {//return; // TODO
        var w = window.innerWidth;
        var h = window.innerHeight;
        var c = ctx.canvas; 
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
        var topdiv = document.getElementById("top-div");
        topdiv.style.marginTop = Math.floor((h - sh) / 2) + "px";
    };

    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("resize", resizeHandler);
    
    window.addEventListener("load", function () {
        loadKongregateApi(function (api) {
            kongApi = api;
            
            setInterval(function () {
                kongApi.submitStat("Progress", Math.floor(fillsPerSecond));
                kongApi.submitStat("Achievements", numberOfAchievements);
                kongApi.submitStat("Prestige", Math.round(Math.log(prestige) / Math.log(2)));
                saveGameState();
            }, 5000);
            
            initialize();
            loadGameState();
            loop();
        });
        
        resizeHandler();
    });

})();


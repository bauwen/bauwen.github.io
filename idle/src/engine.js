var hasLocalStorage = false;

try {
    hasLocalStorage = !!localStorage.getItem;
} catch (err) {
    hasLocalStorage = false;
}

var WIDTH_RATIO = 1;
var HEIGHT_RATIO = 1;

var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var mousePressed = false;
var mouseReleased = false;

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

var resizeHandler = function () {
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
    document.getElementById("top-div").style.marginTop = Math.floor((h - sh) / 2) + "px";
};

window.addEventListener("mousedown", mouseDownHandler);
window.addEventListener("mouseup", mouseUpHandler);
window.addEventListener("mousemove", mouseMoveHandler);
window.addEventListener("resize", resizeHandler);
window.addEventListener("load", function () { resizeHandler(); initialize(); });

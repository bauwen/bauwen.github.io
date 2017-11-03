var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var mousePressed = false;

function isMouseInBox(x, y, w, h) {
    return x <= mouseX && mouseX < x + w && y <= mouseY && mouseY < y + h;
}

function clamp(v, a, b) {
    return Math.max(a, Math.min(v, b));
}

function Slider(x, y, width, min, max, callback) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.min = min;
    this.max = max;
    this.value = min;
    this.selected = false;
    
    this.draw = function () {
        var value = Math.max(this.min, Math.min(this.value, this.max));
        
        var h = 3;
        var t = (value - this.min) / (this.max - this.min);
        
        ctx.fillStyle = "rgb(100, 100, 100)";
        ctx.fillRect(this.x, this.y - h/2, this.width, h);
        
        ctx.fillStyle = "rgb(160, 150, 140)";
        ctx.fillRect(this.x, this.y - h/2, this.width * t, h);
        
        var xx = this.x + this.width * t;
        
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(2 + xx, 2 + this.y, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = color1;
        ctx.beginPath();
        ctx.arc(xx, this.y, 7, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(xx, this.y, 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        var hovering = isMouseInBox(this.x - 24, this.y - 20, this.width + 48, 40);
        
        if (mousePressed && hovering) {
            this.selected = true;
        }
        
        if (mouseDown) {
            if (this.selected) {
                this.value = (mouseX - this.x) / this.width * this.max;
                var value = Math.max(this.min, Math.min(this.value, this.max));
                
                if (callback) {
                    callback(value);
                    SEEKING = true;
                }
            }
        } else {
            this.selected = false;
            
            if (callback) {
                SEEKING = false;
            }
        }
        
        this.value = Math.max(this.min, Math.min(this.value, this.max));
        this.value = Math.round(this.value * 10) / 10;
    };
}

function Button(x, y, width, height, callback) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.draw = function (logo) {
        if (logo) {
            logo(this.x, this.y, this.width, this.height);
        }
        
        var hovering = isMouseInBox(this.x, this.y, this.width, this.height);
        
        if (hovering) {
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        }
        
        if (mousePressed && hovering && callback) {
            callback();
        }
    };
}

function positionFileInput() {
    var f = document.getElementById("file");
    var rect = canvas.getBoundingClientRect();
    var left = rect.left + 230;
    var top = rect.top + 440;
    
    f.style.left = left + "px";
    f.style.top = top + "px";
}

function formatTime(seconds) { 
    var decisec = Math.floor(seconds * 10) % 10;
    var sec = Math.floor(seconds) % 60;
    var min = Math.floor(seconds / 60);
    
    return min + ":" + (sec < 10 ? "0" : "") + sec + ":" + decisec;
}

window.addEventListener("mousedown", function (event) {
    event.preventDefault();
    
    var rect = canvas.getBoundingClientRect();
    mouseX = event.pageX - window.scrollX - rect.left;
    mouseY = event.pageY - window.scrollY - rect.top;
    
    if (!mouseDown) {
        mouseDown = true;
        mousePressed = true;
    }
});

window.addEventListener("mouseup", function (event) {
    event.preventDefault();
    mouseDown = false;
});

window.addEventListener("mousemove", function (event) {
    event.preventDefault();
    
    var rect = canvas.getBoundingClientRect();
    mouseX = event.pageX - window.scrollX - rect.left;
    mouseY = event.pageY - window.scrollY - rect.top;
});

window.addEventListener("dragleave", function (event) {
    event.preventDefault();
});

window.addEventListener("dragover", function (event) {
    event.preventDefault();
});

window.addEventListener("drop", function (event) {
    event.preventDefault();
    loadAudio(event.dataTransfer.files[0]);
});

window.onresize = function () {
    positionFileInput();
    
    var h = window.innerHeight;
    
    canvas.height = Math.max(580, h);
};

document.getElementById("file").addEventListener("change", function (event) {
    if (event.target.files[0]) {
        loadAudio(event.target.files[0]);
    }
});

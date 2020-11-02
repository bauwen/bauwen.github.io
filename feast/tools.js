function Button() {
    this.x = 0;
    this.y = 0;
    this.width = 250;
    this.height = 60;
    this.text = "";
    
    this.draw = function () {
        ctx.strokeStyle = "rgb(200, 200, 200)";
        ctx.fillStyle = "rgb(50, 50, 50)";
        ctx.lineWidth = 2;
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.textAlign = "center";
        ctx.font = "bold 24px verdana";
        
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.3;
        ctx.fillText(this.text, this.x + this.width / 2 + 3, this.y + this.height / 2 + 10 + 3);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 10);
    };
    
    this.isHovering = function () {
        return this.x <= mouseX && mouseX < this.x + this.width && this.y <= mouseY && mouseY < this.y + this.height;
    };
}

function mouseInBox(x, y, width, height) {
    return x <= mouseX && mouseX < x + width && y <= mouseY && mouseY < y + height;
}

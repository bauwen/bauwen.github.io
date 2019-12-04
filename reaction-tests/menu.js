addModule("menu", function () {
    
    var shapesButton = new Button();
    var numbersButton = new Button();
    
    shapesButton.width = 400;
    shapesButton.height = 80;
    numbersButton.width = shapesButton.width;
    numbersButton.height = shapesButton.height;
    
    return function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var xx = canvas.width / 2 - shapesButton.width / 2;
        var yy = canvas.height / 3;
        
        shapesButton.x = xx;
        shapesButton.y = yy;
        shapesButton.text = "START SHAPE TEST";
        shapesButton.draw();
        
        numbersButton.x = xx;
        numbersButton.y = yy + 150;
        numbersButton.text = "START NUMBER TEST";
        numbersButton.draw();
        
        if (mousePressed("Left")) {
            if (shapesButton.isHovering()) {
                setModule("shapes");
            }
            else if (numbersButton.isHovering()) {
                setModule("numbers");
            }
        }
    };
});
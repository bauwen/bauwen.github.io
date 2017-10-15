function update() {
    x += (keyboard[RIGHT] - keyboard[LEFT]) * 3;
    y += (keyboard[DOWN] - keyboard[UP]) * 3;
    
    //for (var i = 0; i < 1; i++) circleFill(x, y, (x + y) / 10);
    
    var s = Math.floor(x + y) / 10;
    
    if (keyboard[SPACE]) {
        setcolor(200, 200, 200);
        rectfill(0, 0, 192, 160);
    }
    
    if (!keyboard[ENTER]) {
        setcolor(0, 255, 55);
    } else {
        setcolor(255, 0, 0);
    }
    
    rectfill(10, 20, 20, 100);
    rectfill(180, 140, 30, 30);
    
    setcolor(255, 128, 0);
    
    for (var i = 0; i < 1; i++) circleFill(x, y, s); //rectfill(x, y, s, s);
}

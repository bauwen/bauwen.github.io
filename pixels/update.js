function update() {
    x += (keyboard[RIGHT] - keyboard[LEFT]) * 4;
    y += (keyboard[DOWN] - keyboard[UP]) * 4;
    
    //for (var i = 0; i < 1; i++) circleFill(x, y, (x + y) / 10);
    
    var s = Math.floor(x + y) / 10;
    
    setcolor(0, 255, 55);
    rectfill(10, 20, 20, 100);
    
    rectfill(180, 140, 30, 30);
    
    setcolor(255, 128, 0);
    
    for (var i = 0; i < 100; i++) circleFill(x, y, s); //rectfill(x, y, s, s);
}

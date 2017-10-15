var t_ = 0;
var CIRC = 2 * Math.PI;

function update() {
    var x = 192 / 2;
    var y = 160 / 2;
    var r = 1;
    var a = 0;
    
    for (var i = 0; i < 150; i++) {
        switch (i % 3) {
            case 0:
                setcolor(255, 255, 255, 255);
                break;
            case 1:
                setcolor(255, 0, 0, 255);
                break;
            case 2:
                setcolor(120, 120, 120, 255);
                break;
        }
        circleFill(Math.floor(x), Math.floor(y), Math.floor(r / 2));
        x += Math.cos(a * CIRC) * r;
        y += -Math.sin(a * CIRC) * r;
        r += 1 / 4;
        a += t_ / 5;
    }
    
    t_ += 0.0005;
}

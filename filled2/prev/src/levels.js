// 8x10

var LEVELS = [

    // 1-5 =======================
    
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oo@..xoo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo",
    
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "ooo..ooo" +
    "oo@..xoo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo",
    
    "oooooooo" +
    "oooooooo" +
    "o....@oo" +
    "o.o..xoo" +
    "o.....oo" +
    "o.....oo" +
    "o.o...oo" +
    "o.....oo" +
    "oooooooo" +
    "oooooooo",
    
    "oooooooo" +
    "oo@...oo" +
    "o...o.oo" +
    "o.o...oo" +
    "o..x..oo" +
    "o.....oo" +
    "o.....oo" +
    "o...oooo" +
    "o...oooo" +
    "oooooooo",
    
    "o.....oo" +
    "o.....oo" +
    "oxoo.ooo" +
    "o..o..oo" +
    "o..oo.oo" +
    "o.....oo" +
    "o.oo..oo" +
    "o.o@..oo" +
    "o.ooo.oo" +
    "o.....oo",
    
    
    // 6-10 ======================
    
    ".......o" +
    ".oo....o" +
    ".ox.o..o" +
    ".oooo..o" +
    "....@..o" +
    "..oo...o" +
    "...o...o" +
    ".o.....o" +
    ".......o" +
    "o..oo..o",
    
    ".......o" +
    ".o.....o" +
    "...o...o" +
    "..oo.o.o" +
    ".....o.o" +
    ".......o" +
    "..oo...o" +
    "...ox..o" +
    ".o.....o" +
    ".....@.o",
    
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oo...ooo" +
    "oo1x.ooo" +
    "oooooooo" +
    "oooooooo" +
    "oo..1ooo" +
    "oo@..ooo" +
    "oooooooo",
    
    "oooooooo" +
    "oo1..@oo" +
    "oo....oo" +
    "oo....oo" +
    "oo.oo.oo" +
    "oo....oo" +
    "oox..1oo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo",
    
    "oooooooo" +
    "o.....oo" +
    "o.1...oo" +
    "o...oooo" +
    "o.oooooo" +
    "o@ooooxo" +
    "ooooo..o" +
    "ooooo..o" +
    "oo.....o" +
    "oo1....o",
    
    
    // 11-15 =====================
    
    "x......o" +
    "1...oo.o" +
    "..o.o..o" +
    "....o..o" +
    "....@..o" +
    "..o....o" +
    "..o.o..o" +
    "....o..o" +
    ".o.....o" +
    "......1o",
    
    "o@.....o" +
    "o..1...o" +
    "o...oo.o" +
    "o...o..o" +
    "o..oo..o" +
    "o......o" +
    "o.o...oo" +
    "o..o..xo" +
    "o..o...o" +
    "o.....1o",
    
    "oooooooo" +
    "o...oxoo" +
    "o.o.o.oo" +
    "o..%..oo" +
    "ooo.oooo" +
    "ooo.oooo" +
    "ooo@oooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo",
    
    "ox.oo..o" +
    "...oo..o" +
    "...o...o" +
    "..oo...o" +
    "..oo...o" +
    "....%.@o" +
    "..oo...o" +
    "...o...o" +
    "...oo..o" +
    "o..oo..o",
    
    "ooo@oooo" +
    "ooo....o" +
    "oo.....o" +
    "oo..oooo" +
    "oo.%...o" +
    "oo.%...o" +
    "o...oooo" +
    "..x....o" +
    ".....o.o" +
    "..oo...o",
    
    
    // 16-20 =====================
    
    "%%...%.o" +
    "%%...%%o" +
    ".ooooo.o" +
    ".....x.o" +
    "...%...o" +
    ".%%%..@o" +
    ".......o" +
    ".ooooo.o" +
    "%....%%o" +
    "%%...%%o",
    
    ".....ooo" +
    "...o...o" +
    "...o...o" +
    "..%.%..o" +
    ".o.o...o" +
    "..%....o" +
    "....o..o" +
    "...%.%xo" +
    "..o...oo" +
    "o.....@o",
    
    "...1oo4o" +
    ".ooooo.o" +
    ".o@.oo.o" +
    "....oo5o" +
    "oooooooo" +
    "...xo1.." +
    ".oooooo." +
    ".32oo2.." +
    ".oooo5oo" +
    "4oooo..3",
    
    "o...@.oo" +
    "o.o.o..o" +
    "ox1..o.o" +
    "o..o2..o" +
    "o.2oo..o" +
    "o..oo..o" +
    "o......o" +
    "o.o....o" +
    "o.o1o..o" +
    "o......o",
    
    "oooooooo" +
    "oo...xoo" +
    "oo255.oo" +
    "oo11o4oo" +
    "oo.324oo" +
    "oo..3.oo" +
    "o.....@o" +
    "o......o" +
    "oooooooo" +
    "oooooooo",
    
    
    // 21-25 =====================
    
    "oo....oo" +
    "o.%....o" +
    "o1.....o" +
    "oo..o..o" +
    "oo..o..o" +
    "o.....oo" +
    "o....o1o" +
    "oxo@%..o" +
    "o.oo...o" +
    "o......o",
    
    "o.....oo" +
    "o2...4oo" +
    "o2.o.4oo" +
    "o.5x..oo" +
    "o.5...oo" +
    "o....1oo" +
    "o.33.1oo" +
    "o.@...oo" +
    "o.o...oo" +
    "o.....oo" +
    "oooooooo",
    
     "...o.xoo" +
    "...o...o" +
    ".%.o...o" +
    "...o.%.o" +
    ".2.o.%2o" +
    ".ooo.%.o" +
    "...o...o" +
    "1o.o...o" +
    "...o...o" +
    "o..o1@.o",
    
    "@.o....o" +
    "o...1..o" +
    "2.3....o" +
    "..o....o" +
    ".....4oo" +
    "3......o" +
    "..o..2.o" +
    "..o....o" +
    "4.....oo" +
    "....1.xo",
    
    "32.....o" +
    ".ooooo.o" +
    ".....x.o" +
    "o.....oo" +
    "..o1o..o" +
    "..o1o@.o" +
    "o.....oo" +
    ".......o" +
    ".ooooo.o" +
    ".....23o",
    
    
    // 26-30 =====================
    
     "......1o" +
    ".ooo...o" +
    ".....o.o" +
    ".....o.o" +
    "...o...o" +
    "..o....o" +
    "....o.xo" +
    ".o..o..o" +
    "....o1.o" +
    "o.....@o",
    
    "oo1.2.oo" +
    "ooo3o.oo" +
    "oo.2o.oo" +
    "oo....oo" +
    "oo4....o" +
    "oo.1...o" +
    "oo..%5oo" +
    "oo..%.oo" +
    "ooo354oo" +
    "oo@.oxoo",
    
    "%%...%%o" +
    "%.o1o.%o" +
    ".oo.oo.o" +
    ".......o" +
    "x.oo...o" +
    "o..oo@.o" +
    ".......o" +
    ".oo.oo.o" +
    "%.o1o.%o" +
    "%%...%%o",
    
    "o3....oo" +
    "o...o.oo" +
    "o.1...oo" +
    "o.....oo" +
    "o...2.oo" +
    "o...@.oo" +
    "o2..o.oo" +
    "ox1...oo" +
    "o.....oo" +
    "o....3oo",
    
    "oooooooo" +
    "oooooooo" +
    "..24...o" +
    ".......o" +
    "..1553.o" +
    "..312x.o" +
    ".....%.o" +
    "@.....4o" +
    "oooooooo" +
    "oooooooo",
    
    /*
    "oooooooo" +
    "oooooooo" +
    "oo.1xooo" +
    "oo.o.ooo" +
    "oo...ooo" +
    "oooooooo" +
    "oooooooo" +
    "oo...ooo" +
    "oo.1.ooo" +
    "oo..@ooo",
    */

    
    // end
    
    "@ooxoooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo",
    
    /*
    "@xoooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo",
    */
];

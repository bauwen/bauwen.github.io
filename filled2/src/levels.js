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
    
    
    // 11-15 =====================
    
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
    
    "oooooooo" +
    "oo...xoo" +
    "oo255.oo" +
    "oo11o4oo" +
    "oo.324oo" +
    "oo..3.oo" +
    "o@....oo" +
    "oooooooo" +
    "oooooooo" +
    "oooooooo",
    
    
    // 21-25 =====================
    
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
    
    
    // 26-30 =====================
    
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

var PLACEHOLDER = [
    
    // NONE
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooox..@oooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooooo..ooooooo" +
    "oooooox..@oooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooo....oooooo" +
    "oooooo.@x.oooooo" +
    "oooooo....oooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    // WALL
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooo...ooooooo" +
    "ooooox.#.@oooooo" +
    "ooooo..ooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooo....x@ooooo" +
    "ooooo......ooooo" +
    "ooooo......ooooo" +
    "ooooo.#..#.ooooo" +
    "ooooo......ooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooo.......ooooo" +
    "oooo.....#.@oooo" +
    "oooo....x...oooo" +
    "oooooo....#.oooo" +
    "oooooo......oooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo........x....o" +
    "o..###....###..o" +
    "o..#@#.####....o" +
    "o..#...#.......o" +
    "o........oooo..o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    // TUNNEL
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooo..oo1.ooooo" +
    "ooooo.xoo..ooooo" +
    "ooooo.1oo.@ooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooox.....ooooo" +
    "ooooo..#..1ooooo" +
    "ooooo1..#..ooooo" +
    "ooooo.....@ooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "ooooooooo2oooooo" +
    "ooooooooo.oooooo" +
    "oooooox..1oooooo" +
    "oooooooo.ooooooo" +
    "oooooo1..@oooooo" +
    "oooooo..o.oooooo" +
    "ooooooooo2oooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooo.1........o" +
    "o.....#........o" +
    "o...#3x.3####..o" +
    "o.##........#..o" +
    "o.22.......@1..o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "o3.12.ooo@.....o" +
    "oooo..1........o" +
    "ox.2.......###.o" +
    "oooo.....3.....o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o............1xo" +
    "o.##...........o" +
    "o.#..##..##....o" +
    "o..............o" +
    "o....#.@###..#.o" +
    "o............#.o" +
    "o1.............o" +
    "oooooooooooooooo",
    
    
    // BRIDGE
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooo...oo@ooooo" +
    "ooooo.#.oo.ooooo" +
    "ooooo..%...ooooo" +
    "ooooooo.##xooooo" +
    "ooooooo....ooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooo@x.....ooooo" +
    "oooo..%.##..oooo" +
    "oooo........oooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooo......oox.ooo" +
    "ooo.#.%......ooo" +
    "ooo....o...%.ooo" +
    "oooo.@oo....oooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo..o......ooooo" +
    "oo@..%%......ooo" +
    "oo.....##....ooo" +
    "oo.o..##.%.%.ooo" +
    "ooxoo.......oooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo...@....##..oo" +
    "oo...#.#.%....oo" +
    "oo.###...%....oo" +
    "oo.....##x###.oo" +
    "oo............oo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooo.......ooo" +
    "oooo..x.......@o" +
    "oo.............o" +
    "oo..####...##..o" +
    "o...###...###..o" +
    "o.......o....#.o" +
    "oooooooooooo...o" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oo.....oo....x3o" +
    "o1....%@o......o" +
    "ooo....oo..4...o" +
    "ooo..oooo..##..o" +
    "oo...oooo..##..o" +
    "oo..%..2o....4.o" +
    "o2...3.1o......o" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "o..o..........1o" +
    "o...%.........xo" +
    "o.1........#...o" +
    "o.@..........#.o" +
    "o..............o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o........x.....o" +
    "o.###....#.###.o" +
    "o.#..........#.o" +
    "o.#..%.......#.o" +
    "o.....#........o" +
    "o....##.@##....o" +
    "o..............o" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "ooo.2.......oooo" +
    "oo..#.o1.%..oooo" +
    "oo....o.....oooo" +
    "oooooooooooooooo" +
    "oooo2.........oo" +
    "oooo@...%%%..xoo" +
    "oooo.....1...ooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "@.o2..oo.......3" +
    "1.o....o..%.##.." +
    "ooo..o4o......%." +
    "...ooooooooooo.1" +
    ".5.ox%.o.....ooo" +
    "...o4%.o........" +
    "3..o.%.o..2...5." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o.............@o" +
    "o.###.....#....o" +
    "o.#...#..##....o" +
    "o......#.x.....o" +
    "o....#...##..#.o" +
    "o..###..#..###.o" +
    "oo.............o" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "o...o1o.....o..o" +
    "o.....x%.##....o" +
    "o..#.....#.@...o" +
    "o..#.%.......#.o" +
    "oo....o1o......o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo........2..ooo" +
    "oo1#@.......%.oo" +
    "oo..x##....#..oo" +
    "oo.%..2......1oo" +
    "ooo...oo......oo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oo.............o" +
    "oo....#...####.o" +
    "oo......#.#..#.o" +
    "oo..#..##.#x...o" +
    "o...#...#@###..o" +
    "o...#..........o" +
    "o..............o" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooo........oooo" +
    "oooo.##.....oooo" +
    "oooo.#@.#1..oooo" +
    "oooox...##..oooo" +
    "oooo..1##.%.oooo" +
    "oooo.......ooooo" +
    "oooo..o....ooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo1....x.....2oo" +
    "oooo.%...##..ooo" +
    "oo....##@#3...oo" +
    "oo....3#......oo" +
    "oooo........oooo" +
    "oo2..........1oo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o............1xo" +
    "o.##...........o" +
    "o.#..##..##....o" +
    "o..............o" +
    "o....#.@###..#.o" +
    "o............#.o" +
    "o1.............o" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo@o...2...o1ooo" +
    "oo.3..1..#43.ooo" +
    "ooo5%%.....#4ooo" +
    "oox2.5.......ooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "ooo........ooooo" +
    "o......#.......o" +
    "o.##..%.%..%...o" +
    "o...%..#.##...oo" +
    "o....#..%...%.oo" +
    "o...%......#..oo" +
    "oo@#x.........oo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o............o@o" +
    "o.#..#.........o" +
    "o..##....#..1..o" +
    "o........###...o" +
    "o..........#...o" +
    "o1..xo.........o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o4....1oooo....o" +
    "o......ooox....o" +
    "o..##..oo......o" +
    "o.2##2.oo@oo...o" +
    "o..##..ooooo...o" +
    "o......ooooo...o" +
    "o...43.ooooo.31o" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "o@o..oo......ooo" +
    "o...%.o.......oo" +
    "oo.....#.......o" +
    "ooo..#.........o" +
    "o......#..#.#.oo" +
    "o....#...#....oo" +
    "oo.........o..xo" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "o.......o@o....o" +
    "o....1....o...2o" +
    "o3.....#.......o" +
    "o........1.....o" +
    "oo..2oo........o" +
    "ox...oo....3...o" +
    "oooooooooooooooo",

    "oooooooooooooooo" +
    "ooo...........oo" +
    "oo..##......#.oo" +
    "oo.....###..#.oo" +
    "oo.......#..#.oo" +
    "oo.####.......oo" +
    "oo.1#.....##..oo" +
    "oo@...x......1oo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "@o...ooo......oo" +
    ".......o.......o" +
    "o.......#......." +
    "oo....#........." +
    "........#..#.#.o" +
    "......#...#....o" +
    "o...........o..x" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    ".1x...........1." +
    "................" +
    "..3..........2.." +
    "....4......4...." +
    "..2..........3.." +
    "................" +
    ".5...........@5." +
    "oooooooooooooooo",
    
    // extra 40 -----------------------
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooo@oooooooooo" +
    "ooooo...21.ooooo" +
    "ooooo..325.ooooo" +
    "ooooo.31#5.ooooo" +
    "ooooo..44.xooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    
    // gif out
    "oooooooooooooooo" +
    "........21......" +
    ".#####..##.####." +
    ".##54....2.####." +
    ".##.###.##.##@.." +
    ".##.x##.##.###1." +
    "5######.##.##..." +
    "3.....4..3......" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oo............oo" +
    "o.....###......o" +
    "..#...##..##...@" +
    "..##...#..###..." +
    "o..#...##......." +
    "oo....###.....xo" +
    "oo..o.........oo" +
    "oooooooooooooooo",
    
    
    "oooooooooooooooo" +
    "oo...ooooooo..oo" +
    "oo....ooooo...oo" +
    "ooo.x.....o.#.oo" +
    "ooo...%%....@.oo" +
    "oo...o..o..o..oo" +
    "oo.#.o..o..o..oo" +
    "oo...o..o..o..oo" +
    "oooooooooooooooo",
    
    
    "oooooooooooooooo" +
    "ooo..........ooo" +
    "oo...........xoo" +
    "oo...oo.oo....oo" +
    "ooooooo.oooooooo" +
    "oooo...%....oooo" +
    "oo............oo" +
    "oo.....@......oo" +
    "oooooooooooooooo",
    
    /*
    "oooooooooooooooo" +
    "oooo........oooo" +
    "ooo.........oooo" +
    "oo..#...#..#..oo" +
    "oo..#..##..#..oo" +
    "oo@.#..#...#..oo" +
    "ooox........%.oo" +
    "ooo..........ooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o..xo....o.....@" +
    "...%o..%%%%....." +
    "..o%o...o..oooo." +
    "..o%oooooooo..o." +
    "..o%%%%%%%%%%.o." +
    "..ooooooooooooo." +
    "................" +
    "oooooooooooooooo",
    */
    
    "oooooooooooooooo" +
    "oo.......oo...oo" +
    "oo..#..#.oo...oo" +
    "oo..@....o...ooo" +
    "oo.......o.x%.oo" +
    "oo...#...o....oo" +
    "oo.#..%..oo...oo" +
    "oo.....o......oo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "ooo..x..oo1.oooo" +
    "ooo.##.....%.ooo" +
    "ooo.#@.......ooo" +
    "ooo..%..##...ooo" +
    "ooo...#......ooo" +
    "ooo...1o....oooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    
    // A
    "oooooooooooooooo" +
    "ooo.......ox.ooo" +
    "ooo.##..1.2#.ooo" +
    "ooo.2..###...ooo" +
    "ooo.#..##1.#@ooo" +
    "ooo.......#..ooo" +
    "ooo.........oooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    /*
    "oooooooooooooooo" +
    "oo..o...o.....oo" +
    "oo.2o......o1.oo" +
    "oo.oo..#...ooooo" +
    "oo.....@x.....oo" +
    "oooo....#..oo.oo" +
    "oo.1###...oo2.oo" +
    "oo........oo..oo" +
    "oooooooooooooooo",
    */
    
    // A
    "oooooooooooooooo" +
    "...............o" +
    "..........#....o" +
    "o....#x.#......o" +
    "o...##..##..#..o" +
    "..#..#.@#...#..." +
    "............#..." +
    "o..............." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oo.....oo....@oo" +
    "oo...#........oo" +
    "oo...#.....#..oo" +
    "ooo....#.....ooo" +
    "oo..#.....#...oo" +
    "oo...%........oo" +
    "oox...oo.....ooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o.............1o" +
    "o.#............o" +
    "o.#..###@.#....o" +
    "o..............o" +
    "o....##..##..#.o" +
    "o...........##.o" +
    "ox1............o" +
    "oooooooooooooooo",
    
    // 52
    "oooooooooooooooo" +
    "%%..o.x.......%%" +
    "%.#..........#.%" +
    ".##....###...##." +
    ".1....####....1." +
    ".##...#@.....##." +
    "%.#.........##.%" +
    "%%.......oo...%%" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "....o..........." +
    "............#..." +
    "......#........." +
    "....1..........o" +
    ".#.....#.....ooo" +
    ".....#....#..ox." +
    "..o.........@o1." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "....o......o...2" +
    ".#............#3" +
    ".#.....##.....#." +
    ".#..#..11..#..#." +
    ".#.....##.....#." +
    "3##....@.....x#." +
    "2...o......o...." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "2.@............1" +
    ".....x......4..." +
    ".....3.........." +
    "................" +
    "................" +
    "....4....3......" +
    "1..............2" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o......o..o....." +
    "....##.o........" +
    "..#....o........" +
    "o.x....o......#1" +
    "o....#.o...#...o" +
    "1##..#.o........" +
    ".......oo..@o..." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo%%........%%oo" +
    "oo%.#...%%.#%%oo" +
    "oo..#..%%..#..oo" +
    "oo%%#..%%.x#%%oo" +
    "oo%%....@...%.oo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oo............oo" +
    "oo.#........#.oo" +
    "oo...#....#...oo" +
    "oo..##....##..oo" +
    "oo..x.........oo" +
    "oo@....##.....oo" +
    "oo............oo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "2..............." +
    ".x.....#3..##..." +
    "...3......%.1..." +
    "..#......#......" +
    "....1..@.......2" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o............o@o" +
    "o.#..#.........o" +
    "o..##....#..1..o" +
    "o........###...o" +
    "o..........#...o" +
    "o1..xo.........o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o@.....oo....1.o" +
    "o....x.........o" +
    "ooooo..#.%.....o" +
    "o..............o" +
    "o.##..#....#...o" +
    "o..........1...o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "2.x..........o.." +
    "..1......#......" +
    "...%.#..%.#@.##." +
    "..2..#........1." +
    ".#............#." +
    "................" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo@o...2...o1ooo" +
    "oo.3..1..#43.ooo" +
    "ooo5%%.....#4ooo" +
    "oox2.5.......ooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "...........o...." +
    "...#............" +
    ".........#......" +
    "o..........x...." +
    "........#.....#." +
    ".....#....#....." +
    "@............o.." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o..o........oooo" +
    "o.......#......." +
    "o..##..%.%..%..." +
    ".....%..#.##...o" +
    "......#..%...%.o" +
    ".....%......#..o" +
    "ooo@ox.........o" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    ".3..4..o.....2o@" +
    "..........#....." +
    "...##.......#4.o" +
    ".....#...#......" +
    "1......#......1." +
    "...2.......3...." +
    "xo....oooo......" +
    "oooooooooooooooo",
    
    // 67
    "oooooooooooooooo" +
    "ox............2o" +
    "o..........1...o" +
    "o.....#........o" +
    "o..#...%...%...o" +
    "o.%...%%....#..o" +
    "o@...#....#....o" +
    "o2.1...........o" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo.....1......@o" +
    "o..x.......##..o" +
    "o.##....#2.##..o" +
    "o...##2...%....o" +
    "o............1.o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "o..1...........o" +
    "o......#3......o" +
    "o.2..#4..%.#...o" +
    "o.....3.....2..o" +
    "ox......4...o..o" +
    "o..o....o..1oo@o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "...............o" +
    ".#....#........o" +
    "......#...#...%." +
    "..x#....#....#.." +
    ".#............%." +
    "....##....ooo..." +
    "o..@......ooo..." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "@..............." +
    "..##3....5..###." +
    "..#1..4..2...1#." +
    "..#...#5......#." +
    "......#x##2....." +
    ".######....3.4.." +
    "................" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "4......5.......1" +
    "5.%.####...###.." +
    "...#...3........" +
    "..#....#..@..#1." +
    "..#..4#..3....#2" +
    ".....##...###2.." +
    "..oo..x........o" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooo.......22.ooo" +
    "ooo.#@3.55...ooo" +
    "ooo...3..x#..ooo" +
    "ooo..........ooo" +
    "ooo...11..44.ooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "o.............@o" +
    "o..%%%.%%%.%%%.o" +
    "o..%%%.%.%.%.%.o" +
    "o...%%.%%%.%%%.o" +
    "ox.............o" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "@..............." +
    "..1............." +
    ".......##....#.." +
    "....##.........." +
    "..#.......#....." +
    "................" +
    "...xo..o.......1" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    ".2oooo.........." +
    "...3.......###1." +
    "3.#2.####..1...." +
    "o.#..###.%......" +
    "o.#x......#####." +
    "o......%...@###." +
    "o....oo........." +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oo..x2.......3oo" +
    "oo..1......1..oo" +
    "oo.....@......oo" +
    "oo...#...2..#.oo" +
    "oo3...........oo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "................" +
    "....2..........1" +
    "....5..........." +
    "............%..." +
    "......@..5.2...." +
    ".....1........4." +
    ".3.....4......3x" +
    "oooooooooooooooo",
    
    
    // extra
    
    
    
    "oooooooooooooooo" +
    "ooooo@.....ooooo" +
    "ooooo......ooooo" +
    "ooooo..21.3ooooo" +
    "ooooo..15.4ooooo" +
    "ooooo..35..ooooo" +
    "ooooo.%x2..ooooo" +
    "ooooo4.....ooooo" +
    "oooooooooooooooo",
    
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "ooooooo@oxoooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo" +
    "oooooooooooooooo",
];

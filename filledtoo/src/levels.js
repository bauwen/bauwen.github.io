var LEVELS = [

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

const newGame = (starter) => ({
    grid: new Array(9).fill(''),
    current: starter,
    empty: true,
    full: false,
    winner: '',
    tiles: [0, 0, 0],
});

const playMove = (state, position) => {
    let grid = [...state.grid];
    grid[position] = state.current;
    return {
        grid,
        current: state.current === 'x' ? 'o' : 'x',
        empty: false,
        full: grid.filter(v => v === '').length === 0,
        ...checkWinner(grid),
    };
};

const checkWinner = (grid) => {
    for (let i = 0; i < 2; i++) {
        const p = ['x', 'o'][i];
        // -
        for (let j = 0; j < 9; j += 3) {
            if (grid[j + 0] === p && grid[j + 1] === p && grid[j + 2] === p) {
                return {
                    winner: p,
                    tiles: [j + 0, j + 1, j + 2],
                }
            }
        }
        // |
        for (let j = 0; j < 3; j += 1) {
            if (grid[j + 0] === p && grid[j + 3] === p && grid[j + 6] === p) {
                return {
                    winner: p,
                    tiles: [j + 0, j + 3, j + 6],
                }
            }
        }
        // \ 
        if (grid[0] === p && grid[4] === p && grid[8] === p) {
            return {
                winner: p,
                tiles: [0, 4, 8],
            }
        }
        // /
        if (grid[2] === p && grid[4] === p && grid[6] === p) {
            return {
                winner: p,
                tiles: [2, 4, 6],
            }
        }
    }
    return {
        winner: '',
        tiles: [0, 0, 0],
    }
};

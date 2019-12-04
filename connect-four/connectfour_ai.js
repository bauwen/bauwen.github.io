// Connect Four AI

/*
    board is an upside-down grid of columns with cell values one of the following:
    0: empty square
    1: first player's square
    2: second player's square
*/

const findNextMove = (function () {
    let MAX_DEPTH = 6;  // 6 seems to be the maximum without significant delay
    
    const checkDirection = (grid, player, sx, sy, dx, dy, state) => {
        const width = grid.length;
        const height = grid[0].length;
        
        for (let i = 0; i < 2; i++) {
            dx = -dx;
            dy = -dy;
            let x = sx;
            let y = sy;
            let radius = 0;
            let connected = true;
            
            while (true) {
                x += dx;
                y += dy;
                radius += 1;
                if (x < 0 || width <= x || y < 0 || height <= y) {
                    state.slots = 3;
                    break;
                }
                if (radius >= 4) {
                    break;
                }
                
                const cell = grid[x][y];
                if (cell === 0) {
                    state.slots += 1;
                    connected = false;
                } else if (cell === player) {
                    if (connected) {
                        state.serie += 1;
                    }
                } else {
                    state.slots = 3;
                    break;
                }
            }
        }
    };
    
    const heuristic = (grid, player, x, y) => {
        let score = 0;
        const directions = [[1, 0], [0, 1], [1, 1], [-1, 1]];
        
        for (let i = 0; i < directions.length; i++) {
            const pair = directions[i];
            const state = { slots: 0, serie: 0 };
            checkDirection(grid, player, x, y, pair[0], pair[1], state);
            if (state.serie >= 3) {
                return -1;
            } else {
                score += Math.pow(6 - state.slots, 3) + Math.pow(state.serie, 2);
            }
        }
        
        return score;
    };
    
    const makeMove = (grid, player, x) => {
        let y = -1;
        
        const newGrid = [];
        for (let i = 0; i < grid.length; i++) {
            newGrid[i] = grid[i];
        }
        
        const column = grid[x];
        const newColumn = [];
        for (let i = 0; i < column.length; i++) {
            const cell = column[i];
            if (cell === 0) {
                y = i;
                newColumn.push(player);
                for (let j = i; j < column.length; j++) {
                    newColumn.push(0);
                }
                break;
            } else {
                newColumn.push(cell);
            }
        }
        
        newGrid[x] = newColumn;
        return [newGrid, y];
    };
    
    const calculateBoard = (grid, player, depth) => {
        if (depth === MAX_DEPTH) {
            return [0, 0];
        }
        
        const sign = 1 - depth % 2 * 2;
        let bestScore = sign * -Infinity;
        let bestMove = -1;
        
        for (let x = 0; x < grid.length; x++) {
            const [newGrid, y] = makeMove(grid, player, x);
            if (y < 0) {
                continue;
            }
            let score = heuristic(newGrid, player, x, y);
            if (score < 0) {
                return [sign * Infinity, x];
            } else {
                const [nextScore, _] = calculateBoard(newGrid, 3 - player, depth + 1);
                score = sign * score + nextScore;
            }
            
            if (sign > 0) {
                if (score >= bestScore) {
                    bestScore = score;
                    bestMove = x;
                }
            } else {
                if (score <= bestScore) {
                    bestScore = score;
                    bestMove = x;
                }
            }
        }
        
        if (bestMove < 0) {
            return [0, 0];
        }
        
        return [bestScore, bestMove];
    };

    return (grid, player, maxDepth) => {
        MAX_DEPTH = maxDepth;
        const [_, bestMove] = calculateBoard(grid, player, 0);
        return bestMove;
    };
})();

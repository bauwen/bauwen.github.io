class Sudoku {
    constructor(sudoku) {
        if (sudoku) {
            this.array = sudoku.array.slice();
        } else {
            this.array = [];
            for (let i = 0; i < 81; i++) {
                this.array.push(0);
            }
        }
    }
    
    get(row, column) {
        return this.array[row + column * 9];
    }
    
    set(row, column, digit) {
        this.array[row + column * 9] = digit;
    }
    
    isSolved() {
        for (let i = 0; i < 81; i++) {
            if (this.array[i] === 0) {
                return false;
            }
        }
        return this.isValid();
    }
    
    isValid() {
        const rows = [];
        const columns = [];
        const blocks = [];
        for (let i = 0; i < 9; i++) {
            rows.push(0);
            columns.push(0);
            blocks.push(0);
        }
        
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                const digit = this.get(row, column);
                if (digit === 0) {
                    continue;
                }
                const bits = 1 << (digit - 1);
                if (rows[row] & bits) {
                    return false;
                }
                if (columns[column] & bits) {
                    return false;
                }
                const block = Math.floor(row / 3) + Math.floor(column / 3) * 3;
                if (blocks[block] & bits) {
                    return false;
                }
                rows[row] |= bits;
                columns[column] |= bits;
                blocks[block] |= bits;
            }
        }
        
        return true;
    }
    
    isEqual(sudoku) {
        for (let i = 0; i < 81; i++) {
            if (this.array[i] !== sudoku.array[i]) {
                return false;
            }
        }
        return true;
    }
    
    hasUniqueSolution() {
        if (!this.isValid()) {
            return false;
        }
        
        const sudoku1 = new Sudoku(this);
        sudoku1.bruteforce(0, 1);
        const sudoku2 = new Sudoku(this);
        sudoku2.bruteforce(80, -1);
        
        return sudoku1.isEqual(sudoku2);
    }
    
    solve() {
        if (!this.isValid()) {
            return false;
        }
        return this.bruteforce(0, 1);
    }
    
    isInvalidMove(row, column, digit) {
        const rowBlock = Math.floor(row / 3) * 3;
        const columnBlock = Math.floor(column / 3) * 3;
        
        for (let i = 0; i < 9; i++) {
            if (this.get(row, i) === digit) {
                return true;
            }
            if (this.get(i, column) === digit) {
                return true;
            }
            const r = i % 3;
            const c = Math.floor(i / 3);
            if (this.get(rowBlock + r, columnBlock + c) === digit) {
                return true;
            }
        }
        
        return false;
    }
    
    bruteforce(index, direction) {
        if (index < 0 || 81 <= index) {
            return true;
        }
        
        if (this.array[index] > 0) {
            return this.bruteforce(index + direction, direction);
        }
        const row = index % 9;
        const column = Math.floor(index / 9);
        let from = direction < 0 ? 9 : 1;
        let to = direction < 0 ? 0 : 10;
        for (let digit = from; digit !== to; digit += direction) {
            if (this.isInvalidMove(row, column, digit)) {
                continue;
            }
            this.array[index] = digit;
            if (this.bruteforce(index + direction, direction)) {
                return true;
            }
        }
        this.array[index] = 0;
        return false;
    }
    
    swapRows(row1, row2) {
        for (let i = 0; i < 9; i++) {
            const temp = this.get(row1, i);
            this.set(row1, i, this.get(row2, i));
            this.set(row2, i, temp);
        }
    }
    
    swapColumns(column1, column2) {
        for (let i = 0; i < 9; i++) {
            const temp = this.get(i, column1);
            this.set(i, column1, this.get(i, column2));
            this.set(i, column2, temp);
        }
    }
    
    swapBlockRows(blockRow1, blockRow2) {
        for (let i = 0; i < 3; i++) {
            const row1 = blockRow1 * 3 + i;
            const row2 = blockRow2 * 3 + i;
            this.swapRows(row1, row2);
        }
    }
    
    swapBlockColumns(blockColumn1, blockColumn2) {
        for (let i = 0; i < 3; i++) {
            const column1 = blockColumn1 * 3 + i;
            const column2 = blockColumn2 * 3 + i;
            this.swapColumns(column1, column2);
        }
    }
    
    static generate() {
        const sudoku = new Sudoku();
        
        sudoku.solve();
        
        for (let k = 0; k < 3; k++) {
            for (let i = 0; i < 2; i++) {
                const j = i + Math.floor(Math.random() * (3 - i));
                sudoku.swapRows(k * 3 + i, k * 3 + j);
            }
        }
        for (let k = 0; k < 3; k++) {
            for (let i = 0; i < 2; i++) {
                const j = i + Math.floor(Math.random() * (3 - i));
                sudoku.swapColumns(k * 3 + i, k * 3 + j);
            }
        }
        for (let i = 0; i < 2; i++) {
            const j = i + Math.floor(Math.random() * (3 - i));
            sudoku.swapBlockRows(i, j);
        }
        for (let i = 0; i < 2; i++) {
            const j = i + Math.floor(Math.random() * (3 - i));
            sudoku.swapBlockColumns(i, j);
        }
        
        // value "50" chosen randomly here (~ number of open tiles), change to alter difficulty
        for (let i = 0; i < 50; i++) {
            let row, column, digit;
            do {
                row = Math.floor(Math.random() * 9);
                column = Math.floor(Math.random() * 9);
                digit = sudoku.get(row, column);
            } while (digit === 0);
            sudoku.set(row, column, 0);
            if (!sudoku.hasUniqueSolution()) {
                sudoku.set(row, column, digit);
            }
        }
        
        return sudoku;
    }
}

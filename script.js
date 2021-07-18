/* Module */
const game = (() => {
    const newGameBtn = document.querySelector('.new-game-btn');
    const startGame = () => {
        const player1 = Player('X');
        const player2 = Player('O');
        
    }
    return {startGame}
})();

const gameBoard = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    const getBoard = () => { 
        return board; 
    }
    const setBoard = (state, row, col) => {
        if (board[row][col] !== '') return;
        board[row][col] = state;
    }
    const isEmptyCell = (row, col) => {
        return board[row][col] === '';
    }
    const isFull = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] === '') return false;
            }
        }
        return true;
    }
    const checkHorizontalWin = (state) => {
        if (board[0][0] === state && board[0][1] === state && board[0][2] === state) return true;
        if (board[1][0] === state && board[1][1] === state && board[1][2] === state) return true;
        if (board[2][0] === state && board[2][1] === state && board[2][2] === state) return true;
    }
    const checkVerticalWin = (state) => {
        if (board[0][0] === state && board[1][0] === state && board[2][0] === state) return true;
        if (board[0][1] === state && board[1][1] === state && board[2][1] === state) return true;
        if (board[0][2] === state && board[1][2] === state && board[2][2] === state) return true;
    }
    const checkDiagonalWin = (state) => {
        if (board[0][0] === state && board[1][1] === state && board[2][2] === state) return true;
        if (board[2][2] === state && board[1][1] === state && board[0][0] === state) return true;
    }
    const isWin = () => {
        if (checkVerticalWin('O') || checkHorizontalWin('O') || checkDiagonalWin('O')) {console.log('O Win'); return true;}
        if (checkVerticalWin('X') || checkHorizontalWin('X') || checkDiagonalWin('X')) {console.log('X win'); return true;}
    }
    const checkDraw = () => {
        if (isFull() && !isWin()) console.log('draw');
    }
    return {
        getBoard,
        setBoard,
        isEmptyCell,
        isWin,
        checkDraw
    };
})();

/* Module */
const displayController = (() => {
    const grid = document.querySelector('.grid-container');
    const children = grid.children;
    const displayBoard = () => {
        let idx = 0;
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            for (let j = 0; j < gameBoard.getBoard()[0].length; j++) {
                children[idx].innerText = gameBoard.getBoard()[i][j];
                idx++;
            }
        }
    }
    const displayChildren = () => {
        console.log(children);
    }
    const displayChild = (idx) => {
        console.log(children[idx]);
    }
    return {displayBoard, displayChildren, displayChild}
})();

/* Factory */
const Player = (type) => {
    let piece = type;
    const move = (row, col) => {
        if (gameBoard.isEmptyCell(row, col)) {
            gameBoard.setBoard(piece, row, col);
            displayController.displayBoard();
        }
    }
    return {move}
}

game.startGame();
const board = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];
    const get = () => {
        return board;
    };
    const set = (state, row, col) => {
        if (board[row][col] !== '') return;
        board[row][col] = state;
    };
    const display = () => {
        let idx = 0;
        const gridItem = document.querySelector('.grid-container').children;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                gridItem[idx].innerText = board[i][j];
                idx++;
            }
        }
    };
    const clear = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                board[i][j] = '';
            }
        }
    };
    const isFull = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] === '') return false;
            }
        }
        return true;
    };
    const checkHorizontalWin = (state) => {
        if (
            board[0][0] === state &&
            board[0][1] === state &&
            board[0][2] === state
        )
            return true;
        if (
            board[1][0] === state &&
            board[1][1] === state &&
            board[1][2] === state
        )
            return true;
        if (
            board[2][0] === state &&
            board[2][1] === state &&
            board[2][2] === state
        )
            return true;
    };
    const checkVerticalWin = (state) => {
        if (
            board[0][0] === state &&
            board[1][0] === state &&
            board[2][0] === state
        )
            return true;
        if (
            board[0][1] === state &&
            board[1][1] === state &&
            board[2][1] === state
        )
            return true;
        if (
            board[0][2] === state &&
            board[1][2] === state &&
            board[2][2] === state
        )
            return true;
    };
    const checkDiagonalWin = (state) => {
        if (
            board[0][0] === state &&
            board[1][1] === state &&
            board[2][2] === state
        )
            return true;
        if (
            board[0][2] === state &&
            board[1][1] === state &&
            board[2][0] === state
        )
            return true;
    };
    return {
        get,
        set,
        display,
        clear,
        checkHorizontalWin,
        checkVerticalWin,
        checkDiagonalWin,
        isFull,
    };
})();

// const computer = (() => {
//     const piece = 'O';
//     const move = () => {
//         let row = getRandom();
//         let col = getRandom();
//         while (board.get()[row][col] !== '') {
//             row = getRandom();
//             col = getRandom();
//         }
//         board.set(piece, row, col);
//     };
//     const getRandom = () => {
//         return Math.floor(Math.random() * board.length);
//     };
//     return { move };
// })();

/* Factory */
const Player = (type) => {
    let name;
    let piece = type;
    const move = (row, col) => {
        if (board.get()[row][col] === '') {
            board.set(piece, row, col);
            return true;
        }
        return false;
    };
    const setName = (pName) => {
        name = pName;
    };
    const getName = () => {
        return name;
    };
    return { move, setName, getName };
};

const game = (() => {
    const p1 = Player('X');
    const p2 = Player('O');
    let turn;
    let playing;
    const start = () => {
        displayController.showNameForm();
        displayController.dimGrid();
        init();
    };
    const init = () => {
        turn = 0;
        playing = true;
        board.clear();
        board.display();
        showMessage('Click new game to start or restart game!');
    };
    const makeMove = (row, col) => {
        if (isP1Turn()) {
            if (p1.move(row, col)) {
                turn++;
            }
        } else {
            if (p2.move(row, col)) {
                turn++;
            }
        }
        if (isTie()) {
            showMessage('Tie Game!');
            playing = false;
        }
        if (isWin('X')) {
            showMessage(p1.getName() + 'Wins!');
            playing = false;
        }
        if (isWin('O')) {
            showMessage(p2.getName() + 'Wins!');
            playing = false;
        }
        board.display();
    };
    const getInput = (row, col) => {
        if (playing) {
            makeMove(row, col);
        }
    };
    const isP1Turn = () => {
        return turn % 2 === 0;
    };
    const showMessage = (message) => {
        let status = document.getElementById('status');
        if (status !== null) status.innerText = message;
    };
    const isWin = (player) => {
        if (
            board.checkVerticalWin(player) ||
            board.checkHorizontalWin(player) ||
            board.checkDiagonalWin(player)
        ) {
            return true;
        }
        return false;
    };
    const isTie = () => {
        return board.isFull() && !isWin();
    };
    return { start, getInput };
})();

const displayController = (() => {
    const showNameForm = () => {
        document.getElementById('name-form').style.display = 'block';
    };
    const hideNameForm = () => {
        document.getElementById('name-form').style.display = 'none';
    };
    const dimGrid = () => {
        document.getElementById('grid').style.opacity = '15%';
    };
    const showGrid = () => {
        document.getElementById('grid-container').style.opacity = '75%';
    };
    const setPlayerNames = () => {
        let p1Name = document.getElementById('name1').value;
        let p2Name = document.getElementById('name2').value;
        p1.setName(p1Name);
        p2.setName(p2Name);
        hideNameForm();
        showGrid();
    };
    const getPlayerNames = () => {};
    return { showNameForm, dimGrid, setPlayerNames };
})();

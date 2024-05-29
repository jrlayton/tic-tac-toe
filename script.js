const player = (name, token) => {
  const _name = name;
  const _token = token;

  const getName = () => {
    return _name;
  };

  const getToken = () => {
    return _token;
  };

  return { getName, getToken };
};

const gameBoard = (() => {
  let _board = [];

  const get = () => {
    return _board;
  };

  const set = (row, col, token) => {
    _board[row][col] = token;
  };

  const reset = () => {
    _board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };

  const toString = () => {
    return _board.map((row) => row.join(" ")).join("\n");
  };

  return { get, set, reset, toString };
})();

const gameController = (() => {
  const _player1 = player("Player1", "X");
  const _player2 = player("Player2", "O");
  const _state = {
    running: false,
    turn: undefined,
  };

  const _checkValidMove = (row, col) => {
    const board = gameBoard.get();
    return board[row][col] === "";
  };

  const _checkRowWin = (row, token) => {
    const board = gameBoard.get();
    return (
      board[row][0] === token &&
      board[row][1] === token &&
      board[row][2] === token
    );
  };

  const _checkColWin = (col, token) => {
    const board = gameBoard.get();
    return (
      board[0][col] === token &&
      board[1][col] === token &&
      board[2][col] === token
    );
  };

  const _checkDiagWin = (token) => {
    const board = gameBoard.get();
    return (
      (board[0][0] === token &&
        board[1][1] === token &&
        board[2][2] === token) ||
      (board[0][2] === token && board[1][1] === token && board[2][0] === token)
    );
  };

  const newGame = () => {
    console.log("Starting new game");
    gameBoard.reset();
    _state.running = true;
    _state.playerTurn = 1;
  };

  const playerMove = (row, col) => {
    if (!_state.running) {
      console.log("ERROR: Game not in progress.");
      return false;
    }
    if (!_checkValidMove(row, col)) {
      console.log("ERROR: Player move is invalid");
      return false;
    }

    const token =
      _state.playerTurn === 1 ? _player1.getToken() : _player2.getToken();
    gameBoard.set(row, col, token);

    console.log(gameBoard.toString());

    if (isWin(row, col, token)) {
      const playerName =
        _state.playerTurn === 1 ? _player1.getName() : _player2.getName();
      console.log(`${playerName} wins`);
      _state.running = false;
    } else if (isTie()) {
      console.log(`Tie game`);
      _state.running = false;
    } else {
      _state.playerTurn = _state.playerTurn === 1 ? 2 : 1;
    }

    return true;
  };

  const getState = () => {
    return _state;
  };

  const isWin = (row, col, token) => {
    return (
      _checkRowWin(row, token) ||
      _checkColWin(col, token) ||
      _checkDiagWin(token)
    );
  };

  const isTie = () => {
    return gameBoard
      .get()
      .flatMap((row) => row)
      .every((element) => element !== "");
  };

  return { getState, newGame, playerMove, isWin, isTie };
})();

const displayController = (() => {
  const newGameBtn = document.querySelector("button");
  newGameBtn.addEventListener("click", () => {
    gameController.newGame();
    clearCells();
  });

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) =>
    cell.addEventListener("click", () => {
      const row = cell.getAttribute("data-row");
      const col = cell.getAttribute("data-col");
      const token = gameController.getState().playerTurn === 1 ? "X" : "O";

      if (gameController.playerMove(row, col)) {
        cell.appendChild(elementFactory.createCellItem(token));
      }

      // writeToDOM(
      //   `.cell[data-row="${row}"][data-col="${col}"]`,
      //   elementFactory.createCellItem(token)
      // );
    })
  );

  const writeToDOM = (selector, message) => {
    document.querySelector(selector).innerHTML = message;
  };

  const clearCells = () => {
    const cellItems = document.querySelectorAll(".cell-item");
    cellItems.forEach((item) =>
      item.classList.replace("show-animation", "hide-animation")
    );

    setTimeout(() => {
      cells.forEach((cell) => (cell.innerText = ""));
    }, 500);
  };

  return { writeToDOM, clearCells };
})();

const elementFactory = (() => {
  const createCellItem = (token) => {
    const img = document.createElement("img");
    img.src = `assets/${token}.png`;
    img.classList.add("cell-item", "show-animation");
    return img;
  };

  return { createCellItem };
})();

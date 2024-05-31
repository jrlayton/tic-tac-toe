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
  let _winningCells = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const _checkValidMove = (row, col) => {
    const board = gameBoard.get();
    return board[row][col] === "";
  };

  const _checkRowWin = (row, token) => {
    const board = gameBoard.get();
    if (
      board[row][0] === token &&
      board[row][1] === token &&
      board[row][2] === token
    ) {
      _winningCells[row][0] = 1;
      _winningCells[row][1] = 1;
      _winningCells[row][2] = 1;
      return true;
    }
    return false;
  };

  const _checkColWin = (col, token) => {
    const board = gameBoard.get();
    if (
      board[0][col] === token &&
      board[1][col] === token &&
      board[2][col] === token
    ) {
      _winningCells[0][col] = 1;
      _winningCells[1][col] = 1;
      _winningCells[2][col] = 1;
      return true;
    }
    return false;
  };

  const _checkDiagWin = (token) => {
    // Checking with variables here to make sure the functions run
    // and set all winning cells (any 3 in a row) so that if a
    // player wins using both diagonals, they both change color at the end
    let primaryDiagWin = _checkPrimaryDiagWin(token);
    let secondaryDiagWin = _checkSecondaryDiagWin(token);
    return primaryDiagWin || secondaryDiagWin;
  };

  const _checkPrimaryDiagWin = (token) => {
    const board = gameBoard.get();
    if (
      board[0][0] === token &&
      board[1][1] === token &&
      board[2][2] === token
    ) {
      _winningCells[0][0] = 1;
      _winningCells[1][1] = 1;
      _winningCells[2][2] = 1;
      return true;
    }
    return false;
  };

  const _checkSecondaryDiagWin = (token) => {
    const board = gameBoard.get();
    if (
      board[0][2] === token &&
      board[1][1] === token &&
      board[2][0] === token
    ) {
      _winningCells[0][2] = 1;
      _winningCells[1][1] = 1;
      _winningCells[2][0] = 1;
      return true;
    }
    return false;
  };

  const newGame = () => {
    console.log("Starting new game");
    gameBoard.reset();
    _winningCellsReset();
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

  const getWinningCells = () => {
    return _winningCells;
  };

  const _winningCellsReset = () => {
    _winningCells = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  };

  const isWin = (row, col, token) => {
    // Checking with variables here to make sure the functions run
    // and set all winning cells (any 3 in a row) so that if a
    // player wins using both a row and col, they both change color at the end
    let rowWin = _checkRowWin(row, token);
    let colWin = _checkColWin(col, token);
    return rowWin || colWin || _checkDiagWin(token);
  };

  const isTie = () => {
    return gameBoard
      .get()
      .flatMap((row) => row)
      .every((element) => element !== "");
  };

  return { getState, getWinningCells, newGame, playerMove, isWin, isTie };
})();

const displayController = (() => {
  /* Grab DOM elements */
  const h1 = document.querySelector("h1");
  const newGameBtn = document.querySelector(".new-game");
  const cells = document.querySelectorAll(".cell");
  const grid = document.querySelector(".grid");
  const opponentsModal = document.querySelector(".opponents");
  const difficultyModal = document.querySelector(".difficulty");
  const modalBackBtn = document.querySelector(".modal-back");
  const pageIndicators = document.querySelector(".page-indicators");
  const pageIndicatorPrev = document.querySelector(
    ".page-indicator:nth-child(1)"
  );
  const pageIndicatorNext = document.querySelector(
    ".page-indicator:nth-child(2)"
  );
  const chooseOpponentPlayer = document.querySelector(
    ".opponents .modal-options > div:nth-child(1)"
  );
  const chooseOpponentComputer = document.querySelector(
    ".opponents .modal-options > div:nth-child(2)"
  );

  /* Add event listeners to DOM elements */
  newGameBtn.addEventListener("click", () => {
    gameController.newGame();
    clearCells();
    revertHeaderToTitleOnGameStart();
  });
  cells.forEach((cell) =>
    cell.addEventListener("click", () => {
      const row = cell.getAttribute("data-row");
      const col = cell.getAttribute("data-col");
      const token = gameController.getState().playerTurn === 1 ? "X" : "O";

      if (gameController.playerMove(row, col)) {
        cell.appendChild(elementFactory.createCellItem(token));

        if (gameController.isWin(row, col, token)) {
          highlightCellsOnGameEnd({ isWin: true });
          changeHeaderToStatusMsgOnGameEnd(
            `Player ${token === "X" ? 1 : 2} wins!`
          );
        } else if (gameController.isTie()) {
          highlightCellsOnGameEnd({ isTie: true });
          changeHeaderToStatusMsgOnGameEnd("Tie game!");
        }
      }
    })
  );
  chooseOpponentPlayer.addEventListener("click", () => {
    opponentsModal.classList.add("slideLeftFadeOut-animation");
    pageIndicators.classList.add("slideLeftFadeOut-animation");
    grid.classList.add("show-animation");
    newGameBtn.classList.add("show-animation");
    setTimeout(() => {
      opponentsModal.style.display = "none";
      modalBackBtn.style.display = "none";
      pageIndicators.style.display = "none";
      newGameBtn.style.opacity = "1";
      grid.style.opacity = "1";
    }, 900);
    gameController.newGame();
  });
  chooseOpponentComputer.addEventListener("click", () => {
    opponentsModal.classList.add("slideLeftFadeOut-animation");
    difficultyModal.classList.add("slideLeftFadeIn-animation");
    pageIndicatorNext.classList.add("toPageIndicatorNext-animation");
    pageIndicatorPrev.classList.add("toPageIndicatorPrev-animation");
    pageIndicatorNext.classList.remove("page-indicator__off");
    modalBackBtn.classList.add("slideLeftFadeIn-animation");
    modalBackBtn.style.display = "flex";
    difficultyModal.style.display = "flex";

    setTimeout(() => {
      opponentsModal.style.display = "none";
      pageIndicatorPrev.classList.add("page-indicator__off");
      opponentsModal.classList.remove("slideLeftFadeOut-animation");
      difficultyModal.classList.remove("slideLeftFadeIn-animation");
      pageIndicatorNext.classList.remove("toPageIndicatorNext-animation");
      pageIndicatorPrev.classList.remove("toPageIndicatorPrev-animation");
      modalBackBtn.classList.remove("slideLeftFadeIn-animation");
    }, 900);
  });
  modalBackBtn.addEventListener("click", () => {
    opponentsModal.style.display = "flex";
    opponentsModal.classList.add("slideRightFadeIn-animation");
    difficultyModal.classList.add("slideRightFadeOut-animation");
    modalBackBtn.classList.add("slideRightFadeOut-animation");
    pageIndicatorNext.classList.add("toPageIndicatorPrev-animation");
    pageIndicatorPrev.classList.add("toPageIndicatorNext-animation");
    pageIndicatorPrev.classList.remove("page-indicator__off");

    setTimeout(() => {
      difficultyModal.style.display = "none";
      modalBackBtn.style.display = "none";
      opponentsModal.classList.remove("slideRightFadeIn-animation");
      difficultyModal.classList.remove("slideRightFadeOut-animation");
      modalBackBtn.classList.remove("slideRightFadeOut-animation");
      pageIndicatorNext.classList.remove("toPageIndicatorPrev-animation");
      pageIndicatorPrev.classList.remove("toPageIndicatorNext-animation");
      pageIndicatorNext.classList.add("page-indicator__off");
    }, 900);
  });

  const changeHeaderToStatusMsgOnGameEnd = (statusMsg) => {
    h1.classList.add("hide-animation");
    setTimeout(() => {
      h1.classList.remove("hide-animation");
    }, 450);
    h1.innerText = statusMsg;
    h1.classList.add("show-animation");
    setTimeout(() => {
      h1.classList.remove("show-animation");
    }, 450);
  };

  const revertHeaderToTitleOnGameStart = () => {
    h1.classList.add("hide-animation");
    setTimeout(() => {
      h1.classList.remove("hide-animation");
    }, 450);
    h1.innerText = "Tic Tac Toe";
    h1.classList.add("show-animation");
    setTimeout(() => {
      h1.classList.remove("show-animation");
    }, 450);
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

  const highlightCellsOnGameEnd = (endState) => {
    cells.forEach((cell) => {
      const row = cell.getAttribute("data-row");
      const col = cell.getAttribute("data-col");
      const cellItem = cell?.firstElementChild;
      const svg = cellItem?.firstElementChild;
      const path = svg?.firstElementChild;

      if (endState.isWin && gameController.getWinningCells()[row][col] === 1) {
        path?.classList.add("strobeGreenWin-animation");
      } else if (endState.isTie) {
        path?.classList.add("strobeRedTie-animation");
      }
    });
  };
})();

const elementFactory = (() => {
  const createCellItem = (token) => {
    const svgDiv = document.createElement("div");
    const svgX = `<svg
        width="100"
        height="117"
        viewBox="0 0 100 117"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M98.0683 13.6753C101.011 10.134 100.542 4.87409 97.0007 1.93166C93.4594 -1.01076 88.1995 -0.54206 85.2571 2.99927L50 45.3129L14.7429 2.99927C11.8005 -0.54206 6.5406 -1.01076 2.99927 1.93166C-0.54206 4.87409 -1.01076 10.134 1.93166 13.6753L39.1417 58.3325L1.93166 102.99C-1.01076 106.531 -0.54206 111.791 2.99927 114.733C6.5406 117.676 11.8005 117.207 14.7429 113.666L50 71.3521L85.2571 113.666C88.1995 117.207 93.4594 117.676 97.0007 114.733C100.542 111.791 101.011 106.531 98.0683 102.99L60.8583 58.3325L98.0683 13.6753Z"
          fill="white"
        />
      </svg>`;
    const svgO = `<svg
        width="125"
        height="125"
        viewBox="0 0 125 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M62.5 17.8571C50.66 17.8571 39.3049 22.5606 30.9327 30.9327C22.5606 39.3049 17.8571 50.66 17.8571 62.5C17.8571 74.34 22.5606 85.6951 30.9327 94.0673C39.3049 102.439 50.66 107.143 62.5 107.143C74.34 107.143 85.6951 102.439 94.0673 94.0673C102.439 85.6951 107.143 74.34 107.143 62.5C107.143 50.66 102.439 39.3049 94.0673 30.9327C85.6951 22.5606 74.34 17.8571 62.5 17.8571ZM125 62.5C125 79.076 118.415 94.9731 106.694 106.694C94.9731 118.415 79.076 125 62.5 125C45.924 125 30.0268 118.415 18.3058 106.694C6.5848 94.9731 0 79.076 0 62.5C0 45.924 6.5848 30.0268 18.3058 18.3058C30.0268 6.5848 45.924 0 62.5 0C79.076 0 94.9731 6.5848 106.694 18.3058C118.415 30.0268 125 45.924 125 62.5Z"
          fill="white"
        />
      </svg>`;

    svgDiv.innerHTML = token === "X" ? svgX : svgO;
    svgDiv.classList.add("cell-item", "show-animation");
    return svgDiv;
  };

  return { createCellItem };
})();

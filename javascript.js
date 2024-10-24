/*
 A Cell represents one square on the board and can have one of the following:
 1. "X" - cross
 2. "O" - nought
 3. "empty" - empty
 */
function Cell() {
  let value = "";
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  const setEmptyValue = () => {
    value = "";
  };
  return { addToken, getValue, setEmptyValue };
}

/*
   Create a Gameboard to represent the state of the board;
   Each square holds a Cell;
   Expose a dropToken method to add Cells to squares
   */
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // create a 2D array representing the state of the board
  // row 0 represent the top row
  // coloumn 0 represent the left-most column
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // render the initial board
  const getBoard = () => board;

  // drop a token at an empty cell
  let tokenDropped = false;
  const dropToken = (player, row, column) => {
    if (board[row][column].getValue() === "") {
      tokenDropped = true;
      board[row][column].addToken(player);
    } else {
      tokenDropped = false;
      return;
    }
  };

  const getTokenDroppedStatus = () => tokenDropped;

  // get new board
  const getNewBoard = () => {
    const newBoard = board.map((row) =>
      row.map((cell) => cell.setEmptyValue())
    );
    return newBoard;
  };

  // get current board
  const getCurrentBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    return boardWithCellValues;
  };

  //   print current board to console
  const printCurrentBoard = () => {
    console.log(getCurrentBoard());
  };

  return {
    getBoard,
    dropToken,
    getCurrentBoard,
    printCurrentBoard,
    getNewBoard,
    getTokenDroppedStatus,
    rows,
    columns,
  };
}

/* 
  The GameController will be responsible for: 
  1. controlling the flow and state of the game's turns
  2. whether anybody has won the game 
  */
function GameController(playerCross = "X", playerNought = "O") {
  const board = Gameboard();
  const players = [
    { name: playerCross, token: "X" },
    { name: playerNought, token: "O" },
  ];

  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printCurrentBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (row, column) => {
    let hasResult = false;
    const result = document.querySelector(".result");

    // drop a token from current active player
    console.log(
      `Dropping ${getActivePlayer().token} to row ${row} column ${column}...`
    );
    board.dropToken(getActivePlayer().token, row, column);
    result.textContent = "";
    board.printCurrentBoard();

    // check for winner
    // if three tokens of a row/column/diagonal are the same, the player of that token wins the game
    const checkForWinner = () => {
      const countToken = (token) => {
        return board
          .getCurrentBoard()
          .filter((row) => row.filter((cell) => cell === token)).length;
      };

      const getTokenLocations = (token) => {
        const locations = [];
        for (let i = 0; i < board.rows; i++) {
          for (let j = 0; j < board.columns; j++) {
            if (board.getCurrentBoard()[i][j] === token) {
              locations.push([i, j]);
            }
          }
        }
        return locations;
      };

      const checkTokenLocations = (locations, token) => {
        let locNums = [0, 1, 2];
        // check if row or column condition is met
        for (let locNum of locNums) {
          if (
            locations.filter((loc) => loc[0] === locNum).length === 3 ||
            locations.filter((loc) => loc[1] === locNum).length === 3
          ) {
            hasResult = true;
            console.log(`The winner is ${token}!`);
            result.textContent = `The winner is ${token}!`;
            board.getNewBoard();
            printNewRound();
          }
        }
        //check if diagonal condition is met
        const diagonalOne = [
          [0, 0],
          [1, 1],
          [2, 2],
        ];
        const diagonalTwo = [
          [0, 2],
          [1, 1],
          [2, 0],
        ];
        const includesArray = (locations, loc) => {
          return locations.some((subLoc) =>
            subLoc.every((element, index) => element === loc[index])
          );
        };
        if (
          diagonalOne.every((loc) => includesArray(locations, loc)) ||
          diagonalTwo.every((loc) => includesArray(locations, loc))
        ) {
          hasResult = true;
          console.log(`The winner is ${token}!`);
          result.textContent = `The winner is ${token}!`;
          board.getNewBoard();
          printNewRound();
        }
      };
      return { countToken, getTokenLocations, checkTokenLocations };
    };

    //check winner and draw
    const playerTokenLocations = checkForWinner().getTokenLocations(
      getActivePlayer().token
    );
    console.log(`active token's locations: ${playerTokenLocations}`);

    checkForWinner().checkTokenLocations(
      playerTokenLocations,
      getActivePlayer().token
    );

    // draw
    if (!board.getCurrentBoard().some((row) => row.includes(""))) {
      hasResult = true;
      console.log("It's a draw!");
      result.textContent = "It's a draw!";
      board.getNewBoard();
      printNewRound();
    }

    // Switch player turn
    if (hasResult === false && board.getTokenDroppedStatus() === true) {
      switchPlayerTurn();
      printNewRound();
    }
  };

  // Initial play game message
  printNewRound();
  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const result = document.querySelector(".result");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the latest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.token}'s turn...`;

    // render board squares
    let rowCount = -1;
    board.forEach((row) => {
      row.forEach((cell, index) => {
        // create cell as clickable button
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // create data attribute to identify column and row of each cell
        cellButton.dataset.column = index;
        // console.log(cellButton.dataset.column);
        if (index === 0) {
          rowCount += 1;
        }
        cellButton.dataset.row = rowCount;
        // console.log(cellButton.dataset.row);
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  //   add event listener for the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    // console.log(selectedColumn);
    const selectedRow = e.target.dataset.row;
    // console.log(selectedRow);
    // make sure it's the cell and not the gap that's clicked
    if (!(selectedColumn || selectedRow)) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  //   board click event
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
}

ScreenController();

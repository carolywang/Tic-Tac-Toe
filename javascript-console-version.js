/*
 A Cell represents one square on the board and can have one of the following:
 1. "X" - cross
 2. "O" - nought
 3. "empty" - empty
 */
function Cell() {
  let value = "empty";
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  const setEmptyValue = () => {
    value = "empty";
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
    if (board[row][column].getValue() === "empty") {
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
    // drop a token from current active player
    console.log(
      `Dropping ${getActivePlayer().token} to row ${row} column ${column}...`
    );
    board.dropToken(getActivePlayer().token, row, column);
    board.printCurrentBoard();

    // check for winner
    // if three tokens of a row/column/diagonal are the same, the player of that token wins the game
    let hasResult = false;
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
    if (!board.getCurrentBoard().some((row) => row.includes("empty"))) {
      hasResult = true;
      console.log("It's a draw!");
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
  };
}

/* 
Play the game in console 
*/
const game = GameController();
// draw
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(2, 1);
// game.playRound(0, 0);
// game.playRound(0, 2);
// game.playRound(2, 0);
// game.playRound(2, 2);

// X wins
game.playRound(1, 1); //x
game.playRound(1, 2); //o
game.playRound(1, 0); //x
game.playRound(0, 0); //o
game.playRound(0, 2); //x
game.playRound(2, 2); //o
game.playRound(0, 1); //x
game.playRound(2, 0); //o
game.playRound(2, 1); //x

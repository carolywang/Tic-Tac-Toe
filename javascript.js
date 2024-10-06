/*
 A Cell represents one square on the board and can have one of the following:
 1. "X" - cross
 2. "O" - nought
 3. null - empty
 */
function Cell() {
  let value = null;
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  return { addToken, getValue };
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
  const dropToken = (player, row, column) => {
    if (board[row][column].getValue() === null) {
      board[row][column].addToken(player);
    } else {
      return;
    }
  };

  // get and print current board to console
  const getCurrentBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
    return boardWithCellValues;
  };

  return { getBoard, dropToken, getCurrentBoard };
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
    board.getCurrentBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };
  const playRound = (row, column) => {
    // drop a token from current active player
    console.log(
      `Dropping ${getActivePlayer().token} to row ${row} column ${column}...`
    );
    board.dropToken(getActivePlayer().token, row, column);
    board.getCurrentBoard();
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
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            if (board.getCurrentBoard()[i][j].getValue() === token) {
              locations.push([i, j]);
            }
          }
        }
        return locations;
      };

      const checkTokenLocations = (locations, token) => {
        const showWinner = console.log(`The winner is ${token}!`);
        let locNums = [0, 1, 2];
        // check if row or column condition is met
        for (let locNum of locNums) {
          if (
            locations.filter((loc) => loc[0] === locNum).length === 3 ||
            locations.filter((loc) => loc[1] === locNum).length === 3
          ) {
            return showWinner;
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
        if (
          diagonalOne.every((loc) => locations.includes(loc)) ||
          diagonalTwo.every((loc) => locations.includes(loc))
        ) {
          return showWinner;
        }
      };

      // !!! check winner
      if (countToken(players[0].token) < 3) {
        if (countToken(players[1].token) < 3) {
          return;
        } else {
        }
      }
    };
  };
}

/* 
Play the game in console 
*/
const game = GameController();

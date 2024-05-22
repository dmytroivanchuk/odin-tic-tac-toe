const GameBoard = () => {
  const Space = (number) => {
    const defaultMarker = "-";
    let marker = defaultMarker;
    const getMarker = () => marker;
    const setMarker = (newMarker) => (marker = newMarker);
    const getNumber = () => number;
    const getDefaultMarker = () => defaultMarker;

    return { getMarker, setMarker, getNumber, getDefaultMarker };
  };

  const spaces = 9;

  const board = (() => {
    const board = [];
    for (let number = 1; number <= spaces; number++) {
      const space = Space(number);
      board.push(space);
    }
    return board;
  })();

  let unmarkedSpaceNumbers = (() => {
    const arr = [];
    for (let number = 1; number <= spaces; number++) {
      arr.push(number);
    }
    return arr;
  })();

  const mark = (marker, spaceNumber) => {
    const targetSpace = board.find(
      (space) => space.getNumber() === spaceNumber
    );
    targetSpace.setMarker(marker);
    const spaceNumberIndex = unmarkedSpaceNumbers.indexOf(spaceNumber);
    unmarkedSpaceNumbers.splice(spaceNumberIndex, 1);
  };

  const spaceUnmarked = (spaceNumber) => {
    return unmarkedSpaceNumbers.includes(spaceNumber);
  };

  const printed = () => {
    const boardMapped = board.map((space) => space.getMarker());
    const columns = 3;
    let boardPrinted = "";
    for (let i = 0; i < boardMapped.length; i += columns) {
      const row = boardMapped.slice(i, i + columns);
      const rowJoined = row.join(" ");
      const rowPrinted = rowJoined + "\n";
      boardPrinted += rowPrinted;
    }
    return boardPrinted;
  };

  const randomSpaceNumber = () => {
    return unmarkedSpaceNumbers[
      Math.floor(Math.random() * unmarkedSpaceNumbers.length)
    ];
  };

  const checkCombination = (combination) => {
    const targetCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    return targetCombinations.some((comb) =>
      comb.every((spaceNumber) => combination.includes(spaceNumber))
    );
  };

  const restart = () => {
    board.forEach((space) => {
      if (space.getMarker() != space.getDefaultMarker()) {
        space.setMarker(space.getDefaultMarker());
      }
    });

    const arr = [];
    for (let number = 1; number <= spaces; number++) {
      arr.push(number);
    }
    unmarkedSpaceNumbers = arr;
  };

  const allSpacesMarked = () => {
    return unmarkedSpaceNumbers.length === 0 ? true : false;
  };

  return {
    mark,
    spaceUnmarked,
    printed,
    randomSpaceNumber,
    checkCombination,
    restart,
    allSpacesMarked,
  };
};

const Player = (newName, newMarker) => {
  let name = newName;
  let marker = newMarker;
  const getName = () => name;
  const setName = (newName) => (name = newName);
  const getMarker = () => marker;
  const setMarker = (newMarker) => (marker = newMarker);
  let markedSpaceNumbers = [];
  const getMarkedSpaceNumbers = () => markedSpaceNumbers;
  const addMarkedSpaceNumber = (number) => markedSpaceNumbers.push(number);
  let movesMade = 0;
  const getMovesMade = () => movesMade;
  const incrementMovesMade = () => (movesMade += 1);
  const restart = () => {
    markedSpaceNumbers = [];
    movesMade = 0;
  };

  return {
    getName,
    setName,
    getMarker,
    setMarker,
    getMarkedSpaceNumbers,
    addMarkedSpaceNumber,
    getMovesMade,
    incrementMovesMade,
    restart,
  };
};

const GameController = () => {
  const GameMode = () => {
    const single = "single";
    const multi = "multi";
    let active = single;

    const getActive = () => active;
    const getSingle = () => single;
    const setSingle = () => (active = single);
    const getMulti = () => multi;
    const setMulti = () => (active = multi);

    return {
      getActive,
      getSingle,
      setSingle,
      getMulti,
      setMulti,
    };
  };

  const gameBoard = GameBoard();
  const gameMode = GameMode();
  const player1 = Player("User", "X");
  const player2 = Player("Computer", "O");
  let playerToMove;

  const playMove = (player, spaceNumber) => {
    gameBoard.mark(player.getMarker(), spaceNumber);
    player.addMarkedSpaceNumber(spaceNumber);
    player.incrementMovesMade();
    console.log(
      `Space number ${spaceNumber} is marked by ${player.getName()}.`
    );
    console.log(gameBoard.printed());
  };

  const hasWon = (player) => {
    if (player.getMovesMade() >= 3) {
      if (gameBoard.checkCombination(player.getMarkedSpaceNumbers())) {
        console.log(`Game over. ${player.getName()} has won.`);
        return true;
      }
    }
    return false;
  };

  const draw = () => {
    if (gameBoard.allSpacesMarked()) {
      console.log("Game over. Draw.");
      return true;
    }
    return false;
  };

  const mark = (spaceNumber) => {
    if (isNaN(spaceNumber)) {
      console.log(
        `Invalid space number. Type "game.play()" with a valid space number from 1 to 9`
      );
    } else if (!gameBoard.spaceUnmarked(spaceNumber)) {
      console.log(
        `Space number ${spaceNumber} is already marked! Try another.`
      );
    } else {
      if (gameMode.getActive() === gameMode.getSingle()) {
        playMove(player1, spaceNumber);
        if (hasWon(player1) || draw()) {
        return;
      }

        const player2SpaceNumber = gameBoard.randomSpaceNumber();
        playMove(player2, player2SpaceNumber);
        if (hasWon(player2) || draw()) {
        return;
      }
    } else {
        if (playerToMove === player1) {
          playMove(player1, spaceNumber);
          if (hasWon(player1) || draw()) {
            return;
          }
          playerToMove = player2;
        } else {
          playMove(player2, spaceNumber);
          if (hasWon(player2) || draw()) {
            return;
          }
          playerToMove = player1;
        }
      }
    }
  };

  const start = () => {
    gameBoard.restart();
    player1.restart();
    player2.restart();

    const players = [player1, player2];
    playerToMove = players[Math.floor(Math.random() * players.length)];

    console.log(`${playerToMove.getName()} goes first.`);

    if (
      playerToMove === player1 ||
      gameMode.getActive() === gameMode.getMulti()
    ) {
      console.log(
        `Type "game.mark() with a space number from 1 to 9 in the parentheses to mark the space number on the board.`
      );
    } else {
      const player2SpaceNumber = gameBoard.randomSpaceNumber();
      playMove(player2, player2SpaceNumber);
    }
  };

  const changeGameMode = () => {
    if (gameMode.getActive() === gameMode.getSingle()) {
      gameMode.setMulti();
      console.log(`Game mode is changed to 2 players.`);
    } else {
      gameMode.setSingle();
      console.log(`Game mode is changed to 1 player.`);
    }
  };

  const greeting = () => {
    console.log(
      `Welcome to the Tic Tac Toe game!\n\n1. Type "game.start()" to start or restart the game.\n\n2. Type "game.mark() with a space number from 1 to 9 in the parentheses to mark the space number on the board.`
    );
  };
  greeting();

  return { start, mark, changePlayerName, changePlayerMarker, changeGameMode };
};

const game = GameController();

const Gameboard = (defaultMarkType = "-") => {
  const Space = (number) => {
    let markType = defaultMarkType;
    const getNumber = () => number;
    const getDefaultMarkType = () => defaultMarkType;

    return { markType, getNumber, getDefaultMarkType };
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

  const mark = (markType, spaceNumber) => {
    const targetSpace = board.find(
      (space) => space.getNumber() === spaceNumber
    );
    targetSpace.markType = markType;
    const spaceNumberIndex = unmarkedSpaceNumbers.indexOf(spaceNumber);
    unmarkedSpaceNumbers.splice(spaceNumberIndex, 1);
  };

  const spaceUnmarked = (spaceNumber) => {
    return unmarkedSpaceNumbers.includes(spaceNumber);
  };

  const printed = () => {
    const boardMapped = board.map((space) => space.markType);
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
      if (space.markType != space.getDefaultMarkType()) {
        space.markType = space.getDefaultMarkType();
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

const Player = (name, markType) => {
  const getName = () => name;
  const getMarkType = () => markType;
  let markedSpaceNumbers = [];
  const getMarkedSpaceNumbers = () => markedSpaceNumbers;
  const addMarkedSpaceNumber = (number) => markedSpaceNumbers.push(number);
  let turnsMade = 0;
  const getTurnsMade = () => turnsMade;
  const incrementTurnsMade = () => (turnsMade += 1);
  const restart = () => {
    markedSpaceNumbers = [];
    turnsMade = 0;
  };

  return {
    getName,
    getMarkType,
    getMarkedSpaceNumbers,
    addMarkedSpaceNumber,
    getTurnsMade,
    incrementTurnsMade,
    restart,
  };
};

const GameController = () => {
  const gameboard = Gameboard();
  const user = Player("User", "X");
  const computer = Player("Computer", "O");

  const playTurn = (player, spaceNumber) => {
    gameboard.mark(player.getMarkType(), spaceNumber);
    player.addMarkedSpaceNumber(spaceNumber);
    player.incrementTurnsMade();
    console.log(
      `Space number ${spaceNumber} is marked by ${player.getName()}.`
    );
    console.log(gameboard.printed());
  };

  const hasWon = (player) => {
    if (player.getTurnsMade() >= 3) {
      if (gameboard.checkCombination(player.getMarkedSpaceNumbers())) {
        console.log(`Game over. ${player.getName()} has won.`);
        return true;
      }
    }
    return false;
  };

  const draw = () => {
    if (gameboard.allSpacesMarked()) {
      console.log("Game over. Draw.");
      return true;
    }
    return false;
  };

  const mark = (userSpaceNumber) => {
    if (isNaN(userSpaceNumber)) {
      console.log(
        `Invalid space number. Type "game.play()" with a valid space number from 1 to 9`
      );
    } else if (gameboard.spaceUnmarked(userSpaceNumber)) {
      playTurn(user, userSpaceNumber);
      if (hasWon(user) || draw()) {
        return;
      }

      const computerSpaceNumber = gameboard.randomSpaceNumber();
      playTurn(computer, computerSpaceNumber);
      if (hasWon(computer) || draw()) {
        return;
      }
    } else {
      console.log(
        `Space number ${userSpaceNumber} is already marked! Try another.`
      );
    }
  };

  const start = () => {
    gameboard.restart();
    user.restart();
    computer.restart();

    const players = [user, computer];
    const firstTurnPlayer = players[Math.floor(Math.random() * players.length)];

    console.log(`${firstTurnPlayer.getName()} goes first.`);

    if (firstTurnPlayer === user) {
      console.log(
        `Type "game.mark() with a space number from 1 to 9 in the parentheses to mark the space number on the board.`
      );
    } else {
      const computerSpaceNumber = gameboard.randomSpaceNumber();
      playTurn(computer, computerSpaceNumber);
    }
  };

  const greeting = () => {
    console.log(
      `Welcome to the Tic Tac Toe game!\n\n1. Type "game.start()" to start or restart the game.\n\n2. Type "game.mark() with a space number from 1 to 9 in the parentheses to mark the space number on the board.`
    );
  };
  greeting();

  return { start, mark };
};

const game = GameController();

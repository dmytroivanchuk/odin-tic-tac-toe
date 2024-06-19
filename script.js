const ticTacToe = (() => {
  const GameController = () => {
    const GameBoard = () => {
      const Space = (number) => {
        const defaultMarker = "";
        let marker = defaultMarker;

        const getMarker = () => marker;
        const setMarker = (newMarker) => (marker = newMarker);
        const getDefaultMarker = () => defaultMarker;
        const getNumber = () => number;

        return { getMarker, setMarker, getNumber, getDefaultMarker };
      };

      const spaces = 9;

      const board = (() => {
        const board = [];
        for (let i = 1; i <= spaces; i++) {
          const space = Space(i);
          board.push(space);
        }
        return board;
      })();

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

      let unmarkedSpaceNumbers = (() => {
        const arr = [];
        for (let i = 1; i <= spaces; i++) {
          arr.push(i);
        }
        return arr;
      })();

      const get = () => board;

      const mark = (marker, spaceNumber) => {
        const targetSpace = board.find(
          (space) => space.getNumber() === spaceNumber
        );
        targetSpace.setMarker(marker);
        const spaceNumberIndex = unmarkedSpaceNumbers.indexOf(spaceNumber);
        unmarkedSpaceNumbers.splice(spaceNumberIndex, 1);
      };

      const spaceMarked = (spaceNumber) => {
        return !unmarkedSpaceNumbers.includes(spaceNumber);
      };

      const allSpacesMarked = () => {
        return unmarkedSpaceNumbers.length === 0;
      };

      const randomSpaceNumber = () => {
        return unmarkedSpaceNumbers[
          Math.floor(Math.random() * unmarkedSpaceNumbers.length)
        ];
      };

      const combinationMatched = (combination) => {
        return targetCombinations.some((comb) =>
          comb.every((spaceNumber) => combination.includes(spaceNumber))
        );
      };

      const clearMarkedSpaces = () => {
        board.forEach((space) => {
          space.setMarker(space.getDefaultMarker());
        });

        unmarkedSpaceNumbers = (() => {
          const arr = [];
          for (let number = 1; number <= spaces; number++) {
            arr.push(number);
          }
          return arr;
        })();
      };

      return {
        get,
        mark,
        spaceMarked,
        allSpacesMarked,
        randomSpaceNumber,
        combinationMatched,
        clearMarkedSpaces,
      };
    };

    const Player = (name, marker) => {
      let markedSpaceNumbers = [];
      let score = 0;

      const getName = () => name;
      const setName = (newName) => (name = newName);
      const getMarker = () => marker;
      const getMarkedSpaceNumbers = () => markedSpaceNumbers;
      const clearMarkedSpaceNumbers = () => (markedSpaceNumbers = []);
      const addMarkedSpaceNumber = (number) => markedSpaceNumbers.push(number);
      const getScore = () => score;
      const incrementScore = () => (score += 1);
      const clearScore = () => (score = 0);

      return {
        getName,
        setName,
        getMarker,
        getMarkedSpaceNumbers,
        clearMarkedSpaceNumbers,
        addMarkedSpaceNumber,
        getScore,
        incrementScore,
        clearScore,
      };
    };

    const GameMode = () => {
      const single = "1P";
      const multi = "2P";
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
    const player1 = Player("Player", "X");
    const player2 = Player("Computer", "O");
    let tieScore = 0;
    let playerToMove;

    const playMove = (player, spaceNumber) => {
      gameBoard.mark(player.getMarker(), spaceNumber);
      player.addMarkedSpaceNumber(spaceNumber);

      if (gameBoard.combinationMatched(player.getMarkedSpaceNumbers())) {
        player.incrementScore();
        clearRound();
        return;
      } else if (gameBoard.allSpacesMarked()) {
        tieScore += 1;
        clearRound();
        return;
      }
    };

    const clearRound = () => {
      gameBoard.clearMarkedSpaces();
      player1.clearMarkedSpaceNumbers();
      player2.clearMarkedSpaceNumbers();
    };

    const start = () => {
      const players = [player1, player2];
      playerToMove = players[Math.floor(Math.random() * players.length)];

      if (
        playerToMove === player2 &&
        gameMode.getActive() === gameMode.getSingle()
      ) {
        const player2SpaceNumber = gameBoard.randomSpaceNumber();
        playMove(player2, player2SpaceNumber);
      }
    };

    const play = (spaceNumber) => {
      if (gameBoard.spaceMarked(spaceNumber)) {
        return;
      }
      switch (gameMode.getActive()) {
        case gameMode.getSingle():
          playMove(player1, spaceNumber);
          const player2SpaceNumber = gameBoard.randomSpaceNumber();
          playMove(player2, player2SpaceNumber);
          break;
        case gameMode.getMulti():
          switch (playerToMove) {
            case player1:
              playMove(player1, spaceNumber);
              playerToMove = player2;
              break;
            case player2:
              playMove(player2, spaceNumber);
              playerToMove = player1;
          }
      }
    };

    const changeMode = () => {
      switch (gameMode.getActive()) {
        case gameMode.getSingle():
          gameMode.setMulti();
          player1.setName("Player 1");
          player2.setName("Player 2");
          break;
        case gameMode.getMulti():
          gameMode.setSingle();
          player1.setName("Player");
          player2.setName("Computer");
      }
      clearRound();
      player1.clearScore();
      player2.clearScore();
      tieScore = 0;
    };

    const getScore = () => ({
      player1: player1.getScore(),
      player2: player2.getScore(),
      tie: tieScore,
    });

    const getBoard = () => gameBoard.get();
    const getPlayer1Name = () => player1.getName();
    const getPlayer2Name = () => player2.getName();
    const getPlayer1Marker = () => player1.getMarker();
    const getPlayer2Marker = () => player2.getMarker();
    const getActiveMode = () => gameMode.getActive();
    const getSingleMode = () => gameMode.getSingle();
    const getMultiMode = () => gameMode.getMulti();

    return {
      start,
      play,
      changeMode,
      getScore,
      getBoard,
      getPlayer1Name,
      getPlayer2Name,
      getPlayer1Marker,
      getPlayer2Marker,
      getActiveMode,
      getSingleMode,
      getMultiMode,
    };
  };

  const game = GameController();
  const spaces = document.querySelector(".board").children;
  const board = game.getBoard();

  const player1Name = document.querySelector(".player1 .name");
  const player1Score = document.querySelector(".player1 .score");
  const tieName = document.querySelector(".tie .name");
  const tieScore = document.querySelector(".tie .score");
  const player2Name = document.querySelector(".player2 .name");
  const player2Score = document.querySelector(".player2 .score");
  const modeName = document.querySelector(".mode .name");
  const modeIcon = document.querySelector(".mode .icon");

  const initializeBoard = () => {
    for (let i = 0; i < spaces.length; i++) {
      spaces[i].addEventListener("click", () => {
        const spaceNumber = board[i].getNumber();
        game.play(spaceNumber);
        updateBoard();
        updateInfo();
      });
    }
  };

  const updateBoard = () => {
    for (let i = 0; i < spaces.length; i++) {
      spaces[i].textContent = board[i].getMarker();
    }
  };

  const initializeInfo = () => {
    const mode = document.querySelector(".mode");
    mode.addEventListener("click", () => {
      game.changeMode();
      game.start();
      updateBoard();
      updateInfo();
    });
  };

  const updateInfo = () => {
    player1Name.textContent = `${game.getPlayer1Name()} (${game.getPlayer1Marker()})`;
    player1Score.textContent = game.getScore().player1;

    tieName.textContent = "Tie";
    tieScore.textContent = game.getScore().tie;

    player2Name.textContent = `${game.getPlayer2Name()} (${game.getPlayer2Marker()})`;
    player2Score.textContent = game.getScore().player2;

    modeName.textContent = game.getActiveMode();
    switch (game.getActiveMode()) {
      case game.getSingleMode():
        modeIcon.src = "icons/account.svg";
        modeIcon.alt = "1-Player mode";
        break;
      case game.getMultiMode():
        modeIcon.src = "icons/account-multiple.svg";
        modeIcon.alt = "2-Player mode";
    }
  };

  game.start();
  initializeBoard();
  updateBoard();
  initializeInfo();
  updateInfo();
})();

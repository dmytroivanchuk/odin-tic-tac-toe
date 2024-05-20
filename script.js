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

const board = document.getElementById("board");
const message = document.getElementById("message");
let currentPlayer = "X";
let gameActive = true;
const cells = Array(9).fill(null);
let roundCounter = 0; // Tracks the number of rounds completed

function createBoard() {
  board.innerHTML = "";
  cells.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    if (roundCounter < 4) {
      message.textContent = `Round ${roundCounter + 1}: ${currentPlayer} was about to win, but the game continues!`;
      resetBoard(); // Prevent the winner from winning
    } else {
      message.textContent = `${currentPlayer} wins! Congratulations!`;
      gameActive = false;

      // Trigger PDF download after a win
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = "Note/us.pdf"; // Path to the PDF file
        link.download = "Winner_Certificate.pdf"; // Name of the downloaded file
        link.click();
      }, 1000);

      return;
    }
  }

  if (cells.every(cell => cell)) {
    message.textContent = `Round ${roundCounter + 1}: It's a draw!`;
    resetBoard();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  const emptyCells = cells.map((cell, i) => (cell ? null : i)).filter(i => i !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  cells[randomIndex] = "O";
  const cellElement = document.querySelector(`.cell[data-index='${randomIndex}']`);
  cellElement.textContent = "O";

  if (checkWin("O")) {
    if (roundCounter < 4) {
      message.textContent = `Round ${roundCounter + 1}: O was about to win, but the game continues!`;
      resetBoard(); // Prevent O from winning
    } else {
      message.textContent = `O wins! Congratulations!`;
      gameActive = false;
      return;
    }
  }

  if (cells.every(cell => cell)) {
    message.textContent = `Round ${roundCounter + 1}: It's a draw!`;
    resetBoard();
    return;
  }

  currentPlayer = "X";
}

function resetBoard() {
  roundCounter++; // Increment the round counter
  if (roundCounter < 5) {
    cells.fill(null);
    createBoard();
    gameActive = true;
    message.textContent = `Round ${roundCounter + 1}: Get ready!`;
  }
}

function checkWin(player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winningCombinations.some(combination =>
    combination.every(index => cells[index] === player)
  );
}

createBoard();

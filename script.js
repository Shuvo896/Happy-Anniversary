const board = document.getElementById("board");
const message = document.getElementById("message");
let currentPlayer = "X";
let gameActive = true;
const cells = Array(9).fill(null);

// Create the game board
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

// Handle a player's move
function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    if (currentPlayer === "X") {
      // If player X wins, redirect to index2.html
      message.textContent = `${currentPlayer} wins! Redirecting...`;
      gameActive = false;
      setTimeout(() => {
        window.location.href = "index2.html";
      }, 1000);
    } else {
      // If player O wins, restart the game
      message.textContent = `Player O wins! Restarting...`;
      setTimeout(resetGame, 1000);
    }
    return;
  }

  if (cells.every(cell => cell)) {
    // If it's a draw, restart the game
    message.textContent = "It's a draw! Restarting...";
    setTimeout(resetGame, 1000);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

// Simulate the computer's move
function computerMove() {
  const emptyCells = cells.map((cell, i) => (cell ? null : i)).filter(i => i !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  cells[randomIndex] = "O";
  const cellElement = document.querySelector(`.cell[data-index='${randomIndex}']`);
  cellElement.textContent = "O";

  if (checkWin("O")) {
    message.textContent = "Player O wins! Restarting...";
    gameActive = false;
    setTimeout(resetGame, 1000);
    return;
  }

  if (cells.every(cell => cell)) {
    message.textContent = "It's a draw! Restarting...";
    gameActive = false;
    setTimeout(resetGame, 1000);
    return;
  }

  currentPlayer = "X";
}

// Check for a winner
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

// Reset the game state
function resetGame() {
  cells.fill(null);
  currentPlayer = "X";
  gameActive = true;
  createBoard();
  message.textContent = "New game started! Your turn.";
}

// Initialize the game
createBoard();

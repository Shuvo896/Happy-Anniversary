const board = document.getElementById("board");
const message = document.getElementById("message");
let currentPlayer = "X";
let gameActive = true;
const cells = Array(9).fill(null);

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
    message.textContent = `${currentPlayer} wins!`;
    gameActive = false;

    // Trigger PDF download
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "Note/us.pdf"; // Path to the PDF file in the 'Note' directory
      link.download = "us.pdf"; // The name of the downloaded file
      link.click();
    }, 1000);

    return;
  }

  if (cells.every(cell => cell)) {
    message.textContent = "It's a draw!";
    gameActive = false;
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
    message.textContent = "O wins!";
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell)) {
    message.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
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

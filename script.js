let gameBoard = Array(9).fill(null);
let isGameOver = false;
let currentPlayer = 'X';
let gameMode = 1;

const player = 'X';
const computer = 'O';

const boardEl = document.getElementById('gameBoard');
const statusEl = document.getElementById('status');

function selectMode(mode) {
  gameMode = mode;
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'flex';
  restartGame();
}

const winCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function drawBoard() {
  boardEl.innerHTML = '';
  gameBoard.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = val;
    cell.addEventListener('click', () => makeMove(i));
    boardEl.appendChild(cell);
  });
}

function makeMove(index) {
  if (gameBoard[index] || isGameOver) return;

  gameBoard[index] = currentPlayer;
  drawBoard();

  if (checkWinner(currentPlayer)) {
    statusEl.textContent = `🎉 Player ${currentPlayer} Wins!`;
    isGameOver = true;
    return;
  }

  if (!gameBoard.includes(null)) {
    statusEl.textContent = "It's a Draw 🤝";
    isGameOver = true;
    return;
  }

  if (gameMode === 1) {
    currentPlayer = player;
    statusEl.textContent = "Computer's Turn 🤖";
    setTimeout(computerMove, 500);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function computerMove() {
  if (isGameOver) return;

  const bestMove = getBestMove();
  gameBoard[bestMove] = computer;
  drawBoard();

  if (checkWinner(computer)) {
    statusEl.textContent = "💻 Computer Wins!";
    isGameOver = true;
    return;
  }

  if (!gameBoard.includes(null)) {
    statusEl.textContent = "It's a Draw 🤝";
    isGameOver = true;
    return;
  }

  statusEl.textContent = "Your Turn (X)";
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === null) {
      gameBoard[i] = computer;
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(computer)) return 10 - depth;
  if (checkWinner(player)) return depth - 10;
  if (!board.includes(null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = computer;
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = player;
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(p) {
  return winCombinations.some(combo =>
    combo.every(index => gameBoard[index] === p)
  );
}

function restartGame() {
  gameBoard = Array(9).fill(null);
  isGameOver = false;
  currentPlayer = 'X';
  statusEl.textContent = gameMode === 1 ? "Your Turn (X)" : "Player X's Turn";
  drawBoard();
}

drawBoard();

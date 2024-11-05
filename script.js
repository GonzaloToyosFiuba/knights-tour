let currentAnimationKey = null; // Clave única para la animación actual

const generateBoard = () => {
  const boardSize = document.getElementById("board-size").value;
  if (boardSize < 5 || boardSize > 8) {
    alert("El tablero debe tener dimensión entre 5 y 8.");
    return;
  }

  currentAnimationKey = null; // Detenemos cualquier animación en curso
  const chessboard = document.getElementById("chessboard");

  chessboard.innerHTML = '';

  chessboard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  chessboard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
  chessboard.style.width = `${boardSize * 60}px`;
  chessboard.style.height = `${boardSize * 60}px`;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const square = document.createElement('div');
      square.classList.add('square');

      const isLightSquare = (row + col) % 2 === 0;
      square.classList.add(isLightSquare ? 'light' : 'dark');

      chessboard.appendChild(square);
    }
  }
};

const cleanBoard = () => {
  currentAnimationKey = null; // Reiniciamos la clave para detener animaciones en curso
  const squares = Array.from(document.querySelectorAll('.square'));
  for (let square of squares) {
    square.innerText = '';
    square.classList.remove('visited');
  }
};

const moveKnight = async () => {
  cleanBoard();

  const boardSize = document.getElementById("board-size").value;
  const path = getKnightPath(parseInt(boardSize));
  const squares = Array.from(document.querySelectorAll('.square'));

  // Creamos una nueva clave de animación y la asignamos a esta ejecución
  const animationKey = Symbol("animationKey");
  currentAnimationKey = animationKey;

  let knightImg = document.querySelector('.knight');
  if (!knightImg) {
    knightImg = document.createElement('img');
    knightImg.src = 'horse.svg';
    knightImg.classList.add('knight');
    const origin = path[0][0] * boardSize + path[0][1];
    squares[origin].appendChild(knightImg);
  }

  let previousSquare = null;
  for (let step = 0; step < path.length; step++) {
    if (currentAnimationKey !== animationKey) break; // Detenemos si hay una nueva animación

    const [row, col] = path[step];
    const square = squares[row * boardSize + col];

    if (square) {
      square.classList.add('visited');
      square.appendChild(knightImg);

      if (previousSquare) {
        const seqNum = document.createElement('span');
        seqNum.classList.add('seqNum');
        seqNum.innerText = step;
        previousSquare.appendChild(seqNum);
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      previousSquare = square;
    }
  }
};

// Añadimos eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.getElementById("generate-button");
  const moveKnightButton = document.getElementById("move-knight-button");

  generateButton.addEventListener("click", generateBoard);
  generateBoard();

  moveKnightButton.addEventListener("click", moveKnight);
});

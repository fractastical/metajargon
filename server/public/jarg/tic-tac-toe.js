function ticTacToeThreeJS(scene) {
    const size = 3;
    let board = Array(size).fill(null).map(() => Array(size).fill(null));
    let currentPlayer = 'X';
  
    function onClick(event) {
      const x = Math.floor(event.clientX / (window.innerWidth / size));
      const y = Math.floor(event.clientY / (window.innerHeight / size));
  
      if (board[y][x] === null) {
        board[y][x] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        checkGameState();
      }
    }
  
    function checkGameState() {
      const lines = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
      ];
  
      for (let line of lines) {
        const [a, b, c] = line;
        if (
          board[a[0]][a[1]] &&
          board[a[0]][a[1]] === board[b[0]][b[1]] &&
          board[a[0]][a[1]] === board[c[0]][c[1]]
        ) {
          alert(`${board[a[0]][a[1]]} wins!`);
          resetBoard();
        }
      }
  
      if (board.every(row => row.every(cell => cell !== null))) {
        alert("It's a draw!");
        resetBoard();
      }
    }
  
    function resetBoard() {
      board = Array(size).fill(null).map(() => Array(size).fill(null));
      currentPlayer = 'X';
    }
  
    window.addEventListener('click', onClick);
  }
  
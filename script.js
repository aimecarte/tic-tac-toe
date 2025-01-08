const appState = {
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ],
    moves: [],
    currentPlayer: null,
    currentMoveIndex: -1    
};

const boardElement = document.querySelector('.board');
const messageElement = document.querySelector('.message');
const previousButton = document.querySelector('.previous');
const nextButton = document.querySelector('.next');
const resetButton = document.querySelector('.reset');

function renderBoard() {

    messageElement.textContent = appState.currentPlayer ? `Player ${appState.currentPlayer}\'s turn` : `Choose a player`;
    boardElement.innerHTML = '';
    const { board } = appState;
    board.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
            rowElement.appendChild(cellElement);
        });
        boardElement.appendChild(rowElement);
    });
}

function handleCellClick(row, col) {
    const { board, currentPlayer } = appState;

    if (board[row][col] !== '' || checkWinner(board)) return;
    
    board[row][col] = currentPlayer;

    const copyBoard = board.map(row => [...row]);

    appState.moves.push(copyBoard);
    appState.currentMoveIndex++;;

    if (checkWinner(board)) {
        messageElement.textContent = `${currentPlayer} wins!`;
        toggleHistoryButtons(true);
    } else if (isDraw(board)) {
        messageElement.textContent = 'It\'s a draw!';
        toggleHistoryButtons(true);
    } else {
        appState.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        messageElement.textContent = `Player ${appState.currentPlayer}\'s turn`;
    }

    renderBoard();
    updateHistoryButtons();
}

function checkWinner(board) {
    const lines = [
        // Rows
        [ [0, 0], [0, 1], [0, 2] ],
        [ [1, 0], [1, 1], [1, 2] ],
        [ [2, 0], [2, 1], [2, 2] ],
        // Columns
        [ [0, 0], [1, 0], [2, 0] ],
        [ [0, 1], [1, 1], [2, 1] ],
        [ [0, 2], [1, 2], [2, 2] ],
        // Diagonals
        [ [0, 0], [1, 1], [2, 2] ],
        [ [0, 2], [1, 1], [2, 0] ]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a[0]][a[1]] && 
            board[a[0]][a[1]] === board[b[0]][b[1]] && 
            board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return true;
        }
    }
    return false;
}

function isDraw(board) {
    return board.flat().every(cell => cell !== '');
}

function showPreviousMove() {
    const { moves, currentMoveIndex } = appState;
    if (currentMoveIndex > 0) {
        appState.currentMoveIndex--;
        appState.board = moves[appState.currentMoveIndex];
        renderBoard();
        updateHistoryButtons();
    }
}

function showNextMove() {
    const { moves, currentMoveIndex } = appState;
    if (currentMoveIndex < moves.length - 1) {
        appState.currentMoveIndex++;
        appState.board = moves[appState.currentMoveIndex];
        renderBoard();
        updateHistoryButtons();
    }
}

function resetGame() {
    appState.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    appState.moves = [];
    appState.currentMoveIndex = -1;
    appState.currentPlayer = null;

    toggleHistoryButtons(false);
    renderBoard();
}

function updateHistoryButtons() {
    const { currentMoveIndex, moves } = appState;
    previousButton.disabled = currentMoveIndex <= 0;
    nextButton.disabled = currentMoveIndex >= moves.length - 1;
}

function toggleHistoryButtons(visible) {
    previousButton.style.display = visible ? 'inline-block' : 'none';
    nextButton.style.display = visible ? 'inline-block' : 'none';
}

previousButton.addEventListener('click', showPreviousMove);
nextButton.addEventListener('click', showNextMove);
resetButton.addEventListener('click', loadSA);

loadSA();

async function loadSA(){
    resetGame();
    const inputOptions = {
        "X": "X",
        "O": "O"
    };
    const { value: selectedPlayer } = await Swal.fire({
    title: "Select player",
    input: "radio",
    inputOptions,
    inputValidator: (value) => {
        if (!value) {
        return "You need to choose something!";
        }
    }
    });
    appState.currentPlayer = selectedPlayer;
    if (appState.currentPlayer !== null) {
    renderBoard();
    }
}


const chessboard = document.getElementById('chessboard');
const pieces = {
    'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟',
    'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔', 'p': '♙'
};

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let selectedPiece = null;
let currentPlayer = 'white'; // 'white' or 'black'

function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = initialBoard[row][col];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece');
                pieceElement.textContent = pieces[piece];
                pieceElement.dataset.piece = piece;
                square.appendChild(pieceElement);
            }

            square.addEventListener('click', () => handleSquareClick(square));
            chessboard.appendChild(square);
        }
    }
}

function handleSquareClick(square) {
    const pieceElement = square.querySelector('.piece');

    if (selectedPiece) {
        movePiece(selectedPiece, square);
        selectedPiece = null;
        clearHighlights();
    } else if (pieceElement) {
        const pieceColor = getPieceColor(pieceElement.dataset.piece);
        if (pieceColor === currentPlayer) {
            selectedPiece = square;
            highlightValidMoves(square);
        }
    }
}

function movePiece(fromSquare, toSquare) {
    const pieceElement = fromSquare.querySelector('.piece');
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);

    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
        toSquare.appendChild(pieceElement);
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    const targetPiece = initialBoard[toRow][toCol];
    const dx = Math.abs(toRow - fromRow);
    const dy = Math.abs(toCol - fromCol);

    // Check if the target square has a piece of the same color
    if (targetPiece && getPieceColor(targetPiece) === getPieceColor(piece)) {
        return false;
    }

    // Movement rules for each piece
    switch (piece.toLowerCase()) {
        case 'p': // Pawn
            const direction = piece === 'P' ? -1 : 1; // White pawns move up, black pawns move down
            if (fromCol === toCol) {
                // Move forward one square
                if (toRow === fromRow + direction && !targetPiece) return true;
                // Move two squares on first move
                if ((fromRow === 1 && piece === 'p' && toRow === 3 && !targetPiece) ||
                    (fromRow === 6 && piece === 'P' && toRow === 4 && !targetPiece)) {
                    return true;
                }
            } else if (dy === 1 && toRow === fromRow + direction && targetPiece) {
                // Capture diagonally
                return true;
            }
            break;

        case 'r': // Rook
            if (fromRow === toRow || fromCol === toCol) {
                return isPathClear(fromRow, fromCol, toRow, toCol);
            }
            break;

        case 'n': // Knight
            return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);

        case 'b': // Bishop
            if (dx === dy) {
                return isPathClear(fromRow, fromCol, toRow, toCol);
            }
            break;

        case 'q': // Queen
            if (fromRow === toRow || fromCol === toCol || dx === dy) {
                return isPathClear(fromRow, fromCol, toRow, toCol);
            }
            break;

        case 'k': // King
            return dx <= 1 && dy <= 1;
    }

    return false;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const dx = toRow - fromRow;
    const dy = toCol - fromCol;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xStep = dx / steps;
    const yStep = dy / steps;

    for (let i = 1; i < steps; i++) {
        const row = fromRow + xStep * i;
        const col = fromCol + yStep * i;
        if (initialBoard[row][col]) return false;
    }
    return true;
}

function highlightValidMoves(square) {
    const fromRow = parseInt(square.dataset.row);
    const fromCol = parseInt(square.dataset.col);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (isValidMove(fromRow, fromCol, row, col)) {
                const targetSquare = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                targetSquare.classList.add('highlight');
            }
        }
    }
}

function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(square => {
        square.classList.remove('highlight');
    });
}

function getPieceColor(piece) {
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

createBoard();
import { useState } from 'react'
import Restart from './Restart';
import './App.css'

// Square component representing each square on the board
function Square(props) {
  // Renders a button for each square, applying dynamic styles and values
  return (
    <button className="square" onClick={props.onSquareClick} style={props.onWinnerColor}>{props.value}</button>
  );
}

// Board component containing the game's logic
function Board(props) {
  // Handles click events on squares to make a move
  const handleClick = (i) => {
     // Prevents making a move on an already filled square or if the game is won
    if (props.squares[i] || calculateWinner(props.squares)) {
      return;
    }
    const nextSquares = props.squares.slice(); // Copies the current state of squares
     // Sets the current square to 'X' or 'O' based on whose turn it is
    props.xIsNext ? nextSquares[i] = "X" : nextSquares[i] = "O";
    props.onPlay(nextSquares); // Updates the state in the Game component
  }

  // Checks if there's a winner
  const winnerInfo = calculateWinner(props.squares);
  // Extracts the winning squares' indices if there's a winner
  const winningSquares = winnerInfo ? winnerInfo.line : [];

  // Renders a Square component for each square on the board
  const renderSquare = (i) => {
    // Checks if the current square is a winning square to apply the red background
    const isWinningSquare = winningSquares.includes(i);
    return (
      <Square
        value={props.squares[i]}
        onSquareClick={() => handleClick(i)}
        onWinnerColor={isWinningSquare ? { backgroundColor: 'red' } : { backgroundColor: '#fff' }}
      />
    );
  };

  // Determines the status message shown above the board
  let status;
  if (winnerInfo) {
    status = 'Ganador: ' + props.squares[winningSquares[0]];
  } else {
    status = 'Siguiente Jugador: ' + (props.xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="table">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    </>
  );
}

// Game component manages the game state and history
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // Tracks the history of moves
  const [currentMove, setCurrentMove] = useState(0); // Tracks the current move
  const xIsNext = currentMove % 2 === 0; // Determines whose turn it is
  const currentSquares = history[currentMove]; // Retrieves the current state of the board

  // Updates the game state with a new move
  const handlePlay = nextSquares => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); // Advances to the next move
  }

  const handleRestart = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    // Reset any other states as needed
};

// Allows jumping to a past move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Maps the history of moves to React elements for rendering
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir al movimiento #' + move;
    } else {
      description = 'Ir al inicio del juego'
    }
    return (
      <li key={move}>
        <button className='button' onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <Restart handleRestart = {handleRestart}/>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <h2>Historial de partida:</h2>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // Define all possible winning combinations on the board
  const lines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Center column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];

  // Iterate through all possible winning combinations
  for (let i = 0; i < lines.length; i++) {
    // Destructure the indices of the current winning combination into variables a, b, and c
    const [a, b, c] = lines[i];

    // Check if the squares at indices a, b, and c are filled and all equal
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // If true, return the value ('X' or 'O') at these indices, indicating a win
      return { winner: squares[a], line: [a, b, c] };
    }
  }

  // If no winning combinations are found, return null
  return null;
}

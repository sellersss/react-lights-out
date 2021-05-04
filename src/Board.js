import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.25,
  };
  constructor(props) {
    super(props);
    // TODO: set initial state
    this.state = {
      hasWon: false,
      board: this.createBoard(),
    };
    this.makeBoard = this.makeBoard.bind(this);
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  /** create a board nRows high/nCols wide, each cell randomly lit or unlit */
  createBoard() {
    let board = [];
    let { nRows, nCols, chanceLightStartsOn } = this.props;
    // TODO: create array-of-arrays of true/false values
    for (let r = 0; r < nRows; r++) {
      let row = [];
      for (let c = 0; c < nCols; c++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */
  flipCellsAround(coord) {
    let { nCols, nRows } = coord;
    let { board } = this.state;
    // let [y, x] = coord.split("-").map(Number);
    let north = {
      col: nCols,
      row: nRows - 1 < 0 ? nRows : nRows - 1,
    };
    let south = {
      col: nCols,
      row: nRows + 1 > 4 ? nRows : nRows + 1,
    };
    let west = {
      col: nCols - 1 < 0 ? nCols : nCols - 1,
      row: nRows,
    };
    let east = {
      col: nCols + 1 > 4 ? nCols : nCols + 1,
      row: nRows,
    };

    function flipper(col, row, props) {
      if (col >= 0 && col < props.nCols && row >= 0 && row < props.nRows) {
        board[row][col] = !board[row][col];
      }
    }

    // TODO: flip this cell and the cells around it
    north.row !== nRows && flipper(north.col, north.row, this.props);
    south.row !== nRows && flipper(south.col, south.row, this.props);
    west.col !== nCols && flipper(west.col, west.row, this.props);
    east.col !== nCols && flipper(east.col, east.row, this.props);
    flipper(nCols, nRows, this.props);

    // win when every cell is turned off
    // TODO: determine is the game has been won
    function isWinner() {
      return [...board].flat().every((c) => !c);
    }
    this.setState({ board, hasWon: isWinner() });
  }
  handleRestart(e) {
    let newBoard = this.createBoard();
    this.setState({ board: newBoard, hasWon: false });
    this.makeBoard();
  }

  /** Render game board or winning message. */
  makeBoard() {
    let board = this.state.board.map((row, ri) => {
      return (
        <>
          <tr key={`Row-${ri}`}>
            {row.map((c, ci) => {
              return (
                <Cell
                  key={`${ri}-${ci}`}
                  isLit={this.state.board[ri][ci]}
                  flipCellsAroundMe={this.flipCellsAround}
                  nCols={ci}
                  nRows={ri}
                />
              );
            })}
          </tr>
        </>
      );
    });
    return board;
  }

  render() {
    // TODO
    return !this.state.hasWon ? (
      <div>
        <h1 className="container">
          <span className="s1">Lights</span>
          <span className="s2">Out</span>
        </h1>
        <table className="Board">
          <tbody>{this.makeBoard()}</tbody>
        </table>
        <button className="Board-btn" onClick={this.handleRestart}>
          Try again
        </button>
      </div>
    ) : (
      // if the game is won, just show a winning msg & render nothing else
      <div>
        {/* <h1 className="Board-h1">Lights Out</h1> */}
        <h1 className="container">
          <span className="s1">You</span>
          <span className="s2">Win!</span>
        </h1>
        <button className="Board-btn" onClick={this.handleRestart}>
          Play Again!
        </button>
      </div>
    );
  }
}

export default Board;

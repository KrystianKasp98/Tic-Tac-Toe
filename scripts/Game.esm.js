import { UI } from './UI.esm.js';
import { Field } from './Field.esm.js';
import { BOARD_GAME,FIELD, BOARD_ROWS,BOARD_COLS, VARIABLE_ROWS_CSS, VARIABLE_COLS_CSS, BACKGROUND_IMAGE_O_CSS, BACKGROUND_IMAGE_X_CSS} from './Statements.esm.js';

export class Game extends UI{
  constructor() {
    //const properties
    super();
    this.board = this.getElement(BOARD_GAME)
    this.rows = BOARD_ROWS;
    this.cols = BOARD_COLS;

    this.board.addEventListener('click', (e) => {
      this.clickField(e);
    })

    //properties to restart
    this.arrayOfFields = [];
    this.gameMoves = 0;
    this.endGameMoves = this.rows * this.cols;
  }
  startGame() {
    this.generateFields();
    this.renderGame();
    console.log(this.arrayOfFields);
    console.log(this.endGameMoves);
  }
  generateFields() {
    //creating 2d array of fields
    for (let row = 0; row < this.rows; row++){
      this.arrayOfFields[row] = [];
      for (let col = 0; col < this.cols; col++){
        this.arrayOfFields[row].push(new Field(col, row));
      }
    }
  }
  renderBoard() {
    this.arrayOfFields.flat().forEach(field => {
      this.board.insertAdjacentHTML('beforeend', field.createElement());
    })
  }
  renderGame() {
    document.documentElement.style.setProperty(VARIABLE_ROWS_CSS, this.rows);
    document.documentElement.style.setProperty(VARIABLE_COLS_CSS, this.cols);
    this.generateFields();
    this.renderBoard();
  }
  //reference to clicked field
  findField(e) {
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);
    const field = this.arrayOfFields[rowIndex][colIndex];
    return field;
  }
  clickField = (e) => {
    const field = this.findField(e);
    field.setBackground(BACKGROUND_IMAGE_X_CSS);
  }
}

const game = new Game();
game.startGame();
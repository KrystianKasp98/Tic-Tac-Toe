import { UI } from './UI.esm.js';
import { Field } from './Field.esm.js';
import { BOARD_GAME_SELECTOR,FIELD_SELECTOR,MODAL_BUTTON_SELECTOR,MODAL_WRAPPER_SELECTOR, BOARD_ROWS,BOARD_COLS, VARIABLE_ROWS_CSS, VARIABLE_COLS_CSS, BACKGROUND_IMAGE_O_CSS, BACKGROUND_IMAGE_X_CSS, MARK_FIELD_O, MARK_FIELD_X, MOVE_SELECTOR, PLAYER_1_TURN_TEXT, PLAYER_2_TURN_TEXT, VISIBILITY_CLASS_CSS,MODAL_RESULT_TEXT_SELECTOR,DRAW_TEXT, BACKGROUND_IMAGE_EMPTY_CSS,PLAYER_1_WIN_TEXT,PLAYER_2_WIN_TEXT} from './Statements.esm.js';

export class Game extends UI{
  constructor() {
    //const properties
    super();
    this.board = this.getElement(BOARD_GAME_SELECTOR);
    this.button = this.getElement(MODAL_BUTTON_SELECTOR);
    this.rows = BOARD_ROWS;//niestety za duzo bledow popelnilem ponizej
    this.cols = BOARD_COLS;

    //properties to restart
    this.arrayOfFields = [];
    this.gameMoves = 0;
    this.endGameMoves = this.rows * this.cols;
    this.isGameEnded = false;

    this.addEventListeners();
  }
  addEventListeners() {
    this.board.addEventListener('click', (e) => {
      this.clickField(e);
    });

    this.button.addEventListener('click', () => {
      this.toogleModal();
      this.resetGame();
    });
  }
  startGame() {
    this.generateFields();
    this.renderGame();
    console.log(this.arrayOfFields);
    console.log(this.endGameMoves);
  }
  resetGame() {
    this.gameMoves = 0;
    this.endGameMoves = this.rows * this.cols;
    this.isGameEnded = false;
    this.startGame();
  }
  generateFields() {
    //reseting
    this.arrayOfFields = [];
    //when cols > rows
    if (this.cols > this.rows) {
      for (let col = 0; col < this.cols; col++) {
        this.arrayOfFields[col] = [];
        for (let row = 0; row < this.rows; row++) {
          this.arrayOfFields[col].push(new Field(row, col));
        }
      }
    }
    else {
      //creating 2d array of fields
      for (let row = 0; row < this.rows; row++) {
        this.arrayOfFields[row] = [];
        for (let col = 0; col < this.cols; col++) {
          this.arrayOfFields[row].push(new Field(col, row));
        }
      }
    }
    
  }
  renderBoard() {
    this.arrayOfFields.flat().forEach(field => {
      this.board.insertAdjacentHTML('beforeend', field.createElement());
      field.setBackground(BACKGROUND_IMAGE_EMPTY_CSS);//reseting background
    })
  }
  renderGame() {
    if (this.board.firstChild != '') {
      while (this.board.lastChild) {
        this.board.removeChild(this.board.lastChild);
      }
    }
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
  //rendering field background, update field property, changing text
  renderField(field,markField,backgroundImage,playerMoveTxt) {
    field.markField(markField);
    field.setBackground(backgroundImage);
    this.updateText(MOVE_SELECTOR, playerMoveTxt);//upadete player move txt
  }
  //left click event
  clickField = (e) => {
    if (this.isGameEnded)  return;
    const field = this.findField(e);
    //protection against unexpected increments
    if (field.checkIsFieldMarked())
    {
      console.log('field was marked');
      return;
    }
    //mark X
    if (this.gameMoves % 2 == 0) {
      this.renderField(field,MARK_FIELD_X, BACKGROUND_IMAGE_X_CSS, PLAYER_2_TURN_TEXT);
    }
    //mark O
    else if (this.gameMoves % 2 == 1) {
      this.renderField(field, MARK_FIELD_O, BACKGROUND_IMAGE_O_CSS, PLAYER_1_TURN_TEXT);
    }
    this.gameMoves++;
    this.checkFieldsAround(field, this.arrayOfFields);
    
    
    
    this.checkDraw();
  }
  //checking around x-isMarkedAs(x/o)
  checkFieldsAround(field,fields) {
    const rowIndex = field.x;
    const colIndex = field.y;
    //poziom
    let right_2 = rowIndex + 2 < this.rows ? fields[colIndex][rowIndex + 2] : false;
    let right_1 = rowIndex + 1 < this.rows ? fields[colIndex][rowIndex + 1] : false;
    let left_2 = rowIndex - 2 >= 0 ? fields[colIndex][rowIndex - 2] : false;
    let left_1 = rowIndex - 1 >= 0 ? fields[colIndex][rowIndex - 1] : false;
    //pion
    let down_2 = colIndex + 2 < this.cols ? fields[colIndex + 2][rowIndex] : false;
    let down_1 = colIndex + 1 < this.cols ? fields[colIndex + 1][rowIndex] : false;
    let up_2 = colIndex - 2 >= 0 ? fields[colIndex - 2][rowIndex] : false;
    let up_1 = colIndex - 1 >= 0 ? fields[colIndex - 1][rowIndex] : false;

    //skos TL ->BR
    let up_2_left_2 = colIndex - 2 >= 0 && rowIndex - 2 >= 0 ? fields[colIndex - 2][rowIndex - 2] : false;
    let up_1_left_1 = colIndex - 1 >= 0 && rowIndex - 1 >= 0 ? fields[colIndex - 1][rowIndex - 1] : false;
    let down_1_right_1 = colIndex + 1 < this.cols && rowIndex + 1 < this.rows ? fields[colIndex + 1][rowIndex + 1] : false;
    let down_2_right_2 = colIndex + 2 < this.cols && rowIndex + 2 < this.rows < this.cols ? fields[colIndex + 2][rowIndex + 2] : false;

    //skos BL -> TR
    let down_2_left_2 = colIndex + 2 < this.cols && rowIndex - 2 >= 0 ? fields[colIndex + 2][rowIndex - 2] : false;
    let down_1_left_1 = colIndex + 1 < this.cols && rowIndex - 1 >= 0 ? fields[colIndex + 1][rowIndex - 1] : false;
    let up_1_right_1 = colIndex - 1 >= 0 && rowIndex + 1 < this.rows ? fields[colIndex - 1][rowIndex + 1] : false;
    let up_2_right_2 = colIndex - 2 >= 0 && rowIndex + 2 < this.rows ? fields[colIndex - 2][rowIndex + 2] : false;

    //down_1 down_2
    if (down_2 !== false && down_1 !== false) this.checkResultXorO(field, down_1, down_2);
    //down_1 up_1
    if (up_1 !== false && down_1 !== false) this.checkResultXorO(field, down_1, up_1);
    //up_1 up_2
    if (up_1 !== false && up_2 !== false) this.checkResultXorO(field, up_1, up_2);
  
    //left 1 left 2
    if (left_1 !== false && left_2 !== false) this.checkResultXorO(field, left_1, left_2);
    //left 1 right 1
    if (left_1 !== false && right_1 !== false) this.checkResultXorO(field, left_1, right_1);
    //right 1 right 2
    if (right_1 !== false && right_2 !== false) this.checkResultXorO(field, right_1, right_2);

    //skos TL ->BR
    if (up_2_left_2 !== false && up_1_left_1 !== false) this.checkResultXorO(field, up_2_left_2, up_1_left_1);
    if (up_1_left_1 !== false && down_1_right_1 !== false) this.checkResultXorO(field, up_1_left_1, down_1_right_1);
    if (down_1_right_1 !== false && down_2_right_2 !== false) this.checkResultXorO(field, down_1_right_1, down_2_right_2);

    //skos BL -> TR
    if (down_2_left_2 !== false && down_1_left_1 !== false) this.checkResultXorO(field, down_2_left_2, down_1_left_1);
    if (down_1_left_1 !== false && up_1_right_1 !== false) this.checkResultXorO(field, down_1_left_1, up_1_right_1);
    if (up_2_right_2 !== false && up_1_right_1 !== false) this.checkResultXorO(field, up_2_right_2, up_1_right_1);
    
  }
  //rostrzyga czy sprawdzac x czy o i zwraca wynik
  checkResultXorO(field_1, field_2, field_3) {
    if (this.gameMoves % 2 == 1) {
      if (field_1.isMarkedAsX && field_2.isMarkedAsX && field_3.isMarkedAsX) {
        setTimeout(() => {
          this.toogleModal(PLAYER_1_WIN_TEXT);
          this.isGameEnded = true;
          console.log(field_1.selector, field_2.selector, field_3.selector);
        },1500)
        
      }
    } else if (this.gameMoves % 2 == 0) {
      if (field_1.isMarkedAsO && field_2.isMarkedAsO && field_3.isMarkedAsO) {
        setTimeout(() => {
          this.toogleModal(PLAYER_2_WIN_TEXT);
          this.isGameEnded = true;
          console.log(field_1.selector, field_2.selector, field_3.selector);
        },1500) 
      }
    }
  }

  //checking result
  checkDraw() {
    if (this.gameMoves === this.endGameMoves) {
      setTimeout(() => {
        this.toogleModal(DRAW_TEXT); //makes modal visible
        this.isGameEnded = true;
      },1500)
    }
  }
  //change modal visibility
  toogleModal(text) {
      this.getElement(MODAL_WRAPPER_SELECTOR).classList.toggle(VISIBILITY_CLASS_CSS);
      this.updateText(MODAL_RESULT_TEXT_SELECTOR, text);
  }
}

const game = new Game();
game.startGame();
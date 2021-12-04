import { UI } from './UI.esm.js';
import { Field } from './Field.esm.js';
import { BOARD_GAME_SELECTOR,FIELD_SELECTOR,MODAL_BUTTON_SELECTOR,MODAL_WRAPPER_SELECTOR, BOARD_ROWS,BOARD_COLS, VARIABLE_ROWS_CSS, VARIABLE_COLS_CSS, BACKGROUND_IMAGE_O_CSS, BACKGROUND_IMAGE_X_CSS, MARK_FIELD_O, MARK_FIELD_X, MOVE_SELECTOR, PLAYER_1_TURN_TEXT, PLAYER_2_TURN_TEXT, VISIBILITY_CLASS_CSS,MODAL_RESULT_TEXT_SELECTOR,DRAW_TEXT, BACKGROUND_IMAGE_EMPTY_CSS,PLAYER_1_WIN_TEXT,PLAYER_2_WIN_TEXT, MARKS_TO_WIN} from './Statements.esm.js';

class Game extends UI{
  constructor() {
    //const properties
    super();
    this.board = this.getElement(BOARD_GAME_SELECTOR);
    this.button = this.getElement(MODAL_BUTTON_SELECTOR);
    this.rows = BOARD_ROWS;
    this.cols = BOARD_COLS;
    
    this.marksToWin = MARKS_TO_WIN;//


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
    // console.log(this.arrayOfFields);
    // console.log(this.endGameMoves);
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
    // if (this.cols > this.rows) {
      for (let col = 0; col < this.cols; col++) {
        this.arrayOfFields[col] = [];
        for (let row = 0; row < this.rows; row++) {
          this.arrayOfFields[col].push(new Field(row, col));
        }
      }
    // }
    // else {
    //   //creating 2d array of fields
    //   for (let row = 0; row < this.rows; row++) {
    //     this.arrayOfFields[row] = [];
    //     for (let col = 0; col < this.cols; col++) {
    //       this.arrayOfFields[row].push(new Field(col, row));
    //     }
    //   }
    // }
    
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
    // console.log(target)
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

    //protection against overwrite
    if (field.checkIsFieldMarked())
    {
      console.log('field was marked');
      return;
    }

    //mark X
    if (this.gameMoves % 2 == 0) {
      this.renderField(field, MARK_FIELD_X, BACKGROUND_IMAGE_X_CSS, PLAYER_2_TURN_TEXT);
      this.checkAllWaysToWin(field, this.arrayOfFields, MARK_FIELD_X);
    }
    //mark O
    else if (this.gameMoves % 2 == 1) {
      this.renderField(field, MARK_FIELD_O, BACKGROUND_IMAGE_O_CSS, PLAYER_1_TURN_TEXT);
      this.checkAllWaysToWin(field, this.arrayOfFields, MARK_FIELD_O);
    }
    this.gameMoves++;
    
    
    this.checkDraw();
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
  //winning checker
  checkAllWaysToWin(field, arrayOfFields, mark) {
    //pion
    this.checkWinHorizontal(field, arrayOfFields, mark);
    //poziom
    this.checkWinVertical(field, arrayOfFields, mark);
    //skos1
    this.checkWinTopLeftToBottomRight(field, arrayOfFields, mark);
    //skos 2
    this.checkWinBottomLeftToTopRight(field, arrayOfFields, mark);
  }

  checkWinHorizontal(field,fields,fieldType) {
    const rowIndex = field.x;
    const colIndex = field.y;
    const plusRange = this.marksToWin - 1;
    const minusRange = -this.marksToWin + 1;

    const arrayOfFieldsToCheck = [];//tablica do komorek

    //tworzenie tablicy z pasujacych komorek
    for (let row = plusRange; row >= minusRange; row--){
      const fieldRowIndex = rowIndex + row;
      if (fieldRowIndex >= 0 && fieldRowIndex < this.rows) {
        arrayOfFieldsToCheck.push(fields[colIndex][fieldRowIndex])
      }
    }
    this.arrayChecker(arrayOfFieldsToCheck, fieldType)

  }
  checkWinVertical(field, fields, fieldType) {
    const rowIndex = field.x;
    const colIndex = field.y;
    const plusRange = this.marksToWin - 1;
    const minusRange = -this.marksToWin + 1;

    const arrayOfFieldsToCheck = []; //tablica do komorek

    //tworzenie tablicy z pasujacych komorek
    for (let col = plusRange; col >= minusRange; col--) {
      const fieldcolIndex = colIndex + col;
      if (fieldcolIndex >= 0 && fieldcolIndex < this.cols) {
        arrayOfFieldsToCheck.push(fields[fieldcolIndex][rowIndex])
      }
    }
    this.arrayChecker(arrayOfFieldsToCheck, fieldType)

  }
  checkWinTopLeftToBottomRight(field, fields, fieldType) {
    const rowIndex = field.x;
    const colIndex = field.y;
    const plusRange = this.marksToWin - 1;
    const minusRange = -this.marksToWin + 1;

    const arrayOfFieldsToCheck = []; //tablica do komorek

    for (let index = plusRange; index >= minusRange; index--) {
      const fieldcolIndex = colIndex + index;
      const fieldrowIndex = rowIndex + index;
      if (fieldcolIndex >= 0 && fieldcolIndex < this.cols && fieldrowIndex >= 0 && fieldrowIndex < this.rows) {
        arrayOfFieldsToCheck.push(fields[fieldcolIndex][fieldrowIndex])
      }
    }

    this.arrayChecker(arrayOfFieldsToCheck, fieldType)

  }
  checkWinBottomLeftToTopRight(field, fields, fieldType) {
    const rowIndex = field.x;
    const colIndex = field.y;
    const plusRange = this.marksToWin - 1;
    const minusRange = -this.marksToWin + 1;

    const arrayOfFieldsToCheck = []; //tablica do komorek

    for (let index = plusRange; index >= minusRange; index--) {
      const fieldcolIndex = colIndex - index;
      const fieldrowIndex = rowIndex + index;
      if (fieldcolIndex >= 0 && fieldcolIndex < this.cols && fieldrowIndex >= 0 && fieldrowIndex < this.rows) {
        arrayOfFieldsToCheck.push(fields[fieldcolIndex][fieldrowIndex])
      }
    }

    this.arrayChecker(arrayOfFieldsToCheck, fieldType)
  }


  //checking array
  arrayChecker(arrayOfFieldsToCheck, fieldType) {
    let firstIndex = 0;
    let lastCheck = arrayOfFieldsToCheck.length;

    while (lastCheck >= firstIndex + MARKS_TO_WIN) {
      let scores = 0;
      for (let actuallIndex = firstIndex; actuallIndex < firstIndex + MARKS_TO_WIN; actuallIndex++) {
        const fieldActual = arrayOfFieldsToCheck[actuallIndex];
        // console.log(fieldActual);

        //for X
        if (fieldType === MARK_FIELD_X) {
          if (fieldActual.isMarkedAsX) {
            scores++;
          }
          //winning statement for X
          if (actuallIndex == firstIndex + MARKS_TO_WIN - 1 && scores === MARKS_TO_WIN) {
            console.log('wygraly iksy');
            setTimeout(() => {
              this.toogleModal(PLAYER_1_WIN_TEXT);
              this.isGameEnded = true;
            }, 1500)
          }
        }

        //for O
        if (fieldType === MARK_FIELD_O) {
          if (fieldActual.isMarkedAsO) {
            scores++;
          }
          //winning STATEMENT FOR O
          if (actuallIndex == firstIndex + MARKS_TO_WIN - 1 && scores === MARKS_TO_WIN) {
            console.log('wygraly kolka');
            setTimeout(() => {
              this.toogleModal(PLAYER_2_WIN_TEXT);
              this.isGameEnded = true;
            }, 1500)
          }
        }

      }
      firstIndex++;
      console.log(scores)
    }
  }

}

export const game = new Game();
game.startGame();
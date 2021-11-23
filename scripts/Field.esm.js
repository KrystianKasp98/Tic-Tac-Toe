import { BACKGROUND_IMAGE_X_CSS, BACKGROUND_IMAGE_O_CSS,MARK_FIELD_O,MARK_FIELD_X, BACKGROUND_IMAGE_EMPTY_CSS } from './Statements.esm.js'
import { UI } from './UI.esm.js';
export class Field extends UI{
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.selector = `[data-x="${this.x}"][data-y="${this.y}"]`;
    this.isMarkedAsX = false;
    this.isMarkedAsO = false;
    this.isMarked = false;
    this.background = '';
  }
  createElement() {
    this.element = `<div class="field" data-field data-x="${this.x}" data-y="${this.y}"></div>`;
    return this.element;
  }
  setBackground(svgURL) {
    if (svgURL === BACKGROUND_IMAGE_X_CSS || svgURL === BACKGROUND_IMAGE_O_CSS || svgURL === BACKGROUND_IMAGE_EMPTY_CSS) {
      this.getElement(this.selector).style.backgroundImage = `url(${svgURL})`;
      this.background = svgURL;
    }
    //protection from overwriting background
    else {
        console.log('bad url or background was changed');
        return;
    }
  }
  markField(mark) {
    //protection from overwriting mark
    if (this.isMarked) {
      console.log('bad mark or field was marked');
      return;
    } 
    if (mark === MARK_FIELD_X || mark === MARK_FIELD_O) {
      mark === MARK_FIELD_X ? this.isMarkedAsX = true : this.isMarkedAsO = true;
      this.isMarked = true;
    }
  }
  checkIsFieldMarked() {
    return this.isMarked;
  }
}


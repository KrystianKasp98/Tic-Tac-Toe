import { BACKGROUND_IMAGE_X_CSS, BACKGROUND_IMAGE_O_CSS,MARK_FIELD_O,MARK_FIELD_X } from './Statements.esm.js'
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
    if (svgURL === BACKGROUND_IMAGE_X_CSS || svgURL === BACKGROUND_IMAGE_O_CSS) {
      this.getElement(this.selector).style.backgroundImage = `url(${svgURL})`;
    }
    else {
      throw new Error('bad url');
    }
  }
  markField(mark) {
    if (mark === MARK_FIELD_X || mark === MARK_FIELD_O) {
      
    }
    else {
      throw new Error('bad mark');
    }
  }
}


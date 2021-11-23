export class UI{
  constructor() {
  }
  getElement(dataSelector) {
    if (document.querySelector(dataSelector) == '') {
      throw new Error('not valid selector');
    }
    return  document.querySelector(dataSelector);
  }
  updateText(dataSelector, text) {
    if (document.querySelector(dataSelector) == '') {
      throw new Error('not valid selector');
    }
   document.querySelector(dataSelector).textContent = text;
  }
}
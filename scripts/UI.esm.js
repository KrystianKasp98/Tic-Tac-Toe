export class UI{
  constructor() {
  }
  getElement(dataSelector) {
    if (document.querySelector(dataSelector) == '') {
      throw new Error('not valid selector');
    }
    return  document.querySelector(dataSelector);
  }
}
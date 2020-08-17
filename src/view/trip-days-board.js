import {createElement} from '../utils.js';

export const createTripDaysBoardTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class TripDaysBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDaysBoardTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

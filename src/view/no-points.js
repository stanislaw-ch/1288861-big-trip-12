import {createElement} from '../utils.js';

const createNoSiteTripPointTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoTripPoint {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createNoSiteTripPointTemplate(this._data);
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

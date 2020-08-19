import {createElement} from '../utils.js';

export const createTripDaysTemplate = (data) => {
  const day = data.slice(0, 2);

  return `<li class="trip-days__item  day">
  <div class="day__info">
    <span class="day__counter">${+day}</span>
    <time class="day__date" datetime="2019-03-18">${data.slice(4)}</time>
  </div>
  <ul class="trip-events__list"></ul>
</li>`;
};

export default class TripDay {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createTripDaysTemplate(this._data);
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

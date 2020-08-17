import {createElement, getFormattedTime, getDurationInterval} from '../utils.js';

export const createSiteTripPointTemplate = (data) => {
  const {eventsTypes, destination, price, offers} = data;
  const {startTime, endTime} = data.time;

  const typePoint = eventsTypes.type;
  const typePicture = typePoint.toLowerCase();

  const offerList = offers.slice(0, 3);

  let offersTemplate = ``;
  for (let offer of offerList) {
    offersTemplate += `
      <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      €&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
  `;
  }

  return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typePicture}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typePoint} to ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${getFormattedTime(startTime)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${getFormattedTime(endTime)}</time>
          </p>
          <p class="event__duration">${getDurationInterval(startTime, endTime)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${offersTemplate}</ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class TripPoint {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createSiteTripPointTemplate(this._data);
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

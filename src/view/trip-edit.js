import he from "he";
import SmartView from "./smart.js";
import {getTimeFormat} from '../utils/points.js';
import {POINT_TYPES, CITIES, OFFERS, generateDescription, getOffers} from '../mock/trip-point.js';
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  eventsTypes: {type: `Taxi`, category: `Transfer`},
  destination: {
    name: ``,
    description: ``,
    pictures: [],
  },
  startTime: getTimeFormat(new Date()),
  endTime: getTimeFormat(new Date()),
  price: ``,
  offers: [],
  isFavorite: false
};

const pointTypes = Array.from(POINT_TYPES);

const getTypesTemplate = (list, checkedType) => {

  let types = ``;
  for (let typeItem of list) {
    const typeName = typeItem.type.toLowerCase();
    const checked = (checkedType === typeItem) ? ` checked` : ``;

    types += `<div class="event__type-item">
      <input id="event-type-${typeName}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${typeName}"${checked}>
      <label class="event__type-label event__type-label--${typeName}" for="event-type-${typeName}-1">${typeName}</label>
    </div>
  `;
  }
  return types;
};

export const createSiteTripPointEditTemplate = (data) => {
  const {eventsTypes, price, offers, isFavorite, startTime, endTime} = data;
  const {description, name, pictures} = data.destination;

  const typePoint = eventsTypes.type;
  const typePicture = typePoint.toLowerCase();

  const groupOfTypes = new Set(pointTypes.map((item) => item.category));

  let typesList = ``;
  for (let group of groupOfTypes) {
    typesList += `
      <fieldset class="event__type-group">
        <legend class="visually-hidden">${group === `Transfer` ? `Transfer` : `Activity`}</legend>
        ${getTypesTemplate(pointTypes.filter((item) => item.category === group), eventsTypes.type)}
      </fieldset>
    `;
  }

  let cityOptions = ``;
  for (let city of CITIES) {
    cityOptions += `<option value="${city}"></option>`;
  }

  let offersList = ``;
  for (let offer of OFFERS) {
    const offerChecked = !offers.some((el) => el.type === offer.type) || `checked`;
    offersList += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" ${offerChecked}>
        <label class="event__offer-label" for="event-offer-${offer.type}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }

  return `<form class="event  event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${typePicture}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">${typesList}</div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${typePoint} to
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
      <datalist id="destination-list-1">${cityOptions}</datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getTimeFormat(startTime)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getTimeFormat(endTime)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>

    <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite === true ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>

  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">${offersList}</div>
    </section>

    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map((it) =>`<img class="event__photo" src="${it}" alt="Event photo">`).join(``)}
        </div>
      </div>
    </section>
  </section>
</form>`;
};

export default class TripPointEdit extends SmartView {
  constructor(data = BLANK_POINT) {
    super();
    this._data = TripPointEdit.parsePointToData(data);
    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._eventsTypeClickHandler = this._eventsTypeClickHandler.bind(this);
    this._eventsDestinationClickHandler = this._eventsDestinationClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  static parsePointToData(data) {
    return Object.assign({}, data);
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (data.isFavorite) {
      data.isFavorite = true;
    }

    return data;
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(data) {
    this.updateData(
        TripPointEdit.parsePointToData(data)
    );
  }

  getTemplate() {
    return createSiteTripPointEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setEditClickHandler(this._callback.editClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._datepickerStart || this._datepickerEnd) {
      this._datepickerStart.destroy();
      this._datepickerEnd.destroy();
      this._datepickerStart = null;
      this._datepickerEnd = null;
    }

    if (this._data) {
      this._datepickerStart = flatpickr(
          this.getElement().querySelector(`.event__input--time:first-of-type`),
          {
            enableTime: true,
            /* eslint-disable-next-line */
            time_24hr: true,
            dateFormat: `d/m/y H:i`,
            defaultDate: this._data.startTime,
            onChange: this._startDateChangeHandler
          }
      );
      this._datepickerEnd = flatpickr(
          this.getElement().querySelector(`.event__input--time:last-of-type`),
          {
            enableTime: true,
            /* eslint-disable-next-line */
            time_24hr: true,
            dateFormat: `d/m/y H:i`,
            defaultDate: this._data.endTime,
            onChange: this._endDateChangeHandler
          }
      );
    }
  }

  _startDateChangeHandler([userDate]) {
    if (userDate !== this._data.startTime) {
      this.updateData({
        time: {
          startTime: userDate,
          endTime: this._data.endTime,
        }
      }, true);
    }
  }

  _endDateChangeHandler([userDate]) {
    if (userDate !== this._data.endTime) {
      this.updateData({
        time: {
          startTime: this._data.startTime,
          endTime: userDate,
        }
      }, true);
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoriteToggleHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventsTypeClickHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._eventsDestinationClickHandler);
  }

  _favoriteToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripPointEdit.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TripPointEdit.parseDataToPoint(this._data));
  }

  _eventsTypeClickHandler(evt) {
    evt.preventDefault();
    this._data.eventsTypes = pointTypes.find((eventsTypes) => eventsTypes.type.toLowerCase() === evt.target.value);
    this._data.offers = getOffers();
    this.updateData({
      eventsTypes: this._data.eventsTypes,
      offers: this._data.offers
    });
  }

  _eventsDestinationClickHandler(evt) {
    evt.preventDefault();
    this._data.destination = evt.target.value;
    this._data.description = generateDescription();

    if (CITIES.includes(evt.target.value)) {
      this.updateData({
        destination: this._data.destination,
        description: this._data.description
      });
    }
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }
}

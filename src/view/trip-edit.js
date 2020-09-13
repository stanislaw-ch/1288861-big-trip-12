import SmartView from "./smart.js";
import moment from "moment";
import {
  getTimeFormat,
  capitalizeFirstLetter,
  getToday
} from '../utils/points.js';
import flatpickr from "flatpickr";
import {
  TRIP_TYPES,
  ACTIVITY_TYPES
} from "../const.js";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  eventsTypes: `taxi`,
  destination: {
    name: ``,
    description: ``,
    pictures: [],
  },
  startTime: getToday(),
  endTime: getToday(),
  price: ``,
  offers: [],
  isFavorite: false
};

const setFavorite = (isFavorite) => {
  if (isFavorite) {
    return `checked`;
  }

  return ``;
};


const createCityListTemplate = (cities) => {
  return (
    cities.reduce((prev, current) => {
      return prev + (
        `<option value="${current}"></option>`
      );
    }, ``)
  );
};

const createRadioTemplate = (point, types) => {
  return (
    types.reduce((prev, current) => {
      return prev + (
        `<div class="event__type-item">
          <input
            id="event-type-${current}-${point.id}"
            class="event__type-input visually-hidden"
            type="radio" name="event-type"
            value="${current}"
            ${point.type === current ? `checked` : ``}
          >
          <label
            class="event__type-label
            event__type-label--${current}"
            for="event-type-${current}-${point.id}"
            >
          ${capitalizeFirstLetter(current)}
          </label>
        </div>`
      );
    }, ``)
  );
};

const getOfferLabel = (offer) => {
  let split = offer.title.split(` `);

  if (split.length >= 2 && split[split.length - 1] === `class`) {
    return split[split.length - 2];
  }

  return split[split.length - 1];
};

const createOfferTemplate = (offer, check, id) => {
  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${getOfferLabel(offer)}-${id}"
        type="checkbox"
        name="event-offer-${getOfferLabel(offer)}"
        ${check}
        data-title="${offer.title}"
      >
      <label
        class="event__offer-label"
        for="event-offer-${getOfferLabel(offer)}-${id}"
      >
      <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const addOfferTemplate = (point, offersData) => {
  const {eventsTypes, offers, id} = point;

  let offersTemplate = [];

  const offer = offersData.find((item) => item.type === eventsTypes);

  if (offer.offers.length !== 0) {
    const offersOfType = offer.offers;

    offersOfType.forEach((item) => {
      let check = ``;

      for (let i = 0; i < offers.length; i++) {
        if (offers[i].title === item.title) {
          check = `checked`;
          break;
        }
      }

      offersTemplate.push(createOfferTemplate(item, check, id));
    });
  }

  return offersTemplate.join(``);
};

const createPhotosTemplate = (photos) => {
  return (
    photos.reduce((prev, current) => {
      return prev + (
        `<img class="event__photo"
          src="${current.src}"
          alt="${current.description}"
        >`
      );
    }, ``)
  );
};

const createDesinationTemplate = (description, photos) => {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotosTemplate(photos)}
        </div>
      </div>
    </section>`
  );
};

const createTripFavoriteButtonTemplate = (isNew, isFavorite, isDisabled, pointsData) => {

  return !isNew ? (
    `<input
    id="event-favorite-${pointsData.id}"
    class="event__favorite-checkbox  visually-hidden"
    type="checkbox"
    name="event-favorite"
    ${setFavorite(isFavorite)}
    ${isDisabled ? `disabled` : ``}
  />
  <label class="event__favorite-btn" for="event-favorite-${pointsData.id}">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </label>

  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
  )
    : ``;
};

export const createSiteTripPointEditTemplate = (
    pointsData,
    offersData,
    destination,
    isNew) => {

  const {
    id,
    eventsTypes,
    price,
    startTime,
    endTime,
    isFavorite,
    isDisabled,
    isSaving,
    isDeleting
  } = pointsData;

  const {name} = pointsData.destination;
  const typePoint = capitalizeFirstLetter(eventsTypes);
  const cities = [];
  let photos = [];
  let description = [];
  const isSubmitDisabled = (name === ``);

  destination.forEach((item) => {
    cities.push(item.name);

    if (item.name === name) {
      photos = item.pictures;
      description = item.description;
    }
  });

  const stateDeleteButton = isDeleting ? `Deleting...` : `Delete`;

  return `<form class="${pointsData ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label
        class="event__type  event__type-btn"
        for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img
          class="event__type-icon"
          width="17"
          height="17"
          src="img/icons/${eventsTypes}.png"
          alt="Event type icon"
        >
      </label>
      <input
        class="event__type-toggle  visually-hidden"
        id="event-type-toggle-${id}"
        type="checkbox"
        ${isDisabled ? `disabled` : ``}
      >

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${createRadioTemplate(pointsData, TRIP_TYPES, isDisabled)}
        </fieldset>

        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>
          ${createRadioTemplate(pointsData, ACTIVITY_TYPES, isDisabled)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label
        class="event__label  event__type-output"
        for="event-destination-${id}">${typePoint} to
      </label>
      <input
        class="event__input  event__input--destination"
        id="event-destination-${id}"
        type="text" name="event-destination"
        value="${name}"
        list="destination-list-${id}"
        ${isDisabled ? `disabled` : ``}
      >
      <datalist id="destination-list-${id}">
        ${createCityListTemplate(cities)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">
        From
      </label>
      <input
        class="event__input  event__input--time"
        id="event-start-time-${id}"
        type="text" name="event-start-time"
        value="${getTimeFormat(startTime)}"
        ${isDisabled ? `disabled` : ``}
      >
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">
        To
      </label>
      <input
        class="event__input
        event__input--time"
        id="event-end-time-${id}"
        type="text"
        name="event-end-time"
        value="${getTimeFormat(endTime)}"
        ${isDisabled ? `disabled` : ``}
      >
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input
        class="event__input event__input--price"
        id="event-price-${id}"
        type="number"
        name="event-price"
        value="${price}"
        ${isDisabled ? `disabled` : ``}
        required
      >
    </div>

    <button
      class="event__save-btn  btn  btn--blue"
      type="submit"
      ${isSubmitDisabled || isDisabled ? `disabled` : ``}
      >${isSaving ? `saving...` : `save`}
    </button>
    <button
      class="event__reset-btn"
      type="reset" ${isDisabled ? `disabled` : ``}
      >
      ${isNew ? `Cancel` : stateDeleteButton}
    </button>

    ${createTripFavoriteButtonTemplate(isNew, isFavorite, isDisabled, pointsData)}
  </header>

  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">${addOfferTemplate(pointsData, offersData)}</div>
    </section>

    ${name !== `` ? createDesinationTemplate(description, photos) : ``}
  </section>
</form>`;
};

export default class TripPointEdit extends SmartView {
  constructor(data, offers, destination) {
    super();
    if (!data) {
      data = BLANK_POINT;
      this._isNew = true;
    }

    this._data = TripPointEdit.parsePointToData(data);
    this._datepickerStart = null;
    this._datepickerEnd = null;
    this._offers = offers;
    this._destination = destination;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._eventsTypeClickHandler = this._eventsTypeClickHandler.bind(this);
    this._eventsDestinationClickHandler = this._eventsDestinationClickHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  static parsePointToData(data) {
    return Object.assign(
        {},
        data,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (data.isFavorite) {
      data.isFavorite = true;
    }

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
  }

  reset(data) {
    this.updateData(
        TripPointEdit.parsePointToData(data)
    );
  }

  getTemplate() {
    return createSiteTripPointEditTemplate(this._data, this._offers, this._destination, this._isNew);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setEditClickHandler(this._callback.editClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCancelClickHandler(this._callback.cancelClick);
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
            "enableTime": true,
            "time_24hr": true,
            "dateFormat": `d/m/y H:i`,
            "defaultDate": this._data.startTime,
            "onChange": this._startDateChangeHandler
          }
      );
      this._datepickerEnd = flatpickr(
          this.getElement().querySelector(`.event__input--time:last-of-type`),
          {
            "enableTime": true,
            "time_24hr": true,
            "dateFormat": `d/m/y H:i`,
            "defaultDate": this._data.endTime,
            "onChange": this._endDateChangeHandler
          }
      );
    }
  }

  _startDateChangeHandler([userDate]) {
    const date = userDate.toISOString();
    let end = this._data.endTime;

    if (userDate > moment(end)) {
      const timeEndElement = this.getElement()
        .querySelector(`input[name="event-end-time"]`);

      end = date;
      timeEndElement.value = moment(end).format(`DD/MM/YY HH:mm`);
    }

    this.updateData({
      startTime: date,
      endTime: end,
    });
  }

  _endDateChangeHandler([userDate]) {
    const date = userDate.toISOString();
    let start = this._data.startTime;

    if (userDate < moment(start)) {
      const timeStartElement = this.getElement()
        .querySelector(`input[name="event-start-time"]`);

      start = date;
      timeStartElement.value = moment(start).format(`DD/MM/YY HH:mm`);
    }

    this.updateData({
      startTime: start,
      endTime: date
    }, true);
  }

  _setInnerHandlers() {
    if (!this._isNew) {
      this.getElement()
        .querySelector(`.event__favorite-btn`)
        .addEventListener(`click`, this._favoriteToggleHandler);
    }
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventsTypeClickHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._eventsDestinationClickHandler);
    this.getElement()
      .querySelector(`.event__section--offers`)
      .addEventListener(`change`, this._offersChangeHandler);
  }

  _favoriteToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    if (!evt.target.value) {
      evt.target.setCustomValidity(`Enter the cost of the trip`);
      return;
    }

    this.updateData({
      price: Number(evt.target.value)
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

  _formCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick(TripPointEdit.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TripPointEdit.parseDataToPoint(this._data));
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    let offers = [];
    const offersOfType = this._offers.find((item) => item.type === this._data.eventsTypes).offers;
    const offer = offersOfType.find((item) => item.title === evt.target.dataset.title);

    if (evt.target.checked) {
      offers = [
        ...this._data.offers,
        offer
      ];
    } else {
      const index = this._data.offers.findIndex((item) => item.title === offer.title);

      offers = [
        ...this._data.offers.slice(0, index),
        ...this._data.offers.slice(index + 1)
      ];
    }

    this.updateData({
      offers
    });
  }

  _eventsTypeClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      eventsTypes: evt.target.value,
      offers: []
    });
  }

  _eventsDestinationClickHandler(evt) {
    evt.preventDefault();

    const destination = this._destination.find((item) => item.name === evt.target.value);

    if (!destination) {
      evt.target.setCustomValidity(`Choose a city from the list`);
      return;
    }

    this.updateData({
      destination: {
        name: evt.target.value,
        description: destination.description,
        pictures: destination.pictures
      }
    });
  }

  setEditClickHandler(callback) {
    if (!this._isNew) {
      this._callback.editClick = callback;
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
    }
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

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formCancelClickHandler);
  }
}

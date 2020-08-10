import {getRandomFloat, getDayFormat} from '../utils.js';
import {generateTripPoint} from '../mock/trip-point.js';
import {createSiteTripEventsItemTemplate} from './trip-events-item.js';
// import {createSiteTripEventsAddTemplate} from './trip-events-add.js';

const POINT_COUNT = getRandomFloat(4, 16);
// console.log(POINT_COUNT);

export const EVENTS_LIST = new Array(POINT_COUNT).fill().map(generateTripPoint);
// console.log(EVENTS_LIST);

export const sortDates = Array.from(new Set(EVENTS_LIST
.sort((elem1, elem2) => elem1.time.startTime > elem2.time.startTime ? 1 : -1)
.map((it) => getDayFormat(it.time.startTime))));

// console.log(sortDates);

let daysTemplate = ``;
for (let date of sortDates) {
  const day = date.slice(0, 2);

  const dayEvents = EVENTS_LIST.filter((it) => {
    return getDayFormat(it.time.startTime) === date;
  });

  // console.log(dayEvents.length);
  // console.log(dayEvents);

  const tripTemplate = (data) => {
    let tripItem = ``;
    for (let item of data) {
      tripItem += createSiteTripEventsItemTemplate(item);
    }
    return tripItem;
  };

  daysTemplate += `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="2019-03-18">${date.slice(4)}</time>
      </div>
      <ul class="trip-events__list">${tripTemplate(dayEvents)}</ul>
    </li>
  `;
}

export const createSiteSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
      <label class="trip-sort__btn" for="sort-time">
        Time
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
      <label class="trip-sort__btn" for="sort-price">
        Price
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>

    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>

  <ul class="trip-days">${daysTemplate}</ul>`
  );
};

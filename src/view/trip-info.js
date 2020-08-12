import {EVENTS_LIST} from "./sort.js";

const cities = Array.from(
    new Set(EVENTS_LIST))
        .sort((elem1, elem2) => elem1.time.startTime > elem2.time.startTime ? 1 : -1)
        .map((it) => it.destination);

const citiesMiddle = (cities.length > 2) ? `...` : cities[1];

const startDay = new Date(
    Math.min(...EVENTS_LIST
        .map((it) => it.time.startTime.getTime())
    )
).toDateString().slice(4, 10);

let endDay = new Date(
    Math.max(...EVENTS_LIST
        .map((it) => it.time.endTime.getTime())
    )
).toDateString().slice(4, 10);

if (endDay.slice(0, 3) === startDay.slice(0, 3)) {
  endDay = endDay.slice(-2);
}

export const createSiteTripInfoTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities[0]} &mdash; ${citiesMiddle} &mdash; ${cities[cities.length - 1]}</h1>

      <p class="trip-info__dates">${startDay}&nbsp;&mdash;&nbsp;${endDay}</p>
    </div>
  </section>`
  );
};

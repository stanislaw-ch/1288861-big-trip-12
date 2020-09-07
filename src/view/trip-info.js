import Abstract from "./abstract.js";
import {points} from "../main.js";

export const createSiteTripInfoTemplate = () => {
  const cities = points
          .sort((elem1, elem2) => elem1.startTime > elem2.startTime ? 1 : -1)
          .map((it) => it.destination.name);

  const citiesMiddle = (cities.length > 2) ? `...` : cities[1];

  const startDay = new Date(
      Math.min(...points
          .map((it) => it.startTime.getTime())
      )
  ).toDateString().slice(4, 10);

  let endDay = new Date(
      Math.max(...points
          .map((it) => it.endTime.getTime())
      )
  ).toDateString().slice(4, 10);

  if (endDay.slice(0, 3) === startDay.slice(0, 3)) {
    endDay = endDay.slice(-2);
  }

  if (points.length !== 0) {
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities[0]} &mdash; ${citiesMiddle} &mdash; ${cities[cities.length - 1]}</h1>

      <p class="trip-info__dates">${startDay}&nbsp;&mdash;&nbsp;${endDay}</p>
    </div>
  </section>`;
  } else {
    return `<section class="trip-main__trip-info  trip-info"></section>`;
  }
};


export default class TripInfo extends Abstract {
  getTemplate() {
    return createSiteTripInfoTemplate();
  }
}

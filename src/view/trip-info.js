import Abstract from "./abstract.js";
import moment from "moment";

export const createSiteTripInfoTemplate = (points) => {
  const cities = points
          .sort((elem1, elem2) => moment(elem1.startTime).format(`YYYY-MM-DD`) > moment(elem2.startTime).format(`YYYY-MM-DD`) ? 1 : -1)
          .map((it) => it.destination.name);

  const citiesMiddle = (cities.length > 2) ? `...` : cities[1];

  const startDate = new Date(
      Math.min(...points
          .map((it) => new Date(it.startTime))
      )
  );

  const endDate = new Date(
      Math.max(...points
          .map((it) => new Date(it.endTime))
      )
  );

  const startMonth = moment(startDate).format(`MMM`);
  const endMonth = moment(endDate).format(`MMM`);
  const startDay = startDate.getDate() + `&nbsp;&mdash;&nbsp;`;
  const endDay = endDate.getDate();

  const checkMonth = () => {
    if (startMonth === endMonth) {
      return ``;
    }

    return endMonth + ` `;
  };

  if (points.length !== 0) {
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities[0]} &mdash; ${citiesMiddle} &mdash; ${cities[cities.length - 1]}</h1>

      <p class="trip-info__dates">${startMonth} ${startDay}${checkMonth()}${endDay}</p>
    </div>
  </section>`;
  } else {
    return `<section class="trip-main__trip-info  trip-info"></section>`;
  }
};

export default class TripInfo extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createSiteTripInfoTemplate(this._points);
  }
}

import moment from "moment";
import Abstract from "./abstract.js";

export const createTripDayTemplate = (data) => {
  const day = moment(data).format(`D`);

  return `<li class="trip-days__item  day">
  <div class="day__info">
    <span class="day__counter">${day}</span>
    <time class="day__date" datetime="2019-03-18">${moment(data).format(`MMM YY`)}</time>
  </div>
  <ul class="trip-events__list"></ul>
</li>`;
};

export default class TripDay extends Abstract {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createTripDayTemplate(this._data);
  }
}

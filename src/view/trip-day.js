import Abstract from "./abstract.js";

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

export default class TripDay extends Abstract {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createTripDaysTemplate(this._data);
  }
}

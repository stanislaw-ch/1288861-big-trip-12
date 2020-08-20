import Abstract from "./abstract.js";

export const createTripDaysSortTemplate = () => {
  return `<li class="trip-days__item  day">
  <div class="day__info"></div>

  <ul class="trip-events__list"></ul>
</li>`;
};

export default class TripDaySort extends Abstract {
  getTemplate() {
    return createTripDaysSortTemplate();
  }
}

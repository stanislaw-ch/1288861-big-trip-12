import Abstract from "./abstract.js";

export const createTripDayContainerTemplate = () => {
  return `<li class="trip-days__item  day">
            <div class="day__info"></div>
            <ul class="trip-events__list"></ul>
          </li>
  `;
};

export default class TripDayContainer extends Abstract {

  getTemplate() {
    return createTripDayContainerTemplate();
  }
}

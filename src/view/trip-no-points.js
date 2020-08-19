import Abstract from "./abstract.js";

const createNoSiteTripPointTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoTripPoints extends Abstract {
  getTemplate() {
    return createNoSiteTripPointTemplate();
  }
}

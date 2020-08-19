import Abstract from "./abstract.js";

const createNoSiteTripPointTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoTripPoints extends Abstract {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoSiteTripPointTemplate(this._data);
  }
}

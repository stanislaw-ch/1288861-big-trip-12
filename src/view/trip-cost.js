import {createElement} from "../utils.js";

export const createSiteTripCostTemplate = (tripPoint) => {

  const totalPrice = tripPoint.map((it) => it.price).reduce(function (elem1, elem2) {
    return elem1 + elem2;
  });

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export default class TripCost {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createSiteTripCostTemplate(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

import {createElement} from "../utils.js";

export const createSiteTripCostTemplate = (tripPoint) => {

  if (tripPoint.length !== 0) {
    const totalPrice = tripPoint
      .map((it) => it.price)
      .reduce(function (total, price) {
        return total + price;
      });

    return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>`;
  } else {
    return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
    </p>`;
  }
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

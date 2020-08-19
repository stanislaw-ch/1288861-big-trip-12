import Abstract from "./abstract.js";

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

export default class TripCost extends Abstract {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createSiteTripCostTemplate(this._data);
  }
}

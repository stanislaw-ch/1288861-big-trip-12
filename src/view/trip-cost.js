import Abstract from "./abstract.js";

export const createSiteTripCostTemplate = (tripPoint) => {

  if (tripPoint.length !== 0) {
    let totalPrice = 0;

    tripPoint.forEach((item) => {
      item.offers.forEach((offer) => {
        totalPrice += +offer.price;
      });

      totalPrice += item.price;
    });

    return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>`;
  }

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
    </p>`;
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

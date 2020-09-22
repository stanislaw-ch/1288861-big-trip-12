import TripInfoView from "../view/trip-info.js";
import TripPriceView from "../view/trip-cost.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export default class TripInfo {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;

    this._tripInfoComponent = null;
  }

  init(points) {
    this._renderTripInfo(points);
    this._renderTripPrice(points);
  }

  _renderTripInfo(points) {
    this._tripInfoComponent = new TripInfoView(points);

    render(this._tripInfoContainer, this._tripInfoComponent, AFTERBEGIN);
  }

  _renderTripPrice(points) {
    const tripPriceComponent = new TripPriceView(points);

    render(this._tripInfoComponent, tripPriceComponent, BEFOREEND);
  }

  destroy() {
    remove(this._tripInfoComponent);
  }
}

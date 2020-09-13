import TripInfo from "../view/trip-info.js";
import TripPrice from "../view/trip-cost.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;

export default class TripInfoPresenter {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;

    this._tripInfoComponent = null;
  }

  init(points) {
    this._renderTripInfo(points);
    this._renderTripPrice(points);
  }

  _renderTripInfo(points) {
    this._tripInfoComponent = new TripInfo(points);

    render(this._tripInfoContainer, this._tripInfoComponent, AFTERBEGIN);
  }

  _renderTripPrice(points) {
    this._tripPriceComponent = new TripPrice(points);

    render(this._tripInfoComponent, this._tripPriceComponent, BEFOREEND);
  }

  destroy() {
    remove(this._tripInfoComponent);
  }
}

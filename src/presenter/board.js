import TripBoard from "../view/trip-board.js";
import TripDay from "../view/trip-day.js";
import TripPoint from "../view/trip-point.js";
import TripPointAdd from "../view/trip-add.js";
import NoTripPoints from "../view/trip-no-points.js";
import {render, RenderPosition, replace} from "../utils/render.js";
import {getDayFormat} from '../utils/points.js';

export default class Trip {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new TripBoard();
    // this._dayComponent = new TripDay();
    // this._pointComponent = new TripPoint();
    // this._pointAddComponent = new TripPointAdd();
    this._noPointsComponent = new NoTripPoints();
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
  }

  _renderPoint(pointListElement, it) {
    const pointAddComponent = new TripPointAdd(it);
    const pointComponent = new TripPoint(it);

    const replacePointToForm = () => {
      replace(pointAddComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointAddComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    pointAddComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(pointListElement, pointComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints() {
    const sortDates = new Set(this._tripPoints
      .map((it) => getDayFormat(it.time.startTime))
      .sort((elem1, elem2) => elem1 > elem2 ? 1 : -1));

    for (let date of sortDates) {
      this._dayComponent = new TripDay(date);

      render(this._boardComponent, this._dayComponent, RenderPosition.BEFOREEND);
      const dayPoint = this._dayComponent.getElement().querySelector(`.trip-events__list`);

      const dayEvents = this._tripPoints.filter((it) => getDayFormat(it.time.startTime) === date);

      dayEvents.forEach((it) => this._renderPoint(dayPoint, it));
    }
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._tripPoints.length !== 0) {
      this._renderPoints();
    } else {
      this._renderNoPoints();
    }
  }
}

import TripBoard from "../view/trip-board.js";
import TripDay from "../view/trip-day.js";
import TripDaySort from "../view/trip-day-sort.js";
import TripPoint from "../view/trip-point.js";
import TripPointAdd from "../view/trip-add.js";
import NoTripPoints from "../view/trip-no-points.js";
import TripSort from "../view/trip-sort.js";
import {render, RenderPosition, replace} from "../utils/render.js";
import {getDayFormat} from '../utils/points.js';
import {sortTimeDown, sortPriceDown} from "../utils/points.js";
import {SortType} from "../view/trip-sort.js";

export default class Trip {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new TripBoard();
    this._pointComponent = new TripPoint();
    this._noPointsComponent = new NoTripPoints();
    this._sortComponent = new TripSort();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._sourcedBoardPoint = tripPoints.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderSort();
    this._renderBoard();
  }

  _sortPoint(sortType) {
    switch (sortType) {
      case SortType.TIME_DOWN:
        this._tripPoints.sort(sortTimeDown);
        break;
      case SortType.PRICE_DOWN:
        this._tripPoints.sort(sortPriceDown);
        break;
      case SortType.DEFAULT:
        this._tripPoints = this._sourcedBoardPoint.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    if (sortType === `default`) {
      this._currentSortType = sortType;
      this._clearPointList();
      this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).innerHTML = `Day`;
      this._renderPoints();
    } else {
      this._sortPoint(sortType);
      this._clearPointList();
      this._renderPointsSort();
    }
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

  _clearPointList() {
    this._boardComponent.getElement().innerHTML = ``;
    this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).innerHTML = ``;
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

  _renderPointsSort() {
    this._boardSortComponent = new TripDaySort();

    render(this._boardComponent, this._boardSortComponent, RenderPosition.BEFOREEND);

    const boardSort = this._boardSortComponent.getElement().querySelector(`.trip-events__list`);

    this._tripPoints.forEach((it) => this._renderPoint(boardSort, it));
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

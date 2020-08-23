import TripBoard from "../view/trip-board.js";
import TripDay from "../view/trip-day.js";
import TripDaySort from "../view/trip-day-sort.js";
// import TripPoint from "../view/trip-point.js";
// import TripPointAdd from "../view/trip-add.js";
// import TripPointEdit from "../view/trip-edit.js";
import NoTripPoints from "../view/trip-no-points.js";
import TripSort from "../view/trip-sort.js";
import PointsPresenter from "./points.js";
import {updateItem} from "../utils/common.js";
import {render, RenderPosition} from "../utils/render.js";
import {getDayFormat} from '../utils/points.js';
import {sortTimeDown, sortPriceDown} from "../utils/points.js";
import {SortType} from "../view/trip-sort.js";

export default class Trip {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._currentSortType = SortType.DEFAULT;
    this._pointPresenter = {};
    // this._pointDayPresenter = [];

    this._boardComponent = new TripBoard();
    this._noPointsComponent = new NoTripPoints();
    this._sortComponent = new TripSort();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._sourcedBoardPoints = tripPoints.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderSort();
    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._sourcedBoardPoints = updateItem(this._sourcedBoardPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
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
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointList();

    if (sortType === `default`) {
      this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).innerHTML = `Day`;
      this._renderPoints();
    } else {
      this._sortPoint(sortType);
      this._renderPointsSort();
    }
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(dayPoint, it) {
    const pointsPresenter = new PointsPresenter(this._handlePointChange, this._handleModeChange);
    pointsPresenter.init(dayPoint, it);
    this._pointPresenter[it.id] = pointsPresenter;
    // console.log(pointsPresenter);
  }

  _clearPointList() {
    this._boardComponent.getElement().innerHTML = ``;
    // Object
    //   .values(this._pointDayPresenter)
    //   .forEach((presenter) => presenter.destroy());
    // this._pointsPresenter = {};
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
    const boardSortComponent = new TripDaySort();
    render(this._boardComponent, boardSortComponent, RenderPosition.BEFOREEND);

    const boardSort = boardSortComponent.getElement().querySelector(`.trip-events__list`);
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

import TripBoard from "../view/trip-board.js";
import TripDay from "../view/trip-day.js";
import TripDaySort from "../view/trip-day-sort.js";
import NoTripPoints from "../view/trip-no-points.js";
import TripSort from "../view/trip-sort.js";
import PointPresenter from "./point.js";
import PointNewPresenter from "./point-new.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {getDayFormat} from '../utils/points.js';
import {sortTimeDown, sortPriceDown} from "../utils/points.js";
import {filter} from "../utils/filter.js";
import {SortType, UpdateType, UserAction} from "../const.js";

export default class TripPresenter {
  constructor(tripContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.DEFAULT;
    this._pointItems = {};

    this._boardComponent = new TripBoard();
    this._noPointsComponent = new NoTripPoints();
    this._sortComponent = new TripSort();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleResetView = this._handleResetView.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._boardComponent, this._handleViewAction);
  }

  init() {
    render(this._tripContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderSort();
    this._renderTrip();
  }

  destroy() {
    this._clearTripBoard();

    remove(this._boardComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME_DOWN:
        return filtredPoints.sort(sortTimeDown);
      case SortType.PRICE_DOWN:
        return filtredPoints.sort(sortPriceDown);
    }

    return filtredPoints;
  }

  _handleResetView() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointItems)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, pointItem, dayPoint) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._pointItems[pointItem.id].init(dayPoint, pointItem);
        break;
      case UpdateType.MAJOR:
        this._clearTripBoard();
        this._renderTrip();
        this._renderSort();
        this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).innerHTML = `Day`;
        break;
      // case UpdateType.MAJOR:
      //   this._clearTripBoard();
      //   this._renderTrip();
      //   break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearSortPointList();

    if (sortType === SortType.DEFAULT) {
      this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).innerHTML = `Day`;
      this._renderPoints();
    } else {
      this._renderPointsSort();
    }
  }

  _renderSort() {
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderPoint(dayPoint, pointItem) {
    const pointPresenter = new PointPresenter(this._handleViewAction, this._handleResetView);
    pointPresenter.init(dayPoint, pointItem);
    this._pointItems[pointItem.id] = pointPresenter;
  }

  _clearSortPointList() {
    this._boardComponent.getElement().innerHTML = ``;
    this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).innerHTML = ``;
  }

  _clearTripBoard() {
    this._pointNewPresenter.destroy();
    this._boardComponent.getElement().innerHTML = ``;

    remove(this._sortComponent);
    remove(this._noPointsComponent);
  }

  _renderPoints() {
    const sortDates = new Set(this._getPoints()
      .map((pointItem) => getDayFormat(pointItem.time.startTime))
      .sort((elem1, elem2) => elem1 > elem2 ? 1 : -1));

    for (let date of sortDates) {
      const dayComponent = new TripDay(date);

      render(this._boardComponent, dayComponent, RenderPosition.BEFOREEND);
      const dayPoint = dayComponent.getElement().querySelector(`.trip-events__list`);

      const dayEvents = this._getPoints().filter((pointItem) => getDayFormat(pointItem.time.startTime) === date);

      dayEvents.forEach((pointItem) => this._renderPoint(dayPoint, pointItem));
    }
  }

  _renderPointsSort() {
    const boardSortComponent = new TripDaySort();
    render(this._boardComponent, boardSortComponent, RenderPosition.BEFOREEND);

    const boardSort = boardSortComponent.getElement().querySelector(`.trip-events__list`);
    this._getPoints().forEach((it) => this._renderPoint(boardSort, it));
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._getPoints().length !== 0) {
      this._renderPoints();
    } else {
      this._renderNoPoints();
    }
  }
}

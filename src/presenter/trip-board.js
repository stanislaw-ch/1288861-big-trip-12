import TripNewButton from "../view/new-trip-btn.js";
import TripBoard from "../view/trip-board.js";
import TripDay from "../view/trip-day.js";
import TripDaySort from "../view/trip-day-sort.js";
import TripSort from "../view/trip-sort.js";
import Statistics from "../view/statistics.js";
import NoTripPoints from "../view/trip-no-points.js";
import LoadingView from "../view/loading.js";
import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import PointNewPresenter from "./point-new.js";
import TripInfoPresenter from "./trip-info.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTimeDown, sortPriceDown} from "../utils/points.js";
import {filter} from "../utils/filter.js";
import {MenuItem, SortType, UpdateType, UserAction, FilterType} from "../const.js";

export default class TripPresenter {
  constructor(
      tripContainer,
      offersModel,
      pointsModel,
      filterModel,
      destinationModel,
      siteMenuModel,
      api
  ) {
    this._tripContainer = tripContainer;
    this._offersModel = offersModel;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._siteMenuModel = siteMenuModel;
    this._destinationModel = destinationModel;
    this._currentSortType = SortType.DEFAULT;
    this._pointItems = {};
    this._tripInfoPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._statisticsComponent = null;

    this._boardComponent = new TripBoard();
    this._noPointsComponent = new NoTripPoints();
    this._sortComponent = new TripSort();
    this._loadingComponent = new LoadingView();
    this._newTripBtnComponent = new TripNewButton();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleResetView = this._handleResetView.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleMenuModel = this._handleMenuModel.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._boardComponent, this._handleViewAction);
    this._siteMenuModel.addObserver(this._handleMenuModel);
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
    this._pointNewPresenter.init(callback, this._getOffers(), this._getDestination());
  }

  _getOffers() {
    return this._offersModel.getOffers();
  }

  _getDestination() {
    return this._destinationModel.getDestination();
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
        this._pointItems[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointItems[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointItems[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointItems[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, pointItem, dayPoint) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._tripInfoPresenter.destroy();
        this._pointItems[pointItem.id].init(dayPoint, pointItem, this._getOffers(), this._getDestination());
        this._renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this._tripInfoPresenter.destroy();
        this._clearTripBoard();
        this._renderTripInfo();
        this._renderTrip();
        this._renderSort();
        this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).innerHTML = `Day`;
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._newTripBtnComponent.getElement().disabled = false;
        remove(this._loadingComponent);
        this._renderTripInfo();
        this._renderTrip();
        break;
    }
  }

  _handleMenuModel(menuItem) {
    switch (menuItem) {
      case MenuItem.TABLE:
        this.destroy();
        this.init();
        remove(this._statisticsComponent);
        break;
      case MenuItem.STATISTICS:
        this.destroy();
        const siteMainElement = document.querySelector(`.page-body__page-main`);
        const siteStats = siteMainElement.querySelector(`.page-body__container`);
        this._statisticsComponent = new Statistics(this._pointsModel.getPoints());
        render(siteStats, this._statisticsComponent, RenderPosition.BEFOREEND);
        break;
      case MenuItem.ADD_NEW_EVENT:
        this._siteMenuModel.setMenuItem(MenuItem.TABLE);
        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
        this.createPoint();
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

  _renderTripInfo() {
    const tripMainElement = document.querySelector(`.trip-main`);
    const tripInfoPresenter = new TripInfoPresenter(tripMainElement);

    this._tripInfoPresenter = tripInfoPresenter;

    tripInfoPresenter.init(this._pointsModel.getPoints());
  }

  _renderSort() {
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderPoint(dayPoint, pointItem) {
    const pointPresenter = new PointPresenter(this._handleViewAction, this._handleResetView);
    pointPresenter.init(dayPoint, pointItem, this._getOffers(), this._getDestination());//
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
  }

  _renderPoints() {
    const sortDates = new Set(this._getPoints()
      .map((pointItem) => new Date(pointItem.startTime))
      .sort((elem1, elem2) => elem1 > elem2 ? 1 : -1));

    for (let date of sortDates) {
      const dayComponent = new TripDay(date);

      render(this._boardComponent, dayComponent, RenderPosition.BEFOREEND);
      const dayPoint = dayComponent.getElement().querySelector(`.trip-events__list`);

      const dayEvents = this._getPoints().filter((pointItem) => pointItem.startTime === date.toISOString());

      dayEvents.forEach((pointItem) => this._renderPoint(dayPoint, pointItem));
    }
  }

  _renderPointsSort() {
    const boardSortComponent = new TripDaySort();
    render(this._boardComponent, boardSortComponent, RenderPosition.BEFOREEND);

    const boardSort = boardSortComponent.getElement().querySelector(`.trip-events__list`);
    this._getPoints().forEach((it) => this._renderPoint(boardSort, it));
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    render(this._boardComponent, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      this._newTripBtnComponent.getElement().disabled = true;
      return;
    } else if (this._getPoints().length !== 0) {
      // this._renderTripInfo();
      this._renderPoints();
    } else {
      this._renderNoPoints();
    }
  }
}

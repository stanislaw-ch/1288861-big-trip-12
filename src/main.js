import TripInfo from "./view/trip-info.js";
import TripCost from "./view/trip-cost.js";
import SiteMenu from "./view/site-menu.js";
import Statistics from "./view/statistics.js";
import {getRandomFloat} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render.js";
import {generateTripPoint} from './mock/trip-point.js';
import TripPresenter from "./presenter/trip-board.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";

const POINT_COUNT = getRandomFloat(4, 16);

export const points = new Array(POINT_COUNT).fill().map(generateTripPoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteMenuComponent = new SiteMenu(MenuItem.TABLE);

// Информация о поездке
const siteTrip = siteHeaderElement.querySelector(`.trip-main`);
render(siteTrip, new TripInfo(), RenderPosition.AFTERBEGIN);

// Информация о стоимости
const siteTripCost = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(siteTripCost, new TripCost(points), RenderPosition.BEFOREEND);

const handlePointNewFormClose = () => {
  document.querySelector(`.trip-main__event-add-btn`).disabled = false;
};

// Меню проекта
const siteMenu = siteHeaderElement.querySelector(`.trip-main__trip-controls h2`);
render(siteMenu, siteMenuComponent, RenderPosition.AFTEREND);

// Фильтр проекта
const siteFilter = siteHeaderElement.querySelector(`.trip-main__trip-controls`);

// Список событий поездки
const siteBoard = siteMainElement.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(siteBoard, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilter, filterModel, pointsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      // Показать статистику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
// tripPresenter.init();
// Для удобства отладки скроем доску
// и отобразим сразу статистику
const siteStats = siteMainElement.querySelector(`.page-body__container`);
render(siteStats, new Statistics(pointsModel.getPoints()), RenderPosition.BEFOREEND);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  document.querySelector(`.trip-main__event-add-btn`).disabled = true;
});

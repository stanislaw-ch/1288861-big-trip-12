// import TripAddButton from "./view/event-add-button.js";
import TripInfo from "./view/trip-info.js";
import TripCost from "./view/trip-cost.js";
import SiteMenu from "./view/site-menu.js";
import Statistics from "./view/statistics.js";
import {getRandomFloat} from "./utils/common.js";
import {render, RenderPosition, remove} from "./utils/render.js";
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
// const tripAddButtonComponent = new TripAddButton();

// Информация о поездке
const siteTrip = siteHeaderElement.querySelector(`.trip-main`);
render(siteTrip, new TripInfo(), RenderPosition.AFTERBEGIN);
// render(siteTrip, tripAddButtonComponent, RenderPosition.BEFOREEND);

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
const siteStats = siteMainElement.querySelector(`.page-body__container`);

let statisticsComponent = null;

// const handlePointNewFormClose = () => {
//   tripAddButtonComponent.getElement().querySelector(`.trip-main__event-add-btn`).disabled = false;
//   siteMenuComponent.setMenuItem(MenuItem.TABLE);
// };

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    // case MenuItem.ADD_NEW_EVENT:
    //   remove(statisticsComponent);
    //   tripPresenter.destroy();
    //   filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    //   tripPresenter.init();
    //   tripPresenter.createPoint(handlePointNewFormClose);
    //   tripAddButtonComponent.getElement().querySelector(`.trip-main__event-add-btn`).disabled = true;
    //   break;
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      statisticsComponent = new Statistics(pointsModel.getPoints());
      render(siteStats, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
// tripAddButtonComponent.setAddButtonHandler(handleSiteMenuClick);


filterPresenter.init();
tripPresenter.init();


document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  remove(statisticsComponent);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  document.querySelector(`.trip-main__event-add-btn`).disabled = true;
});

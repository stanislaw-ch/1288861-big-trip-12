// import TripInfo from "./view/trip-info.js";
// import TripCost from "./view/trip-cost.js";
import SiteMenu from "./view/site-menu.js";
import Statistics from "./view/statistics.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import TripPresenter from "./presenter/trip-board.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic oo1iu2ygf`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-body__page-main`);

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();

const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenu(MenuItem.TABLE);

// Информация о поездке
// const siteTrip = siteHeaderElement.querySelector(`.trip-main`);
// render(siteTrip, new TripInfo(), RenderPosition.AFTERBEGIN);

// Информация о стоимости
// const siteTripCost = siteHeaderElement.querySelector(`.trip-main__trip-info`);
// render(siteTripCost, new TripCost(points), RenderPosition.BEFOREEND);

const handlePointNewFormClose = () => {
  document.querySelector(`.trip-main__event-add-btn`).disabled = false;
};

// Меню проекта
const siteMenu = siteHeaderElement.querySelector(`.trip-main__trip-controls h2`);

// Фильтр проекта
const siteFilter = siteHeaderElement.querySelector(`.trip-main__trip-controls`);

// Список событий поездки
const siteBoard = siteMainElement.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(siteBoard, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteFilter, filterModel, pointsModel);
const siteStats = siteMainElement.querySelector(`.page-body__container`);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
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

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    render(siteMenu, siteMenuComponent, RenderPosition.AFTEREND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(siteMenu, siteMenuComponent, RenderPosition.AFTEREND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

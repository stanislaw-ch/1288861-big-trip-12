import TripInfo from "./view/trip-info.js";
import TripCost from "./view/trip-cost.js";
import SiteMenu from "./view/site-menu.js";
import TripFilter from "./view/trip-filter.js";
import {getRandomFloat} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render.js";
import {generateTripPoint} from './mock/trip-point.js';
import TripPresenter from "./presenter/trip.js";

const POINT_COUNT = getRandomFloat(4, 16);

export const points = new Array(POINT_COUNT).fill().map(generateTripPoint);

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-body__page-main`);

// Информация о поездке
const siteTrip = siteHeaderElement.querySelector(`.trip-main`);
render(siteTrip, new TripInfo(), RenderPosition.AFTERBEGIN);

// Информация о стоимости
const siteTripCost = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(siteTripCost, new TripCost(points), RenderPosition.BEFOREEND);

// Меню проекта
const siteMenu = siteHeaderElement.querySelector(`.trip-main__trip-controls h2`);
render(siteMenu, new SiteMenu(), RenderPosition.AFTEREND);

// Фильтр проекта
const siteFilter = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(siteFilter, new TripFilter(), RenderPosition.BEFOREEND);

// Список событий поездки
const siteBoard = siteMainElement.querySelector(`.trip-events`);
const boardPresenter = new TripPresenter(siteBoard);
boardPresenter.init(points);

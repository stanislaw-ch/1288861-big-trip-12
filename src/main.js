import {createSiteTripInfoTemplate} from "./view/trip-info.js";
import {createSiteTripCostTemplate} from "./view/trip-cost.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSiteFilterTemplate} from "./view/filter.js";
import {createSiteSortTemplate} from "./view/sort.js";
import {createSiteTripDaysListTemplate} from "./view/trip-day-list.js";
import {createSiteTripDayItemTemplate} from "./view/trip-day-item.js";
import {createSiteTripEventsListTemplate} from "./view/trip-events-list.js";
import {createSiteTripEventsItemTemplate} from "./view/trip-events-item.js";
import {createSiteTripEventsAddTemplate} from "./view/trip-events-add.js";
import {generateTripPoint} from "./mock/trip-point.js";

const POINT_COUNT = 10;

const tripPoint = new Array(POINT_COUNT).fill().map(generateTripPoint);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);

// Информация о поездке
const siteTrip = siteHeaderElement.querySelector(`.trip-main`);
render(siteTrip, createSiteTripInfoTemplate(), `afterbegin`);

// Информация о стоимости
const siteTripCost = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(siteTripCost, createSiteTripCostTemplate(), `beforeend`);

// Меню проекта
const siteMenu = siteHeaderElement.querySelector(`.trip-main__trip-controls h2`);
render(siteMenu, createSiteMenuTemplate(), `afterend`);

// Фильтр проекта
const siteFilter = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(siteFilter, createSiteFilterTemplate(), `beforeend`);

// Сортировка проекта
const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteTripSort = siteMainElement.querySelector(`.trip-events h2`);
render(siteTripSort, createSiteSortTemplate(), `afterend`);

// Группировка/список по дням проекта
const siteTripFormSort = document.querySelector(`.trip-events__trip-sort`);
render(siteTripFormSort, createSiteTripDaysListTemplate(), `afterend`);

// День поездки
const siteTripDaysList = document.querySelector(`.trip-days`);
render(siteTripDaysList, createSiteTripDayItemTemplate(), `afterbegin`);

// Список событий поездки
const siteTripDayItem = document.querySelector(`.trip-days__item`);
render(siteTripDayItem, createSiteTripEventsListTemplate(), `beforeend`);


// Добавление - редактирование поездки
const siteTripEventsList = document.querySelector(`.trip-events__list`);
render(siteTripEventsList, createSiteTripEventsAddTemplate(tripPoint[0]), `afterbegin`);

// Точки поездки
for (let i = 1; i < POINT_COUNT; i++) {
  render(siteTripEventsList, createSiteTripEventsItemTemplate(tripPoint[i]), `beforeend`);
}

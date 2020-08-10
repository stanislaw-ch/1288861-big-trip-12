import {createSiteTripInfoTemplate} from "./view/trip-info.js";
import {createSiteTripCostTemplate} from "./view/trip-cost.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSiteFilterTemplate} from "./view/filter.js";
import {createSiteSortTemplate} from "./view/sort.js";
import {createSiteTripEventsListTemplate} from "./view/trip-events-list.js";
import {createSiteTripEventsAddTemplate} from "./view/trip-events-add.js";
import {EVENTS_LIST} from "./view/sort.js";

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

// Список событий поездки
const siteTripDayItem = document.querySelector(`.trip-days__item`);
render(siteTripDayItem, createSiteTripEventsListTemplate(), `beforeend`);

// Добавление - редактирование поездки
const siteTripEventsList = document.querySelector(`.trip-events__list`);
render(siteTripEventsList, createSiteTripEventsAddTemplate(EVENTS_LIST[0]), `afterbegin`);

// Точки поездки
// for (let i = 1; i < POINT_COUNT; i++) {
//   render(siteTripEventsList, createSiteTripEventsItemTemplate(tripPoints[i]), `beforeend`);
// }

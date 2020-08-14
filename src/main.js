import TripInfo from "./view/trip-info.js";
import TripCost from "./view/trip-cost.js";
import SiteMenu from "./view/site-menu.js";
import Filter from "./view/filter.js";
import Sort from "./view/sort.js";
import TripDaysBoard from "./view/trip-days-board.js";
import TripDaysList from "./view/trip-day.js";
import TripPointList from "./view/trip-point.js";
import TripPointAdd from "./view/trip-add.js";
import {render, RenderPosition, getDayFormat, getRandomFloat} from "./utils.js";
import {generateTripPoint} from './mock/trip-point.js';

const POINT_COUNT = getRandomFloat(4, 16);

export const EVENTS_LIST = new Array(POINT_COUNT).fill().map(generateTripPoint);

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-body__page-main`);

const renderPoint = (pointListElement, it) => {
  const pointComponent = new TripPointList(it);
  const pointEditComponent = new TripPointAdd(it);

  const replaceCardToForm = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  pointEditComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

// Информация о поездке
const siteTrip = siteHeaderElement.querySelector(`.trip-main`);
render(siteTrip, new TripInfo().getElement(), RenderPosition.AFTERBEGIN);

// Информация о стоимости
const siteTripCost = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(siteTripCost, new TripCost().getElement(), RenderPosition.BEFOREEND);

// Меню проекта
const siteMenu = siteHeaderElement.querySelector(`.trip-main__trip-controls h2`);
render(siteMenu, new SiteMenu().getElement(), RenderPosition.AFTER);

// Фильтр проекта
const siteFilter = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(siteFilter, new Filter().getElement(), RenderPosition.BEFOREEND);

// Сортировка проекта
const siteBoard = siteMainElement.querySelector(`.trip-events`);
render(siteBoard, new Sort().getElement(), RenderPosition.BEFOREEND);

const sortDates = new Set(EVENTS_LIST
  .map((it) => getDayFormat(it.time.startTime))
  .sort((elem1, elem2) => elem1 > elem2 ? 1 : -1));

// Список событий поездки
render(siteBoard, new TripDaysBoard().getElement(), RenderPosition.BEFOREEND);

const dayBoard = siteMainElement.querySelector(`.trip-days`);
for (let date of sortDates) {
  const dayComponent = new TripDaysList(date);
  render(dayBoard, dayComponent.getElement(), RenderPosition.BEFOREEND);
  const dayPoint = dayComponent.getElement().querySelector(`.trip-events__list`);

  const dayEvents = EVENTS_LIST.filter((it) => {
    return getDayFormat(it.time.startTime) === date;
  });

  dayEvents.forEach((it) => renderPoint(dayPoint, it));
}

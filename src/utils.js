import {createSiteTripEventsItemTemplate} from './view/trip-events-item.js';

/**
 * Возвращает случайное число
 * @param {number} from
 * @param {number} to
 *
 * @return {number}
 */
export const getRandomInteger = (from = 0, to = 1) => {
  const lower = Math.ceil(Math.min(from, to));
  const upper = Math.floor(Math.max(from, to));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * Возвращает случайное число в заданном диапозоне
 * @param {number} min
 * @param {number} max
 *
 * @return {number} randNumber
 */
export const getRandomFloat = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

// Форматирует номер дня если он меньше нуля, добавляя в начало "0"
export const getFormattedDayNumber = (num) => (num < 10) ? `0${num}` : num;

/**
 * Возвращает время в формате час мин для начала и окончания события в точке
 * @param {object} date
 *
 * @return {object}
 */
export const getFormattedTime = (date) => {
  const hours = getFormattedDayNumber(date.getHours());
  const min = getFormattedDayNumber(date.getMinutes());

  return `${hours}:${min}`;
};

/**
 * Возвращает время в формате час мин для интервала продолжительности события в точке
 * @param {object} minutes
 *
 * @return {object}
 */
const getHoursMinInterval = (minutes) => {
  const durationInHours = Math.floor(minutes / 60);
  const durationInMin = minutes - durationInHours * 60;

  return `${getFormattedDayNumber(durationInHours)}H ${getFormattedDayNumber(durationInMin)}M`;
};

/**
 * Описывает логику отображения интервала продолжительности события в точке
 * @param {object} startTime
 * @param {object} endTime
 *
 * @return {object}
 */
export const getDurationInterval = (startTime, endTime) => {
  const durationInMin = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

  if (durationInMin < 60) {
    return `${getFormattedDayNumber(durationInMin)}M`;
  }

  const durationInHours = durationInMin / 60;
  if (durationInHours < 24) {
    return getHoursMinInterval(durationInMin);
  }

  const durationInDays = Math.floor(durationInHours / 24);
  return `${getFormattedDayNumber(durationInDays)}D ${getHoursMinInterval(durationInMin - durationInDays * 60 * 24)}`;
};

/**
 * Возвращает дату в формате день, месяц, год
 * @param {object} date
 *
 * @return {object}
 */
export const getDayFormat = (date) => {
  const dateString = date.toDateString();
  return `${dateString.slice(8, 11)} ${dateString.slice(4, 7)} ${dateString.slice(13, 15)}`;
};

export const getDayTemplate = (pointsData, sortDates) => {
  let daysTemplate = ``;
  for (let date of sortDates) {
    const day = date.slice(0, 2);

    const dayEvents = pointsData.filter((it) => {
      return getDayFormat(it.time.startTime) === date;
    });

    const tripTemplate = (data) => {
      let tripItem = ``;
      for (let item of data) {
        tripItem += createSiteTripEventsItemTemplate(item);
      }
      return tripItem;
    };

    daysTemplate = daysTemplate + `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${+day}</span>
        <time class="day__date" datetime="2019-03-18">${date.slice(4)}</time>
      </div>
      <ul class="trip-events__list">${tripTemplate(dayEvents)}</ul>
    </li>
  `;
  }
  return daysTemplate;
};
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

/**
 * Возвращает дату в формате день, месяц, год
 * @param {object} date
 *
 * @return {object}
 */
export const getTimeFormat = (date) => {
  const dateString = date.toDateString();
  return `${dateString.slice(8, 10)}/${getFormattedDayNumber(date.getMonth() + 1)}/${dateString.slice(13, 15)} ${getFormattedDayNumber(date.getHours())}:${getFormattedDayNumber(date.getMinutes())}`;
};

export const getDurationIntervalForSort = (startTime, endTime) => {
  const durationInMin = (endTime.getTime() - startTime.getTime()) / 60000;

  return durationInMin;
};

export const sortTimeDown = (pointA, pointB) =>
  getDurationIntervalForSort(pointA.time.startTime, pointA.time.endTime) >
  getDurationIntervalForSort(pointB.time.startTime, pointB.time.endTime) ? -1 : 1;

export const sortPriceDown = (pointA, pointB) => pointA.price > pointB.price ? -1 : 1;

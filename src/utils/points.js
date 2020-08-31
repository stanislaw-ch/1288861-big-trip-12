import moment from "moment";

// Форматирует номер дня если он меньше нуля, добавляя в начало "0"
export const getFormattedDayNumber = (num) => (num < 10) ? `0${num}` : num;

/**
 * Возвращает время в формате час мин для начала и окончания события в точке
 * @param {object} date
 *
 * @return {object}
 */
export const getFormattedTime = (date) => {
  return moment(date).format(`HH:mm`);
};

/**
 * Описывает логику отображения интервала продолжительности события в точке
 * @param {object} startTime
 * @param {object} endTime
 *
 * @return {object}
 */
export const getDurationInterval = (startTime, endTime) => {
  const start = moment(startTime.getTime());
  const end = moment(endTime.getTime());
  const duration = end.diff(start);

  const durationInMin = duration / 60000;

  if (durationInMin < 60) {
    return `${moment(duration).format(`mm`)}M`;
  }

  const durationInHours = durationInMin / 60;
  if (durationInHours < 24) {
    return `${moment(duration).format(`HH`)}H ${moment(duration).format(`mm`)}M`;
  }

  return `${moment(duration).format(`DD`)}D ${moment(duration).format(`HH`)}H ${moment(duration).format(`mm`)}M`;
};

/**
 * Возвращает дату в формате день, месяц, год
 * @param {object} date
 *
 * @return {object}
 */
export const getDayFormat = (date) => {
  return moment(date).format(`MMM DD YY`);
};

/**
 * Возвращает дату в формате день, месяц, год
 * @param {object} date
 *
 * @return {object}
 */
export const getTimeFormat = (date) => {
  return `${moment(date).format(`DD/MM/YY HH:mm`)}`;
};

export const getDurationIntervalForSort = (startTime, endTime) => {
  const durationInMin = (endTime.getTime() - startTime.getTime()) / 60000;

  return durationInMin;
};

export const sortTimeDown = (pointA, pointB) =>
  getDurationIntervalForSort(pointA.time.startTime, pointA.time.endTime) >
  getDurationIntervalForSort(pointB.time.startTime, pointB.time.endTime) ? -1 : 1;

export const sortPriceDown = (pointA, pointB) => pointA.price > pointB.price ? -1 : 1;

export const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

export const isPointExpired = (pointDate) => {
  if (pointDate === null) {
    return false;
  }

  const currentDate = new Date();

  return currentDate.getTime() > pointDate.getTime();
};

export const isPointActual = (pointDate) => {
  if (pointDate === null) {
    return false;
  }

  const currentDate = new Date();

  return currentDate.getTime() < pointDate.getTime();
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

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
  const start = moment(new Date(startTime).getTime());
  const end = moment(new Date(endTime).getTime());
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
  const durationInMin = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000;

  return durationInMin;
};

export const sortTimeDown = (pointA, pointB) =>
  getDurationIntervalForSort(pointA.startTime, pointA.endTime) >
  getDurationIntervalForSort(pointB.startTime, pointB.endTime) ? -1 : 1;

export const sortPriceDown = (pointA, pointB) => pointA.price > pointB.price ? -1 : 1;

export const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

export const isPointExpired = (date) => {
  if (date === null) {
    return false;
  }

  const currentDate = new Date();
  const pointDate = new Date(date);

  return currentDate.getTime() > pointDate.getTime();
};

export const isPointActual = (date) => {
  if (date === null) {
    return false;
  }

  const currentDate = new Date();
  const pointDate = new Date(date);

  return currentDate.getTime() < pointDate.getTime();
};

// Date.now() и Math.random() - плохие решения для генерации id
// в "продуктовом" коде, а для моков самое то.
// Для "продуктового" кода используйте что-то понадежнее,
// вроде nanoid - https://github.com/ai/nanoid
export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

export const getToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0).toString();

  return today;
};

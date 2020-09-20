import moment from "moment";

export const getFormattedTime = (date) => {
  return moment(date).format(`HH:mm`);
};

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

export const getTimeFormat = (date) => {
  return `${moment(date).format(`DD/MM/YY HH:mm`)}`;
};

export const getDurationIntervalForSort = (startTime, endTime) => {
  return (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000;
};

export const sortTimeDown = (pointA, pointB) =>
  getDurationIntervalForSort(pointA.startTime, pointA.endTime) >
  getDurationIntervalForSort(pointB.startTime, pointB.endTime) ? -1 : 1;

export const sortPriceDown = (pointA, pointB) => pointA.price > pointB.price ? -1 : 1;

export const areDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

export const isPointExpired = (date) => {
  if (date === null) {
    return false;
  }

  const currentDate = moment(new Date()).format(`YYYY-MM-DD`);
  const pointDate = moment(new Date(date)).format(`YYYY-MM-DD`);

  return currentDate > pointDate;
};

export const isPointActual = (date) => {
  if (date === null) {
    return false;
  }

  const currentDate = moment(new Date()).format(`YYYY-MM-DD`);
  const pointDate = moment(new Date(date)).format(`YYYY-MM-DD`);

  return currentDate <= pointDate;
};

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

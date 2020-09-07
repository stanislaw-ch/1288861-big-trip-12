import moment from "moment";

export const uniqTypes = (items) => [...new Set(items)];

export const costPointByType = (points, type) => {
  return points.filter((item) => item.eventsTypes === type)
               .map((it) => it.price)
               .reduce((total, price) => total + price);
};

export const countPointByType = (points, type) => {
  return points.filter((item) => item.eventsTypes === type).length;
};

export const countPointByTime = (points, type) => {
  return points.filter((item) => item.eventsTypes === type).length;
};

export const getDuration = (startTime, endTime) => {

  const start = moment(new Date(startTime).getTime());
  const end = moment(new Date(endTime).getTime());
  const duration = end.diff(start);
  const durationInHours = (duration / 60000) / 60;

  return Math.ceil(durationInHours);
};

export const getDurationInterval = (points, type) => {
  return points.filter((item) => item.eventsTypes === type)
               .map((item) => getDuration(item.startTime, item.endTime))
               .reduce((total, time) => total + time);
};

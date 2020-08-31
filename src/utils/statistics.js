import moment from "moment";

export const countCompletedTaskInDateRange = (tasks, dateFrom, dateTo) => {
  return tasks.reduce((counter, task) => {
    if (task.dueDate === null) {
      return counter;
    }

    // С помощью moment.js проверям, сколько задач с дедлайном
    // попадают в диапазон дат
    if (
      moment(task.dueDate).isSame(dateFrom) ||
      moment(task.dueDate).isBetween(dateFrom, dateTo) ||
      moment(task.dueDate).isSame(dateTo)
    ) {
      return counter + 1;
    }

    return counter;
  }, 0);
};

export const uniqTypes = (items) => [...new Set(items)];

export const costPointByType = (points, type) => {
  return points.filter((item) => item.eventsTypes.type === type)
    .map((it) => it.price)
    .reduce(function (total, price) {
      return total + price;
    });
};

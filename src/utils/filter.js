import {FilterType} from "../const";
import {isPointExpired, isPointActual} from "./points";

export const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((task) => isPointExpired(task.time.startTime)),
  [FilterType.FUTURE]: (points) => points.filter((task) => isPointActual(task.time.startTime)),
};

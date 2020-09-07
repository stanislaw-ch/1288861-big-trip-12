import {FilterType} from "../const";
import {isPointExpired, isPointActual} from "./points";

export const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.startTime)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointActual(point.startTime)),
};

import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      updatedPoint,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, updatedPoint) {
    this._points = [
      updatedPoint,
      ...this._points
    ];

    this._notify(updateType, updatedPoint);
  }

  deletePoint(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          eventsTypes: point.type,
          startTime: point.date_from,
          endTime: point.date_to,
          pictures: point.photos,
          isFavorite: point.is_favorite
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.type;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.photos;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.price,
          "type": point.eventsTypes,
          "date_from": point.startTime,
          "date_to": point.endTime,
          "photos": point.pictures,
          "is_favorite": point.isFavorite
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.eventsTypes;
    delete adaptedPoint.startTime;
    delete adaptedPoint.endTime;
    delete adaptedPoint.pictures;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}

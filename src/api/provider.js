import {nanoid} from "nanoid";
import PointsModel from "../model/points.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items, isPoints) => {
  return items.reduce((acc, current) => {
    if (isPoints) {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }
    return items;
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);
          return offers;
        });
    }
    const storeOffers = Object.values(this._store.getOffers());

    return Promise.resolve(storeOffers.slice());
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destination) => {
          this._store.setDestinations(destination);
          return destination;
        });
    }

    const storeDestination = Object.values(this._store.getDestinations());

    return Promise.resolve(storeDestination.slice());
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._store.setPoints(items);

          return points;
        });
    }

    const storePoints = Object.values(this._store.getPoints());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatePoint) => {
          this._store.setItem(updatePoint.id, PointsModel.adaptToServer(updatePoint));
          return updatePoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._store.setItem(localNewPoint.id, PointsModel.adaptToServer(localNewPoint));

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    this._store.removeItem(point.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._store.getData());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}

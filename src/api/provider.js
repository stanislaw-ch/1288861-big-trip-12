import {nanoid} from "nanoid";
import PointsModel from "../model/points.js";

// const StoreTitle = {
//   EVENTS: `Points`,
//   OFFERS: `Offers`,
//   DESTINATIONS: `Destinations`,
// };

const getSyncedTasks = (items) => {
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
          const offersItems = createStoreStructure(offers);
          const items = {offersItems};
          this._store.setItems(items);
          return offers;
        });
    }
    const storeOffers = Object.values(this._store.getOffersItems());

    return Promise.resolve(storeOffers.slice());
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destination) => {
          const destinationsItems = createStoreStructure(destination);
          const items = {destinationsItems};
          this._store.setItems(items);
          return destination;
        });
    }

    const storeDestination = Object.values(this._store.getDestinationsItems());

    return Promise.resolve(storeDestination.slice());
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const pointsItems = createStoreStructure(points.map(PointsModel.adaptToServer));
          const items = {pointsItems};
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getPointsItems());

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
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedTasks(response.created);
          const updatedPoints = getSyncedTasks(response.updated);
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

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getData() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setData(data) {
    this._storage.setItem(this._storeKey, JSON.stringify(data));
  }

  setOffers(offers) {
    const data = this.getData();
    data.offers = offers;

    this.setData(data);
  }

  setDestinations(destinations) {
    const data = this.getData();
    data.destinations = destinations;

    this.setData(data);
  }

  setPoints(points) {
    const data = this.getData();
    data.points = points;

    this.setData(data);
  }

  getOffers() {
    return this.getData().offers;
  }

  getDestinations() {
    return this.getData().destinations;
  }

  getPoints() {
    return this.getData().points;
  }

  setItem(value) {
    const store = this.getData();
    store.points.push(value);

    this.setData(store);
  }

  updateItem(key, value) {
    const storedPoints = this.getPoints();

    const index = storedPoints.findIndex((point) => point.id === key);
    storedPoints[index] = value;

    this.setPoints(storedPoints);
  }

  leftPoints(key) {
    const store = this.getData();
    const removePoints = store.points.filter((point) => point.id !== key);

    this.setPoints(removePoints);
  }
}

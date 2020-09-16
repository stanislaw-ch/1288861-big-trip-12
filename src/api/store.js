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

  setDestinations(destination) {
    const data = this.getData();
    data.destination = destination;

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
    return this.getData().destination;
  }

  getPoints() {
    return this.getData().points;
  }

  setItem(key, value) {
    const store = this.getData();
    store.points[key] = value;

    this.setData(store);
  }

  removeItem(key) {
    const store = this.getData();
    delete store.points[key];

    this.setData(store);
  }
}

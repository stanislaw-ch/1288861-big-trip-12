export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getPointsItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)).pointsItems || {};
    } catch (err) {
      return {};
    }
  }

  getOffersItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)).offersItems || {};
    } catch (err) {
      return {};
    }
  }

  getDestinationsItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)).destinationsItems || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }

  setStaticDataByKey(key, data) {
    this._storage.setItem(
        key,
        JSON.stringify(data)
    );
  }

  getStaticDataByKey(key) {
    try {
      return JSON.parse(this._storage.getItem(key)) || [];
    } catch (err) {
      return [];
    }
  }
}

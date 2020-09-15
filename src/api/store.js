// const STORAGE_KEY = `BIG_TRIP`;
export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }


  // getData() {
  //   try {
  //     return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  //   } catch (err) {
  //     return {};
  //   }
  // }

  // setData(data) {
  //   this._storeKey.setItem(STORAGE_KEY, JSON.stringify(data));
  // }

  getPointsItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getOffersItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getDestinationsItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setOffersItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  setDestinationsItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  setPointsItems(items) {
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
}

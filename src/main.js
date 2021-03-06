import SiteMenuPresenter from "./presenter/site-menu.js";
import TripPresenter from "./presenter/trip-presenter.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import SiteMenuModel from "./model/site-menu.js";
import DestinationsModel from "./model/destinations.js";
import {UpdateType} from "./const.js";
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic oovigizsskoktddjjhg`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteBoard = siteMainElement.querySelector(`.trip-events`);
const siteControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteFilterElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const siteMenuModel = new SiteMenuModel();

const siteMenuPresenter = new SiteMenuPresenter(
    siteControlsElement,
    siteMenuModel
);
const filterPresenter = new FilterPresenter(
    siteFilterElement,
    filterModel,
    pointsModel
);
const tripPresenter = new TripPresenter(
    siteBoard,
    offersModel,
    pointsModel,
    filterModel,
    destinationsModel,
    siteMenuModel,
    apiWithProvider);

siteMenuPresenter.init();
filterPresenter.init();
tripPresenter.init();

apiWithProvider.getOffers()
.then((offers) => {
  offersModel.setOffers(offers);
})
.catch(() => {
  offersModel.setOffers([]);
});

apiWithProvider.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

apiWithProvider.getDestinations()
  .then((destination) => {
    destinationsModel.setDestinations(destination);
  })
  .catch(() => {
    destinationsModel.setDestinations([]);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

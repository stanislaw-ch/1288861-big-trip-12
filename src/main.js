import SiteMenuPresenter from "./presenter/site-menu.js";
import TripPresenter from "./presenter/trip-board.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import SiteMenuModel from "./model/site-menu.js";
import DestinationModel from "./model/destination.js";
import {UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic oo1iu2ygf`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteBoard = siteMainElement.querySelector(`.trip-events`);
const siteControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteFilter = siteHeaderElement.querySelector(`.trip-main__trip-controls`);

const api = new Api(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationModel = new DestinationModel();
const siteMenuModel = new SiteMenuModel();

const siteMenuPresenter = new SiteMenuPresenter(
    siteControlsElement,
    siteMenuModel
);
const filterPresenter = new FilterPresenter(
    siteFilter,
    filterModel,
    pointsModel
);
const tripPresenter = new TripPresenter(
    siteBoard,
    offersModel,
    pointsModel,
    filterModel,
    destinationModel,
    siteMenuModel,
    api);

siteMenuPresenter.init();
filterPresenter.init();
tripPresenter.init();

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);

    api.getPoints()
      .then((points) => {
        pointsModel.setPoints(UpdateType.INIT, points);
      });
    // .catch(() => {
    //   pointsModel.setPoints(UpdateType.INIT, []);
    // });

  });
// .catch(() => {
//   offersModel.setOffers([]);
// });

api.getDestination()
  .then((destination) => {
    destinationModel.setDestination(destination);
  });
// .catch(() => {
//   destinationModel.setDestination([]);
// });


import SiteMenuView from "../view/site-menu.js";
import FilterView from "../view/trip-filter.js";
import TripNewButton from "../view/new-trip-btn.js";
import {render, RenderPosition} from "../utils/render.js";
import {MenuItem} from "../const.js";

const {BEFOREEND} = RenderPosition;

export default class SiteMenuPresenter {
  constructor(siteMenuContainer, siteMenuModel) {
    this._siteMenuContainer = siteMenuContainer;
    this._siteMenuModel = siteMenuModel;

    this._siteMenuComponent = new SiteMenuView();
    this._filterComponent = new FilterView();
    this._newTripBtnComponent = new TripNewButton();

    this._handleSiteMenuChange = this._handleSiteMenuChange.bind(this);
    this._handleNewEventBtnClick = this._handleNewEventBtnClick.bind(this);
  }

  init() {
    this._renderSiteMenu();
    this._renderNewEventBtn();

    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuChange);
    this._newTripBtnComponent.setClickHandler(this._handleNewEventBtnClick);
  }

  _handleSiteMenuChange(menuItem) {
    this._currentMenuItem = this._siteMenuModel.getMenuItem();
    if (this._currentMenuItem === menuItem || menuItem === undefined) {
      return;
    }

    this._siteMenuComponent.getElement()
      .querySelector(`[data-type="${this._currentMenuItem}"]`)
      .classList.remove(`trip-tabs__btn--active`);

    this._siteMenuComponent.getElement()
      .querySelector(`[data-type="${menuItem}"]`)
      .classList.add(`trip-tabs__btn--active`);

    this._siteMenuModel.setMenuItem(menuItem);
    this._newTripBtnComponent.getElement().disabled = false;
  }

  _handleNewEventBtnClick() {
    this._currentMenuItem = this._siteMenuModel.getMenuItem();

    if (this._currentMenuItem === MenuItem.STATISTICS) {
      this._siteMenuComponent.getElement()
      .querySelector(`[data-type="${MenuItem.STATISTICS}"]`)
      .classList.remove(`trip-tabs__btn--active`);

      this._siteMenuComponent.getElement()
        .querySelector(`[data-type="${MenuItem.TABLE}"]`)
        .classList.add(`trip-tabs__btn--active`);
    }

    this._newTripBtnComponent.getElement().disabled = true;

    this._siteMenuModel.setMenuItem(MenuItem.ADD_NEW_EVENT);
  }

  _renderSiteMenu() {
    render(this._siteMenuContainer, this._siteMenuComponent, BEFOREEND);
  }

  _renderNewEventBtn() {
    const tripMainElement = document.querySelector(`.trip-main`);

    render(tripMainElement, this._newTripBtnComponent, BEFOREEND);
  }
}

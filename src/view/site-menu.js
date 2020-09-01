import Abstract from "./abstract.js";
import {MenuItem} from "../const.js";

export const createSiteMenuTemplate = (currentMenuType) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a
          class="trip-tabs__btn ${currentMenuType === MenuItem.TABLE ? `trip-tabs__btn--active` : ``}"
          data-menu-item="${MenuItem.TABLE}"
          href="#">
          Table
      </a>
      <a
          class="trip-tabs__btn ${currentMenuType === MenuItem.STATISTICS ? `trip-tabs__btn--active` : ``}"
          data-menu-item="${MenuItem.STATISTICS}"
          href="#">
          Stats
      </a>
    </nav>`;
};


export default class SiteMenu extends Abstract {
  constructor(currentMenuType) {
    super();

    this._currentMenuType = currentMenuType;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._currentMenuType);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    // if (this._currentMenuType === evt.target.dataset.menuItem) {
    //   return;
    // }
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}

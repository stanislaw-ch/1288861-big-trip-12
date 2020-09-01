// import Abstract from "./abstract.js";
// import {MenuItem} from "../const.js";

// export const createTripAddButtonTemplate = () => {
//   return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" data-menu-item="${MenuItem.ADD_NEW_EVENT}">New event</button>`;
// };

// export default class TripAddButton extends Abstract {
//   getTemplate() {
//     return createTripAddButtonTemplate();
//   }

//   _buttonClickHandler(evt) {
//     evt.preventDefault();
//     this._callback.buttonClick(evt.target.dataset.menuItem);
//   }

//   setAddButtonHandler(callback) {
//     this._callback.buttonClick = callback;
//     this.getElement().addEventListener(`click`, this._buttonClickHandler);
//   }
// }

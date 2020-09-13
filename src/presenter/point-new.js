import PointAdd from "../view/trip-add.js";
import TripDayContainer from "../view/trip-day-container.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNewPresenter {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointAddComponent = null;
    this._destroyCallback = null;
    this._dayComponent = new TripDayContainer();

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback, offers, destination) {
    this._destroyCallback = callback;

    if (this._pointAddComponent !== null) {
      return;
    }

    this._pointAddComponent = new PointAdd(this._destroyCallback, offers, destination);
    this._pointAddComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointAddComponent.setCancelClickHandler(this._handleCancelClick);

    render(this._pointListContainer, this._dayComponent, RenderPosition.AFTERBEGIN);
    const dayPoint = this._dayComponent.getElement().querySelector(`.trip-events__list`);
    render(dayPoint, this._pointAddComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointAddComponent === null) {
      return;
    }

    document.querySelector(`.trip-main__event-add-btn`)
    .disabled = false;

    remove(this._pointAddComponent);
    this._pointAddComponent.removeElement();
    this._pointAddComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._pointAddComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointAddComponent.updateData({
        isDisabled: false,
        isSaving: false
      });
    };

    this._pointAddComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

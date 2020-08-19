import Abstract from "./abstract.js";

export const createTripBoardTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class TripBoard extends Abstract {
  getTemplate() {
    return createTripBoardTemplate();
  }
}

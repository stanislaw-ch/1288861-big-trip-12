import {getRandomInteger} from "../utils.js";
import {getRandomFloat} from "../utils.js";

const MSEC_IN_WEEK = 1000 * 3600 * 24 * 7;

const generateDescription = () => {
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
     sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed
     sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum
     ac purus sit amet tempus.`,
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateDestinations = () => {
  const destination = [
    `Amsterdam`,
    `Geneva`,
    `Chamonix`,
    `Saint Petersburg`
  ];

  const randomIndex = getRandomInteger(0, destination.length - 1);

  return destination[randomIndex];
};

const generateTypes = () => {
  const eventsTypes = [
    {type: `Taxi`, category: `Transfer`},
    {type: `Bus`, category: `Transfer`},
    {type: `Train`, category: `Transfer`},
    {type: `Ship`, category: `Transfer`},
  ];

  const randomIndex = getRandomInteger(0, eventsTypes.length - 1);

  return eventsTypes[randomIndex];
};

const photosArr = [
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
];

const offersArr = [
  {
    title: `Add luggage`,
    type: `luggage`,
    price: 30
  },
  {
    title: `Switch to comfort class`,
    type: `comfort`,
    price: 100
  },
  {
    title: `Add meal`,
    type: `meal`,
    price: 15
  },
  {
    title: `Choose seats`,
    type: `seats`,
    price: 5
  },
  {
    title: `Travel by train`,
    type: `train`,
    price: 40
  },
  {
    title: `Order Uber`,
    type: `uber`,
    price: 20
  }
];
const currDate = new Date();
const currPointInTime = currDate.getTime();

export const generateTripPoint = () => {
  const startTimestamp = getRandomFloat(currPointInTime - MSEC_IN_WEEK, currPointInTime + MSEC_IN_WEEK);
  return {
    eventsTypes: generateTypes(),
    destination: generateDestinations(),
    time: {
      startTime: new Date(startTimestamp),
      endTime: new Date(startTimestamp + getRandomFloat(0, MSEC_IN_WEEK)),
    },
    price: getRandomFloat(0, 200),
    offers: offersArr.slice(getRandomFloat(0, 3), getRandomFloat(4, 5)),
    description: generateDescription(),
    photos: photosArr.slice(getRandomInteger(0, 1), getRandomInteger(0, 5))
  };
};

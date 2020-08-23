/**
 * Возвращает случайное число
 * @param {number} from
 * @param {number} to
 *
 * @return {number}
 */
export const getRandomInteger = (from = 0, to = 1) => {
  const lower = Math.ceil(Math.min(from, to));
  const upper = Math.floor(Math.max(from, to));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * Возвращает случайное число в заданном диапозоне
 * @param {number} min
 * @param {number} max
 *
 * @return {number} randNumber
 */
export const getRandomFloat = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

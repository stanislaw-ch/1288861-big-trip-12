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

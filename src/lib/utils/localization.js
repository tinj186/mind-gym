import { CONTEXT_TIERS } from './variable-bank';

/**
 * Returns a random Singaporean context (name, setting, and topical items).
 * @param {string} category - 'food' for food items, any other string for general items.
 * @param {string} levelTier - 'LOWER_BLOCK', 'MIDDLE_BLOCK', or 'UPPER_BLOCK'. Defaults to 'LOWER_BLOCK'.
 * @returns {object} An object containing a random name, setting, and an array of items.
 */
export function getRandomContext(category, levelTier = 'LOWER_BLOCK') {
  const tier = CONTEXT_TIERS[levelTier] || CONTEXT_TIERS.LOWER_BLOCK;
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const name = getRandomElement(tier.NAMES);
  const setting = getRandomElement(tier.SETTINGS);

  let selectedItemPool = tier.GENERAL;
  if (String(category).toLowerCase() === 'food') {
    selectedItemPool = tier.FOOD;
  }

  // Select a random number of items (e.g., 2 to 4)
  const numItems = Math.min(selectedItemPool.length, Math.floor(Math.random() * 3) + 2);
  const items = [];
  const usedIndices = new Set();

  while (items.length < numItems) {
    const index = Math.floor(Math.random() * selectedItemPool.length);
    if (!usedIndices.has(index)) {
      items.push(selectedItemPool[index]);
      usedIndices.add(index);
    }
  }

  return { name, setting, items };
}
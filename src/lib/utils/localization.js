const NAMES = ['Siti', 'Muthu', 'Wei Ling', 'Ahmad', 'Ravi', 'Jun Jie', 'Mei Ling', 'Fatimah', 'Deepak', 'Kumar'];
const SETTINGS = ['HDB void deck', 'hawker centre', 'MRT station', 'school canteen', 'East Coast Park', 'wet market', 'community club'];
const GENERAL_ITEMS = ['stickers', 'marbles', 'ang pows', 'erasers', 'pencils', 'magnets'];
const FOOD_ITEMS = ['curry puffs', 'satay sticks', 'kueh lapis', 'mangosteens', 'dumplings', 'fishballs'];

/**
 * Returns a random Singaporean context (name, setting, and topical items).
 * @param {string} category - 'food' for food items, any other string for general items.
 * @returns {object} An object containing a random name, setting, and an array of items.
 */
export function getRandomContext(category) {
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const name = getRandomElement(NAMES);
  const setting = getRandomElement(SETTINGS);

  let selectedItemPool = GENERAL_ITEMS;
  if (category === 'food') {
    selectedItemPool = FOOD_ITEMS;
  }

  // Select a random number of items (e.g., 2 to 4)
  const numItems = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 items
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
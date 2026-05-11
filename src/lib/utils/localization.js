const CONTEXT_TIERS = {
  LOWER_BLOCK: { // P1-P2: Familiar and tangible
    NAMES: ['Siti', 'Ali', 'Mei Ling', 'Muthu', 'Ahmad', 'Wei Ling'],
    SETTINGS: ['playground', 'HDB void deck', 'school canteen', 'East Coast Park'],
    GENERAL: [
      { item: 'stickers', icon: '⭐' },
      { item: 'marbles', icon: '🔮' },
      { item: 'erasers', icon: '🧽' },
      { item: 'pencils', icon: '✏️' },
      { item: 'magnets', icon: '🧲' }
    ],
    FOOD: [
      { item: 'curry puffs', icon: '🥟' },
      { item: 'satay sticks', icon: '🍢' },
      { item: 'kueh lapis', icon: '🍰' },
      { item: 'fishballs', icon: '🍡' }
    ]
  },
  MIDDLE_BLOCK: { // P3-P4: Broader community settings
    NAMES: ['Ravi', 'Jun Jie', 'Fatimah', 'Deepak', 'Kumar', 'Grace'],
    SETTINGS: ['MRT station', 'wet market', 'community club', 'public library', 'Science Centre'],
    GENERAL: [
      { item: 'ang pows', icon: '🧧' },
      { item: 'storybooks', icon: '📚' },
      { item: 'game cards', icon: '🃏' },
      { item: 'bottles', icon: '🧴' }
    ],
    FOOD: [
      { item: 'mangosteens', icon: '🍎' },
      { item: 'dumplings', icon: '🥟' },
      { item: 'durians', icon: '🍈' }
    ]
  },
  UPPER_BLOCK: { // P5-P6: Professional/Abstract
    NAMES: ['Mr. Lim', 'Mrs. Teo', 'Manager Kumar', 'Officer Ravi', 'Dr. Siti'],
    SETTINGS: ['Changi Business Park', 'PSA Port', 'Jurong Island', 'Stock Exchange', 'Warehouse'],
    GENERAL: [
      { item: 'vouchers', icon: '🎫' },
      { item: 'shipping containers', icon: '📦' },
      { item: 'investment shares', icon: '📈' },
      { item: 'parcels', icon: '📦' }
    ],
    FOOD: [
      { item: 'mooncakes', icon: '🥮' },
      { item: 'bento sets', icon: '🍱' }
    ]
  }
};

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
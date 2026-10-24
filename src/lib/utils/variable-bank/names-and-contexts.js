/**
 * variable-bank.js
 * 
 * A centralized repository for all syllabus-related variables, themes, items, and names.
 * This prevents hardcoding strings across different generation files and makes updates easier.
 */

// ----------------------------------------------------------------------------
/**
 * Helper to ensure a single item is returned as an array for standard API design,
 * while using a Proxy to maintain backward compatibility with legacy variant code 
 * that expects a string primitive or single object.
 */
export const makeCompatibleArray = (singleItem) => {
  const arr = [singleItem];
  return new Proxy(arr, {
    get(target, prop) {
      if (prop === 'length' || (typeof prop === 'string' && !isNaN(Number(prop)))) {
        return target[prop];
      }
      if (typeof target[prop] === 'function' && prop !== 'toString' && prop !== 'valueOf') {
        return target[prop].bind(target);
      }
      if (singleItem == null) return target[prop];
      const itemVal = singleItem[prop];
      if (typeof itemVal === 'function') {
        return itemVal.bind(singleItem);
      }
      return itemVal !== undefined ? itemVal : target[prop];
    }
  });
};

export const CONTEXT_TIERS = {
  LOWER_BLOCK: { // P1-P2: Familiar and tangible
    NAMES: [
      'Siti', 'Ali', 'Mei Ling', 'Muthu', 'Ahmad', 'Wei Ling',
      // New names added below to reach 20
      'Ramasamy', 'Fatima', 'Jia Hao', 'Sarah', 'Kumar', 'Zhi Xuan',
      'Danial', 'Chloe', 'Farhan', 'Shanti', 'Ryan', 'Nurul',
      'Min Jie', 'Arjun'
    ],
    SETTINGS: [
      'playground', 'HDB void deck', 'school canteen', 'East Coast Park',
      // New settings added below to reach 20
      'classroom', 'school field', 'public library', 'indoor sports hall',
      'community club', 'neighbourhood park', 'student care centre', 'science lab',
      'computer room', 'art classroom', 'bus interchange', 'MRT station',
      'hawker centre', 'shopping mall', 'rooftop garden', 'eco-garden'
    ],
    GENERAL: [
      { item: 'pencils', icon: '✏️' },
      { item: 'paper clips', icon: '📎' },
      { item: 'straight rulers', icon: '📏' },
      { item: 'scissors', icon: '✂️' },
      { item: 'crayons', icon: '🖍️' },
      { item: 'paint palettes', icon: '🎨' },
      { item: 'magnets', icon: '🧲' },
      { item: 'books', icon: '📚' },
      { item: 'backpacks', icon: '🎒' },
      { item: 'name badges', icon: '📛' },
      { item: 'yo-yos', icon: '🪀' },
      { item: 'kites', icon: '🪁' },
      { item: 'teddy bears', icon: '🧸' },
      { item: 'puzzle pieces', icon: '🧩' },
      { item: 'cards', icon: '🃏' },
      { item: 'game dice', icon: '🎲' },
      { item: 'admission tickets', icon: '🎟️' },
      { item: 'coins', icon: '🪙' },
      { item: 'keys', icon: '🔑' },
      { item: 'stars', icon: '⭐' }
    ],
    FOOD: [
      { item: 'curry puff', icon: '🥟' },
      { item: 'satay sticks', icon: '🍢' },
      { item: 'cake slices', icon: '🍰' },
      { item: 'fishball stick', icon: '🍡' },
      { item: 'bread', icon: '🍞' },
      { item: 'coffee', icon: '☕' },
      { item: 'candies', icon: '🍬' },
      { item: 'ice kachang', icon: '🍧' },
      { item: 'pineapples', icon: '🍍' },
      { item: 'juice boxes', icon: '🧃' },
      { item: 'glasses of milk', icon: '🥛' },
      { item: 'croissants', icon: '🥐' },
      { item: 'coconuts', icon: '🥥' },
      { item: 'doughnuts', icon: '🍩' },
      { item: 'takeout boxes', icon: '🥡' },
      { item: 'drum sticks', icon: '🍗' },
      { item: 'porridge', icon: '🥣' },
      { item: 'pancakes', icon: '🥞' },
      { item: 'waffles', icon: '🧇' },
      { item: 'kaya toast', icon: '🥪' }
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


// 1. NAMES
// ----------------------------------------------------------------------------
export const NAMES_POOL = [
  ...CONTEXT_TIERS.LOWER_BLOCK.NAMES,
  ...CONTEXT_TIERS.MIDDLE_BLOCK.NAMES,
  ...CONTEXT_TIERS.UPPER_BLOCK.NAMES
];

export const getRandomNames = (count = 1) => {
  const shuffled = [...NAMES_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomLocations = (count = 1) => {
  const shuffled = [...CONTEXT_TIERS.LOWER_BLOCK.SETTINGS].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomCountableItems = (count = 1) => {
  const pool = [
    ...CONTEXT_TIERS.LOWER_BLOCK.GENERAL,
    ...CONTEXT_TIERS.MIDDLE_BLOCK.GENERAL,
    ...CONTEXT_TIERS.UPPER_BLOCK.GENERAL,
    ...CONTEXT_TIERS.LOWER_BLOCK.FOOD,
    ...CONTEXT_TIERS.MIDDLE_BLOCK.FOOD,
    ...CONTEXT_TIERS.UPPER_BLOCK.FOOD
  ];
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getPackingAndShoppingItems = (count = 1) => {
  const pool = [
    // Localized & Food Items
    { item: 'ang pows', icon: '🧧' }, { item: 'satay sticks', icon: '🍢' }, { item: 'curry puffs', icon: '🥟' },
    { item: 'fishball sticks', icon: '🍡' }, { item: 'mooncakes', icon: '🥮' }, { item: 'bento sets', icon: '🍱' },
    { item: 'dumplings', icon: '🥟' }, { item: 'kueh lapis', icon: '🍰' }, { item: 'roti prata', icon: '🥞' },
    { item: 'mangosteens', icon: '🍎' }, { item: 'durians', icon: '🍈' }, { item: 'pineapples', icon: '🍍' },
    { item: 'croissants', icon: '🥐' }, { item: 'coconuts', icon: '🥥' }, { item: 'doughnuts', icon: '🍩' },
    { item: 'drum sticks', icon: '🍗' }, { item: 'pancakes', icon: '🥞' }, { item: 'waffles', icon: '🧇' },
    { item: 'kaya toasts', icon: '🥪' }, { item: 'cake slices', icon: '🍰' }, { item: 'loaves of bread', icon: '🍞' },
    { item: 'burgers', icon: '🍔' }, { item: 'pizzas', icon: '🍕' }, { item: 'cookies', icon: '🍪' },
    { item: 'strawberries', icon: '🍓' }, { item: 'grapes', icon: '🍇' }, { item: 'bananas', icon: '🍌' },
    { item: 'cherries', icon: '🍒' }, { item: 'ice creams', icon: '🍦' },
    
    // School, Toys & Stationary
    { item: 'storybooks', icon: '📚' }, { item: 'game cards', icon: '🃏' }, { item: 'teddy bears', icon: '🧸' },
    { item: 'pencils', icon: '✏️' }, { item: 'erasers', icon: '🧽' }, { item: 'stickers', icon: '🌟' },
    { item: 'keychains', icon: '🔑' }, { item: 'toy cars', icon: '🚗' }, { item: 'marbles', icon: '🪩' },
    { item: 'notebooks', icon: '📓' }, { item: 'paper clips', icon: '📎' }, { item: 'straight rulers', icon: '📏' },
    { item: 'scissors', icon: '✂️' }, { item: 'crayons', icon: '🖍️' }, { item: 'paint palettes', icon: '🎨' },
    { item: 'magnets', icon: '🧲' }, { item: 'backpacks', icon: '🎒' }, { item: 'name badges', icon: '📛' },
    { item: 'yo-yos', icon: '🪀' }, { item: 'kites', icon: '🪁' }, { item: 'puzzle pieces', icon: '🧩' },
    { item: 'game dice', icon: '🎲' }, { item: 'admission tickets', icon: '🎟️' }, { item: 'coins', icon: '🪙' },
    { item: 'balls', icon: '⚽' }, { item: 'robots', icon: '🤖' }, { item: 'toy trains', icon: '🚂' },
    
    // Clothing & Accessories
    { item: 'shirts', icon: '👕' }, { item: 'shoes', icon: '👞' }, { item: 'hats', icon: '🎩' },
    { item: 'socks', icon: '🧦' }, { item: 'pants', icon: '👖' }, { item: 'dresses', icon: '👗' },
    { item: 'rings', icon: '💍' }, { item: 'crowns', icon: '👑' }, { item: 'diamonds', icon: '💎' },
    { item: 'watches', icon: '⌚' }, { item: 'sunglasses', icon: '🕶️' }, { item: 'umbrellas', icon: '☂️' },
    
    // General Objects & Party
    { item: 'balloons', icon: '🎈' }, { item: 'candies', icon: '🍬' }, { item: 'presents', icon: '🎁' },
    { item: 'bottles', icon: '🧴' }, { item: 'vouchers', icon: '🎫' }, { item: 'shipping containers', icon: '📦' },
    { item: 'parcels', icon: '📦' }, { item: 'clocks', icon: '🕰️' }, { item: 'phones', icon: '📱' },
    { item: 'computers', icon: '💻' }, { item: 'stars', icon: '⭐' }, { item: 'cups', icon: '☕' },
    
    // Nature & Animals (As toys or figurines to pack)
    { item: 'toy cats', icon: '🐱' }, { item: 'toy dogs', icon: '🐶' }, { item: 'toy rabbits', icon: '🐰' },
    { item: 'potted plants', icon: '🪴' }, { item: 'flowers', icon: '🌸' }, { item: 'leaves', icon: '🍃' },
    { item: 'toy butterflies', icon: '🦋' }, { item: 'toy birds', icon: '🐦' }, { item: 'toy fish', icon: '🐟' },
    { item: 'sunflowers', icon: '🌻' }, { item: 'mushrooms', icon: '🍄' }, { item: 'cactuses', icon: '🌵' }
  ];
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};


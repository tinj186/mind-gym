/**
 * variable-bank.js
 * 
 * A centralized repository for all syllabus-related variables, themes, items, and names.
 * This prevents hardcoding strings across different generation files and makes updates easier.
 */

// ----------------------------------------------------------------------------
export const CONTEXT_TIERS = {
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


// 1. NAMES
// ----------------------------------------------------------------------------
export const NAMES_POOL = [
  ...CONTEXT_TIERS.LOWER_BLOCK.NAMES,
  ...CONTEXT_TIERS.MIDDLE_BLOCK.NAMES,
  ...CONTEXT_TIERS.UPPER_BLOCK.NAMES
];

export const getRandomNames = (count = 1) => {
  const shuffled = [...NAMES_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

// ----------------------------------------------------------------------------
// 2. PICTURE GRAPH THEMES
// ----------------------------------------------------------------------------
export const PICTURE_GRAPH_THEMES = [
  { name: "fruits", items: ["Apple", "Banana", "Orange", "Grape", "Mango", "Pear"], emojis: ["🍎", "🍌", "🍊", "🍇", "🥭", "🍐"] },
  { name: "toys", items: ["Car", "Doll", "Ball", "Robot", "Train", "Kite"], emojis: ["🚗", "🧸", "⚽", "🤖", "🚂", "🪁"] },
  { name: "pets", items: ["Dog", "Cat", "Fish", "Bird", "Hamster", "Rabbit"], emojis: ["🐶", "🐱", "🐠", "🐦", "🐹", "🐰"] },
  { name: "vegetables", items: ["Carrot", "Broccoli", "Corn", "Pea", "Tomato", "Mushroom"], emojis: ["🥕", "🥦", "🌽", "🫛", "🍅", "🍄"] }
];

export const getRandomTheme = (itemCount = 4) => {
  const selectedTheme = PICTURE_GRAPH_THEMES[Math.floor(Math.random() * PICTURE_GRAPH_THEMES.length)];
  const itemIndices = [...Array(selectedTheme.items.length).keys()].sort(() => 0.5 - Math.random()).slice(0, itemCount);
  
  return {
    name: selectedTheme.name,
    items: itemIndices.map(i => selectedTheme.items[i]),
    emojis: itemIndices.map(i => selectedTheme.emojis[i])
  };
};

export const getFullTheme = () => {
  return PICTURE_GRAPH_THEMES[Math.floor(Math.random() * PICTURE_GRAPH_THEMES.length)];
};

// ----------------------------------------------------------------------------
// 3. MEASUREMENT (LENGTH & HEIGHT)
// ----------------------------------------------------------------------------
export const LENGTH_ITEMS_POOL = [
  "cutter", "highlighter", "pen", "pencil", "usbdrive", "paperclip"
];

export const HEIGHT_SUBJECTS_POOL = [
  "tree", "giraffe", "building", "boy", "ladder", "lamp-post", 
  "bookshelf", "door", "flagpole"
];

export const getRandomLengthItems = (count = 1) => {
  const shuffled = [...LENGTH_ITEMS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

export const getRandomHeightSubjects = (count = 1) => {
  const shuffled = [...HEIGHT_SUBJECTS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

// ----------------------------------------------------------------------------
// 4. GEOMETRY (SHAPES, COLORS, SUBJECTS)
// ----------------------------------------------------------------------------
export const SHAPES_POOL = ["circle", "triangle", "square", "rectangle", "half circle", "quarter circle"];
export const COLORS_POOL = ["red", "blue", "yellow", "green", "purple", "orange"];
export const SIZES_POOL = ["small", "medium", "large"];
export const GEOMETRY_SUBJECTS_POOL = [
  "steam train", "space rocket", "friendly robot", "sailboat on water", 
  "tall castle", "butterfly", "racecar", "snowman", "house with a tree", 
  "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"
];

export const getRandomShapes = (count = 1) => {
  const shuffled = [...SHAPES_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

export const getRandomColors = (count = 1) => {
  const shuffled = [...COLORS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

export const getRandomGeometrySubjects = (count = 1) => {
  const shuffled = [...GEOMETRY_SUBJECTS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

export const getSizesPool = () => [...SIZES_POOL];

// ----------------------------------------------------------------------------
// 5. WHOLE NUMBERS (WORDS & ORDINALS)
// ----------------------------------------------------------------------------
export const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", 
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", 
  "seventeen", "eighteen", "nineteen", "twenty"
];

export const ORDINAL_WORDS = [
  "first", "second", "third", "fourth", "fifth", "sixth", 
  "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"
];

export const getNumberWord = (num) => {
  return NUMBER_WORDS[num] || String(num);
};

export const getOrdinalWord = (num) => {
  // num is 1-indexed for ordinals (1 = first)
  return ORDINAL_WORDS[num - 1] || `${num}th`;
};


export const emojiObjects = [
  { name: 'apples', icon: '🍎' }, { name: 'cars', icon: '🚗' }, { name: 'stars', icon: '⭐' }, 
  { name: 'balls', icon: '⚽' }, { name: 'cats', icon: '🐱' }, { name: 'dogs', icon: '🐶' }, 
  { name: 'rabbits', icon: '🐰' }, { name: 'books', icon: '📚' }, { name: 'pencils', icon: '✏️' }, 
  { name: 'trees', icon: '🌳' }, { name: 'flowers', icon: '🌸' }, { name: 'leaves', icon: '🍃' }, 
  { name: 'butterflies', icon: '🦋' }, { name: 'birds', icon: '🐦' }, { name: 'fish', icon: '🐟' }, 
  { name: 'pizzas', icon: '🍕' }, { name: 'burgers', icon: '🍔' }, { name: 'cookies', icon: '🍪' }, 
  { name: 'cakes', icon: '🍰' }, { name: 'candies', icon: '🍬' }, { name: 'balloons', icon: '🎈' }, 
  { name: 'presents', icon: '🎁' }, { name: 'houses', icon: '🏠' }, { name: 'buses', icon: '🚌' }, 
  { name: 'trains', icon: '🚆' }, { name: 'airplanes', icon: '✈️' }, { name: 'boats', icon: '⛵' }, 
  { name: 'clocks', icon: '🕰️' }, { name: 'phones', icon: '📱' }, { name: 'computers', icon: '💻' }, 
  { name: 'keys', icon: '🔑' }, { name: 'umbrellas', icon: '☂️' }, { name: 'sunflowers', icon: '🌻' }, 
  { name: 'strawberries', icon: '🍓' }, { name: 'grapes', icon: '🍇' }, { name: 'bananas', icon: '🍌' }, 
  { name: 'cherries', icon: '🍒' }, { name: 'ice creams', icon: '🍦' }, { name: 'cups', icon: '☕' }, 
  { name: 'hats', icon: '🎩' }, { name: 'shoes', icon: '👞' }, { name: 'socks', icon: '🧦' }, 
  { name: 'shirts', icon: '👕' }, { name: 'pants', icon: '👖' }, { name: 'dresses', icon: '👗' }, 
  { name: 'rings', icon: '💍' }, { name: 'crowns', icon: '👑' }, { name: 'diamonds', icon: '💎' }, 
  { name: 'hearts', icon: '❤️' }, { name: 'stars', icon: '✨' }, { name: 'moons', icon: '🌙' }, 
  { name: 'suns', icon: '☀️' }, { name: 'clouds', icon: '☁️' }, { name: 'snowflakes', icon: '❄️' }, 
  { name: 'fire', icon: '🔥' }, { name: 'water drops', icon: '💧' }, { name: 'leaves', icon: '🍂' }, 
  { name: 'mushrooms', icon: '🍄' }, { name: 'cactuses', icon: '🌵' }, { name: 'palm trees', icon: '🌴' }
];

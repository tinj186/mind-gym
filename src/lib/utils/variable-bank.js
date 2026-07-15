/**
 * variable-bank.js
 * 
 * A centralized repository for all syllabus-related variables, themes, items, and names.
 * This prevents hardcoding strings across different generation files and makes updates easier.
 */

// ----------------------------------------------------------------------------
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
// 3.5 FRACTION DIVISIBLE FOODS
// ----------------------------------------------------------------------------
export const DIVISIBLE_FOODS_POOL = [
  // Original 8
  "pizza",
  "cake",
  "pie",
  "waffle",
  "quiche",
  "tart",
  "chocolate bar",
  "baguette",

  // General easily divisible foods
  "sandwich",
  "pancake",
  "brownie",
  "loaf of bread",
  "omelette",
  "block of cheese",
  "watermelon",
  "sushi roll",
  "lasagna",
  "flatbread",
  "apple",
  "orange",
  "pita bread",
  "garlic bread",
  "jelly",
  "sausage",
  "cucumber",
  "sub sandwich",
  "sponge cake",
  "fudge",
  "cheesecake",
  "cornbread",

  // Singaporean / Asian local divisible foods
  "roti prata",          // Often folded and cut into pieces
  "murtabak",            // Cut into a rectangular grid
  "min jiang kueh",      // Large peanut pancake cut into rectangular slices
  "kaya toast",          // Slices of toast cut in half or quarters
  "pandan waffle",       // Cut into quarters
  "kueh lapis",          // Layer cake, sliced
  "mooncake",            // Traditionally cut into wedges (halves, quarters, eighths)
  "bakkwa",              // Large square sheet cut into smaller pieces
  "roti john",           // Long sandwich cut into segments
  "you tiao",            // Dough fritter split in half or snipped into pieces
  "popiah",              // Long roll cut into segments
  "otah",                // Long strip cut into halves or bite-sized pieces
  "swiss roll",          // Cut into slices
  "agar-agar",           // Tray jelly cut into cubes or diamonds
  "steamed yam cake",    // Made in a round/square tray and cut into pieces
  "pandan cake",         // Chiffon tube cake cut into wedges
  "kueh salat",          // Tray kueh cut into rectangles or diamonds
  "sugee cake",          // Baked in a tin and cut into squares
  "kueh bingka",         // Baked tapioca cake cut into squares
  "kueh talam"           // Layered tray kueh cut into pieces
];

export const getRandomDivisibleFoods = (count = 1) => {
  const shuffled = [...DIVISIBLE_FOODS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

// ----------------------------------------------------------------------------
// 3.6 FRACTION DIVISIBLE OBJECTS (NON-FOOD)
// ----------------------------------------------------------------------------
export const DIVISIBLE_OBJECTS_POOL = [
  // Original 10
  "ribbon",
  "string",
  "wire",
  "rope",
  "plank of wood",
  "sheet of paper",
  "cardboard",
  "piece of cloth",
  "fabric",
  "tape",

  // General continuous materials (Length / Area)
  "yarn",
  "twine",
  "thread",
  "wrapping paper",
  "measuring tape",
  "shoelace",
  "aluminium foil",
  "plastic wrap",
  "bandage",
  "wooden stick",
  "metal pipe",
  "garden hose",
  "rubber tube",
  "party banner",
  "elastic band",
  "skipping rope",
  "kite string",
  "fishing line",
  "strip of leather",
  "craft wire",

  // School and art supplies
  "crepe paper",
  "construction paper",
  "tracing paper",
  "felt sheet",
  "cellophane tape",
  "masking tape",
  "block of clay",
  "roll of playdough",

  // Singaporean / Localized objects
  "raffia string",         // Extremely common in SG for tying items
  "mahjong paper",         // The classic large paper used for SG school projects
  "vanguard sheet",        // Standard thick paper used in SG art classes
  "mounting board",        // Common SG school project material
  "drawing block paper",   // From the standard issue SG school drawing block
  "banana leaf",           // Used for wrapping food, cut into rectangular pieces
  "pandan leaf",           // Often cut into smaller segments for cooking
  "bamboo pole",           // The classic HDB clothes-drying pole
  "satay stick",           // Wooden skewer
  "chopstick",             // Wooden disposable chopstick
  "coconut leaf",          // Woven into ketupat or cut into strips
  "red market string"      // The iconic red plastic string used in wet markets
];

export const getRandomDivisibleObjects = (count = 1) => {
  const shuffled = [...DIVISIBLE_OBJECTS_POOL].sort(() => 0.5 - Math.random());
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

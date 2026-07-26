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
const makeCompatibleArray = (singleItem) => {
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
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomHeightSubjects = (count = 1) => {
  const shuffled = [...HEIGHT_SUBJECTS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
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
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
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
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
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
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomColors = (count = 1) => {
  const shuffled = [...COLORS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomGeometrySubjects = (count = 1) => {
  const shuffled = [...GEOMETRY_SUBJECTS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getSizesPool = () => [...SIZES_POOL];

export const getGramItems = (count = 1) => {
  const gramItems = [
    { item: 'apple', icon: '🍎' },
    { item: 'book', icon: '📖' },
    { item: 'mango', icon: '🥭' },
    { item: 'toy car', icon: '🚙' },
    { item: 'teddy bear', icon: '🧸' },
    { item: 'cake', icon: '🎂' },
    { item: 'cup', icon: '☕' },
    { item: 'shoe', icon: '👞' }
  ];
  const shuffled = [...gramItems].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getKgItems = (count = 1) => {
  const kgItems = [
    { item: 'dog', icon: '🐕' },
    { item: 'cat', icon: '🐈' },
    { item: 'bag of rice', icon: '🍚' },
    { item: 'watermelon', icon: '🍉' },
    { item: 'bicycle', icon: '🚲' },
    { item: 'television', icon: '📺' },
    { item: 'chair', icon: '🪑' },
    { item: 'suitcase', icon: '🧳' }
  ];
  const shuffled = [...kgItems].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getMeasurementAppropriateUnits = (type = null) => {
  let objects = [
    // Original 15
    { name: "length of a pencil", unit: "cm", wrong: "m", val: 15 },
    { name: "length of an eraser", unit: "cm", wrong: "m", val: 4 },
    { name: "height of a door", unit: "m", wrong: "cm", val: 2 },
    { name: "length of a classroom", unit: "m", wrong: "cm", val: 8 },
    { name: "length of a textbook", unit: "cm", wrong: "m", val: 25 },
    { name: "mass of a cat", unit: "kg", wrong: "g", val: 4 },
    { name: "mass of an adult", unit: "kg", wrong: "g", val: 65 },
    { name: "mass of a strawberry", unit: "g", wrong: "kg", val: 15 },
    { name: "mass of a coin", unit: "g", wrong: "kg", val: 5 },
    { name: "mass of a laptop", unit: "kg", wrong: "g", val: 2 },
    { name: "volume of water in a fish tank", unit: "l", wrong: "ml", val: 10 },
    { name: "volume of a juice box", unit: "ml", wrong: "l", val: 250 },
    { name: "volume of a teaspoon of medicine", unit: "ml", wrong: "l", val: 5 },
    { name: "volume of a bucket of water", unit: "l", wrong: "ml", val: 8 },
    { name: "volume of a water bottle", unit: "ml", wrong: "l", val: 500 },

    // New 35
    { name: "height of a Primary 2 student", unit: "cm", wrong: "m", val: 120 },
    { name: "length of a toothbrush", unit: "cm", wrong: "m", val: 18 },
    { name: "height of a flagpole", unit: "m", wrong: "cm", val: 5 },
    { name: "width of a hand", unit: "cm", wrong: "m", val: 7 },
    { name: "length of a skipping rope", unit: "m", wrong: "cm", val: 2 },
    { name: "height of a double-decker bus", unit: "m", wrong: "cm", val: 4 },
    { name: "length of a paperclip", unit: "cm", wrong: "m", val: 3 },
    { name: "length of a swimming pool", unit: "m", wrong: "cm", val: 50 },
    { name: "width of a mobile phone", unit: "cm", wrong: "m", val: 8 },
    { name: "length of a basketball court", unit: "m", wrong: "cm", val: 28 },
    { name: "width of a whiteboard", unit: "m", wrong: "cm", val: 3 },
    { name: "length of a standard ruler", unit: "cm", wrong: "m", val: 15 },

    { name: "mass of an egg", unit: "g", wrong: "kg", val: 50 },
    { name: "mass of a newborn baby", unit: "kg", wrong: "g", val: 3 },
    { name: "mass of a bag of rice", unit: "kg", wrong: "g", val: 5 },
    { name: "mass of a packet of sugar", unit: "kg", wrong: "g", val: 1 },
    { name: "mass of a paperclip", unit: "g", wrong: "kg", val: 1 },
    { name: "mass of a slice of bread", unit: "g", wrong: "kg", val: 30 },
    { name: "mass of a bicycle", unit: "kg", wrong: "g", val: 12 },
    { name: "mass of an apple", unit: "g", wrong: "kg", val: 150 },
    { name: "mass of a hamster", unit: "g", wrong: "kg", val: 120 },
    { name: "mass of a television", unit: "kg", wrong: "g", val: 15 },
    { name: "mass of a bar of soap", unit: "g", wrong: "kg", val: 100 },
    { name: "mass of a dining chair", unit: "kg", wrong: "g", val: 4 },

    { name: "volume of milk in a large carton", unit: "l", wrong: "ml", val: 1 },
    { name: "volume of a mug of hot milo", unit: "ml", wrong: "l", val: 250 },
    { name: "volume of a raindrop", unit: "ml", wrong: "l", val: 1 },
    { name: "volume of a bowl of soup", unit: "ml", wrong: "l", val: 300 },
    { name: "volume of water in a kitchen sink", unit: "l", wrong: "ml", val: 15 },
    { name: "volume of shampoo in a bottle", unit: "ml", wrong: "l", val: 400 },
    { name: "volume of water in a watering can", unit: "l", wrong: "ml", val: 5 },
    { name: "volume of medicine in an eyedropper", unit: "ml", wrong: "l", val: 2 },
    { name: "volume of water in a kettle", unit: "l", wrong: "ml", val: 2 },
    { name: "volume of fuel in a car tank", unit: "l", wrong: "ml", val: 50 },
    { name: "volume of a swimming pool", unit: "l", wrong: "ml", val: 50000 }
  ];

  if (type === 'length') objects = objects.filter(o => o.unit === 'cm' || o.unit === 'm');
  else if (type === 'mass') objects = objects.filter(o => o.unit === 'g' || o.unit === 'kg');
  else if (type === 'volume') objects = objects.filter(o => o.unit === 'ml' || o.unit === 'l');

  const baseObj = objects[Math.floor(Math.random() * objects.length)];

  // Vary the value by up to +/- 10% to create dynamic values
  const variation = (Math.random() * 0.2) - 0.1;
  let newVal = Math.round(baseObj.val * (1 + variation));

  // Ensure it doesn't drop to 0 or change if the base value is very small (like 1 or 2)
  if (baseObj.val <= 2) {
    newVal = baseObj.val;
  }

  return {
    ...baseObj,
    val: newVal
  };
};

export const getMeasurementEstimationPairs = (type = null) => {
  let pairs = [
    // Original 12
    { name: "length of a new pencil", correct: "15 cm", wrong: "15 m" },
    { name: "height of a tree", correct: "5 m", wrong: "5 cm" },
    { name: "length of a car", correct: "4 m", wrong: "4 cm" },
    { name: "thickness of a book", correct: "3 cm", wrong: "3 m" },
    { name: "mass of a watermelon", correct: "3 kg", wrong: "3 g" },
    { name: "mass of a small apple", correct: "100 g", wrong: "100 kg" },
    { name: "mass of a dog", correct: "15 kg", wrong: "15 g" },
    { name: "mass of a feather", correct: "2 g", wrong: "2 kg" },
    { name: "volume of a can of soda", correct: "330 ml", wrong: "330 l" },
    { name: "volume of water in a bathtub", correct: "150 l", wrong: "150 ml" },
    { name: "volume of a coffee cup", correct: "250 ml", wrong: "250 l" },
    { name: "length of a bus", correct: "10 m", wrong: "10 cm" },

    // New 38
    { name: "height of a giraffe", correct: "5 m", wrong: "5 cm" },
    { name: "length of a key", correct: "5 cm", wrong: "5 m" },
    { name: "length of an MRT train cabin", correct: "23 m", wrong: "23 cm" },
    { name: "height of a mug", correct: "10 cm", wrong: "10 m" },
    { name: "length of a fork", correct: "18 cm", wrong: "18 m" },
    { name: "height of an HDB flat door", correct: "2 m", wrong: "2 cm" },
    { name: "length of a crayon", correct: "8 cm", wrong: "8 m" },
    { name: "width of a computer keyboard", correct: "45 cm", wrong: "45 m" },
    { name: "width of a single bed", correct: "1 m", wrong: "1 cm" },
    { name: "length of a thumb", correct: "5 cm", wrong: "5 m" },
    { name: "height of a dining table", correct: "1 m", wrong: "1 cm" },
    { name: "length of a pair of scissors", correct: "15 cm", wrong: "15 m" },

    { name: "mass of a packet of tissue paper", correct: "20 g", wrong: "20 kg" },
    { name: "mass of a whole durian", correct: "2 kg", wrong: "2 g" },
    { name: "mass of a 10-cent coin", correct: "3 g", wrong: "3 kg" },
    { name: "mass of a dictionary", correct: "1 kg", wrong: "1 g" },
    { name: "mass of a chicken", correct: "2 kg", wrong: "2 g" },
    { name: "mass of a tennis ball", correct: "60 g", wrong: "60 kg" },
    { name: "mass of a bowling ball", correct: "5 kg", wrong: "5 g" },
    { name: "mass of a pair of spectacles", correct: "30 g", wrong: "30 kg" },
    { name: "mass of a large sack of rice", correct: "10 kg", wrong: "10 g" },
    { name: "mass of an empty school bag", correct: "1 kg", wrong: "1 g" },
    { name: "mass of a packet of potato chips", correct: "60 g", wrong: "60 kg" },
    { name: "mass of a loaf of bread", correct: "400 g", wrong: "400 kg" },
    { name: "mass of a motorcycle", correct: "150 kg", wrong: "150 g" },

    { name: "volume of a carton of milk", correct: "1 l", wrong: "1 ml" },
    { name: "volume of a bowl of porridge", correct: "400 ml", wrong: "400 l" },
    { name: "capacity of a washing machine", correct: "50 l", wrong: "50 ml" },
    { name: "volume of a standard Yakult bottle", correct: "100 ml", wrong: "100 l" },
    { name: "volume of a large bottle of cooking oil", correct: "2 l", wrong: "2 ml" },
    { name: "volume of a kiddie pool", correct: "200 l", wrong: "200 ml" },
    { name: "volume of a spoon of cough syrup", correct: "10 ml", wrong: "10 l" },
    { name: "volume of a small tube of toothpaste", correct: "50 ml", wrong: "50 l" },
    { name: "volume of a large jug of water", correct: "3 l", wrong: "3 ml" },
    { name: "volume of a bottle of shampoo", correct: "500 ml", wrong: "500 l" },
    { name: "volume of a printer ink cartridge", correct: "15 ml", wrong: "15 l" },
    { name: "volume of a garden fish pond", correct: "1000 l", wrong: "1000 ml" },
    { name: "volume of a bottle of chili sauce", correct: "300 ml", wrong: "300 l" }
  ];

  if (type === 'length') pairs = pairs.filter(p => p.correct.includes('cm') || p.correct.includes('m'));
  else if (type === 'mass') pairs = pairs.filter(p => p.correct.includes('g') || p.correct.includes('kg'));
  else if (type === 'volume') pairs = pairs.filter(p => p.correct.includes('ml') || p.correct.includes('l'));

  return pairs[Math.floor(Math.random() * pairs.length)];
};

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

export const getTimeActivities = (count = 1, isMorning = true) => {
  const morningActivities = [
    { text: "eating breakfast", min: 6, max: 8 },
    { text: "waking up for school", min: 6, max: 7 },
    { text: "having morning assembly", min: 7, max: 8 },
    { text: "going to the market in the morning", min: 8, max: 11 },
    { text: "brushing teeth in the morning", min: 6, max: 7 },
    { text: "waiting for the school bus", min: 6, max: 7 },
    { text: "reading a book in the morning", min: 8, max: 11 },
    { text: "having recess at school", min: 9, max: 11 },
    { text: "attending a math lesson", min: 8, max: 11 },
    { text: "watching a morning cartoon", min: 7, max: 10 },
    { text: "waterings the plants in the morning", min: 7, max: 9 },
    { text: "going for a morning walk", min: 6, max: 9 },
    { text: "packing the school bag", min: 6, max: 7 },
    { text: "eating a morning snack", min: 9, max: 11 },
    { text: "going to swimming class in the morning", min: 8, max: 11 },
    { text: "helping parents with morning chores", min: 8, max: 11 },
    { text: "having a music lesson", min: 9, max: 11 },
    { text: "visiting the library in the morning", min: 10, max: 11 },
    { text: "baking cookies with mom", min: 9, max: 11 },
    { text: "playing with toys before school", min: 6, max: 7 },
    { text: "doing morning exercises", min: 6, max: 8 },
    { text: "feeding the pet dog", min: 6, max: 8 },
    { text: "taking a morning shower", min: 6, max: 8 },
    { text: "walking to school", min: 6, max: 7 },
    { text: "listening to a morning story", min: 8, max: 11 },
    { text: "practicing piano in the morning", min: 9, max: 11 },
    { text: "cleaning the room", min: 8, max: 11 },
    { text: "going for a jog", min: 6, max: 8 },
    { text: "making the bed", min: 6, max: 7 },
    { text: "having a family breakfast", min: 7, max: 8 }
  ];

  const pmActivities = [
    { text: "eating dinner", min: 6, max: 8 },
    { text: "doing homework after school", min: 2, max: 5 },
    { text: "going to sleep at night", min: 8, max: 10 },
    { text: "playing in the park in the afternoon", min: 4, max: 6 },
    { text: "eating a late lunch", min: 1, max: 2 },
    { text: "watching an evening movie", min: 7, max: 9 },
    { text: "taking an afternoon nap", min: 1, max: 3 },
    { text: "having afternoon tea", min: 3, max: 4 },
    { text: "attending tuition class", min: 3, max: 6 },
    { text: "playing football with friends", min: 4, max: 6 },
    { text: "brushing teeth before bed", min: 8, max: 10 },
    { text: "reading a bedtime story", min: 8, max: 9 },
    { text: "taking an evening stroll", min: 6, max: 8 },
    { text: "washing the dishes after dinner", min: 7, max: 9 },
    { text: "having football practice", min: 4, max: 6 },
    { text: "packing the school bag for tomorrow", min: 7, max: 9 },
    { text: "playing board games with family", min: 7, max: 9 },
    { text: "taking out the trash at night", min: 7, max: 9 },
    { text: "feeding the pet cat in the evening", min: 5, max: 7 },
    { text: "coming home from school", min: 1, max: 3 },
    { text: "visiting the playground", min: 4, max: 6 },
    { text: "eating supper", min: 9, max: 10 },
    { text: "chatting with parents after dinner", min: 7, max: 9 },
    { text: "drawing and coloring", min: 2, max: 5 },
    { text: "practicing spelling words", min: 3, max: 6 },
    { text: "watching the sunset", min: 6, max: 7 },
    { text: "cleaning up toys", min: 7, max: 9 },
    { text: "having dinner at a restaurant", min: 6, max: 8 },
    { text: "listening to music in the afternoon", min: 2, max: 5 },
    { text: "getting ready for bed", min: 8, max: 9 }
  ];

  const pool = isMorning ? morningActivities : pmActivities;

  // Shuffle pool to pick count elements
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return makeCompatibleArray(count === 1 ? selected[0] : selected);
};

export const getPairedActivities = () => {
  const pairs = [
    // Original 6
    { main: "lesson", break: "spelling test" },
    { main: "exam", break: "rest break" },
    { main: "movie", break: "intermission" },
    { main: "training", break: "warm-up" },
    { main: "workshop", break: "short recess" },
    { main: "concert", break: "intermission" },

    // School & Academic (12)
    { main: "PE lesson", break: "water break" },
    { main: "school assembly", break: "principal's speech" },
    { main: "math class", break: "mental sums test" },
    { main: "art lesson", break: "clean-up time" },
    { main: "science experiment", break: "safety briefing" },
    { main: "English lesson", break: "silent reading time" },
    { main: "Chinese lesson", break: "spelling quiz" },
    { main: "CCA session", break: "attendance taking" },
    { main: "learning journey", break: "bus ride" },
    { main: "computer lesson", break: "login time" },
    { main: "tuition class", break: "homework marking" },
    { main: "school camp", break: "tent pitching briefing" },

    // Sports & Hobbies (16)
    { main: "swimming lesson", break: "safety drill" },
    { main: "piano lesson", break: "finger warm-up" },
    { main: "ballet class", break: "stretching time" },
    { main: "taekwondo class", break: "cool-down routine" },
    { main: "football match", break: "half-time break" },
    { main: "badminton game", break: "warm-up rally" },
    { main: "coding workshop", break: "screen break" },
    { main: "robotics class", break: "packing up time" },
    { main: "choir practice", break: "vocal warm-up" },
    { main: "band practice", break: "tuning time" },
    { main: "drama rehearsal", break: "costume change" },
    { main: "gymnastics class", break: "mat setup" },
    { main: "chess tournament", break: "rules briefing" },
    { main: "scout meeting", break: "uniform inspection" },
    { main: "cooking class", break: "washing up time" },
    { main: "magic show", break: "volunteer selection" },

    // Family, Leisure & Daily Life (16)
    { main: "birthday party", break: "cake cutting time" },
    { main: "zoo visit", break: "animal feeding show" },
    { main: "library visit", break: "storytelling session" },
    { main: "grocery trip", break: "queueing at the cashier" },
    { main: "baking session", break: "measuring ingredients" },
    { main: "theatre play", break: "stage setup" },
    { main: "hiking trip", break: "snack break" },
    { main: "cycling trip", break: "safety check" },
    { main: "family dinner", break: "waiting for food" },
    { main: "playdate", break: "cleaning up time" },
    { main: "sports day", break: "prize presentation" },
    { main: "bus tour", break: "photo stop" },
    { main: "shopping trip", break: "parking the car" },
    { main: "museum visit", break: "bag check" },
    { main: "field trip", break: "toilet break" },
    { main: "art gallery tour", break: "introductory video" }
  ];
  return pairs[Math.floor(Math.random() * pairs.length)];
};
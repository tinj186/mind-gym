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
// 2b. BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const BAR_GRAPH_THEMES = [
  {
    id: "book_genres",
    title: "Books Borrowed from Library",
    xAxisLabel: "Genre",
    yAxisLabel: "Number of Books",
    items: ["Adventure", "Mystery", "Sci-Fi", "Fantasy", "Comics", "History"],
    unit: "books"
  },
  {
    id: "bakery_pies",
    title: "Pies Sold in a Week",
    xAxisLabel: "Type of Pie",
    yAxisLabel: "Number of Pies",
    items: ["Apple", "Cherry", "Blueberry", "Peach", "Pecan", "Lemon"],
    unit: "pies"
  },
  {
    id: "school_houses",
    title: "Sports Day Points Scored",
    xAxisLabel: "House",
    yAxisLabel: "Points Scored",
    items: ["Red House", "Blue House", "Green House", "Yellow House"],
    unit: "points"
  },
  {
    id: "primary_classes",
    title: "Bottles Recycled by Classes",
    xAxisLabel: "Class",
    yAxisLabel: "Bottles Recycled",
    items: ["Class 3A", "Class 3B", "Class 3C", "Class 3D", "Class 3E"],
    unit: "bottles"
  },
  {
    id: "zoo_visitors",
    title: "Visitors to the Zoo",
    xAxisLabel: "Day",
    yAxisLabel: "Number of Visitors",
    items: ["Friday", "Saturday", "Sunday", "Monday"],
    unit: "visitors"
  },
  {
    id: "favorite_fruits",
    title: "Favorite Fruits Survey",
    xAxisLabel: "Fruit",
    yAxisLabel: "Number of Pupils",
    items: ["Apple", "Banana", "Orange", "Watermelon", "Mango", "Grapes"],
    unit: "pupils"
  },
  {
    id: "game_levels",
    title: "Points Scored in Game",
    xAxisLabel: "Game Level",
    yAxisLabel: "Points",
    items: ["Level 1", "Level 2", "Level 3", "Level 4"],
    unit: "points"
  },
  {
    id: "stationery_stock",
    title: "Notebooks in Stock",
    xAxisLabel: "Type of Notebook",
    yAxisLabel: "Quantity",
    items: ["Lined", "Grid", "Blank", "Dotted", "Music"],
    unit: "notebooks"
  },
  {
    id: "flowers_sold",
    title: "Flowers Sold by Florist",
    xAxisLabel: "Type of Flower",
    yAxisLabel: "Flowers Sold",
    items: ["Roses", "Tulips", "Lilies", "Sunflowers", "Orchids"],
    unit: "flowers"
  },
  {
    id: "sports_club",
    title: "Pupils in Sports Clubs",
    xAxisLabel: "Sport",
    yAxisLabel: "Number of Pupils",
    items: ["Soccer", "Basketball", "Badminton", "Swimming", "Running"],
    unit: "pupils"
  },
  {
    id: "ticket_types",
    title: "Museum Tickets Sold",
    xAxisLabel: "Ticket Type",
    yAxisLabel: "Tickets Sold",
    items: ["Adult", "Child", "Senior", "Student"],
    unit: "tickets"
  },
  {
    id: "recycling_drive",
    title: "Newspapers Collected Over 5 Days",
    xAxisLabel: "Day",
    yAxisLabel: "Newspapers Collected",
    items: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    unit: "newspapers"
  },
  {
    id: "harvest_fields",
    title: "Potatoes Harvested by Field",
    xAxisLabel: "Field",
    yAxisLabel: "Kilograms Harvested",
    items: ["Field A", "Field B", "Field C", "Field D"],
    unit: "kg of potatoes"
  },
  {
    id: "toy_shops",
    title: "Toys Sold by Shops",
    xAxisLabel: "Shop",
    yAxisLabel: "Toys Sold",
    items: ["Shop A", "Shop B", "Shop C", "Shop D", "Shop E"],
    unit: "toys"
  },
  {
    id: "baking_chefs",
    title: "Cupcakes Baked by Friends",
    xAxisLabel: "Baker",
    yAxisLabel: "Cupcakes Baked",
    items: ["Amy", "Betty", "Cindy", "Diana"],
    unit: "cupcakes"
  },
  {
    id: "pens_sold",
    title: "Pens Sold by Stationery Shop",
    xAxisLabel: "Color of Pen",
    yAxisLabel: "Number of Pens Sold",
    items: ["Blue Pens", "Black Pens", "Red Pens", "Green Pens"],
    unit: "pens"
  },
  {
    id: "car_park_colors",
    title: "Cars in a Car Park",
    xAxisLabel: "Color of Car",
    yAxisLabel: "Number of Cars",
    items: ["White", "Silver", "Black", "Red", "Blue"],
    unit: "cars"
  },
  {
    id: "pets_sold",
    title: "Pets Sold at Pet Shop",
    xAxisLabel: "Type of Pet",
    yAxisLabel: "Number of Pets Sold",
    items: ["Cats", "Dogs", "Rabbits", "Hamsters", "Birds"],
    unit: "pets"
  },
  {
    id: "factory_production",
    title: "Toys Produced in Factory",
    xAxisLabel: "Day",
    yAxisLabel: "Number of Toys Produced",
    items: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    unit: "toys"
  },
  {
    id: "sticker_collections",
    title: "Stickers Collected by Classes",
    xAxisLabel: "Class",
    yAxisLabel: "Number of Stickers",
    items: ["Class 3A", "Class 3B", "Class 3C", "Class 3D"],
    unit: "stickers"
  },
  {
    id: "marbles_collected",
    title: "Marbles Collected by Pupils",
    xAxisLabel: "Pupil",
    yAxisLabel: "Number of Marbles",
    items: ["John", "Peter", "David", "Sam", "Lucas"],
    unit: "marbles"
  },
  {
    id: "bakery_buns",
    title: "Buns Sold by Bakery",
    xAxisLabel: "Type of Bun",
    yAxisLabel: "Number of Buns Sold",
    items: ["Chocolate Buns", "Butter Buns", "Kaya Buns", "Cheese Buns"],
    unit: "buns"
  },
  {
    id: "beads_collected",
    title: "Colored Beads in Jar",
    xAxisLabel: "Color of Bead",
    yAxisLabel: "Number of Beads",
    items: ["Red Beads", "Blue Beads", "Green Beads", "Yellow Beads"],
    unit: "beads"
  },
  {
    id: "vegetables_harvested",
    title: "Vegetables Harvested by Farmer",
    xAxisLabel: "Vegetable",
    yAxisLabel: "Number of Vegetables",
    items: ["Carrots", "Potatoes", "Onions", "Cabbages"],
    unit: "vegetables"
  },
  {
    id: "weekly_profits",
    title: "Weekly Profits of Shop",
    xAxisLabel: "Week",
    yAxisLabel: "Profit ($)",
    items: ["Week 1", "Week 2", "Week 3", "Week 4"],
    unit: "dollars"
  },
  {
    id: "game_points",
    title: "Points Scored by Teams",
    xAxisLabel: "Team",
    yAxisLabel: "Points Scored",
    items: ["Team A", "Team B", "Team C", "Team D"],
    unit: "points"
  }
];

export const getRandomBarGraphTheme = (itemCount = 4, specificThemeId = null) => {
  const pool = specificThemeId 
    ? BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));

  return {
    ...selectedTheme,
    items
  };
};

export const BAR_GRAPH_PALETTES = [
  // Vibrant Rainbow
  ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'],
  // Cool Oceana (Teal, Cyan, Blue, Indigo)
  ['#0ea5e9', '#06b6d4', '#3b82f6', '#6366f1', '#14b8a6', '#2563eb'],
  // Sunset Warmth (Amber, Orange, Rose, Coral)
  ['#f59e0b', '#f97316', '#ef4444', '#f43f5e', '#fb923c', '#e11d48'],
  // Emerald Mint (Mint, Emerald, Lime, Green)
  ['#10b981', '#059669', '#84cc16', '#14b8a6', '#22c55e', '#15803d'],
  // Berry Violet (Purple, Violet, Pink, Fuchsia)
  ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#7c3aed', '#c026d3'],
  // Modern Vibrant Contrast
  ['#4f46e5', '#10b981', '#f43f5e', '#eab308', '#0284c7', '#9333ea'],
  // Coral & Sky
  ['#0284c7', '#f43f5e', '#10b981', '#f59e0b', '#6366f1', '#14b8a6']
];

export const getRandomPaletteColors = (count = 4) => {
  const palette = BAR_GRAPH_PALETTES[Math.floor(Math.random() * BAR_GRAPH_PALETTES.length)];
  const shuffled = [...palette].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ----------------------------------------------------------------------------
// 2c. PACKAGING / EXTERNAL MULTIPLIER BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const PACKAGING_BAR_GRAPH_THEMES = [
  {
    id: "trays_baked_goods",
    title: "Trays of Baked Goods Produced",
    xAxisLabel: "Baked Good",
    yAxisLabel: "Number of Trays",
    groupUnit: "trays",
    singularGroup: "tray",
    itemUnit: "tarts",
    singularItem: "tart",
    items: ["Egg Tarts", "Fruit Tarts", "Custard Buns", "Muffins", "Chicken Pies"],
    multiplierPool: [4, 5, 6, 8, 10]
  },
  {
    id: "boxes_fruit",
    title: "Boxes of Fruit Packed",
    xAxisLabel: "Fruit",
    yAxisLabel: "Number of Boxes",
    groupUnit: "boxes",
    singularGroup: "box",
    itemUnit: "fruits",
    singularItem: "fruit",
    items: ["Apples", "Oranges", "Pears", "Peaches", "Kiwis"],
    multiplierPool: [4, 5, 6, 8, 10]
  },
  {
    id: "packets_stationery",
    title: "Packets of Stationery Prepared",
    xAxisLabel: "Stationery",
    yAxisLabel: "Number of Packets",
    groupUnit: "packets",
    singularGroup: "packet",
    itemUnit: "stationery items",
    singularItem: "stationery item",
    items: ["Pencils", "Erasers", "Highlighters", "Rulers", "Sharpeners"],
    multiplierPool: [3, 4, 5, 6, 10]
  },
  {
    id: "bundles_flowers",
    title: "Bundles of Flowers Arranged",
    xAxisLabel: "Type of Flower",
    yAxisLabel: "Number of Bundles",
    groupUnit: "bundles",
    singularGroup: "bundle",
    itemUnit: "flowers",
    singularItem: "flower",
    items: ["Roses", "Tulips", "Lilies", "Sunflowers", "Carnations"],
    multiplierPool: [4, 5, 6, 8, 10]
  },
  {
    id: "bags_sports_balls",
    title: "Bags of Sports Balls Stored",
    xAxisLabel: "Sport",
    yAxisLabel: "Number of Bags",
    groupUnit: "bags",
    singularGroup: "bag",
    itemUnit: "balls",
    singularItem: "ball",
    items: ["Tennis Balls", "Golf Balls", "Shuttlecocks", "Baseballs", "Ping Pong Balls"],
    multiplierPool: [3, 4, 5, 6, 8]
  },
  {
    id: "boxes_cupcakes",
    title: "Boxes of Cupcakes Sold",
    xAxisLabel: "Cupcake Flavor",
    yAxisLabel: "Number of Boxes",
    groupUnit: "boxes",
    singularGroup: "box",
    itemUnit: "cupcakes",
    singularItem: "cupcake",
    items: ["Chocolate", "Vanilla", "Strawberry", "Red Velvet", "Matcha"],
    multiplierPool: [4, 6, 8, 12]
  },
  {
    id: "packs_stickers",
    title: "Packs of Stickers Collected",
    xAxisLabel: "Sticker Theme",
    yAxisLabel: "Number of Packs",
    groupUnit: "packs",
    singularGroup: "pack",
    itemUnit: "stickers",
    singularItem: "sticker",
    items: ["Animals", "Space", "Dinosaurs", "Superheroes", "Ocean Friends"],
    multiplierPool: [5, 6, 8, 10]
  },
  {
    id: "crates_canned_drinks",
    title: "Crates of Canned Drinks Delivered",
    xAxisLabel: "Drink Flavor",
    yAxisLabel: "Number of Crates",
    groupUnit: "crates",
    singularGroup: "crate",
    itemUnit: "cans",
    singularItem: "can",
    items: ["Lemon Tea", "Soya Milk", "Apple Juice", "Green Tea", "Orange Soda"],
    multiplierPool: [6, 8, 10, 12]
  },
  {
    id: "tins_cookies",
    title: "Tins of Cookies Baked",
    xAxisLabel: "Cookie Variety",
    yAxisLabel: "Number of Tins",
    groupUnit: "tins",
    singularGroup: "tin",
    itemUnit: "cookies",
    singularItem: "cookie",
    items: ["Pineapple Tarts", "Chocolate Chip", "Butter Cookies", "Almond Biscotti", "Oatmeal Crunch"],
    multiplierPool: [4, 5, 6, 8, 10]
  },
  {
    id: "jars_sweets",
    title: "Jars of Sweets Stocked",
    xAxisLabel: "Sweet Type",
    yAxisLabel: "Number of Jars",
    groupUnit: "jars",
    singularGroup: "jar",
    itemUnit: "sweets",
    singularItem: "sweet",
    items: ["Gummy Bears", "Jelly Beans", "Lollipops", "Marshmallows", "Mint Drops"],
    multiplierPool: [5, 6, 8, 10]
  },
  {
    id: "boxes_markers",
    title: "Boxes of Colored Markers",
    xAxisLabel: "Color Set",
    yAxisLabel: "Number of Boxes",
    groupUnit: "boxes",
    singularGroup: "box",
    itemUnit: "markers",
    singularItem: "marker",
    items: ["Primary Colors", "Neon Shades", "Pastel Tones", "Earth Colors"],
    multiplierPool: [4, 5, 6, 8, 10]
  },
  {
    id: "cartons_milk",
    title: "Cartons of Milk Donated",
    xAxisLabel: "Flavor",
    yAxisLabel: "Number of Cartons",
    groupUnit: "cartons",
    singularGroup: "carton",
    itemUnit: "milk packets",
    singularItem: "milk packet",
    items: ["Full Cream", "Low Fat", "Chocolate", "Strawberry", "Banana"],
    multiplierPool: [4, 6, 8, 10]
  },
  {
    id: "sets_color_pencils",
    title: "Sets of Color Pencils Prepared",
    xAxisLabel: "Set Type",
    yAxisLabel: "Number of Sets",
    groupUnit: "sets",
    singularGroup: "set",
    itemUnit: "pencils",
    singularItem: "pencil",
    items: ["Classic 12", "Pastel 12", "Watercolor 12", "Metallic 12"],
    multiplierPool: [6, 8, 10, 12]
  },
  {
    id: "packs_figurines",
    title: "Packs of Toy Figurines Assembled",
    xAxisLabel: "Figurine Theme",
    yAxisLabel: "Number of Packs",
    groupUnit: "packs",
    singularGroup: "pack",
    itemUnit: "figurines",
    singularItem: "figurine",
    items: ["Robots", "Dinosaurs", "Knights", "Astronauts"],
    multiplierPool: [3, 4, 5, 6, 8]
  }
];

export const getRandomPackagingTheme = (itemCount = 4, specificThemeId = null) => {
  const pool = specificThemeId 
    ? PACKAGING_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : PACKAGING_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || PACKAGING_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));

  return {
    ...selectedTheme,
    items
  };
};

// ----------------------------------------------------------------------------
// 2d. SUBGROUP / PART-WHOLE BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const SUBGROUP_BAR_GRAPH_THEMES = [
  {
    id: "sports_clubs",
    title: "Pupils in Sports Clubs",
    xAxisLabel: "Sport",
    yAxisLabel: "Number of Pupils",
    unit: "pupils",
    subgroup1: "boys",
    subgroup2: "girls",
    subgroup1Singular: "boy",
    subgroup2Singular: "girl",
    items: ["Soccer", "Basketball", "Badminton", "Swimming", "Running"]
  },
  {
    id: "library_genres",
    title: "Library Books Borrowed",
    xAxisLabel: "Genre",
    yAxisLabel: "Number of Books",
    unit: "books",
    subgroup1: "English books",
    subgroup2: "Mother Tongue books",
    subgroup1Singular: "English book",
    subgroup2Singular: "Mother Tongue book",
    items: ["Adventure", "Mystery", "Science", "Fantasy", "Folktales"]
  },
  {
    id: "attraction_tickets",
    title: "Tickets Sold for Attractions",
    xAxisLabel: "Attraction",
    yAxisLabel: "Tickets Sold",
    unit: "tickets",
    subgroup1: "adult tickets",
    subgroup2: "child tickets",
    subgroup1Singular: "adult ticket",
    subgroup2Singular: "child ticket",
    items: ["Singapore Zoo", "Bird Paradise", "Science Centre", "Night Safari"]
  },
  {
    id: "performing_arts",
    title: "Pupils in Performing Arts CCAs",
    xAxisLabel: "CCA",
    yAxisLabel: "Number of Pupils",
    unit: "pupils",
    subgroup1: "boys",
    subgroup2: "girls",
    subgroup1Singular: "boy",
    subgroup2Singular: "girl",
    items: ["Choir", "Dance", "Drama", "School Band", "Guzheng"]
  },
  {
    id: "canteen_drinks",
    title: "Drinks Ordered at School Canteen",
    xAxisLabel: "Drink",
    yAxisLabel: "Number of Cups",
    unit: "cups",
    subgroup1: "iced drinks",
    subgroup2: "warm drinks",
    subgroup1Singular: "iced drink",
    subgroup2Singular: "warm drink",
    items: ["Milo", "Tea", "Horlicks", "Soya Milk", "Barley Drink"]
  },
  {
    id: "bake_sale_cupcakes",
    title: "Cupcakes Sold at Charity Bake Sale",
    xAxisLabel: "Flavor",
    yAxisLabel: "Number of Cupcakes",
    unit: "cupcakes",
    subgroup1: "large cupcakes",
    subgroup2: "mini cupcakes",
    subgroup1Singular: "large cupcake",
    subgroup2Singular: "mini cupcake",
    items: ["Chocolate", "Vanilla", "Strawberry", "Matcha", "Red Velvet"]
  },
  {
    id: "garden_volunteers",
    title: "Community Garden Volunteers",
    xAxisLabel: "Garden Plot",
    yAxisLabel: "Number of Volunteers",
    unit: "volunteers",
    subgroup1: "adult volunteers",
    subgroup2: "student volunteers",
    subgroup1Singular: "adult volunteer",
    subgroup2Singular: "student volunteer",
    items: ["Plot A", "Plot B", "Plot C", "Plot D"]
  },
  {
    id: "class_storybooks",
    title: "Storybooks Read by Classes",
    xAxisLabel: "Class",
    yAxisLabel: "Storybooks Read",
    unit: "storybooks",
    subgroup1: "fiction books",
    subgroup2: "non-fiction books",
    subgroup1Singular: "fiction book",
    subgroup2Singular: "non-fiction book",
    items: ["Class 3A", "Class 3B", "Class 3C", "Class 3D"]
  },
  {
    id: "charity_shirts",
    title: "T-shirts Donated for Charity",
    xAxisLabel: "Size",
    yAxisLabel: "Number of T-shirts",
    unit: "T-shirts",
    subgroup1: "short-sleeved shirts",
    subgroup2: "long-sleeved shirts",
    subgroup1Singular: "short-sleeved shirt",
    subgroup2Singular: "long-sleeved shirt",
    items: ["Size S", "Size M", "Size L", "Size XL"]
  },
  {
    id: "park_bicycles",
    title: "Bicycles Rented at Coastal Park",
    xAxisLabel: "Day",
    yAxisLabel: "Bicycles Rented",
    unit: "bicycles",
    subgroup1: "adult bicycles",
    subgroup2: "child bicycles",
    subgroup1Singular: "adult bicycle",
    subgroup2Singular: "child bicycle",
    items: ["Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "canned_food_drive",
    title: "Canned Food Collected for Food Bank",
    xAxisLabel: "Type of Canned Food",
    yAxisLabel: "Number of Cans",
    unit: "cans",
    subgroup1: "small cans",
    subgroup2: "large cans",
    subgroup1Singular: "small can",
    subgroup2Singular: "large can",
    items: ["Baked Beans", "Sweet Corn", "Tuna", "Tomato Soup", "Mushroom Soup"]
  },
  {
    id: "science_centre_visitors",
    title: "Visitors to the Science Centre",
    xAxisLabel: "Day",
    yAxisLabel: "Number of Visitors",
    unit: "visitors",
    subgroup1: "adults",
    subgroup2: "children",
    subgroup1Singular: "adult",
    subgroup2Singular: "child",
    items: ["Thursday", "Friday", "Saturday", "Sunday"]
  }
];

export const getRandomSubgroupTheme = (itemCount = 4, specificThemeId = null) => {
  const pool = specificThemeId 
    ? SUBGROUP_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : SUBGROUP_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || SUBGROUP_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));

  return {
    ...selectedTheme,
    items
  };
};

// ----------------------------------------------------------------------------
// 2e. BEFORE & AFTER ADJUSTMENTS BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const BEFORE_AFTER_BAR_GRAPH_THEMES = [
  {
    id: "bakery_pastries",
    title: "Morning Inventory of Pastries",
    xAxisLabel: "Type of Pastry",
    yAxisLabel: "Number of Pastries",
    unit: "pastries",
    items: ["Croissants", "Muffins", "Doughnuts", "Curry Puffs", "Egg Tarts"],
    decreaseAction: "sells",
    decreasePast: "sold",
    increaseAction: "bakes",
    increasePast: "baked",
    location: "bakery"
  },
  {
    id: "stationery_shop",
    title: "Stationery Stock at Bookstore",
    xAxisLabel: "Item",
    yAxisLabel: "Quantity",
    unit: "items",
    items: ["Notebooks", "Pencil Cases", "Rulers", "Highlighters", "Glue Sticks"],
    decreaseAction: "sells",
    decreasePast: "sold",
    increaseAction: "receives",
    increasePast: "received in a new delivery",
    location: "bookstore"
  },
  {
    id: "library_books",
    title: "Books on Library Shelves",
    xAxisLabel: "Genre",
    yAxisLabel: "Number of Books",
    unit: "books",
    items: ["Science", "Mystery", "Adventure", "Comics", "History"],
    decreaseAction: "are borrowed",
    decreasePast: "borrowed",
    increaseAction: "are returned",
    increasePast: "returned to the shelves",
    location: "school library"
  },
  {
    id: "canteen_fruit_stall",
    title: "Morning Stock at Canteen Fruit Stall",
    xAxisLabel: "Fruit",
    yAxisLabel: "Number of Fruits",
    unit: "fruits",
    items: ["Apples", "Oranges", "Pears", "Bananas", "Watermelons"],
    decreaseAction: "sells",
    decreasePast: "sold during recess",
    increaseAction: "restocks",
    increasePast: "restocked",
    location: "canteen fruit stall"
  },
  {
    id: "plant_nursery",
    title: "Potted Plants at Plant Nursery",
    xAxisLabel: "Type of Plant",
    yAxisLabel: "Number of Pots",
    unit: "pots",
    items: ["Ferns", "Succulents", "Orchids", "Bonsai", "Herbs"],
    decreaseAction: "sells",
    decreasePast: "sold",
    increaseAction: "pots",
    increasePast: "potted and added",
    location: "plant nursery"
  },
  {
    id: "food_bank_drive",
    title: "Supplies at Community Food Bank",
    xAxisLabel: "Item",
    yAxisLabel: "Number of Packs",
    unit: "packs",
    items: ["Rice", "Biscuits", "Instant Noodles", "Oats", "Canned Soup"],
    decreaseAction: "distributes",
    decreasePast: "distributed to residents",
    increaseAction: "receives",
    increasePast: "received from donors",
    location: "community food bank"
  },
  {
    id: "toy_store",
    title: "Toys in Department Store",
    xAxisLabel: "Category",
    yAxisLabel: "Number of Toys",
    unit: "toys",
    items: ["Puzzles", "Board Games", "Plush Toys", "Model Cars", "Building Blocks"],
    decreaseAction: "sells",
    decreasePast: "sold to shoppers",
    increaseAction: "unpacks",
    increasePast: "unpacked from a new shipment",
    location: "toy department"
  },
  {
    id: "sports_equipment",
    title: "Sports Equipment in PE Storeroom",
    xAxisLabel: "Equipment",
    yAxisLabel: "Quantity",
    unit: "items",
    items: ["Basketballs", "Footballs", "Cones", "Skipping Ropes", "Hula Hoops"],
    decreaseAction: "are taken out",
    decreasePast: "taken out for lessons",
    increaseAction: "are added",
    increasePast: "added to the storeroom",
    location: "PE storeroom"
  },
  {
    id: "clothing_boutique",
    title: "Clothing Stock at Boutique",
    xAxisLabel: "Item",
    yAxisLabel: "Number of Pieces",
    unit: "pieces",
    items: ["T-shirts", "Jeans", "Jackets", "Caps", "Cardigans"],
    decreaseAction: "sells",
    decreasePast: "sold",
    increaseAction: "receives",
    increasePast: "received from the warehouse",
    location: "boutique"
  },
  {
    id: "canteen_drinks",
    title: "Morning Stock of Canned Drinks",
    xAxisLabel: "Drink",
    yAxisLabel: "Number of Cans",
    unit: "cans",
    items: ["Green Tea", "Soy Milk", "Chrysanthemum", "Lemon Tea", "Barley Drink"],
    decreaseAction: "sells",
    decreasePast: "sold during lunch",
    increaseAction: "restocks",
    increasePast: "restocked",
    location: "canteen drink stall"
  }
];

export const getRandomBeforeAfterTheme = (itemCount = 4, specificThemeId = null) => {
  const pool = specificThemeId 
    ? BEFORE_AFTER_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : BEFORE_AFTER_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || BEFORE_AFTER_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));

  return {
    ...selectedTheme,
    items
  };
};

// ----------------------------------------------------------------------------
// 2f. FINANCIAL / UNIT VALUE BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const FINANCIAL_BAR_GRAPH_THEMES = [
  {
    id: "museum_tour_tickets",
    title: "Museum Tour Tickets Sold",
    xAxisLabel: "Ticket Type",
    yAxisLabel: "Number of Tickets",
    unit: "tickets",
    items: ["Adult", "Child", "Senior", "Student"],
    prices: [8, 5, 4, 6],
    verb: "sold",
    context: "museum tour",
    revenueNoun: "money collected"
  },
  {
    id: "carnival_rides",
    title: "Carnival Ride Tickets Sold",
    xAxisLabel: "Ride",
    yAxisLabel: "Tickets Sold",
    unit: "tickets",
    items: ["Roller Coaster", "Ferris Wheel", "Bumper Cars", "Merry-Go-Round"],
    prices: [6, 4, 5, 3],
    verb: "sold",
    context: "carnival",
    revenueNoun: "ticket sales"
  },
  {
    id: "canteen_lunch",
    title: "Meals Sold at School Canteen",
    xAxisLabel: "Food Stall",
    yAxisLabel: "Number of Bowls",
    unit: "bowls",
    items: ["Chicken Rice", "Fishball Noodles", "Fried Rice", "Laksa"],
    prices: [4, 3, 3, 4],
    verb: "sold",
    context: "canteen lunch",
    revenueNoun: "money collected"
  },
  {
    id: "bakery_sales",
    title: "Pastries Sold at Bakery",
    xAxisLabel: "Pastry",
    yAxisLabel: "Number of Pastries",
    unit: "pastries",
    items: ["Curry Puffs", "Egg Tarts", "Muffins", "Croissants"],
    prices: [2, 3, 4, 3],
    verb: "sold",
    context: "bakery",
    revenueNoun: "money earned"
  },
  {
    id: "bookstore_stationery",
    title: "Stationery Items Sold at Bookshop",
    xAxisLabel: "Item",
    yAxisLabel: "Quantity Sold",
    unit: "items",
    items: ["Notebooks", "Pencil Cases", "Files", "Highlighter Sets"],
    prices: [2, 5, 3, 4],
    verb: "sold",
    context: "bookshop",
    revenueNoun: "sales revenue"
  },
  {
    id: "charity_bazaar_crafts",
    title: "Handmade Crafts Sold at Bazaar",
    xAxisLabel: "Craft",
    yAxisLabel: "Number of Items",
    unit: "items",
    items: ["Keychains", "Bookmarks", "Tote Bags", "Pouch Bags"],
    prices: [3, 2, 6, 4],
    verb: "sold",
    context: "charity bazaar",
    revenueNoun: "money raised"
  },
  {
    id: "plant_nursery_pots",
    title: "Potted Plants Sold at Nursery",
    xAxisLabel: "Plant",
    yAxisLabel: "Number of Pots",
    unit: "pots",
    items: ["Succulents", "Herbs", "Ferns", "Small Orchids"],
    prices: [4, 3, 5, 8],
    verb: "sold",
    context: "plant nursery",
    revenueNoun: "sales total"
  },
  {
    id: "cinema_tickets",
    title: "Movie Tickets Sold at Cinema",
    xAxisLabel: "Movie Hall",
    yAxisLabel: "Tickets Sold",
    unit: "tickets",
    items: ["Hall 1", "Hall 2", "Hall 3", "Hall 4"],
    prices: [9, 8, 10, 7],
    verb: "sold",
    context: "cinema",
    revenueNoun: "ticket revenue"
  },
  {
    id: "beach_sports_rentals",
    title: "Sports Equipment Rented at Beach",
    xAxisLabel: "Equipment",
    yAxisLabel: "Number of Rentals",
    unit: "rentals",
    items: ["Bicycles", "Rollerblades", "Kayaks", "Paddleboards"],
    prices: [6, 5, 10, 12],
    verb: "rented out",
    context: "beach rental kiosk",
    revenueNoun: "rental fees collected"
  },
  {
    id: "canteen_fruit_stall",
    title: "Cut Fruits Sold at Fruit Stall",
    xAxisLabel: "Fruit",
    yAxisLabel: "Number of Cups",
    unit: "cups",
    items: ["Watermelon", "Pineapple", "Honeydew", "Papaya"],
    prices: [2, 2, 3, 2],
    verb: "sold",
    context: "canteen fruit stall",
    revenueNoun: "money collected"
  }
];

export const getRandomFinancialTheme = (itemCount = 4, specificThemeId = null) => {
  const pool = specificThemeId 
    ? FINANCIAL_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : FINANCIAL_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || FINANCIAL_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));
  const prices = [...selectedTheme.prices].slice(0, Math.min(itemCount, selectedTheme.prices.length));

  return {
    ...selectedTheme,
    items,
    prices
  };
};

// ----------------------------------------------------------------------------
// 2f. ALGEBRAIC MULTIPLIER / FINDING UNKNOWN BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const ALGEBRAIC_BAR_GRAPH_THEMES = [
  {
    id: "baking_cupcakes",
    title: "Cupcakes Baked by Friends",
    xAxisLabel: "Baker",
    yAxisLabel: "Number of Cupcakes",
    unit: "cupcakes",
    verb: "baked",
    baseVerb: "bake",
    items: ["Amy", "Betty", "Cindy", "Devi"],
    externalEntities: ["Diana", "Ethan", "Fiona", "Gabriel"]
  },
  {
    id: "sports_day_points",
    title: "Points Scored on Sports Day",
    xAxisLabel: "House",
    yAxisLabel: "Points Scored",
    unit: "points",
    verb: "scored",
    baseVerb: "score",
    items: ["Red House", "Blue House", "Green House", "Yellow House"],
    externalEntities: ["Gold House", "Purple House", "Silver House"]
  },
  {
    id: "recycling_cans",
    title: "Aluminium Cans Recycled by Classes",
    xAxisLabel: "Class",
    yAxisLabel: "Cans Recycled",
    unit: "cans",
    verb: "recycled",
    baseVerb: "recycle",
    items: ["Class 3A", "Class 3B", "Class 3C", "Class 3D"],
    externalEntities: ["Class 3E", "Class 3F", "Class 3G"]
  },
  {
    id: "library_books_read",
    title: "Books Read During Reading Month",
    xAxisLabel: "Student",
    yAxisLabel: "Number of Books",
    unit: "books",
    verb: "read",
    baseVerb: "read",
    items: ["Bala", "Chloe", "Danial", "Eileen"],
    externalEntities: ["Farhan", "Grace", "Hafiz", "Irene"]
  },
  {
    id: "sticker_collections",
    title: "Reward Stickers Collected",
    xAxisLabel: "Pupil",
    yAxisLabel: "Number of Stickers",
    unit: "stickers",
    verb: "collected",
    baseVerb: "collect",
    items: ["Kai", "Lucas", "Mei Ling", "Nathan"],
    externalEntities: ["Priya", "Rachel", "Sean", "Tariq"]
  },
  {
    id: "origami_paper_cranes",
    title: "Paper Cranes Folded by Art Club",
    xAxisLabel: "Member",
    yAxisLabel: "Paper Cranes",
    unit: "paper cranes",
    verb: "folded",
    baseVerb: "fold",
    items: ["Hana", "Jun Jie", "Siti", "Venkatesh"],
    externalEntities: ["Wei Ting", "Xavier", "Yasmin", "Zack"]
  },
  {
    id: "fruit_harvest_baskets",
    title: "Baskets of Apples Picked",
    xAxisLabel: "Orchard Section",
    yAxisLabel: "Baskets Picked",
    unit: "baskets",
    verb: "picked",
    baseVerb: "pick",
    items: ["Section A", "Section B", "Section C", "Section D"],
    externalEntities: ["Section E", "Section F", "Section G"]
  },
  {
    id: "charity_walk_laps",
    title: "Laps Completed for Charity",
    xAxisLabel: "Team",
    yAxisLabel: "Number of Laps",
    unit: "laps",
    verb: "completed",
    baseVerb: "complete",
    items: ["Team Cheetah", "Team Tiger", "Team Eagle", "Team Falcon"],
    externalEntities: ["Team Panther", "Team Shark", "Team Dolphin"]
  },
  {
    id: "seashells_beach",
    title: "Seashells Collected at Beach",
    xAxisLabel: "Child",
    yAxisLabel: "Number of Seashells",
    unit: "seashells",
    verb: "collected",
    baseVerb: "collect",
    items: ["Aiden", "Brenda", "Calvin", "Darren"],
    externalEntities: ["Elaine", "Faye", "George", "Hazel"]
  },
  {
    id: "toy_car_collections",
    title: "Model Cars Collected by Hobbyists",
    xAxisLabel: "Collector",
    yAxisLabel: "Model Cars",
    unit: "model cars",
    verb: "collected",
    baseVerb: "collect",
    items: ["Ken", "Marcus", "Oscar", "Ramesh"],
    externalEntities: ["Samuel", "Timothy", "Victor", "William"]
  }
];

export const getRandomAlgebraicTheme = (itemCount = 3, specificThemeId = null) => {
  const pool = specificThemeId 
    ? ALGEBRAIC_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : ALGEBRAIC_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || ALGEBRAIC_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));
  const externalEntities = [...selectedTheme.externalEntities];
  const randomExt = externalEntities[Math.floor(Math.random() * externalEntities.length)] || "Diana";

  return {
    ...selectedTheme,
    items,
    externalEntity: randomExt
  };
};

// ----------------------------------------------------------------------------
// 2g. EQUALIZING QUANTITIES / THE TRANSFER PROBLEM BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const EQUALIZING_BAR_GRAPH_THEMES = [
  {
    id: "library_shelves",
    title: "Books on Library Shelves",
    xAxisLabel: "Shelf",
    yAxisLabel: "Number of Books",
    unit: "books",
    container: "shelf",
    containersPlural: "shelves",
    items: ["Shelf A", "Shelf B", "Shelf C", "Shelf D"],
    externalContainer: "Shelf E"
  },
  {
    id: "classroom_stationery_trays",
    title: "Pencils in Classroom Trays",
    xAxisLabel: "Tray",
    yAxisLabel: "Number of Pencils",
    unit: "pencils",
    container: "tray",
    containersPlural: "trays",
    items: ["Tray 1", "Tray 2", "Tray 3", "Tray 4"],
    externalContainer: "Tray 5"
  },
  {
    id: "bakery_display_trays",
    title: "Muffins on Bakery Trays",
    xAxisLabel: "Display Tray",
    yAxisLabel: "Number of Muffins",
    unit: "muffins",
    container: "tray",
    containersPlural: "trays",
    items: ["Tray A", "Tray B", "Tray C", "Tray D"],
    externalContainer: "Tray E"
  },
  {
    id: "fruit_baskets_orchard",
    title: "Oranges in Fruit Baskets",
    xAxisLabel: "Basket",
    yAxisLabel: "Number of Oranges",
    unit: "oranges",
    container: "basket",
    containersPlural: "baskets",
    items: ["Basket 1", "Basket 2", "Basket 3", "Basket 4"],
    externalContainer: "Basket 5"
  },
  {
    id: "craft_beads_jars",
    title: "Craft Beads in Jars",
    xAxisLabel: "Jar",
    yAxisLabel: "Number of Beads",
    unit: "beads",
    container: "jar",
    containersPlural: "jars",
    items: ["Jar A", "Jar B", "Jar C", "Jar D"],
    externalContainer: "Jar E"
  },
  {
    id: "pe_balls_bins",
    title: "Tennis Balls in Equipment Bins",
    xAxisLabel: "Bin",
    yAxisLabel: "Number of Balls",
    unit: "balls",
    container: "bin",
    containersPlural: "bins",
    items: ["Bin 1", "Bin 2", "Bin 3", "Bin 4"],
    externalContainer: "Bin 5"
  },
  {
    id: "canteen_cutlery_holders",
    title: "Spoons in Canteen Holders",
    xAxisLabel: "Holder",
    yAxisLabel: "Number of Spoons",
    unit: "spoons",
    container: "holder",
    containersPlural: "holders",
    items: ["Holder A", "Holder B", "Holder C", "Holder D"],
    externalContainer: "Holder E"
  },
  {
    id: "plant_nursery_rows",
    title: "Seedling Pots in Nursery Rows",
    xAxisLabel: "Row",
    yAxisLabel: "Number of Pots",
    unit: "pots",
    container: "row",
    containersPlural: "rows",
    items: ["Row 1", "Row 2", "Row 3", "Row 4"],
    externalContainer: "Row 5"
  },
  {
    id: "stamp_collector_albums",
    title: "Stamps in Collector Albums",
    xAxisLabel: "Album",
    yAxisLabel: "Number of Stamps",
    unit: "stamps",
    container: "album",
    containersPlural: "albums",
    items: ["Album A", "Album B", "Album C", "Album D"],
    externalContainer: "Album E"
  },
  {
    id: "toy_blocks_bins",
    title: "Building Blocks in Storage Bins",
    xAxisLabel: "Storage Bin",
    yAxisLabel: "Number of Blocks",
    unit: "blocks",
    container: "bin",
    containersPlural: "bins",
    items: ["Bin 1", "Bin 2", "Bin 3", "Bin 4"],
    externalContainer: "Bin 5"
  }
];

export const getRandomEqualizingTheme = (itemCount = 3, specificThemeId = null) => {
  const pool = specificThemeId 
    ? EQUALIZING_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : EQUALIZING_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || EQUALIZING_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));

  return {
    ...selectedTheme,
    items
  };
};

// ----------------------------------------------------------------------------
// 2h. TARGET & SHORTFALL ANALYSIS BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const TARGET_SHORTFALL_BAR_GRAPH_THEMES = [
  {
    id: "recycling_drive_newspapers",
    title: "Newspapers Collected for Recycling Drive",
    xAxisLabel: "Day",
    yAxisLabel: "Newspapers Collected",
    unit: "newspapers",
    targetSubject: "school",
    categorySingular: "day",
    categoriesPlural: "days",
    activity: "for a recycling drive",
    verb: "collect",
    pastVerb: "collected",
    prep: "on",
    items: ["Day 1", "Day 2", "Day 3", "Day 4"],
    nextItem: "Day 5",
    allPeriods: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]
  },
  {
    id: "charity_walk_laps",
    title: "Laps Completed for Charity Walkathon",
    xAxisLabel: "Day",
    yAxisLabel: "Laps Completed",
    unit: "laps",
    targetSubject: "Red House team",
    categorySingular: "day",
    categoriesPlural: "days",
    activity: "for a charity walkathon",
    verb: "complete",
    pastVerb: "completed",
    prep: "on",
    items: ["Day 1", "Day 2", "Day 3", "Day 4"],
    nextItem: "Day 5",
    allPeriods: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]
  },
  {
    id: "canned_food_drive",
    title: "Cans Donated for Food Drive",
    xAxisLabel: "Class",
    yAxisLabel: "Cans Donated",
    unit: "cans",
    targetSubject: "Primary 3 cohort",
    categorySingular: "class",
    categoriesPlural: "classes",
    activity: "for a community food drive",
    verb: "donate",
    pastVerb: "donated",
    prep: "by",
    items: ["Class 3A", "Class 3B", "Class 3C", "Class 3D"],
    nextItem: "Class 3E",
    allPeriods: ["Class 3A", "Class 3B", "Class 3C", "Class 3D", "Class 3E"]
  },
  {
    id: "reading_challenge_books",
    title: "Books Read During Reading Challenge",
    xAxisLabel: "Week",
    yAxisLabel: "Books Read",
    unit: "books",
    targetSubject: "reading club",
    categorySingular: "week",
    categoriesPlural: "weeks",
    activity: "for the annual reading challenge",
    verb: "read",
    pastVerb: "read",
    prep: "in",
    items: ["Week 1", "Week 2", "Week 3", "Week 4"],
    nextItem: "Week 5",
    allPeriods: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
  },
  {
    id: "tree_planting_campaign",
    title: "Saplings Planted Across Sectors",
    xAxisLabel: "Sector",
    yAxisLabel: "Saplings Planted",
    unit: "saplings",
    targetSubject: "park committee",
    categorySingular: "sector",
    categoriesPlural: "sectors",
    activity: "for a park greening project",
    verb: "plant",
    pastVerb: "planted",
    prep: "in",
    items: ["Sector A", "Sector B", "Sector C", "Sector D"],
    nextItem: "Sector E",
    allPeriods: ["Sector A", "Sector B", "Sector C", "Sector D", "Sector E"]
  },
  {
    id: "sports_meet_points",
    title: "Points Scored Across Tournament Events",
    xAxisLabel: "Event",
    yAxisLabel: "Points Scored",
    unit: "points",
    targetSubject: "sports team",
    categorySingular: "event",
    categoriesPlural: "events",
    activity: "towards qualifying for the finals",
    verb: "score",
    pastVerb: "scored",
    prep: "in",
    items: ["Event 1", "Event 2", "Event 3", "Event 4"],
    nextItem: "Event 5",
    allPeriods: ["Event 1", "Event 2", "Event 3", "Event 4", "Event 5"]
  },
  {
    id: "origami_cranes_project",
    title: "Paper Cranes Folded by Art Club",
    xAxisLabel: "Day",
    yAxisLabel: "Paper Cranes Folded",
    unit: "paper cranes",
    targetSubject: "art club",
    categorySingular: "day",
    categoriesPlural: "days",
    activity: "for a hospital charity gift",
    verb: "fold",
    pastVerb: "folded",
    prep: "on",
    items: ["Day 1", "Day 2", "Day 3", "Day 4"],
    nextItem: "Day 5",
    allPeriods: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]
  },
  {
    id: "beach_clean_trash_bags",
    title: "Bags of Litter Collected by Volunteer Teams",
    xAxisLabel: "Team",
    yAxisLabel: "Bags Collected",
    unit: "bags",
    targetSubject: "environment club",
    categorySingular: "team",
    categoriesPlural: "teams",
    activity: "for a coastal cleanup drive",
    verb: "collect",
    pastVerb: "collected",
    prep: "by",
    items: ["Team 1", "Team 2", "Team 3", "Team 4"],
    nextItem: "Team 5",
    allPeriods: ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"]
  },
  {
    id: "fruit_orchard_crates",
    title: "Crates of Fruit Picked Across Zones",
    xAxisLabel: "Zone",
    yAxisLabel: "Crates Picked",
    unit: "crates",
    targetSubject: "orchard team",
    categorySingular: "zone",
    categoriesPlural: "zones",
    activity: "to fulfill a harvest quota",
    verb: "harvest",
    pastVerb: "harvested",
    prep: "in",
    items: ["Zone A", "Zone B", "Zone C", "Zone D"],
    nextItem: "Zone E",
    allPeriods: ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
  },
  {
    id: "charity_bake_sale_boxes",
    title: "Boxes of Muffins Baked for Charity Sale",
    xAxisLabel: "Day",
    yAxisLabel: "Boxes Baked",
    unit: "boxes",
    targetSubject: "baking society",
    categorySingular: "day",
    categoriesPlural: "days",
    activity: "for the school charity carnival",
    verb: "bake",
    pastVerb: "baked",
    prep: "on",
    items: ["Day 1", "Day 2", "Day 3", "Day 4"],
    nextItem: "Day 5",
    allPeriods: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]
  }
];

export const getRandomTargetShortfallTheme = (itemCount = 4, specificThemeId = null) => {
  const pool = specificThemeId 
    ? TARGET_SHORTFALL_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : TARGET_SHORTFALL_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || TARGET_SHORTFALL_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));

  return {
    ...selectedTheme,
    items
  };
};

// ----------------------------------------------------------------------------
// 2i. REPACKING / GROUPING FROM TOTAL DATA BAR GRAPH THEMES
// ----------------------------------------------------------------------------
export const REPACKING_BAR_GRAPH_THEMES = [
  {
    id: "harvest_potatoes_fields",
    title: "Potatoes Harvested Across Fields",
    xAxisLabel: "Field",
    yAxisLabel: "Kilograms of Potatoes",
    unit: "kg of potatoes",
    itemSingular: "kg of potatoes",
    container: "sack",
    containersPlural: "sacks",
    sourceSingular: "field",
    sourcesPlural: "fields",
    items: ["Field A", "Field B", "Field C", "Field D"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [6, 8, 10, 12],
    actionVerb: "harvested",
    baseVerb: "harvest"
  },
  {
    id: "bakery_cookies_batches",
    title: "Cookies Baked Across Batches",
    xAxisLabel: "Batch",
    yAxisLabel: "Number of Cookies",
    unit: "cookies",
    itemSingular: "cookie",
    container: "tin",
    containersPlural: "tins",
    sourceSingular: "batch",
    sourcesPlural: "batches",
    items: ["Batch 1", "Batch 2", "Batch 3", "Batch 4"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [5, 7, 8, 9],
    actionVerb: "baked",
    baseVerb: "bake"
  },
  {
    id: "orchard_oranges_groves",
    title: "Oranges Picked Across Groves",
    xAxisLabel: "Grove",
    yAxisLabel: "Number of Oranges",
    unit: "oranges",
    itemSingular: "orange",
    container: "bag",
    containersPlural: "bags",
    sourceSingular: "grove",
    sourcesPlural: "groves",
    items: ["Grove A", "Grove B", "Grove C", "Grove D"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [4, 5, 6, 8],
    actionVerb: "picked",
    baseVerb: "pick"
  },
  {
    id: "craft_beads_workshops",
    title: "Glass Beads Made in Art Workshops",
    xAxisLabel: "Workshop",
    yAxisLabel: "Number of Beads",
    unit: "beads",
    itemSingular: "bead",
    container: "packet",
    containersPlural: "packets",
    sourceSingular: "workshop",
    sourcesPlural: "workshops",
    items: ["Room 1", "Room 2", "Room 3", "Room 4"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [3, 4, 5, 6],
    actionVerb: "made",
    baseVerb: "make"
  },
  {
    id: "canteen_curry_puffs_stalls",
    title: "Curry Puffs Prepared for Carnival",
    xAxisLabel: "Stall",
    yAxisLabel: "Curry Puffs",
    unit: "curry puffs",
    itemSingular: "curry puff",
    container: "box",
    containersPlural: "boxes",
    sourceSingular: "stall",
    sourcesPlural: "stalls",
    items: ["Stall A", "Stall B", "Stall C", "Stall D"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [5, 6, 8, 10],
    actionVerb: "prepared",
    baseVerb: "prepare"
  },
  {
    id: "stationery_pencils_donations",
    title: "Pencils Collected from Donation Drives",
    xAxisLabel: "Collection Point",
    yAxisLabel: "Number of Pencils",
    unit: "pencils",
    itemSingular: "pencil",
    container: "bundle",
    containersPlural: "bundles",
    sourceSingular: "collection point",
    sourcesPlural: "collection points",
    items: ["Foyer", "Library", "Hall", "Canteen"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [3, 4, 5, 6],
    actionVerb: "collected",
    baseVerb: "collect"
  },
  {
    id: "farm_eggs_coops",
    title: "Fresh Eggs Gathered from Coops",
    xAxisLabel: "Coop",
    yAxisLabel: "Number of Eggs",
    unit: "eggs",
    itemSingular: "egg",
    container: "carton",
    containersPlural: "cartons",
    sourceSingular: "coop",
    sourcesPlural: "coops",
    items: ["Coop 1", "Coop 2", "Coop 3", "Coop 4"],
    capacityPool: [4, 6, 8, 10, 12],
    pricePool: [4, 5, 6, 8],
    actionVerb: "gathered",
    baseVerb: "gather"
  },
  {
    id: "plant_nursery_seedlings",
    title: "Flower Seedlings Potted Across Zones",
    xAxisLabel: "Nursery Zone",
    yAxisLabel: "Seedlings",
    unit: "seedlings",
    itemSingular: "seedling",
    container: "crate",
    containersPlural: "crates",
    sourceSingular: "zone",
    sourcesPlural: "zones",
    items: ["Zone A", "Zone B", "Zone C", "Zone D"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [6, 8, 10, 12],
    actionVerb: "potted",
    baseVerb: "pot"
  },
  {
    id: "carnival_game_tokens",
    title: "Game Tokens Collected by Game Booths",
    xAxisLabel: "Game Booth",
    yAxisLabel: "Tokens",
    unit: "tokens",
    itemSingular: "token",
    container: "pouch",
    containersPlural: "pouches",
    sourceSingular: "booth",
    sourcesPlural: "booths",
    items: ["Ring Toss", "Darts", "Fish Pond", "Bowling"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [2, 3, 4, 5],
    actionVerb: "collected",
    baseVerb: "collect"
  },
  {
    id: "sewing_club_fabric_ribbons",
    title: "Ribbons Cut by Craft Classes",
    xAxisLabel: "Class",
    yAxisLabel: "Number of Ribbons",
    unit: "ribbons",
    itemSingular: "ribbon",
    container: "roll pack",
    containersPlural: "roll packs",
    sourceSingular: "class",
    sourcesPlural: "classes",
    items: ["Class 3A", "Class 3B", "Class 3C", "Class 3D"],
    capacityPool: [4, 5, 6, 8, 10],
    pricePool: [4, 5, 6, 7],
    actionVerb: "cut",
    baseVerb: "cut"
  }
];

export const getRandomRepackingTheme = (itemCount = 4, specificThemeId = null) => {
  const pool = specificThemeId 
    ? REPACKING_BAR_GRAPH_THEMES.filter(t => t.id === specificThemeId) 
    : REPACKING_BAR_GRAPH_THEMES;
  const selectedTheme = pool[Math.floor(Math.random() * pool.length)] || REPACKING_BAR_GRAPH_THEMES[0];
  const items = [...selectedTheme.items].slice(0, Math.min(itemCount, selectedTheme.items.length));

  return {
    ...selectedTheme,
    items
  };
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

export const CM_RECTANGLE_ITEMS_POOL = [
  "photo frame", "card", "sticker", "painting", "book", "tile", "mousepad", "envelope",
  "post-it note", "stamp", "tablet screen", "phone screen", "poster", "certificate", "calendar",
  "notebook", "clipboard", "bookmark", "tray", "placemat", "origami paper",
  "business card", "greeting card", "index card", "flashcard", "name tag", "playing card", "sketchpad"
];

export const M_RECTANGLE_ITEMS_POOL = [
  "garden", "swimming pool", "stage", "room", "field", "playground", "park", "basketball court",
  "hall", "classroom", "carpet", "rug", "courtyard", "car park", "lawn", "paddock", "tennis court",
  "volleyball court", "dance floor", "dining room", "balcony", "patio", "deck", "warehouse",
  "factory floor", "gymnasium", "rooftop", "exhibition booth"
];

export const getRandomLengthItems = (count = 1) => {
  const shuffled = [...LENGTH_ITEMS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomHeightSubjects = (count = 1) => {
  const shuffled = [...HEIGHT_SUBJECTS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomRectangleItems = (unit = "cm", count = 1) => {
  const pool = unit === "m" ? M_RECTANGLE_ITEMS_POOL : CM_RECTANGLE_ITEMS_POOL;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
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

export const getRandomEmojiObjects = (count = 1) => {
  const shuffled = [...emojiObjects].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

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

  return count === 1 ? makeCompatibleArray(selected[0]) : selected;
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

export const getOverlappingVenues = () => {
  const venues = [
    ["community pool", "public library"],
    ["food court", "supermarket"],
    ["theme park", "water park"],
    ["museum", "art gallery"],
    ["bookstore", "cafe"],
    ["sports hall", "gymnasium"],
    ["petting zoo", "bird park"],
    ["medical clinic", "pharmacy"],
    ["post office", "bank"],
    ["bakery", "flower shop"],
    ["shopping mall", "cinema"],
    ["community club", "neighbourhood police centre"],
    ["ice skating rink", "bowling alley"],
    ["science centre", "observatory"],
    ["indoor playground", "arcade"],
    ["hawker centre", "wet market"],
    ["aquarium", "safari park"],
    ["hardware store", "furniture shop"],
    ["bicycles shop", "skate park"],
    ["laundromat", "convenience store"],
    ["tuition centre", "student care"],
    ["trampoline park", "laser tag arena"],
    ["botanical garden", "orchid garden"],
    ["toy store", "candy shop"],
    ["barber shop", "tailor"],
    ["pet grooming salon", "veterinary clinic"],
    ["music school", "dance studio"],
    ["stadium", "tennis court"],
    ["car wash", "petrol kiosk"],
    ["electronics store", "computer repair shop"]
  ];
  return venues[Math.floor(Math.random() * venues.length)];
};

export const getRandom3DObject = () => {
  const objects = [
    // --- CONES (20) ---
    { name: 'party hat', shape: 'cone', imageId: 'party_hat' },
    { name: 'ice cream cone', shape: 'cone', imageId: 'ice_cream_cone' },
    { name: 'traffic cone', shape: 'cone', imageId: 'traffic_cone' },
    { name: 'wizard hat', shape: 'cone', imageId: 'wizard_hat' },
    { name: 'funnel', shape: 'cone', imageId: 'funnel' },
    { name: 'pencil tip', shape: 'cone', imageId: 'pencil_tip' },
    { name: 'spinning top', shape: 'cone', imageId: 'spinning_top' },
    { name: 'clown hat', shape: 'cone', imageId: 'clown_hat' },
    { name: 'castle roof', shape: 'cone', imageId: 'castle_roof' },
    { name: 'teepee tent', shape: 'cone', imageId: 'teepee_tent' },
    { name: 'megaphone', shape: 'cone', imageId: 'megaphone' },
    { name: 'piping bag', shape: 'cone', imageId: 'piping_bag' },
    { name: 'snow cone', shape: 'cone', imageId: 'snow_cone' },
    { name: 'carrot', shape: 'cone', imageId: 'carrot' },
    { name: 'badminton shuttlecock', shape: 'cone', imageId: 'badminton_shuttlecock' },
    { name: 'volcano', shape: 'cone', imageId: 'volcano' },
    { name: 'rocket', shape: 'cone', imageId: 'rocket' },
    { name: 'lamp shade', shape: 'cone', imageId: 'lamp_shade' },
    { name: 'fang', shape: 'cone', imageId: 'fang' },
    { name: 'martini glass', shape: 'cone', imageId: 'martini_glass' },
    { name: 'seashell', shape: 'cone', imageId: 'seashell' },

    // --- CUBOIDS (20) ---
    { name: 'tissue box', shape: 'cuboid', imageId: 'tissue_box' },
    { name: 'shoe box', shape: 'cuboid', imageId: 'shoe_box' },
    { name: 'cereal box', shape: 'cuboid', imageId: 'cereal_box' },
    { name: 'brick', shape: 'cuboid', imageId: 'brick' },
    { name: 'packet drink', shape: 'cuboid', imageId: 'packet_drink' },
    { name: 'eraser', shape: 'cuboid', imageId: 'eraser' },
    { name: 'thick book', shape: 'cuboid', imageId: 'thick_book' },
    { name: 'mattress', shape: 'cuboid', imageId: 'mattress' },
    { name: 'refrigerator', shape: 'cuboid', imageId: 'refrigerator' },
    { name: 'microwave oven', shape: 'cuboid', imageId: 'microwave_oven' },
    { name: 'smartphone', shape: 'cuboid', imageId: 'smartphone' },
    { name: 'pencil case', shape: 'cuboid', imageId: 'pencil_case' },
    { name: 'matchbox', shape: 'cuboid', imageId: 'matchbox' },
    { name: 'ruler', shape: 'cuboid', imageId: 'ruler' },
    { name: 'suitcase', shape: 'cuboid', imageId: 'suitcase' },
    { name: 'door', shape: 'cuboid', imageId: 'door' },
    { name: 'cabinet', shape: 'cuboid', imageId: 'cabinet' },
    { name: 'fish tank', shape: 'cuboid', imageId: 'fish_tank' },
    { name: 'lunchbox', shape: 'cuboid', imageId: 'lunchbox' },
    { name: 'television', shape: 'cuboid', imageId: 'television' },

    // --- SPHERES (20) ---
    { name: 'marble', shape: 'sphere', imageId: 'marble' },
    { name: 'basketball', shape: 'sphere', imageId: 'basketball' },
    { name: 'globe', shape: 'sphere', imageId: 'globe' },
    { name: 'tennis ball', shape: 'sphere', imageId: 'tennis_ball' },
    { name: 'football', shape: 'sphere', imageId: 'football' },
    { name: 'ping pong ball', shape: 'sphere', imageId: 'ping_pong_ball' },
    { name: 'bowling ball', shape: 'sphere', imageId: 'bowling_ball' },
    { name: 'orange', shape: 'sphere', imageId: 'orange' },
    { name: 'watermelon', shape: 'sphere', imageId: 'watermelon' },
    { name: 'full moon', shape: 'sphere', imageId: 'full_moon' },
    { name: 'pearl', shape: 'sphere', imageId: 'pearl' },
    { name: 'soap bubble', shape: 'sphere', imageId: 'soap_bubble' },
    { name: 'bead', shape: 'sphere', imageId: 'bead' },
    { name: 'ornament', shape: 'sphere', imageId: 'ornament' },
    { name: 'lollipop top', shape: 'sphere', imageId: 'lollipop_top' },
    { name: 'yarn ball', shape: 'sphere', imageId: 'yarn_ball' },
    { name: 'chocolate ball', shape: 'sphere', imageId: 'chocolate_ball' },
    { name: 'snow globe', shape: 'sphere', imageId: 'snow_globe' },
    { name: 'cannonball', shape: 'sphere', imageId: 'cannonball' },
    { name: 'golf ball', shape: 'sphere', imageId: 'golf_ball' },

    // --- CUBES (20) ---
    { name: 'dice', shape: 'cube', imageId: 'dice' },
    { name: "Rubik's cube", shape: 'cube', imageId: 'rubiks_cube' },
    { name: 'sugar', shape: 'cube', imageId: 'sugar' },
    { name: 'ice', shape: 'cube', imageId: 'ice' },
    { name: 'alphabet block', shape: 'cube', imageId: 'alphabet_block' },
    { name: 'present box', shape: 'cube', imageId: 'present_box' },
    { name: 'building block', shape: 'cube', imageId: 'building_block' },
    { name: 'tissue box', shape: 'cube', imageId: 'square_tissue_box' },
    { name: 'storage box', shape: 'cube', imageId: 'storage_box' },
    { name: 'footstool', shape: 'cube', imageId: 'footstool' },
    { name: 'wooden crate', shape: 'cube', imageId: 'wooden_crate' },
    { name: 'safe', shape: 'cube', imageId: 'safe' },
    { name: 'speaker', shape: 'cube', imageId: 'speaker' },
    { name: 'candy', shape: 'cube', imageId: 'candy' },
    { name: 'cardboard box', shape: 'cube', imageId: 'cardboard_box' },
    { name: 'cheese', shape: 'cube', imageId: 'cheese' },
    { name: 'pot', shape: 'cube', imageId: 'pot' },
    { name: 'basket', shape: 'cube', imageId: 'basket' },
    { name: 'tofu', shape: 'cube', imageId: 'tofu' },
    { name: 'radio', shape: 'cube', imageId: 'radio' },

    // --- CYLINDERS (20) ---
    { name: 'can of soup', shape: 'cylinder', imageId: 'can_of_soup' },
    { name: 'drinking glass', shape: 'cylinder', imageId: 'drinking_glass' },
    { name: 'battery', shape: 'cylinder', imageId: 'battery' },
    { name: 'toilet paper roll', shape: 'cylinder', imageId: 'toilet_paper_roll' },
    { name: 'water bottle', shape: 'cylinder', imageId: 'water_bottle' },
    { name: 'drinking straw', shape: 'cylinder', imageId: 'drinking_straw' },
    { name: 'lipstick', shape: 'cylinder', imageId: 'lipstick' },
    { name: 'marker pen', shape: 'cylinder', imageId: 'marker_pen' },
    { name: 'rolling pin', shape: 'cylinder', imageId: 'rolling_pin' },
    { name: 'pipe', shape: 'cylinder', imageId: 'pipe' },
    { name: 'drum', shape: 'cylinder', imageId: 'drum' },
    { name: 'candle', shape: 'cylinder', imageId: 'candle' },
    { name: 'coin', shape: 'cylinder', imageId: 'coin' },
    { name: 'fire extinguisher', shape: 'cylinder', imageId: 'fire_extinguisher' },
    { name: 'test tube', shape: 'cylinder', imageId: 'test_tube' },
    { name: 'puck', shape: 'cylinder', imageId: 'puck' },
    { name: 'spool of thread', shape: 'cylinder', imageId: 'spool_of_thread' },
    { name: 'wooden log', shape: 'cylinder', imageId: 'wooden_log' },
    { name: 'chalk', shape: 'cylinder', imageId: 'chalk' },
    { name: 'pillar', shape: 'cylinder', imageId: 'pillar' },
  ];
  return objects[Math.floor(Math.random() * objects.length)];
};

export const LIQUIDS_POOL = [
  "sirap bandung", "iced Milo", "lemonade", "orange juice", 
  "soya bean milk", "milk", "apple juice", "water", "tea"
];

export const getRandomLiquids = (count = 1) => {
  const shuffled = [...LIQUIDS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getSingularUnit = (unit) => {
  if (!unit) return 'item';
  const u = String(unit).toLowerCase().trim();
  if (u === 'pastries') return 'pastry';
  if (u === 'potatoes') return 'potato';
  if (u === 'tomatoes') return 'tomato';
  if (u.endsWith('ies')) return u.slice(0, -3) + 'y';
  if (u.endsWith('ses')) return u.slice(0, -2);
  if (u.endsWith('s') && !u.endsWith('ss')) return u.slice(0, -1);
  return u;
};
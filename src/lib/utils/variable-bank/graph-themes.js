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
import { makeCompatibleArray } from './names-and-contexts.js';

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

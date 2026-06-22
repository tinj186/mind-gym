/**
 * variable-bank.js
 * 
 * A centralized repository for all syllabus-related variables, themes, items, and names.
 * This prevents hardcoding strings across different generation files and makes updates easier.
 */

// ----------------------------------------------------------------------------
// 1. NAMES
// ----------------------------------------------------------------------------
export const NAMES_POOL = [
  'Wei Ling', 'Siti', 'Ahmad', 'Muthu', 'Bala', 'Kumar', 
  'Mei Hua', 'Fatimah', 'Ali', 'Wei Ming', 'Ravi', 'Nurul', 
  'Mei', 'Meiling', 'John'
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
  "cutter", "highlighter", "pen", "pencil", "usbdrive", 
  "eraser", "ruler", "paperclip", "crayon", "marker"
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
export const SHAPES_POOL = ["circle", "triangle", "square", "rectangle"];
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

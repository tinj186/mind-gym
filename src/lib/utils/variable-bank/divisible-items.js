import { makeCompatibleArray } from './names-and-contexts.js';

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
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

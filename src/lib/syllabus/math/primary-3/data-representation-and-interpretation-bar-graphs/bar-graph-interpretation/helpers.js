export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export const gcd = (a, b) => (!b ? a : gcd(b, a % b));
export const lcm = (a, b) => (a * b) / gcd(a, b);

export const partitionSum = (totalSteps, count, minStep = 2) => {
  let rem = totalSteps - count * minStep;
  const parts = Array(count).fill(minStep);
  while (rem > 0) {
    const idx = Math.floor(Math.random() * count);
    parts[idx]++;
    rem--;
  }
  return parts;
};

export const formatCategoryList = (cats) => {
  if (cats.length === 1) return cats[0];
  if (cats.length === 2) return `${cats[0]} and ${cats[1]}`;
  return `${cats.slice(0, -1).join(', ')}, and ${cats[cats.length - 1]}`;
};

export const getContextQuery = (theme, cats) => {
  const list = formatCategoryList(cats);
  const u = theme.unit;
  if (theme.id === 'baking_chefs') return `number of cupcakes baked by ${list}`;
  if (theme.id === 'toy_shops') return `number of toys sold by ${list}`;
  if (theme.id === 'primary_classes') return `number of bottles recycled by ${list}`;
  if (theme.id === 'school_houses') return `points scored by ${list}`;
  if (theme.id === 'harvest_fields') return `kilograms of potatoes harvested from ${list}`;
  if (u === 'points') return `points scored in ${list}`;
  if (u === 'pupils') return `number of pupils who chose ${list}`;
  if (u === 'visitors') return `number of visitors on ${list}`;
  if (u === 'newspapers') return `newspapers collected on ${list}`;
  if (u === 'books') return `number of ${list} books borrowed`;
  if (u === 'pies') return `number of ${list} pies sold`;
  if (u === 'notebooks') return `number of ${list} notebooks`;
  if (u === 'flowers') return `number of ${list} sold`;
  return `number of ${list} ${u}`;
};

export const getAdditionAcceptedAnswers = (a, b, sum) => [
  `${a} + ${b} = ${sum}`,
  `${b} + ${a} = ${sum}`,
  `${a}+${b}=${sum}`,
  `${b}+${a}=${sum}`
];

export const getSubtractionAcceptedAnswers = (a, b, diff) => [
  `${a} - ${b} = ${diff}`,
  `${a}-${b}=${diff}`
];

export const getSumAcceptedAnswers = (terms, sum) => [
  `${terms.join(' + ')} = ${sum}`,
  `${terms.join('+')}=${sum}`
];

export const getMultiplicationAcceptedAnswers = (a, b, product) => [
  `${a} x ${b} = ${product}`,
  `${b} x ${a} = ${product}`,
  `${a} X ${b} = ${product}`,
  `${b} X ${a} = ${product}`,
  `${a} × ${b} = ${product}`,
  `${b} × ${a} = ${product}`,
  `${a} * ${b} = ${product}`,
  `${b} * ${a} = ${product}`,
  `${a}x${b}=${product}`,
  `${b}x${a}=${product}`,
  `${a}X${b}=${product}`,
  `${b}X${a}=${product}`,
  `${a}×${b}=${product}`,
  `${b}×${a}=${product}`,
  `${a}*${b}=${product}`,
  `${b}*${a}=${product}`
];

export const getDivisionAcceptedAnswers = (total, divisor, quotient) => [
  `${total} ÷ ${divisor} = ${quotient}`,
  `${total} / ${divisor} = ${quotient}`,
  `${total}÷${divisor}=${quotient}`,
  `${total}/${divisor}=${quotient}`
];

export const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }
  let delta = 1;
  const hasDollar = String(correctVal).startsWith('$');
  const rawNum = hasDollar ? String(correctVal).replace(/^\$/, '') : String(correctVal);
  const num = Number(rawNum);
  while (set.size < 4) {
    if (!isNaN(num)) {
      const val = Math.max(1, num + (set.size % 2 === 1 ? delta * 5 : -delta * 5));
      const candidate = hasDollar ? `$${val}` : String(val);
      if (!set.has(candidate)) set.add(candidate);
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

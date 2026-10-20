export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }

  const rawStr = String(correctVal).replace(/^\$/, '');
  const isDollar = String(correctVal).startsWith('$');
  const num = Number(rawStr);
  const step = (!isNaN(num) && Number.isInteger(num)) ? 1 : 0.5;
  let delta = 1;

  while (set.size < 4) {
    if (!isNaN(num)) {
      const offset = (set.size % 2 === 1 ? delta : -delta) * (step >= 1 ? (num >= 20 ? 10 : (num >= 10 ? 5 : 1)) : 0.5);
      const val = num + offset;
      if (val > 0) {
        const valStr = Number.isInteger(val) ? String(val) : String(Number(val.toFixed(1)));
        const candidate = isDollar ? `$${valStr}` : valStr;
        if (!set.has(candidate)) set.add(candidate);
      }
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

export const getMultiplicationAcceptedAnswers = (a, b, product) => {
  const ans = new Set([String(product)]);
  const symbols = ['x', 'X', '×', '*'];
  for (const sym of symbols) {
    ans.add(`${a} ${sym} ${b} = ${product}`);
    ans.add(`${b} ${sym} ${a} = ${product}`);
    ans.add(`${a}${sym}${b}=${product}`);
    ans.add(`${b}${sym}${a}=${product}`);
    ans.add(`$${product}`);
    ans.add(`${a} ${sym} ${b} = $${product}`);
    ans.add(`${b} ${sym} ${a} = $${product}`);
    ans.add(`${a}${sym}${b}=$${product}`);
    ans.add(`${b}${sym}${a}=$${product}`);
    ans.add(`${a} ${sym} $${b} = $${product}`);
    ans.add(`${a}${sym}$${b}=$${product}`);
    ans.add(`$${b} ${sym} ${a} = $${product}`);
    ans.add(`$${b}${sym}${a}=$${product}`);
  }
  return Array.from(ans);
};

export const getDivisionAcceptedAnswers = (total, divisor, quotient) => {
  const ans = new Set([String(quotient)]);
  const symbols = ['÷', '/'];
  for (const sym of symbols) {
    ans.add(`${total} ${sym} ${divisor} = ${quotient}`);
    ans.add(`${total}${sym}${divisor}=${quotient}`);
    ans.add(`$${quotient}`);
    ans.add(`${total} ${sym} ${divisor} = $${quotient}`);
    ans.add(`${total}${sym}${divisor}=$${quotient}`);
    ans.add(`$${total} ${sym} ${divisor} = $${quotient}`);
    ans.add(`$${total}${sym}${divisor}=$${quotient}`);
  }
  return Array.from(ans);
};

export const getAdditionAcceptedAnswers = (a, b, sum) => {
  const ans = new Set([String(sum)]);
  ans.add(`${a} + ${b} = ${sum}`);
  ans.add(`${b} + ${a} = ${sum}`);
  ans.add(`${a}+${b}=${sum}`);
  ans.add(`${b}+${a}=${sum}`);
  ans.add(`$${sum}`);
  ans.add(`${a} + ${b} = $${sum}`);
  ans.add(`${b} + ${a} = $${sum}`);
  ans.add(`${a}+${b}=$${sum}`);
  ans.add(`${b}+${a}=$${sum}`);
  return Array.from(ans);
};

export const getSubtractionAcceptedAnswers = (a, b, diff) => {
  const ans = new Set([String(diff)]);
  ans.add(`${a} - ${b} = ${diff}`);
  ans.add(`${a}-${b}=${diff}`);
  ans.add(`$${diff}`);
  ans.add(`${a} - ${b} = $${diff}`);
  ans.add(`${a}-${b}=$${diff}`);
  return Array.from(ans);
};

export const getThreeTermAdditionAcceptedAnswers = (a, b, c, sum) => {
  const ans = new Set([String(sum)]);
  const perms = [
    [a, b, c], [a, c, b],
    [b, a, c], [b, c, a],
    [c, a, b], [c, b, a]
  ];
  for (const p of perms) {
    ans.add(`${p[0]} + ${p[1]} + ${p[2]} = ${sum}`);
    ans.add(`${p[0]}+${p[1]}+${p[2]}=${sum}`);
    ans.add(`$${sum}`);
    ans.add(`${p[0]} + ${p[1]} + ${p[2]} = $${sum}`);
    ans.add(`${p[0]}+${p[1]}+${p[2]}=$${sum}`);
  }
  return Array.from(ans);
};

export const getThreeAdditionAcceptedAnswers = getThreeTermAdditionAcceptedAnswers;


export const getDifferenceAcceptedAnswers = (val1, val2, diffVal, diffBlocks, scaleStep) => {
  const list = [
    ...getSubtractionAcceptedAnswers(val1, val2, diffVal),
    ...getMultiplicationAcceptedAnswers(diffBlocks, scaleStep, diffVal)
  ];
  return Array.from(new Set(list));
};

export const getSumAcceptedAnswers = (val1, val2, totalVal, totalBlocks, scaleStep) => {
  const list = [
    ...getAdditionAcceptedAnswers(val1, val2, totalVal),
    ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, totalVal)
  ];
  return Array.from(new Set(list));
};

export const getThreeTermSumAcceptedAnswers = (v1, v2, v3, totalVal, totalBlocks, scaleStep) => {
  const list = [
    ...getThreeTermAdditionAcceptedAnswers(v1, v2, v3, totalVal),
    ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, totalVal)
  ];
  return Array.from(new Set(list));
};

export const getCombinedAddSubAcceptedAnswers = (a, b, c, result) => [
  String(result),
  `${a} + ${b} - ${c} = ${result}`,
  `${a}+${b}-${c}=${result}`,
  `${b} + ${a} - ${c} = ${result}`,
  `${b}+${a}-${c}=${result}`,
  `${a + b} - ${c} = ${result}`,
  `${a + b}-${c}=${result}`
];

export const getSubSubAcceptedAnswers = (a, b, c, result) => [
  String(result),
  `${a} - ${b} - ${c} = ${result}`,
  `${a}-${b}-${c}=${result}`,
  `${a} - ${c} - ${b} = ${result}`,
  `${a}-${c}-${b}=${result}`,
  `${a} - ${b + c} = ${result}`,
  `${a}-${b + c}=${result}`
];

export const getTwoPairsDiffAcceptedAnswers = (sum12, sum34, diff) => [
  String(diff),
  `${sum12} - ${sum34} = ${diff}`,
  `${sum12}-${sum34}=${diff}`
];

export const getFourTermAdditionAcceptedAnswers = (a, b, c, d, sum) => [
  String(sum),
  `${a} + ${b} + ${c} + ${d} = ${sum}`,
  `${a}+${b}+${c}+${d}=${sum}`,
  `${a + b} + ${c + d} = ${sum}`,
  `${a + b}+${c + d}=${sum}`,
  `${a + b + c} + ${d} = ${sum}`,
  `${a + b + c}+${d}=${sum}`
];

export const getTwoPairSumAcceptedAnswers = (sum12, sum34, total) => [
  String(total),
  `${sum12} + ${sum34} = ${total}`,
  `${sum34} + ${sum12} = ${total}`,
  `${sum12}+${sum34}=${total}`,
  `${sum34}+${sum12}=${total}`
];

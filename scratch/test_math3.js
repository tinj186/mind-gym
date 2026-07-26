function normalizeAnswer(val) {
  if (val === null || val === undefined) return '';

  let str = String(val).trim().toLowerCase();

  // Handle lists by splitting at commas
  if (str.includes(',')) {
    return str.split(',').map(part => normalizeAnswer(part)).join(',');
  }

  str = str.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2');
  str = str.replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/g, '$1 $2/$3');

  str = str.replace(/[^\d./\s-]/g, '').trim();

  const mixedPattern = /^(\d+)\s+(\d+)\/(\d+)$/;
  const mixedMatch = str.match(mixedPattern);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const num = parseFloat(mixedMatch[2]);
    const den = parseFloat(mixedMatch[3]);
    return den !== 0 ? String(whole + num / den) : str;
  }

  const fractionPattern = /^(\d+)\/(\d+)$/;
  const fractionMatch = str.match(fractionPattern);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    return den !== 0 ? String(num / den) : str;
  }

  const singleNum = str.replace(/\s/g, '');
  const parsed = parseFloat(singleNum);
  
  return !isNaN(parsed) && isFinite(parsed) ? String(parsed) : singleNum;
}

console.log(normalizeAnswer("4/5, 3/5, 2/5"));
console.log(normalizeAnswer("\\frac{4}{5}, \\frac{3}{5}, \\frac{2}{5}"));
console.log(normalizeAnswer("\\frac{4}{5},\\frac{3}{5},\\frac{2}{5}"));
console.log(normalizeAnswer("4/5, 1/5, 2/5"));

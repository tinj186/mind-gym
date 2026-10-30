// Test cleanString and resilient unit matching from WorkoutSession and ArenaSession
const cleanString = (str) => {
  let s = String(str || '')
    .replace(/\\\s/g, ' ') // MathLive escaped spaces
    .replace(/\\quad/g, ' ') // MathLive quad space
    .replace(/\\qquad/g, ' ') // MathLive qquad space
    .replace(/\\[,;:!]/g, ' ') // MathLive thin/thick spaces
    .replace(/~/g, ' ') // MathLive tie/non-breaking space
    .replace(/\\displaystyle/g, '') // Strip display style
    .replace(/\\textstyle/g, '') // Strip text style
    .replace(/\\left/g, '') // Strip left
    .replace(/(?:(\d+)\s*)?\\[dt]?frac\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))/g, (m, int, n1, n2, d1, d2) => {
      const num = (n1 || n2 || '').trim();
      const den = (d1 || d2 || '').trim();
      return int ? `${int} ${num}/${den}` : `${num}/${den}`;
    }) // Convert MathLive fractions (frac, dfrac, tfrac), including mixed numbers and single-token fractions
    .replace(/\\operatorname\{\\mathrm\{([^}]*)\}\}/g, '$1') // MathLive text wrappers
    .replace(/\\operatorname\{([^}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .replace(/\\text(?:bf|it)?\{([^}]*)\}/g, '$1') // MathLive text wrappers (e.g. \text{cm})
    .replace(/\\mathbf\{([^}]*)\}/g, '$1')
    .replace(/\\mathit\{([^}]*)\}/g, '$1')
    .replace(/\^\{\\circ\}|\^\\circ|\\circ/g, '°') // Degrees
    .replace(/\^\{?2\}?/g, '²') // Powers of 2 (e.g. ^2, ^{2})
    .replace(/\^\{?3\}?/g, '³') // Powers of 3 (e.g. ^3, ^{3})
    .replace(/[{}]/g, '') // Strip remaining LaTeX grouping braces
    .replace(/\\times/g, '*') // Normalize multiplication
    .replace(/×/g, '*') // Normalize unicode cross
    .replace(/\\div/g, '/') // Normalize division
    .replace(/÷/g, '/') // Normalize unicode divide
    .replace(/\\cdot/g, '*') // Normalize multiplication dot
    .replace(/(?<=\d)\s*[xX]\s*(?=\d)/g, '*') // Normalize letter x used as multiplication between numbers
    .replace(/^\s*[xX]\s*$/g, '*') // Normalize standalone x as multiplication symbol
    .replace(/\\colon/g, ':') // Normalize MathLive colon (used for time/ratios)
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Strip zero-width invisible characters
    .replace(/’/g, "'") // Normalize typographic apostrophes from MathInput bypass
    .replace(/\\/g, '') // Any remaining latex slashes
    .toLowerCase();

  // 1. Protect and standardize place values, money, and conjunctions first
  s = s.replace(/\band\b/g, '');
  s = s.replace(/,/g, '');
  s = s.replace(/\bten\b/g, 'tens');
  s = s.replace(/\bone\b/g, 'ones');

  // Money normalization
  s = s.replace(/\bdollars?\b/g, '$');
  s = s.replace(/\bcents?\b/g, 'c');
  s = s.replace(/¢/g, 'c');
  s = s.replace(/(\d+)\s*\$/g, '$$$1'); // e.g. 2$ -> $2

  // Area & Volume Unit Normalization
  s = s.replace(/\b(?:sq\.?\s*cm|square\s*(?:cm|centimet(?:er|re)s?))\b/g, 'cm²');
  s = s.replace(/cm\s*2\b/g, 'cm²');
  s = s.replace(/cm2\b/g, 'cm²');
  s = s.replace(/cm\s*²/g, 'cm²');

  s = s.replace(/\b(?:sq\.?\s*m|square\s*(?:m|met(?:er|re)s?))\b/g, 'm²');
  s = s.replace(/m\s*2\b/g, 'm²');
  s = s.replace(/m2\b/g, 'm²');
  s = s.replace(/m\s*²/g, 'm²');

  s = s.replace(/\b(?:sq\.?\s*km|square\s*(?:km|kilomet(?:er|re)s?))\b/g, 'km²');
  s = s.replace(/km\s*2\b/g, 'km²');
  s = s.replace(/km2\b/g, 'km²');
  s = s.replace(/km\s*²/g, 'km²');

  s = s.replace(/\b(?:sq\.?\s*mm|square\s*(?:mm|millimet(?:er|re)s?))\b/g, 'mm²');
  s = s.replace(/mm\s*2\b/g, 'mm²');
  s = s.replace(/mm2\b/g, 'mm²');
  s = s.replace(/mm\s*²/g, 'mm²');

  s = s.replace(/\b(?:cu\.?\s*cm|cubic\s*(?:cm|centimet(?:er|re)s?))\b/g, 'cm³');
  s = s.replace(/cm\s*3\b/g, 'cm³');
  s = s.replace(/cm3\b/g, 'cm³');
  s = s.replace(/cm\s*³/g, 'cm³');

  s = s.replace(/\b(?:cu\.?\s*m|cubic\s*(?:m|met(?:er|re)s?))\b/g, 'm³');
  s = s.replace(/m\s*3\b/g, 'm³');
  s = s.replace(/m3\b/g, 'm³');
  s = s.replace(/m\s*³/g, 'm³');

  return s.replace(/\s+/g, '');
};

function grade(rawSubmitted, rawExpected, rawAccepted = []) {
  const studentAns = cleanString(rawSubmitted);
  const realAns = cleanString(rawExpected);
  const accepted = rawAccepted.map(cleanString);

  let isCorrect = studentAns === realAns || accepted.includes(studentAns);

  if (!isCorrect) {
    const unitRegex = /(?:cm²|m²|km²|mm²|cm³|m³|cm|m|km|g|kg|ml|l|°|\$|¢|c)$/;
    const studentBare = studentAns.replace(unitRegex, '');
    const realBare = realAns.replace(unitRegex, '');
    if (studentBare === realBare && studentBare !== '' && /^\d+(?:\.\d+)?$/.test(studentBare)) {
      const studentUnit = studentAns.slice(studentBare.length);
      const realUnit = realAns.slice(realBare.length);
      if (!studentUnit || !realUnit || studentUnit === realUnit) {
        isCorrect = true;
      }
    }
  }

  return { isCorrect, studentAns, realAns };
}

const expected = "34 cm²";
const testCases = [
  "34 cm²",
  "34cm²",
  "34\\text{cm}^2",       // MathLive virtual keyboard cm² button
  "34\\text{cm}^{2}",     // MathLive with explicit curly braces
  "34{cm}^2",             // Macro replacement from typing cm2 in MathInput
  "34cm2",                // Plain text cm2
  "34 cm2",               // Plain text cm 2 with space
  "34 cm 2",              // Extra spaced
  "34 sq cm",             // Word abbreviation
  "34 square cm",         // Full word
  "34",                   // Bare number
  "35 cm²",               // Wrong number (must fail)
  "34 m²",                // Wrong unit (must fail)
  "34 cm",                // Length unit instead of area (must fail)
];

console.log(`--- TESTING EXPECTED: "${expected}" ---`);
let failed = 0;
for (const tc of testCases) {
  const res = grade(tc, expected);
  const shouldBeCorrect = !["35 cm²", "34 m²", "34 cm"].includes(tc);
  const pass = res.isCorrect === shouldBeCorrect;
  if (!pass) failed++;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] input: "${tc}" -> cleaned: "${res.studentAns}" | isCorrect: ${res.isCorrect} (expected ${shouldBeCorrect})`);
}

if (failed === 0) {
  console.log("\nALL TESTS PASSED SUCCESSFULLY! 🎉");
} else {
  console.error(`\n${failed} TESTS FAILED! ❌`);
  process.exit(1);
}

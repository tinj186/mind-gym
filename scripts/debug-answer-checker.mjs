// Let's test what cleanString does in WorkoutSession.jsx
function getCleanString() {
  return (str) => {
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

    s = s.replace(/\b(?:cu\.?\s*m|cubic\s*(?:cm|met(?:er|re)s?))\b/g, 'm³');
    s = s.replace(/m\s*3\b/g, 'm³');
    s = s.replace(/m3\b/g, 'm³');
    s = s.replace(/m\s*³/g, 'm³');

    // 2. Map English word numbers to digits for robust grading (e.g. fourth -> 4th)
    const wordMap = {
      'first': '1st', 'second': '2nd', 'third': '3rd', 'fourth': '4th',
      'fifth': '5th', 'sixth': '6th', 'seventh': '7th', 'eighth': '8th',
      'ninth': '9th', 'tenth': '10th', 'eleventh': '11th', 'twelfth': '12th',
      // Note: 'one' and 'ten' are intentionally omitted to protect "ones" and "tens" place values
      'two': '2', 'three': '3', 'four': '4', 'five': '5',
      'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'eleven': '11', 'twelve': '12'
    };

    Object.keys(wordMap).forEach(key => {
      s = s.replace(new RegExp(`\\b${key}\\b`, 'g'), wordMap[key]);
    });

    const finalStr = s.replace(/\s+/g, ''); // Finally, strip ALL spaces for resilient math grading
    return finalStr;
  };
}

const cleanString = getCleanString();
console.log('cleanString("3 tens 3 ones") =', cleanString("3 tens 3 ones"));

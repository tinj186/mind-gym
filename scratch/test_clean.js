    const cleanString = (str) => {
      let s = String(str || '')
        .replace(/\\\s/g, ' ') // MathLive escaped spaces
        .replace(/\\displaystyle/g, '') // Strip display style
        .replace(/\\textstyle/g, '') // Strip text style
        .replace(/\\left/g, '') // Strip left
        .replace(/\\right/g, '') // Strip right
        .replace(/\\[dt]?frac\s*\{?([^{}]+)\}?\s*\{?([^{}]+)\}?/g, '$1/$2') // Convert MathLive fractions (frac, dfrac, tfrac) to standard slashes
        .replace(/\\text\{([^}]*)\}/g, '$1') // MathLive text wrappers
        .replace(/\\operatorname\{\\mathrm\{([^}]*)\}\}/g, '$1') // MathLive text wrappers
        .replace(/\\mathrm\{([^}]*)\}/g, '$1') // MathLive text wrappers
        .replace(/\\times/g, '*') // Normalize multiplication
        .replace(/\\div/g, '/') // Normalize division
        .replace(/\\cdot/g, '*') // Normalize multiplication dot
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Strip zero-width invisible characters
        .replace(/’/g, "'") // Normalize typographic apostrophes from MathInput bypass
        .replace(/\\/g, '') // Any remaining latex slashes
        .toLowerCase();

      // 1. Protect and standardize place values and conjunctions first
      s = s.replace(/\band\b/g, '');
      s = s.replace(/,/g, '');
      s = s.replace(/\bten\b/g, 'tens');
      s = s.replace(/\bone\b/g, 'ones');

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

console.log(cleanString("4/5, 3/5, 2/5"));
console.log(cleanString("\\frac{4}{5}, \\frac{3}{5}, \\frac{2}{5}"));
console.log(cleanString("\\frac{4}{5}\\ ,\\ \\frac{3}{5}\\ ,\\ \\frac{2}{5}"));

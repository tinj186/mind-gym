import assert from 'assert';

const cleanString = (str) => {
  let s = String(str || '')
    .replace(/\\\s/g, ' ')
    .replace(/\\quad/g, ' ')
    .replace(/\\qquad/g, ' ')
    .replace(/\\[,;:!]/g, ' ')
    .replace(/~/g, ' ')
    .replace(/\\displaystyle/g, '')
    .replace(/\\textstyle/g, '')
    .replace(/\\left/g, '')
    .replace(/(?:(\d+)\s*)?\\[dt]?frac\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))\s*(?:\{([^{}]+)\}|([a-zA-Z0-9]))/g, (m, int, n1, n2, d1, d2) => {
      const num = (n1 || n2 || '').trim();
      const den = (d1 || d2 || '').trim();
      return int ? `${int} ${num}/${den}` : `${num}/${den}`;
    })
    .replace(/\\operatorname\{\\mathrm\{([^}]*)\}\}/g, '$1')
    .replace(/\\operatorname\{([^}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .replace(/\\text(?:bf|it)?\{([^}]*)\}/g, '$1')
    .replace(/\\mathbf\{([^}]*)\}/g, '$1')
    .replace(/\\mathit\{([^}]*)\}/g, '$1')
    .replace(/\^\{\\circ\}|\^\\circ|\\circ/g, '°')
    .replace(/\^\{?2\}?/g, '²')
    .replace(/\^\{?3\}?/g, '³')
    .replace(/[{}]/g, '')
    .replace(/\\times/g, '*')
    .replace(/×/g, '*')
    .replace(/\\div/g, '/')
    .replace(/÷/g, '/')
    .replace(/\\cdot/g, '*')
    .replace(/(?<=\d)\s*[xX]\s*(?=\d)/g, '*')
    .replace(/^\s*[xX]\s*$/g, '*')
    .replace(/\\colon/g, ':')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/’/g, "'")
    .replace(/\\/g, '')
    .toLowerCase();

  s = s.replace(/\band\b/g, '');
  s = s.replace(/,/g, '');
  s = s.replace(/(\d)\s*ten(?=[^a-z]|$)/gi, '$1tens');
  s = s.replace(/\bten\b/g, 'tens');
  s = s.replace(/(\d)\s*one(?=[^a-z]|$)/gi, '$1ones');
  s = s.replace(/\bone\b/g, 'ones');

  const wordMap = {
    'first': '1st', 'second': '2nd', 'third': '3rd', 'fourth': '4th',
    'fifth': '5th', 'sixth': '6th', 'seventh': '7th', 'eighth': '8th',
    'ninth': '9th', 'tenth': '10th', 'eleventh': '11th', 'twelfth': '12th',
    'two': '2', 'three': '3', 'four': '4', 'five': '5',
    'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
    'eleven': '11', 'twelve': '12'
  };

  Object.keys(wordMap).forEach(key => {
    s = s.replace(new RegExp(`\\b${key}\\b`, 'g'), wordMap[key]);
  });

  return s.replace(/\s+/g, '');
};

const parsePlaceValue = (str) => {
  if (!str || typeof str !== 'string') return null;
  const valStr = str.replace(/[{}\\]/g, '').replace(/,/g, '').trim().toLowerCase();
  const hasPlaceWords = /\b(?:thousands?|hundreds?|tens?|ones?)\b/.test(valStr) || /(?:thousands?|hundreds?|tens?|ones?)/.test(valStr);
  const isPureNumber = /^\d+$/.test(valStr);
  if (!hasPlaceWords && !isPureNumber) return null;
  if (isPureNumber) return parseInt(valStr, 10);

  const m = valStr.match(/^(?:(\d+)\s*thousands?)?\s*(?:(\d+)\s*hundreds?)?\s*(?:(\d+)\s*tens?)?\s*(?:and\s*)?(?:(\d+)\s*ones?)?$/);
  if (m && (m[1] !== undefined || m[2] !== undefined || m[3] !== undefined || m[4] !== undefined)) {
    const thousands = m[1] ? parseInt(m[1], 10) : 0;
    const hundreds = m[2] ? parseInt(m[2], 10) : 0;
    const tens = m[3] ? parseInt(m[3], 10) : 0;
    const ones = m[4] ? parseInt(m[4], 10) : 0;
    return thousands * 1000 + hundreds * 100 + tens * 10 + ones;
  }
  return null;
};

function gradeQuestion(submittedAnswer, finalAnswer, acceptedAnswers = []) {
  let studentAns = cleanString(submittedAnswer);
  let realAns = cleanString(finalAnswer);
  let accepted = acceptedAnswers.map(a => cleanString(a));

  let isCorrect = studentAns === realAns || accepted.includes(studentAns);

  if (!isCorrect) {
    const studentHasWords = /\b(?:thousands?|hundreds?|tens?|ones?)\b/i.test(submittedAnswer || '') || /(?:thousands?|hundreds?|tens?|ones?)/i.test(studentAns || '');
    const realHasWords = /\b(?:thousands?|hundreds?|tens?|ones?)\b/i.test(finalAnswer || '') || /(?:thousands?|hundreds?|tens?|ones?)/i.test(realAns || '');
    if (studentHasWords || realHasWords) {
      const studentVal = parsePlaceValue(submittedAnswer) ?? parsePlaceValue(studentAns);
      const realVal = parsePlaceValue(finalAnswer) ?? parsePlaceValue(realAns);
      if (studentVal !== null && realVal !== null && studentVal === realVal) {
        isCorrect = true;
      } else if (studentVal !== null) {
        for (const acc of acceptedAnswers) {
          const accVal = parsePlaceValue(acc) ?? parsePlaceValue(cleanString(acc));
          if (accVal !== null && studentVal === accVal) {
            isCorrect = true;
            break;
          }
        }
      }
    }
  }

  return isCorrect;
}

// Test cases for "Which is smaller: 3 tens 10 ones or 3 tens 3 ones?"
const qFinal = "3 tens 3 ones";
const qAccepted = ["3 tens 3 ones", "33", "3 tens and 3 ones", "33 ones"];

assert.strictEqual(gradeQuestion("3 tens 3 ones", qFinal, []), true, "Exact match should pass");
assert.strictEqual(gradeQuestion("3 tens and 3 ones", qFinal, []), true, "With 'and' should pass");
assert.strictEqual(gradeQuestion("33", qFinal, []), true, "Numeric 33 without acceptedAnswers should pass via fallback");
assert.strictEqual(gradeQuestion("33 ones", qFinal, []), true, "33 ones should pass");
assert.strictEqual(gradeQuestion("3 ten 3 one", qFinal, []), true, "Singular 'ten' and 'one' should pass");
assert.strictEqual(gradeQuestion("3ten 3one", qFinal, []), true, "No space between digit and ten/one should pass");
assert.strictEqual(gradeQuestion("33", qFinal, qAccepted), true, "33 with acceptedAnswers should pass");
assert.strictEqual(gradeQuestion("3 tens 10 ones", qFinal, []), false, "Wrong answer 40 should fail");
assert.strictEqual(gradeQuestion("40", qFinal, []), false, "Wrong number 40 should fail");
assert.strictEqual(gradeQuestion("12", "15", []), false, "Unrelated numbers should not pass");
assert.strictEqual(gradeQuestion("15", "15", []), true, "Standard numbers should still pass");

console.log("All 11 tests passed successfully!");

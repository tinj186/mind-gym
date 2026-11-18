import { p3CompoundUnitConversionBlueprint } from '../src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/compound-unit-conversion.js';
import { UniversalQuestionSchema } from '../src/app/api/admin/generate/questionSchema.js';

console.log('--- Testing Unit Grading & Normalization ---');

// Replicate cleanString as implemented in WorkoutSession.jsx & ArenaSession.jsx
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
    .replace(/\\ell\b/g, 'l')
    .replace(/\\/g, '')
    .toLowerCase();

  s = s.replace(/\band\b/g, '');
  s = s.replace(/,/g, '');
  s = s.replace(/(\d)\s*ten(?=[^a-z]|$)/gi, '$1tens');
  s = s.replace(/\bten\b/g, 'tens');
  s = s.replace(/(\d)\s*one(?=[^a-z]|$)/gi, '$1ones');
  s = s.replace(/\bone\b/g, 'ones');

  s = s.replace(/\bdollars?\b/g, '$');
  s = s.replace(/\bcents?\b/g, 'c');
  s = s.replace(/¢/g, 'c');
  s = s.replace(/(\d+)\s*\$/g, '$$$1');

  // Length, Mass, Volume & Unit Normalization
  s = s.replace(/ℓ/g, 'l');
  s = s.replace(/\b(?:litres?|liters?)\b/g, 'l');
  s = s.replace(/\b(?:millilitres?|milliliters?)\b/g, 'ml');
  s = s.replace(/\b(?:kilometres?|kilometers?)\b/g, 'km');
  s = s.replace(/\b(?:centimetres?|centimeters?)\b/g, 'cm');
  s = s.replace(/\b(?:millimetres?|millimeters?)\b/g, 'mm');
  s = s.replace(/\b(?:metres?|meters?)\b/g, 'm');
  s = s.replace(/\b(?:kilograms?)\b/g, 'kg');
  s = s.replace(/\b(?:grams?)\b/g, 'g');

  s = s.replace(/\b(?:sq\.?\s*cm|square\s*(?:cm|centimet(?:er|re)s?))\b/g, 'cm²');
  s = s.replace(/cm\s*2\b/g, 'cm²');
  s = s.replace(/cm2\b/g, 'cm²');
  s = s.replace(/cm\s*²/g, 'cm²');

  return s.replace(/\s+/g, '');
};

const checkGrade = (submitted, expected, accepted = []) => {
  const studentAns = cleanString(submitted);
  const realAns = cleanString(expected);
  const acceptedClean = accepted.map(cleanString);

  let isCorrect = studentAns === realAns || acceptedClean.includes(studentAns);

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

    const compoundMatch = realAns.match(/^(\d+)(km|kg|l)(\d+)(m|g|ml)$/);
    if (compoundMatch) {
      const [, bigVal, bigUnit, smallVal, smallUnit] = compoundMatch;
      if (studentAns === `${bigVal}${bigUnit}${smallVal}`) {
        isCorrect = true;
      }
    }
  }

  return isCorrect;
};

// 1. Test cleanString and grading on user's exact case
const expectedAnswer = "2 ℓ 500 ml";
const testInputs = [
  "2 l 500 ml",
  "2l 500ml",
  "2l500ml",
  "2 ℓ 500 ml",
  "2ℓ 500ml",
  "2ℓ500ml",
  "2 litres 500 millilitres",
  "2 liters 500 milliliters",
  "2 L 500 mL",
  "2L 500mL",
  "2 \\ell 500 ml",
  "2 l and 500 ml",
  "2 ℓ and 500 ml",
  "2l500" // omitted trailing unit
];

for (const input of testInputs) {
  const correct = checkGrade(input, expectedAnswer);
  if (!correct) {
    throw new Error(`Failed to grade "${input}" as correct against "${expectedAnswer}"!`);
  }
  console.log(`✅ Passed: "${input}" correctly matches "${expectedAnswer}"`);
}

// 2. Test other unit variants
const lengthCases = [
  { input: "3 km 400 m", expected: "3 km 400 m" },
  { input: "3km 400m", expected: "3 km 400 m" },
  { input: "3 kilometres 400 metres", expected: "3 km 400 m" },
  { input: "3 kilometers 400 meters", expected: "3 km 400 m" },
  { input: "3km400", expected: "3 km 400 m" }
];
for (const tc of lengthCases) {
  if (!checkGrade(tc.input, tc.expected)) {
    throw new Error(`Failed to grade "${tc.input}" against "${tc.expected}"!`);
  }
  console.log(`✅ Passed: "${tc.input}" matches "${tc.expected}"`);
}

const massCases = [
  { input: "4 kg 250 g", expected: "4 kg 250 g" },
  { input: "4kg 250g", expected: "4 kg 250 g" },
  { input: "4 kilograms 250 grams", expected: "4 kg 250 g" },
  { input: "4kg250", expected: "4 kg 250 g" }
];
for (const tc of massCases) {
  if (!checkGrade(tc.input, tc.expected)) {
    throw new Error(`Failed to grade "${tc.input}" against "${tc.expected}"!`);
  }
  console.log(`✅ Passed: "${tc.input}" matches "${tc.expected}"`);
}

// 3. Test blueprint generation of compound-unit-conversion
console.log('\n--- Testing Blueprint generation for compound-unit-conversion ---');
for (let i = 0; i < 20; i++) {
  const res = p3CompoundUnitConversionBlueprint.generate('standard', 'standard_subtract_from_compound', 'Short Question');
  if (!res || !res.aiPrompt) {
    throw new Error('Failed to generate prompt for standard_subtract_from_compound');
  }
  if (!res.aiPrompt.includes('"acceptedAnswers":')) {
    throw new Error('Missing acceptedAnswers in schema for standard_subtract_from_compound');
  }
}
console.log('✅ Blueprint successfully generates acceptedAnswers in prompt schema!');

console.log('\n🎉 ALL UNIT GRADING TESTS PASSED!');


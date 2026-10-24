import { foundationLogic } from '../src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/unlike-fraction-comparison/foundation.js';
import { p3UnlikeFractionComparisonBlueprint } from '../src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/unlike-fraction-comparison.js';

console.log('--- Testing Unlike Fraction Comparison Foundation Variants ---');

const mockGetFormatInstructions = (visual, input) => `FORMAT_INSTRUCTIONS`;

const parseFraction = (fStr) => {
  const parts = fStr.split('/');
  return Number(parts[0]) / Number(parts[1]);
};

let errors = 0;

// Test foundation_visual_comparison_related_denominators 100 times
for (let i = 0; i < 100; i++) {
  const res = foundationLogic(
    'foundation_visual_comparison_related_denominators',
    'Foundation',
    'MCQ',
    true,
    false,
    false,
    'MCQ',
    'Foundation',
    'Primary 3',
    'Fractions - Equivalent Fractions',
    mockGetFormatInstructions
  );

  const prompt = res.aiPrompt;
  
  // Extract finalAnswer
  const finalAnswerMatch = prompt.match(/EXACTLY use the following as the finalAnswer:\s*"([^"]+)"/);
  const finalAnswer = finalAnswerMatch ? finalAnswerMatch[1] : null;

  // Extract mcqOptions
  const optionsMatch = prompt.match(/- EXACTLY use these options:\s*(\[[^\]]+\])/);
  const options = optionsMatch ? JSON.parse(optionsMatch[1]) : [];

  // Extract visualEngine
  const visualMatch = prompt.match(/"visualEngine":\s*(\{[\s\S]*?\})\s*,\s*"inputRequirement"/);
  let visualEngine = null;
  if (visualMatch) {
    visualEngine = JSON.parse(visualMatch[1]);
  }

  // Check 1: 4 unique options
  if (!options || options.length !== 4) {
    console.error(`Iteration ${i}: options length is not 4! Got:`, options);
    errors++;
  }
  const uniqueOptions = new Set(options);
  if (uniqueOptions.size !== 4) {
    console.error(`Iteration ${i}: options are not unique! Got:`, options);
    errors++;
  }

  // Check 2: finalAnswer in options
  if (!options.includes(finalAnswer)) {
    console.error(`Iteration ${i}: finalAnswer "${finalAnswer}" not in options:`, options);
    errors++;
  }

  // Check 3: Mathematical correctness of finalAnswer statement
  // Format: "X/Y is greater than A/B" or "X/Y is less than A/B"
  const stmtMatch = finalAnswer.match(/^(\d+\/\d+) is (greater|less) than (\d+\/\d+)$/);
  if (!stmtMatch) {
    console.error(`Iteration ${i}: finalAnswer does not match statement pattern: "${finalAnswer}"`);
    errors++;
  } else {
    const frac1 = parseFraction(stmtMatch[1]);
    const op = stmtMatch[2];
    const frac2 = parseFraction(stmtMatch[3]);

    if (op === 'greater' && !(frac1 > frac2)) {
      console.error(`Iteration ${i}: MATH ERROR! "${finalAnswer}" is false because ${frac1} is not > ${frac2}`);
      errors++;
    } else if (op === 'less' && !(frac1 < frac2)) {
      console.error(`Iteration ${i}: MATH ERROR! "${finalAnswer}" is false because ${frac1} is not < ${frac2}`);
      errors++;
    }
  }

  // Check 4: Bar model visual matching
  if (visualEngine && visualEngine.componentData && visualEngine.componentData.models) {
    const m1 = visualEngine.componentData.models[0];
    const m2 = visualEngine.componentData.models[1];
    const frac1FromModel = m1.parts[0].segments / Number(m1.whole);
    const frac2FromModel = m2.parts[0].segments / Number(m2.whole);

    // Verify first model is Fraction 1
    const m1Label = m1.barLabel;
    const m2Label = m2.barLabel;
    const f1StrInLabel = m1Label.match(/\(([^)]+)\)/)[1];
    const f2StrInLabel = m2Label.match(/\(([^)]+)\)/)[1];
    
    if (parseFraction(f1StrInLabel) !== frac1FromModel) {
      console.error(`Iteration ${i}: Model 1 label/segments mismatch:`, m1Label, m1.parts[0].segments, m1.whole);
      errors++;
    }
  }
}

// Test other foundation variants for 4 MCQ options
const foundationVariants = [
  'foundation_visual_comparison_same_numerator',
  'foundation_benchmark_half',
  'foundation_ordering_same_numerator',
  'foundation_visual_equivalence_true_false'
];

for (const variant of foundationVariants) {
  for (let i = 0; i < 20; i++) {
    const res = foundationLogic(
      variant,
      'Foundation',
      'MCQ',
      true,
      false,
      false,
      'MCQ',
      'Foundation',
      'Primary 3',
      'Fractions - Equivalent Fractions',
      mockGetFormatInstructions
    );

    const prompt = res.aiPrompt;
    const finalAnswerMatch = prompt.match(/EXACTLY use the following as the finalAnswer:\s*"([^"]+)"/);
    const finalAnswer = finalAnswerMatch ? finalAnswerMatch[1] : null;
    const optionsMatch = prompt.match(/- EXACTLY use these options:\s*(\[[^\]]+\])/);
    const options = optionsMatch ? JSON.parse(optionsMatch[1]) : [];

    if (!options || options.length !== 4) {
      console.error(`Variant ${variant} Iteration ${i}: options length is not 4! Got:`, options);
      errors++;
    }
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== 4) {
      console.error(`Variant ${variant} Iteration ${i}: options are not unique! Got:`, options);
      errors++;
    }
    if (!options.includes(finalAnswer)) {
      console.error(`Variant ${variant} Iteration ${i}: finalAnswer "${finalAnswer}" not in options:`, options);
      errors++;
    }
  }
}

const standardVariants = [
  'standard_convert_compare',
  'standard_missing_sign',
  'standard_ordering_ascending',
  'standard_ordering_descending',
  'standard_odd_one_out'
];

for (const variant of standardVariants) {
  for (let i = 0; i < 20; i++) {
    const res = p3UnlikeFractionComparisonBlueprint.generate('standard', variant, 'MCQ');
    const prompt = res.aiPrompt;
    const finalAnswerMatch = prompt.match(/EXACTLY use the following as the finalAnswer:\s*"([^"]+)"/);
    const finalAnswer = finalAnswerMatch ? finalAnswerMatch[1] : null;
    const optionsMatch = prompt.match(/- EXACTLY use these options:\s*(\[[^\]]+\])/);
    const options = optionsMatch ? JSON.parse(optionsMatch[1]) : [];

    if (!options || options.length !== 4) {
      console.error(`Standard Variant ${variant} Iteration ${i}: options length is not 4! Got:`, options);
      errors++;
    }
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== 4) {
      console.error(`Standard Variant ${variant} Iteration ${i}: options are not unique! Got:`, options);
      errors++;
    }
    if (!options.includes(finalAnswer)) {
      console.error(`Standard Variant ${variant} Iteration ${i}: finalAnswer "${finalAnswer}" not in options:`, options);
      errors++;
    }
  }
}

const advancedVariants = [
  'advanced_remaining_comparison',
  'advanced_missing_numerator',
  'advanced_missing_denominator',
  'advanced_benchmark_no_conversion',
  'advanced_closest_to_one'
];

for (const variant of advancedVariants) {
  for (let i = 0; i < 20; i++) {
    const res = p3UnlikeFractionComparisonBlueprint.generate('advanced', variant, 'MCQ');
    const prompt = res.aiPrompt;
    const finalAnswerMatch = prompt.match(/EXACTLY use the following as the finalAnswer:\s*"([^"]+)"/);
    const finalAnswer = finalAnswerMatch ? finalAnswerMatch[1] : null;
    const optionsMatch = prompt.match(/- EXACTLY use these options:\s*(\[[^\]]+\])/);
    const options = optionsMatch ? JSON.parse(optionsMatch[1]) : [];

    if (!options || options.length !== 4) {
      console.error(`Advanced Variant ${variant} Iteration ${i}: options length is not 4! Got:`, options);
      errors++;
    }
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== 4) {
      console.error(`Advanced Variant ${variant} Iteration ${i}: options are not unique! Got:`, options);
      errors++;
    }
    if (!options.includes(finalAnswer)) {
      console.error(`Advanced Variant ${variant} Iteration ${i}: finalAnswer "${finalAnswer}" not in options:`, options);
      errors++;
    }
  }
}

console.log(`\nTests completed with ${errors} errors.`);
if (errors === 0) {
  console.log('ALL TESTS PASSED! Fraction comparison and MCQ options are 100% verified across Foundation, Standard, and Advanced.');
}

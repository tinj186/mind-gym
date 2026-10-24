import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log('--- Testing P4 Number Comparison Combined Foundation Variant ---');

let errors = 0;

const types = ['MCQ', 'Short Question', 'Structured'];
const variantsToTest = [
  'foundation_compare_two_numbers',
  'foundation_difference_deduction',
  'foundation_number_line_reading',
  'foundation_place_value_step_shifts',
  'foundation_extreme_sorting_digit_cards',
  'foundation_three_entity_extrema',
  // Test legacy aliases
  'foundation_compare_greater_ten_thousands',
  'foundation_compare_smaller_ten_thousands',
  'foundation_compare_greater_thousands',
  'foundation_compare_smaller_thousands',
  'foundation_compare_hundreds_tens'
];

for (const variant of variantsToTest) {
  for (const type of types) {
    for (let i = 0; i < 15; i++) {
      try {
        const res = p4NumberComparisonAndOrderingBlueprint.generate('foundation', variant, type);
        const prompt = res.aiPrompt;

        // Check finalAnswer exists
        const finalAnswerMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
        if (!finalAnswerMatch) {
          console.error(`[${variant}][${type}] Failed to find finalAnswer in prompt!`);
          errors++;
          continue;
        }
        const finalAnswer = finalAnswerMatch[1];

        if (type === 'MCQ') {
          // Check options
          const optionsMatch = prompt.match(/- Generate EXACTLY 4 options: (\[[^\]]+\])/);
          if (!optionsMatch) {
            console.error(`[${variant}][${type}] Missing options in prompt!`);
            errors++;
            continue;
          }
          const options = JSON.parse(optionsMatch[1]);
          if (!options || options.length !== 4) {
            console.error(`[${variant}][${type}] Options length != 4:`, options);
            errors++;
          }
          const unique = new Set(options);
          if (unique.size !== 4) {
            console.error(`[${variant}][${type}] Duplicate options:`, options);
            errors++;
          }
          if (!options.includes(finalAnswer)) {
            console.error(`[${variant}][${type}] finalAnswer "${finalAnswer}" not in options:`, options);
            errors++;
          }
        } else if (type === 'Structured') {
          if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"') && !prompt.includes('"inputType":"MULTI_STEP_INPUT"')) {
            console.error(`[${variant}][${type}] Missing MULTI_STEP_INPUT!`);
            errors++;
          }
        }
      } catch (err) {
        console.error(`[${variant}][${type}] Error thrown:`, err);
        errors++;
      }
    }
  }
}

console.log(`\nTests finished with ${errors} errors.`);
if (errors === 0) {
  console.log('SUCCESS: All P4 number comparison foundation variant tests passed!');
}

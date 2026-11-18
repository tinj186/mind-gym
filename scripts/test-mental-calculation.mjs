import { p3MentalCalculationMultiplicationTablesBlueprint } from '../src/lib/syllabus/math/primary-3/whole-numbers-multiplication-and-division/mental-calculation-multiplication-tables.js';

console.log('--- Testing Primary 3 Mental Calculation (Multiplication Tables) ---');

const difficulties = ['foundation', 'standard', 'advanced'];
const variantsByDiff = {
  foundation: [
    'foundation_direct_fact_retrieval',
    'foundation_fact_family_link',
    'foundation_multiplying_multiples_10',
    'foundation_dividing_multiples_10',
    'foundation_direct_fact_retrieval_division'
  ],
  standard: [
    'standard_mental_splitting_addition',
    'standard_mental_compensation',
    'standard_splitting_for_division',
    'standard_halving_and_doubling',
    'standard_extrapolating_hundreds'
  ],
  advanced: [
    'advanced_chained_ops_multiply_add',
    'advanced_chained_ops_divide_subtract',
    'advanced_equivalent_expressions',
    'advanced_mental_scaling',
    'advanced_mental_reversal'
  ]
};

const types = ['MCQ', 'Short Question'];

let totalTests = 0;
let passedTests = 0;

for (const diff of difficulties) {
  const variants = variantsByDiff[diff];
  for (const variant of variants) {
    for (const type of types) {
      totalTests++;
      for (let run = 0; run < 10; run++) {
        const result = p3MentalCalculationMultiplicationTablesBlueprint.generate(diff, variant, type);
        if (!result || !result.aiPrompt) {
          throw new Error(`Failed to generate prompt for ${diff} ${variant} ${type}`);
        }
        const prompt = result.aiPrompt;

        // Check inputRequirement
        const expectedInputType = type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
        if (!prompt.includes(`"inputType":"${expectedInputType}"`) && !prompt.includes(`"inputType": "${expectedInputType}"`)) {
          throw new Error(`Expected inputType ${expectedInputType} in prompt for ${variant} (${type}), got:\n${prompt}`);
        }

        // Check root visualEngine
        if (!prompt.includes('"visualEngine":')) {
          throw new Error(`Missing root visualEngine for ${variant} (${type})`);
        }

        // Check acceptedAnswers
        if (!prompt.includes('"acceptedAnswers":')) {
          throw new Error(`Missing acceptedAnswers for ${variant} (${type})`);
        }

        // Specific checks for foundation_fact_family_link
        if (variant === 'foundation_fact_family_link') {
          // finalAnswer must NEVER contain "=" or "x" or "÷"
          const finalAnswerMatch = prompt.match(/finalAnswer = `(.*?)`/);
          if (!finalAnswerMatch) {
            throw new Error(`Could not find finalAnswer in prompt for ${variant}`);
          }
          const finalAnswer = finalAnswerMatch[1];
          if (finalAnswer.includes('=') || finalAnswer.includes('x') || finalAnswer.includes('÷')) {
            throw new Error(`foundation_fact_family_link finalAnswer contains equation: "${finalAnswer}"!`);
          }
          // Must be a number
          if (isNaN(Number(finalAnswer))) {
            throw new Error(`foundation_fact_family_link finalAnswer is not a number: "${finalAnswer}"!`);
          }

          if (type === 'MCQ') {
            const optionsMatch = prompt.match(/Provide exactly these 4 options in MCQ: "(.*?)", "(.*?)", "(.*?)", "(.*?)"/);
            if (!optionsMatch) {
              throw new Error(`Missing MCQ options specification for ${variant}`);
            }
            const options = [optionsMatch[1], optionsMatch[2], optionsMatch[3], optionsMatch[4]];
            const uniqueOptions = new Set(options);
            if (uniqueOptions.size !== 4) {
              throw new Error(`Duplicate options in MCQ for ${variant}: ${JSON.stringify(options)}`);
            }
            if (!options.includes(finalAnswer)) {
              throw new Error(`Options ${JSON.stringify(options)} do not contain finalAnswer ${finalAnswer} for ${variant}`);
            }
          }
        }

        // Specific checks for standard_mental_splitting_addition
        if (variant === 'standard_mental_splitting_addition') {
          const finalAnswerMatch = prompt.match(/finalAnswer = `(.*?)`/);
          const finalAnswer = finalAnswerMatch[1];
          if (finalAnswer.includes('+') || finalAnswer.includes('x') || isNaN(Number(finalAnswer))) {
            throw new Error(`standard_mental_splitting_addition finalAnswer invalid: "${finalAnswer}"!`);
          }
        }

        // Specific checks for standard_splitting_for_division
        if (variant === 'standard_splitting_for_division') {
          const finalAnswerMatch = prompt.match(/finalAnswer = `(.*?)`/);
          const finalAnswer = finalAnswerMatch[1];
          if (finalAnswer.includes('+') || finalAnswer.includes('÷') || isNaN(Number(finalAnswer))) {
            throw new Error(`standard_splitting_for_division finalAnswer invalid: "${finalAnswer}"!`);
          }
        }
      }
      passedTests++;
      console.log(`✅ Passed: [${diff}] ${variant} (${type})`);
    }
  }
}

console.log(`\n========================================`);
console.log(`Summary: ${passedTests} / ${totalTests} tests passed!`);
console.log(`🎉 ALL P3 MENTAL CALCULATION VARIANTS VERIFIED!`);

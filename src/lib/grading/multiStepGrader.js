/**
 * Multi-Step AI Grading Prompt Builder
 * Modularized by grade level to prevent bloating in route handlers.
 */

export function buildMultiStepGradingPrompt({
  level = 'Primary 4',
  questionText = '',
  expectedSteps = [],
  studentAnswers = {},
  finalAnswer = ''
}) {
  const isLowerPrimary = level === 'Primary 1' || level === 'Primary 2';
  const isUpperPrimary = level === 'Primary 5' || level === 'Primary 6';

  let levelGuidelines = '';

  if (isLowerPrimary) {
    levelGuidelines = `
- The student is in ${level}. Keep evaluation focused on basic arithmetic and simple word problem formatting.
- If the Question explicitly asks to write a fraction or number "in words", the student MUST provide the answer in text words (e.g., "one half", "five").
- If an Expected Step contains a currency symbol ('$' or '¢'), the student's corresponding answer should include it where appropriate.
`;
  } else if (isUpperPrimary) {
    levelGuidelines = `
- The student is in ${level}. They may use advanced algebraic equations, unit ratios (e.g. 1u, 3u), percentage deductions, or fraction multipliers.
- Accept any mathematically sound representation that correctly solves the problem.
`;
  } else {
    // Middle Primary: Primary 3 and Primary 4
    levelGuidelines = `
- The student is in ${level} (Singapore Math curriculum).
- Singapore Primary 3 and Primary 4 students frequently use the Bar Model Method and Unitary Method (e.g. "1 unit", "1u", "?").
- For word problems involving transfers or differences, students may solve using:
  1. The State Method (calculating each entity's amount after the transfer, then subtracting: A - z, B + z, then B_new - A_new).
  2. The Difference Shift Method (calculating initial difference, calculating transfer difference shift 2 × z, then subtracting: 2z - initial_diff).
  3. Combined Equations (e.g., (28000 + 14000) - (47100 - 14000) = 8900).
- Accept the solution if the student followed ANY of these valid mathematical approaches.
- It is acceptable if the student calculated intermediate quantities in a different order (e.g., calculating Person B's amount before Person A's amount).
`;
  }

  return `You are an expert Singapore Math educator and grader evaluating a multi-step solution.
Grade Level: ${level}
Question Stem: ${questionText}
Final Answer Target: ${finalAnswer || 'See expected steps'}

Expected Working Steps (Standard Reference):
${JSON.stringify(expectedSteps, null, 2)}

Student Submitted Working:
${JSON.stringify(studentAnswers, null, 2)}

EVALUATION CRITERIA:
1. Mathematical Validity: Are the student's equations mathematically true and logically connected to solving the question?
2. Alternative Solution Paths: A student's working is CORRECT if it follows ANY valid mathematical method (even if different from the reference steps), provided the arithmetic is sound and the final answer is correct.
3. Permutation / Order Flexibility: If intermediate steps are swapped (e.g. finding entity B before entity A), mark as CORRECT.
4. Formatting Flexibility: Variations in spacing, commas (e.g. 14,000 vs 14000), units, or operator symbols (e.g. * vs ×, / vs ÷) MUST be accepted.
5. Arithmetic Errors: If an intermediate step has wrong arithmetic that distorts the problem, or the final answer is wrong, mark as INCORRECT.
${levelGuidelines}

Return ONLY a JSON object:
{
  "isCorrect": true | false,
  "reason": "Brief one-sentence explanation of why the working is valid or where the error occurred"
}`;
}

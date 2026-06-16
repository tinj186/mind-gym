export function getLevelStrategy(level, type) {
  const isP1toP2 = level === 'Primary 1' || level === 'Primary 2';
  
  let strategy = '';
  
  if (isP1toP2) {
    strategy += `
    - Sentences must be extremely short (maximum 10-12 words per sentence).
    - Use simple, active-voice sentence structures.
    - Avoid technical math terms in hints (avoid "subtract", "variable", "equation").
    - Solutions must use straightforward step structures. Do NOT use complex bar models for this level. Focus on static visual counting items or basic operations.
    `;
  } else {
    strategy += `
    - Use grade-appropriate sentence structures.
    - Solutions MUST use complex dynamic bar models and include a 'modelDescription' representing the visual bar model logic if it is a Structured question.
    `;
  }

  if (type === 'MCQ') {
    strategy += `
    - MUST include exactly 4 options.
    - MUST include a 'defectMap' in the 'content' object mapping the 3 incorrect options to specific error patterns.
    - Valid Defect Codes: CARELESS_CALCULATION, CONCEPTUAL_ERROR, CONFUSED_OPERATION, MISREAD_QUESTION, CONSTANT_VIOLATION.
    - Example defectMap: { "Option B Text": "CONFUSED_OPERATION", "Option C Text": "CARELESS_CALCULATION" }
    `;
  }

  return strategy;
}

const fs = require('fs');

let code = fs.readFileSync('src/lib/syllabus/math/primary-1/whole-numbers/addition-subtraction/foundation.js', 'utf8');

// We need to change:
// const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
// to:
// const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');
code = code.replace(/const inputType = isMCQ \? 'MCQ_BUTTONS' : 'STANDARD_TEXT';/g, "const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');");

// We need to update inputRequirement in promptObject
// inputRequirement: { inputType }
// to:
// inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label, expectedAnswer, defectMap } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
code = code.replace(/inputRequirement:\s*\{\s*inputType\s*\}/g, "inputRequirement: { inputType, ...(isStructure ? { steps: \"[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]\" } : {}) }");

fs.writeFileSync('src/lib/syllabus/math/primary-1/whole-numbers/addition-subtraction/foundation.js', code);

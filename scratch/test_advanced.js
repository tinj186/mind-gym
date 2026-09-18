import { advancedVariants } from '../src/lib/syllabus/math/primary-1/geometry-2d-shapes/shapes/advanced.js';

const getQText = (a, b) => a;
const res = advancedVariants.advanced_pattern_three_attributes({}, 'MCQ', true, false, false, 'type', 'diff', 'P1', 'Shapes', 'instructions', {}, getQText);
console.log(res.aiPrompt);

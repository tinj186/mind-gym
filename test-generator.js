import { foundationLogic } from './src/lib/syllabus/math/primary-2/whole-numbers-numbers-up-to-1000/number-comparison-and-ordering/foundation.js';
import { numberComparisonAndOrderingBlueprint } from './src/lib/syllabus/math/primary-2/whole-numbers-numbers-up-to-1000/number-comparison-and-ordering.js';

const res = numberComparisonAndOrderingBlueprint.generate('foundation', 'foundation_compare_greater_hundreds', 'Short Question');
console.log(res.aiPrompt);

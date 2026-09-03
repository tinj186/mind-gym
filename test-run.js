import { p3RelatedFractionAdditionSubtractionBlueprint } from './src/lib/syllabus/math/primary-3/fractions-addition-and-subtraction/related-fraction-addition-subtraction.js';

const res = p3RelatedFractionAdditionSubtractionBlueprint.generate('advanced', 'advanced_rest_of_whole', 'structured');
console.log(res.aiPrompt);

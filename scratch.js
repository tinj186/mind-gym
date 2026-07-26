import { moneyConversionBlueprint } from './src/lib/syllabus/math/primary-2/money-money/money-conversion.js';

const res = moneyConversionBlueprint.generate('standard', 'standard_decimals_to_worded', 'Structure');
console.log(res.formatInstructions);

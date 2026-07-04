import { foundationLogic } from './mental-calculation-addition-subtraction/foundation';
import { standardLogic } from './mental-calculation-addition-subtraction/standard';
import { advancedLogic } from './mental-calculation-addition-subtraction/advanced';

export const mentalCalculationAdditionSubtractionBlueprint = {
  id: 'p1-mental-calculation-addition-subtraction',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

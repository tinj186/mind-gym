import { foundationLogic } from './addition-subtraction-algorithms/foundation';
import { standardLogic } from './addition-subtraction-algorithms/standard';
import { advancedLogic } from './addition-subtraction-algorithms/advanced';

export const additionSubtractionAlgorithmsBlueprint = {
  id: 'p1-addition-subtraction-algorithms',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

import { foundationLogic } from './addition-and-subtraction-concepts/foundation';
import { standardLogic } from './addition-and-subtraction-concepts/standard';
import { advancedLogic } from './addition-and-subtraction-concepts/advanced';

export const additionAndSubtractionConceptsBlueprint = {
  id: 'p1-addition-and-subtraction-concepts',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

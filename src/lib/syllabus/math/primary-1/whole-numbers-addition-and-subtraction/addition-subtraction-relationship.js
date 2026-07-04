import { foundationLogic } from './addition-subtraction-relationship/foundation';
import { standardLogic } from './addition-subtraction-relationship/standard';
import { advancedLogic } from './addition-subtraction-relationship/advanced';

export const additionSubtractionRelationshipBlueprint = {
  id: 'p1-addition-subtraction-relationship',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

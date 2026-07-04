import { foundationLogic } from './abbreviation-cm/foundation';
import { standardLogic } from './abbreviation-cm/standard';
import { advancedLogic } from './abbreviation-cm/advanced';

export const abbreviationCmBlueprint = {
  id: 'p1-abbreviation-cm',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

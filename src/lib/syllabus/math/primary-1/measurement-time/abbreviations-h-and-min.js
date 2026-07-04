import { foundationLogic } from './abbreviations-h-and-min/foundation';
import { standardLogic } from './abbreviations-h-and-min/standard';
import { advancedLogic } from './abbreviations-h-and-min/advanced';

export const abbreviationsHAndMinBlueprint = {
  id: 'p1-abbreviations-h-and-min',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

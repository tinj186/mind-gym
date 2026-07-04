import { foundationLogic } from './2d-figure-formation/foundation';
import { standardLogic } from './2d-figure-formation/standard';
import { advancedLogic } from './2d-figure-formation/advanced';

export const _2dFigureFormationBlueprint = {
  id: 'p1-2d-figure-formation',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

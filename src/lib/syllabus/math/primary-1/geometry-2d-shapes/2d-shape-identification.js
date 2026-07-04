import { foundationLogic } from './2d-shape-identification/foundation';
import { standardLogic } from './2d-shape-identification/standard';
import { advancedLogic } from './2d-shape-identification/advanced';

export const _2dShapeIdentificationBlueprint = {
  id: 'p1-2d-shape-identification',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

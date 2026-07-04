import { foundationLogic } from './figure-copying-grids/foundation';
import { standardLogic } from './figure-copying-grids/standard';
import { advancedLogic } from './figure-copying-grids/advanced';

export const figureCopyingGridsBlueprint = {
  id: 'p1-figure-copying-grids',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

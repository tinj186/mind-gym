import { foundationLogic } from './operation-symbols/foundation';
import { standardLogic } from './operation-symbols/standard';
import { advancedLogic } from './operation-symbols/advanced';

export const operationSymbolsBlueprint = {
  id: 'p1-operation-symbols',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

import { foundationLogic } from './multiplication-symbol-x/foundation';
import { standardLogic } from './multiplication-symbol-x/standard';
import { advancedLogic } from './multiplication-symbol-x/advanced';

export const multiplicationSymbolXBlueprint = {
  id: 'p1-multiplication-symbol-x',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

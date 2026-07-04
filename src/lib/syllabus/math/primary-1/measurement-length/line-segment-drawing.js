import { foundationLogic } from './line-segment-drawing/foundation';
import { standardLogic } from './line-segment-drawing/standard';
import { advancedLogic } from './line-segment-drawing/advanced';

export const lineSegmentDrawingBlueprint = {
  id: 'p1-line-segment-drawing',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};

import { ordinalsBlueprint } from './math/primary-1/whole-numbers/ordinals';
import { countingBlueprint } from './math/primary-1/whole-numbers/counting';

/**
 * Registry mapping metadata to modular blueprints.
 */
export const blueprintRegistry = {
  'Primary 1-Whole Numbers-Ordinal Numbers': ordinalsBlueprint,
  'Primary 1-Whole Numbers-Counting to 100': countingBlueprint,
  // Slug format: "Level-Topic-Subtopic"
};

/**
 * Global helper to call a blueprint with standard parameters.
 * Supports both AI-guided (legacy) and local generator (new) blueprints.
 */
export function getGeneratedQuestion(level, topic, subtopic, difficulty, variant, type) {
  const blueprintId = `${level}-${topic}-${subtopic}`;
  const blueprint = blueprintRegistry[blueprintId];
  
  if (blueprint && typeof blueprint.generate === 'function') {
    return blueprint.generate(difficulty?.toLowerCase() || 'foundation', variant, type);
  }
  
  return null;
}
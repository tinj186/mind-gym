import { ordinalsBlueprint } from './math/primary-1/whole-numbers/ordinals';
import { countingBlueprint } from './math/primary-1/whole-numbers/counting';
import { placeValuesBlueprint } from './math/primary-1/whole-numbers/place_values';
import { comparingOrderingBlueprint } from './math/primary-1/whole-numbers/comparing_ordering';
import { numberPatternBlueprint } from './math/primary-1/whole-numbers/number_pattern';
import { additionSubtractionBlueprint } from './math/primary-1/whole-numbers/addition_subtraction';
import { multiplicationDivisionBlueprint } from './math/primary-1/whole-numbers/multiplication_division';
import { moneyBlueprint } from './math/primary-1/money/money';

/**
 * Registry mapping metadata to modular blueprints.
 */
export const blueprintRegistry = {
  'Primary 1-Whole Numbers-Ordinal Numbers': ordinalsBlueprint,
  'Primary 1-Whole Numbers-Counting to 100': countingBlueprint,
  'Primary 1-Whole Numbers-Place Value (Tens/Ones)': placeValuesBlueprint,
  'Primary 1-Whole Numbers-Comparing and Ordering': comparingOrderingBlueprint, // Slug format: "Level-Topic-Subtopic"
  'Primary 1-Whole Numbers-Number Patterns': numberPatternBlueprint,
  'Primary 1-Whole Numbers-Addition and Subtraction': additionSubtractionBlueprint,
  'Primary 1-Whole Numbers-Multiplication and Division': multiplicationDivisionBlueprint,
  'Primary 1-Money-Money': moneyBlueprint,
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
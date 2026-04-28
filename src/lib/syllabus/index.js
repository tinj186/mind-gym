import { OrdinalNumbers } from './math/primary-1/whole-numbers/ordinals';

/**
 * Registry mapping metadata to modular blueprints.
 * This will expand as more subtopics are migrated.
 */
const blueprintRegistry = {
  'Math': {
    'Primary 1': {
      'Whole Numbers': {
        'Ordinal Numbers': OrdinalNumbers
      }
    }
  }
};

/**
 * Helper function to retrieve a specific subtopic blueprint object.
 */
export function getSubtopicBlueprint(subject, level, topic, subtopicId) {
  return blueprintRegistry[subject]?.[level]?.[topic]?.[subtopicId] || null;
}
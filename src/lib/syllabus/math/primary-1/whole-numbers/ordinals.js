/**
 * Subtopic: Ordinal Numbers
 * Level: Primary 1
 */

export const OrdinalNumbers = {
  title: 'Ordinal Numbers',
  strand: 'Number and Algebra',
  visualType: 'ORDINAL_LINE',
  variants: [
    {
      id: 'position_to_word',
      difficulty: 'Foundation',
      rule: "Give an item, ask for its position. The final answer must be spelled out (e.g., 'third')."
    },
    {
      id: 'position_to_digit',
      difficulty: 'Standard',
      rule: "Give an item, ask for its position. The final answer must be a digit with a suffix (e.g., '3rd')."
    },
    {
      id: 'advanced_removal',
      difficulty: 'Advanced',
      rule: "Identify a target item. State that 1 or 2 items BEFORE it are removed. Ask for its NEW position as a digit. Rule: Never remove the target item."
    }
  ]
};
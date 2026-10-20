/**
 * SOURCE: MOE 2021 Primary Mathematics Syllabus (Updated Oct 2025)
 * This file acts as the single source of truth for the curriculum grid
 * and AI generation constraints.
 */

export const QUESTION_TYPES = {
  SHORT_QUESTION: {
    label: "Short Question",
    description: "Pure equations/notation (e.g., 12 + 5 = ?)"
  },
  STRUCTURED: {
    label: "Structured",
    description: "Word problems for Bar Modeling"
  },
  MCQ: {
    label: "MCQ",
    description: "Multiple choice with 4 options"
  }
};

/**
 * Single source of truth for type labels
 */
export const DEFAULT_TYPES = Object.values(QUESTION_TYPES).map(t => t.label);
export const DEFAULT_DIFFICULTIES = ["Foundation", "Standard", "Advanced"];

export const DIFFICULTY_DEFINITIONS = {
  Foundation: {
    objective: "Procedural fluency and basic conceptual recall. This maps to the 20% Warm-up block, targeting students with lower mastery or those needing to build early momentum.",
    cognitiveLoad: "Single-step execution. The problem explicitly states the operation required (either directly or through extremely direct keywords like 'total' or 'left').",
    abstraction: "Zero. Problems are highly concrete. If a word problem is used, it strictly follows the LOWER_BLOCK reading mandate (tangible items, simple sentences).",
    protocolMapping: "Almost exclusively utilizes the Short Question (Pure Math) format or a very basic MCQ where distractors are obvious visually or numerically.",
    defectFocus: "Errors here usually trigger basic mechanical defect codes (e.g., ADDITION_FACT_ERROR, PLACE_VALUE_MISALIGNMENT).",
    example: "What is 345+122? or Siti has 4 apples. She buys 3 more. How many apples does she have in total?"
  },
  Standard: {
    objective: "Application of concepts in familiar, routine contexts. This is the baseline expectation of the MOE syllabus and forms the 60% Core Workout.",
    cognitiveLoad: "Routine, multi-step tasks. The student must read a scenario, determine the correct mathematical model (e.g., part-whole, comparison), and execute two or more operations.",
    abstraction: "Moderate. Introduces standard 'Singapore Flavor' word problems utilizing local names and contexts. Students must translate English into math equations.",
    protocolMapping: "Utilizes the 3-Type Protocol. Standard questions frequently deploy the Structured Question format or complex MCQs.",
    defectFocus: "Distractors in MCQs are purposefully engineered to catch common procedural slips. Errors trigger codes like INCOMPLETE_STEP_ERROR (stopping after step 1 of a 2-step problem) or WRONG_OPERATION_CHOSEN.",
    example: "Ali has 150 marbles. He has 45 fewer marbles than Muthu. How many marbles do they have altogether? (Requires finding Muthu's marbles first, then the total)."
  },
  Advanced: {
    objective: "Strategic thinking, logical reasoning, and tackling non-routine tasks. This serves the 20% Challenge block for high-synapse students.",
    cognitiveLoad: "High. Requires the application of problem-solving strategies (Pólya's 4 steps, heuristics). The path to the solution is deliberately obscured. Information may be presented out of order, or require working backwards.",
    abstraction: "High. Relies heavily on visual models (e.g., complex Bar Models) to resolve unequal sharing or proportional relationships.",
    protocolMapping: "Strictly Structured Questions or high-tier MCQs. The defectMap here must be highly sophisticated.",
    defectFocus: "Distractors represent deep logical traps. Errors trigger conceptual defect codes like HEURISTIC_MISAPPLICATION, UNEQUAL_SHARING_ERROR, or CONCEPTUAL_MISUNDERSTANDING.",
    example: "A curry puff costs $2. A piece of cake costs $3. Mrs. Tan bought an equal number of curry puffs and cakes. She spent $20 in total. How many items did she buy altogether? (Requires grouping items into a single $5 set before dividing)."
  }
};

export const FOUNDATION_MAPPING = {
  "Primary 5": "Primary 5 (Foundation)",
  "Primary 6": "Primary 6 (Foundation)"
};
